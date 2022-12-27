import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2022-11-15',
});

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Stripe.Customer | { message: string }>
) {
    try {
        const { id } = req.query;

        if (id === undefined) {
            res.status(404).json({ message: 'Stripe ID required' });
        }

        const { email, name, phone } = req.body;

        const customer = await stripe.customers.update(id as string, {
            email: email,
            name: name,
            phone,
        });

        res.status(200).json(customer);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
}

export default withApiAuthRequired(handler);
