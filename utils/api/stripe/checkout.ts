import { useMutation } from '@tanstack/react-query';

import { CreateStripeCheckoutItem } from '../../../models/stripe-checkout';
import { APIError } from '../api-error';

export interface PublishCheckoutResponse {
    id: string;
}

async function publishCheckout(checkoutItem: CreateStripeCheckoutItem) {
    const url = '/api/products/checkout';

    const request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(checkoutItem),
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

export function usePublishCheckout() {
    return useMutation<
        PublishCheckoutResponse,
        APIError,
        CreateStripeCheckoutItem
    >({
        mutationFn: async (options: CreateStripeCheckoutItem) => {
            return await publishCheckout(options);
        },
    });
}
