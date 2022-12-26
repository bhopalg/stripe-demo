import { useMutation } from '@tanstack/react-query';

import { APIError } from '../../api-error';

export interface PublishUserMetadataResponse {
    [key: string]: string | number | boolean;
}

export interface PublishUserMetadataParams {
    [key: string]: string | number | boolean;
}

async function publishUserMetadata(options: PublishUserMetadataParams) {
    const url = '/api/auth0/customer/update';

    const request = new Request(url, {
        method: 'POST',
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

export function usePublishUserMetadata() {
    return useMutation<
        PublishUserMetadataResponse,
        APIError,
        PublishUserMetadataParams
    >({
        mutationFn: async (options: PublishUserMetadataParams) => {
            return await publishUserMetadata(options);
        },
    });
}
