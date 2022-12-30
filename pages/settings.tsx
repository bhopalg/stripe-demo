import { useEffect, useState } from 'react';
import {
    HomeIcon,
    ShoppingCartIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useGetUser } from '../utils/api/auth0/user/get-user';
import { useGetStripeUser } from '../utils/api/stripe/get-user';
import Layout from '../components/settings/layout';
import Profile from '../components/settings/profile';
import Address from '../components/settings/address';
import Orders from '../components/settings/orders';

const subNavigation = [
    { name: 'Profile', icon: UserCircleIcon, key: 'profile' },
    { name: 'Address', icon: HomeIcon, key: 'address' },
    { name: 'Orders', icon: ShoppingCartIcon, key: 'orders' },
];

export default function Settings() {
    const { query } = useRouter();

    const { data } = useGetUser();
    const { data: user } = useGetStripeUser(
        data?.user_metadata?.stripe_customer_id
    );

    console.log(user);

    const [isCurrent, setIsCurrent] = useState<string | null>();

    useEffect(() => {
        if ('s' in query) {
            setIsCurrent(query.s as string);
        } else {
            setIsCurrent('profile');
        }
    }, [query]);

    return (
        <Layout>
            <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                        <aside className="py-6 lg:col-span-3">
                            <nav className="space-y-1">
                                {subNavigation.map(item => (
                                    <Link
                                        key={item.key}
                                        href={`/settings?s=${item.key}`}
                                        className={classNames(
                                            {
                                                'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900':
                                                    item.key !== isCurrent,
                                                'bg-teal-50 border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-700':
                                                    item.key === isCurrent,
                                            },
                                            'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                                        )}
                                        aria-current={
                                            item.name ? 'page' : undefined
                                        }
                                    >
                                        <item.icon
                                            className={classNames(
                                                {
                                                    'text-teal-500 group-hover:text-teal-500':
                                                        item.key !== isCurrent,
                                                    'text-gray-400 group-hover:text-gray-500':
                                                        item.key === isCurrent,
                                                },
                                                'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                                            )}
                                            aria-hidden="true"
                                        />
                                        <span className="truncate">
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                            </nav>
                        </aside>
                        {isCurrent === 'profile' && user && (
                            <Profile user={user} />
                        )}
                        {isCurrent === 'address' && user && (
                            <Address user={user} />
                        )}
                        {isCurrent === 'orders' && user && (
                            <Orders user={user} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export const getServerSideProps = withPageAuthRequired();
