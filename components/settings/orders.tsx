import Stripe from 'stripe';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import Link from 'next/link';
import classNames from 'classnames';

import { useGetOrders } from '../../utils/api/stripe/get-orders';
import { currencySymbols } from '../global/price';

export default function Orders({ user }: { user: Stripe.Customer }) {
    const { data } = useGetOrders(user.id);

    return (
        <div className="bg-white w-full lg:col-span-9">
            <div className="py-16 sm:py-24">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Order history
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Check the status of recent orders, manage returns,
                            and discover similar products.
                        </p>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="sr-only">Recent orders</h2>
                    <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                        <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                            {(data?.data ?? []).map(order => (
                                <div
                                    key={order.id}
                                    className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                                >
                                    <h3 className="sr-only">
                                        Order placed on{' '}
                                        <time
                                            dateTime={moment
                                                .unix(order.created)
                                                .toISOString()}
                                        >
                                            {moment
                                                .unix(order.created)
                                                .format('MMM D, YYYY')}
                                        </time>
                                    </h3>

                                    <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                                        <div className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                                            <div className={'col-span-12'}>
                                                <dt className="font-medium text-gray-900">
                                                    Order number
                                                </dt>
                                                <dd className="mt-1 text-gray-500">
                                                    {order.id}
                                                </dd>
                                            </div>
                                            <div className="hidden sm:block mt-5 col-span-12">
                                                <dt className="font-medium text-gray-900">
                                                    Date placed
                                                </dt>
                                                <dd className="mt-1 text-gray-500">
                                                    <time
                                                        dateTime={moment
                                                            .unix(order.created)
                                                            .toISOString()}
                                                    >
                                                        {moment
                                                            .unix(order.created)
                                                            .format(
                                                                'MMM D, YYYY'
                                                            )}
                                                    </time>
                                                </dd>
                                            </div>
                                            <div className={'mt-5 col-span-12'}>
                                                <dt className="font-medium text-gray-900">
                                                    Total amount
                                                </dt>
                                                <dd className="mt-1 font-medium text-gray-900">
                                                    {
                                                        currencySymbols[
                                                            order.currency.toUpperCase()
                                                        ]
                                                    }
                                                    {order.amount / 100}
                                                </dd>
                                            </div>
                                        </div>

                                        <Menu
                                            as="div"
                                            className="relative flex justify-end lg:hidden"
                                        >
                                            <div className="flex items-center">
                                                <Menu.Button className="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                                                    <span className="sr-only">
                                                        Options for order{' '}
                                                        {order.id}
                                                    </span>
                                                    <EllipsisVerticalIcon
                                                        className="h-6 w-6"
                                                        aria-hidden="true"
                                                    />
                                                </Menu.Button>
                                            </div>

                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link
                                                                    target={
                                                                        '_blank'
                                                                    }
                                                                    href={
                                                                        order.receipt_url ??
                                                                        ''
                                                                    }
                                                                    className={classNames(
                                                                        {
                                                                            'bg-gray-100 text-gray-900':
                                                                                active,
                                                                            'text-gray-700':
                                                                                !active,
                                                                        },
                                                                        'block px-4 py-2 text-sm'
                                                                    )}
                                                                >
                                                                    View
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>

                                        <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:space-x-4">
                                            <Link
                                                target={'_blank'}
                                                href={order.receipt_url ?? ''}
                                                className="flex items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <span>View Order</span>
                                                <span className="sr-only">
                                                    {order.id}
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
