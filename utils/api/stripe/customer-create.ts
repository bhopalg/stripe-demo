import { useMutation } from '@tanstack/react-query';
import Stripe from 'stripe';

import { APIError } from '../api-error';

async function publishStripeCustomer(email: string) {
    const url = '/api/stripe/customer/create';

    const requestBody = {
        email,
    };

    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(requestBody),
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

export function usePublishStripeCustomer() {
    return useMutation<Stripe.Customer, APIError, string>({
        mutationFn: async (email: string) => {
            return await publishStripeCustomer(email);
        },
    });
}
