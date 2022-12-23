import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
    getGetByEmail,
    useGetUserByEmail,
} from '../../utils/api/user/get-by-email';
import { usePublishUser } from '../../utils/api/user/create-user';
import { usePublishStripeCustomer } from '../../utils/api/stripe/customer-create';
import { UpdateUserDto } from '../../models/user';
import { useUpdateUser } from '../../utils/api/user/update-user';

interface IGlobalContextProps {
    user: any;
}

export const GlobalContext = createContext<IGlobalContextProps>({
    user: {},
});

export default function GlobalContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<any>({});

    const { user: auth0User } = useUser();
    const { data: dbUser } = useGetUserByEmail(auth0User?.email);

    const createUserMutation = usePublishUser();
    const createStripeCustomerMutation = usePublishStripeCustomer();
    const updateUserMutation = useUpdateUser();

    async function createStripeCustomer(): Promise<string | null> {
        if (!auth0User?.email) {
            return null;
        }

        const stripeCustomer = await createStripeCustomerMutation.mutateAsync(
            auth0User?.email
        );

        return stripeCustomer.id;
    }

    async function createUser(): Promise<void> {
        try {
            if (!auth0User?.email) {
                return;
            }

            const stripeId = await createStripeCustomer();

            const newUser = await createUserMutation.mutateAsync({
                email: auth0User?.email,
                stripeCustomerId: stripeId ?? undefined,
            });

            setUser(newUser);
        } catch (e: any) {
            throw new Error(e);
        }
    }

    async function updateUser(
        userId: string,
        updateUserDto: UpdateUserDto
    ): Promise<void> {
        try {
            const _user = await updateUserMutation.mutateAsync({
                body: updateUserDto,
                userId: userId,
            });

            setUser(_user);
        } catch (e: any) {
            throw new Error(e);
        }
    }

    async function handleUser(): Promise<void> {
        if (auth0User) {
            if (auth0User.email) {
                // check if your user exists in the database
                const userExists = await getGetByEmail(auth0User?.email);

                if (userExists) {
                    if (!dbUser?.stripeCustomerId) {
                        const stripeId = await createStripeCustomer();
                        const updateUserDto: UpdateUserDto = {
                            stripeCustomerId: stripeId ?? undefined,
                            email: userExists.email,
                        };

                        await updateUser(userExists?.id, updateUserDto);
                    } else {
                        setUser(userExists);
                    }
                } else {
                    await createUser();
                }
            }
        }
    }

    useEffect(() => {
        handleUser();
    }, [auth0User, dbUser]);

    return (
        <GlobalContext.Provider
            value={{
                user,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);
