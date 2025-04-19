/**
 * Stripe Webhook Handler Route
 * 
 * This module processes Stripe webhook events, specifically handling completed checkout sessions
 * and recording donation transactions in the Appwrite database.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Stripe API secret key
 * - STRIPE_WEBHOOK_SECRET: Stripe webhook signing secret
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { databases, ID } from '@/lib/appwrite-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Maps Stripe payment methods to internal Appwrite payment method types
 * 
 * @param {string} stripeMethod - The payment method from Stripe
 * @returns {string} Mapped internal payment method type
 */
const mapPaymentMethodToAppwrite = (stripeMethod: string): string => {
  switch (stripeMethod.toLowerCase()) {
    case 'card':
      return 'card';
    case 'fpx':
      return 'fpx';
    case 'grabpay':
      return 'grabpay';
    case 'alipay':
    default:
      return 'other'; // fallback to other
  }
};

/**
 * Retrieves the payment method from a Stripe checkout session
 * 
 * @param {Stripe.Checkout.Session} session - The Stripe checkout session
 * @returns {Promise<string>} Resolved payment method type
 */
const getPaymentMethod = async (session: Stripe.Checkout.Session): Promise<string> => {
  try {
    if (session.payment_intent) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id
      );
      const stripeMethod = paymentIntent.payment_method_types[0] || 'card';
      return mapPaymentMethodToAppwrite(stripeMethod);
    }
    const stripeMethod = session.payment_method_types?.[0] || 'card';
    return mapPaymentMethodToAppwrite(stripeMethod);
  } catch (error) {
    console.error('Error getting payment method:', error);
    return 'credit_card'; // fallback to credit_card
  }
};

/**
 * POST request handler for Stripe webhook events
 * 
 * @param {Request} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} JSON response acknowledging event receipt
 * 
 * Handled Events:
 * - checkout.session.completed: Records successful donation in database
 * 
 * Success Response:
 * {
 *   received: true
 * }
 * 
 * Error Response:
 * {
 *   error: string,
 *   status: number
 * }
 * 
 * Database Operations:
 * - Creates document in 'donation_history' collection with:
 *   - user_id: string
 *   - amount: number (in MYR)
 *   - currency: 'MYR'
 *   - timestamp: ISO date string
 *   - payment_status: 'completed'
 *   - payment_method: string
 * 
 * Security:
 * - Verifies Stripe webhook signature
 * - Requires valid 'stripe-signature' header
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    // Await the headers() call as recommended by Next.js
    const headersList = await headers();
    const sig = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId } = session.metadata!;
      // Amount is in the smallest currency unit, convert to MYR (or appropriate currency)
      const amount = session.amount_total! / 100;
      const paymentMethod = await getPaymentMethod(session);

      console.log(`Checkout session completed for user ${userId}, amount ${amount}, payment method ${paymentMethod}`);

      try {
        // Log the document creation attempt
        console.log('Creating donation document with data:', {
          user_id: userId,
          amount,
          currency: 'MYR',
          timestamp: new Date().toISOString(),
          payment_status: 'completed',
          payment_method: paymentMethod,
          stripe_session_id: session.id
        });

        const doc = await databases.createDocument(
          'barakah_db',
          'donation_history',
          ID.unique(),
          {
            user_id: userId,
            amount: amount,
            currency: 'MYR',
            timestamp: new Date().toISOString(),
            payment_status: 'completed',
            payment_method: paymentMethod,
            stripe_session_id: session.id
          },
          // Updated permissions for the document owner
          [`read("user:${userId}")`, `read("users")`]
        );
        console.log('Donation record created in Appwrite:', doc);
      } catch (dbError) {
        console.error('Error creating donation record in Appwrite:', dbError);
        throw dbError;
      }
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    // For unexpected errors, return 500
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
