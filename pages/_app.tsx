import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import Layout from '../components/layout/layout';
import '../styles/globals.scss';
import { NotificationsContainer } from '../components/global/notifications';
import GlobalContextProvider from './context/state';

export const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <QueryClientProvider client={queryClient}>
                <GlobalContextProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </GlobalContextProvider>
            </QueryClientProvider>
            <NotificationsContainer />
        </UserProvider>
    );
}

export default MyApp;
