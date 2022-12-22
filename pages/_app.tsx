import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from '../components/layout/layout';
import '../styles/globals.scss';
import { NotificationsContainer } from '../components/global/notifications';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </QueryClientProvider>
            <NotificationsContainer />
        </>
    );
}

export default MyApp;
