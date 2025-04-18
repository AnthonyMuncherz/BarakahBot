import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { databases, ID } from '@/lib/appwrite-server';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, userId, campaign } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount provided' }, { status: 400 });
    }

    // Ensure amount is in the smallest currency unit (e.g., cents/sen)
    // Stripe expects the amount in the smallest unit (e.g., 1000 for RM10.00)
    const amountInSmallestUnit = Math.round(amount * 100);

    if (amountInSmallestUnit < 50) { // Stripe has minimum amounts (e.g., $0.50 USD, roughly RM2.00)
      return NextResponse.json({ error: 'Amount is too small for payment processing.' }, { status: 400 });
    }

    // Define success and cancel URLs relative to your app URL
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/zakatbot`; // Redirect back to ZakatBot on cancel

    // Create a Checkout Session with Malaysian payment methods
    const session = await stripe.checkout.sessions.create({
      payment_method_configuration: process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION,
      line_items: [
        {
          price_data: {
            currency: 'myr',
            product_data: {
              name: campaign,
            },
            unit_amount: amountInSmallestUnit,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        campaign,
      },
      locale: 'en',
      customer_creation: 'always',
    });

    if (!session.id) {
      throw new Error('Failed to create Stripe checkout session.');
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('[CHECKOUT_SESSION_POST] Error:', error);
    let errorMessage = 'Failed to create payment session.';
    if (error instanceof Stripe.errors.StripeError) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
