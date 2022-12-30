import { useQuery } from '@tanstack/react-query';
import Stripe from 'stripe';

import { APIError } from '../api-error';
import { MILLISECONDS_IN_ONE_MINUTE } from '../../constants';

async function getOrders(id: string) {
    const url = `/api/stripe/customer/orders/${id}`;
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

export function useGetOrders(id?: string) {
    return useQuery<Stripe.ApiSearchResult<Stripe.Charge>, APIError>({
        queryKey: ['orders', id],
        queryFn: async () => {
            if (id === undefined) {
                throw new Error('ID is required');
            }

            return await getOrders(id);
        },
        staleTime: MILLISECONDS_IN_ONE_MINUTE * 5,
        enabled: id !== undefined,
    });
}
