import { useQuery } from '@tanstack/react-query';
import Stripe from 'stripe';

import { APIError } from '../api-error';
import { MILLISECONDS_IN_ONE_MINUTE } from '../../constants';

async function getUser(id: string) {
    const url = `/api/stripe/customer/get/${id}`;
    const request = new Request(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });

    const response = await fetch(request);
    const data = await response.json();

    if (!response.ok) {
        throw new APIError(request, response, data);
    }
    return data;
}

export function useGetStripeUser(id?: string) {
    return useQuery<Stripe.Customer, APIError>({
        queryKey: ['stripeUser', id],
        queryFn: async () => {
            if (id === undefined) {
                throw new Error('ID is required');
            }

            return await getUser(id);
        },
        staleTime: MILLISECONDS_IN_ONE_MINUTE * 5,
        enabled: id !== undefined,
    });
}
