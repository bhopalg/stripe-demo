import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { CreateStripeCheckoutItem } from '../../../models/stripe-checkout';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2022-11-15',
});

interface TransformedItem {
    price: string;
    quantity: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const { priceId, quantity }: CreateStripeCheckoutItem = req.body;

        const transformedItem: TransformedItem = {
            price: priceId,
            quantity,
        };

        const redirectURL =
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://stripe-checkout-next-js-demo.vercel.app';

        const session = await stripe.checkout.sessions.create({
            line_items: [transformedItem],
            mode: 'payment',
            success_url: `${redirectURL}?status=success`,
            cancel_url: `${redirectURL}?status=cancel`,
        });

        res.status(200).json({ id: session.id });
    } catch (e: any) {
        console.log(e);
        res.status(400).json({ message: e.message });
    }
}
