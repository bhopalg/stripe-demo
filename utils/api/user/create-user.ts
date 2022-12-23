import axios, { AxiosError } from 'axios';

import { CreateUserDto, User } from '../../../models/user';

export async function createUser(body: CreateUserDto): Promise<User> {
    try {
        const url = `http://localhost:3001/api/users`;

        const response = await axios.post(url, body);
        return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            throw new AxiosError(
                error.message,
                String(error.status),
                error.config,
                error.request,
                error.response
            );
        } else {
            throw new Error(error);
        }
    }
}
