import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { usePublishStripeCustomer } from '../../utils/api/stripe/customer-create';
import { usePublishUserMetadata } from '../../utils/api/auth0/user/update-metadata';

interface IGlobalContextProps {
    stripeCustomerId: string | null;
}

export const GlobalContext = createContext<IGlobalContextProps>({
    stripeCustomerId: null,
});

export default function GlobalContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(
        null
    );
    const { user: auth0User } = useUser();
    const createStripeCustomerMutation = usePublishStripeCustomer();
    const updateAuth0MetadataMutation = usePublishUserMetadata();

    async function handleUser(): Promise<void> {
        if (auth0User) {
            if (!('stripe_customer_id' in auth0User)) {
                if (auth0User.name == null) {
                    return;
                }
                const stripeCustomer =
                    await createStripeCustomerMutation.mutateAsync(
                        auth0User.name
                    );
                await updateAuth0MetadataMutation.mutateAsync({
                    stripe_customer_id: stripeCustomer.id,
                });
                setStripeCustomerId(stripeCustomer.id);
            } else {
                setStripeCustomerId(auth0User.stripe_customer_id as string);
            }
        }
    }

    useEffect(() => {
        handleUser();
    }, [auth0User]);

    return (
        <GlobalContext.Provider
            value={{
                stripeCustomerId,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);
