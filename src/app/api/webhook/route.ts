import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { databases, ID } from '@/lib/appwrite-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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

      console.log(`Checkout session completed for user ${userId}, amount ${amount}`);

      try {
        // Log the document creation attempt
        console.log('Creating donation document with data:', {
          user_id: userId,
          amount,
          currency: 'MYR',
          timestamp: new Date().toISOString(),
          payment_status: 'completed',
          payment_method: 'credit_card',
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
            payment_method: 'credit_card',
          }
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
