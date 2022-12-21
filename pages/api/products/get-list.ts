import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2022-11-15',
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Stripe.Product[] | { message: string }>
) {
    try {
        const products = await stripe.products.list();
        res.status(200).json(products.data);
    } catch (e: any) {
        console.log(e);
        res.status(400).json({ message: e.message });
    }
}
