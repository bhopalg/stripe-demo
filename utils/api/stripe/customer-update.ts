import { useMutation } from '@tanstack/react-query';
import Stripe from 'stripe';

import { APIError } from '../api-error';

export interface UpdateStripeCustomerOptions {
    name?: string;
    phone?: string;
    email?: string;
    address?: Stripe.Address;
    shipping?: Stripe.CustomerUpdateParams.Shipping;
}

async function updateStripeCustomer(
    options: UpdateStripeCustomerOptions,
    id: string
) {
    const url = `/api/stripe/customer/update/${id}`;

    const request = new Request(url, {
        method: 'PUT',
        body: JSON.stringify(options),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const response = await fetch(request);
    const data = await response.json();

    if (!response.ok) {
        throw new APIError(request, response, data);
    }
    return data;
}

export function useUpdateStripeCustomer() {
    return useMutation<
        Stripe.Customer,
        APIError,
        { id: string; options: UpdateStripeCustomerOptions }
    >({
        mutationFn: async ({ id, options }) => {
            if (id === undefined) {
                throw new Error('Stripe ID required');
            }

            return await updateStripeCustomer(options, id);
        },
    });
}
