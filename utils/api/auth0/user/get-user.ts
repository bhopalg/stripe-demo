import { useQuery } from '@tanstack/react-query';
import { AppMetadata, User, UserMetadata } from 'auth0';

import { APIError } from '../../api-error';
import { MILLISECONDS_IN_ONE_MINUTE } from '../../../constants';

export async function getUser() {
    const url = '/api/auth0/customer/get-user';

    const request = new Request(url, {
        method: 'GET',
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

export function useGetUser() {
    return useQuery<User<AppMetadata, UserMetadata>, APIError>({
        queryKey: ['user'],
        queryFn: async () => {
            return await getUser();
        },
        staleTime: MILLISECONDS_IN_ONE_MINUTE * 5,
    });
}
