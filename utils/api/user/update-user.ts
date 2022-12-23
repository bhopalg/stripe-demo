import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { UpdateUserDto, User } from '../../../models/user';

interface CreateUserOptions {
    body: UpdateUserDto;
    userId: string;
}

export async function createUser({
    body,
    userId,
}: CreateUserOptions): Promise<User> {
    try {
        const url = `http://localhost:3001/api/users/${userId}`;

        const response = await axios.put(url, body);
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

export function useUpdateUser() {
    return useMutation<User, AxiosError, CreateUserOptions>({
        mutationFn: async (options: CreateUserOptions) => {
            return await createUser(options);
        },
    });
}
