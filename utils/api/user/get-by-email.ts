import { APIError } from '../api-error';

import { User } from '../../../models/user';

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
