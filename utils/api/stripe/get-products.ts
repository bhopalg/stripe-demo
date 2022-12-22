import { useQuery } from '@tanstack/react-query';

import { APIError } from '../api-error';
import { MILLISECONDS_IN_ONE_MINUTE } from '../../constants';
import { ProductWithPrice } from '../../../models/stripe-products';

async function getProducts() {
    const url = `/api/products/get-list`;
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

export function useGetProducts() {
    return useQuery<Array<ProductWithPrice>, APIError>({
        queryKey: ['products'],
        queryFn: async () => {
            return await getProducts();
        },
        staleTime: MILLISECONDS_IN_ONE_MINUTE * 5,
    });
}
