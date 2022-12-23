import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useGetUserByEmail } from '../../utils/api/user/get-by-email';
import { usePublishUser } from '../../utils/api/user/create-user';

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

    async function createUser(): Promise<void> {
        try {
            if (!auth0User?.email) {
                return;
            }

            const newUser = await createUserMutation.mutateAsync({
                email: auth0User?.email,
            });

            // check if stripe id exists
        } catch (e: any) {
            throw new Error(e);
        }
    }

    useEffect(() => {
        if (dbUser) {
            console.log(dbUser);
            setUser(dbUser);
        } else {
            createUser();
        }
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
