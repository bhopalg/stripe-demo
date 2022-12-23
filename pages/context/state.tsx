import React, { createContext, useContext, useState } from 'react';

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
