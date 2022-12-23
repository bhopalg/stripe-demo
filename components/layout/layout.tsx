import React from 'react';
import Head from 'next/head';

import Header from '../global/header';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Head>
                <title>Starter Project</title>
                <meta name="description" content="Starter Project" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main>{children}</main>
        </>
    );
}
