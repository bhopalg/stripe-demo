import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

import { ProductWithPrice } from '../../../models/stripe-products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2022-11-15',
});

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ProductWithPrice[] | { message: string }>
) {
    try {
        const products = await stripe.products.list();
        const prices = await stripe.prices.list();

        const productsWithPrice: ProductWithPrice[] = products.data.map(
            product => {
                return {
                    ...product,
                    prices: prices.data.filter(
                        price => price.product === product.id && price.active
                    ),
                };
            }
        );

        res.status(200).json(productsWithPrice);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
}

export default withApiAuthRequired(handler);
