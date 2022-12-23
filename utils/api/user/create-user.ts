import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { CreateUserDto, User } from '../../../models/user';
import { APIError } from '../api-error';

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

export function usePublishUser() {
    return useMutation<User, AxiosError, CreateUserDto>({
        mutationFn: async (options: CreateUserDto) => {
            return await createUser(options);
        },
    });
}
