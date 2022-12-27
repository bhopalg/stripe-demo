import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2022-11-15',
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Stripe.Customer | { message: string }>
) {
    try {
        const existingCustomer = await stripe.customers.search({
            query: `email:'${req.body.email}'`,
        });

        if (existingCustomer.data.length > 0) {
            res.status(200).json(existingCustomer.data[0]);
        } else {
            const { email } = req.body;

            const customer = await stripe.customers.create({
                email: email,
            });

            res.status(200).json(customer);
        }
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
}
