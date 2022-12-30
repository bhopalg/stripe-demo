import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2022-11-15',
});

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<
        Stripe.ApiSearchResult<Stripe.Charge> | { message: string }
    >
) {
    try {
        const { customerId } = req.query;

        if (customerId === undefined) {
            res.status(404).json({ message: 'Stripe ID required' });
        }

        const chargers = await stripe.charges.search({
            query: `customer:'${customerId}'`,
        });
        res.status(200).json(chargers);
    } catch (e: any) {
        console.log(e);
        res.status(400).json({ message: e.message });
    }
}

export default withApiAuthRequired(handler);
