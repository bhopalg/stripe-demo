import { useQuery } from '@tanstack/react-query';
import { APIError } from '../api-error';

import { User } from '../../../models/user';
import { MILLISECONDS_IN_ONE_MINUTE } from '../../constants';

export async function getGetByEmail(email: string): Promise<User> {
    const url = `http://localhost:3001/api/users/${email}/email`;
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

export function useGetUserByEmail(email?: string | null) {
    return useQuery<User, APIError>({
        queryKey: ['user', email],
        queryFn: async () => {
            if (!email) {
                throw new Error('Email Required');
            }

            return await getGetByEmail(email);
        },
        enabled: email !== undefined && email !== null,
    });
}
