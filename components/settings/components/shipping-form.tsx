import Stripe from 'stripe';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import {
    UpdateStripeCustomerOptions,
    useUpdateStripeCustomer,
} from '../../../utils/api/stripe/customer-update';
import { queryClient } from '../../../pages/_app';
import { notify } from '../../global/notifications';

interface FormInputs {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
    name: string;
}

export default function ShippingForm({
    shipping,
    id,
}: {
    shipping?: Stripe.Customer.Shipping | null;
    id: string;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<FormInputs>();
    const updateCustomerMutation = useUpdateStripeCustomer();

    console.log(shipping);

    useEffect(() => {
        if (shipping !== null && shipping !== undefined) {
            setValue('line1', shipping.address?.line1 ?? '');
            setValue('line2', shipping.address?.line2 ?? '');
            setValue('state', shipping.address?.state ?? '');
            setValue('city', shipping.address?.city ?? '');
            setValue('country', shipping.address?.country ?? '');
            setValue('postal_code', shipping.address?.postal_code ?? '');
            setValue('name', shipping.name ?? '');
        }
    }, [shipping]);

    const onSubmit = (data: FormInputs) => {
        const options: UpdateStripeCustomerOptions = {
            shipping: {
                address: {
                    city: data.city,
                    country: data.country,
                    line1: data.line1,
                    line2: data.line2,
                    postal_code: data.postal_code,
                    state: data.state,
                },
                name: data.name,
            },
        };

        updateCustomerMutation.mutate(
            {
                id: id,
                options: options,
            },
            {
                onSuccess: async () => {
                    updateCustomerMutation.reset();
                    reset();
                    await queryClient.invalidateQueries(['stripeUser', id]);
                    notify.success('Successfully updated customer!');
                },
                onError: () => {
                    notify.error('Failed to update');
                },
            }
        );
    };

    return (
        <form
            className={'divide-y divide-gray-200'}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className={'mt-6 grid grid-cols-12 gap-6 '}>
                <div>
                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                        Shipping
                    </h2>
                </div>

                <div className="col-span-12">
                    <div className="block text-sm font-medium text-gray-700">
                        Name
                    </div>
                    <input
                        {...register('name', { required: true })}
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                    {errors.line1 && (
                        <span
                            className={
                                'block text-sm font-medium text-red-500 py-2'
                            }
                        >
                            Name is required
                        </span>
                    )}
                </div>

                <div className="col-span-12">
                    <div className="block text-sm font-medium text-gray-700">
                        Line 1
                    </div>
                    <input
                        {...register('line1', { required: true })}
                        type="text"
                        name="line1"
                        id="line1"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                    {errors.line1 && (
                        <span
                            className={
                                'block text-sm font-medium text-red-500 py-2'
                            }
                        >
                            Line 1 is required
                        </span>
                    )}
                </div>
                <div className="col-span-12">
                    <div className="block text-sm font-medium text-gray-700">
                        Line 2
                    </div>
                    <input
                        {...register('line2')}
                        type="text"
                        name="line2"
                        id="line2"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="block text-sm font-medium text-gray-700">
                        City
                    </div>
                    <input
                        {...register('city', { required: true })}
                        type="text"
                        name="city"
                        id="city"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                    {errors.city && (
                        <span
                            className={
                                'block text-sm font-medium text-red-500 py-2'
                            }
                        >
                            City is required
                        </span>
                    )}
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="block text-sm font-medium text-gray-700">
                        State
                    </div>
                    <input
                        {...register('state')}
                        type="text"
                        name="state"
                        id="state"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="block text-sm font-medium text-gray-700">
                        Country
                    </div>
                    <input
                        {...register('country')}
                        type="text"
                        name="country"
                        id="country"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <div className="block text-sm font-medium text-gray-700">
                        Post Code
                    </div>
                    <input
                        {...register('postal_code', { required: true })}
                        type="text"
                        name="postal_code"
                        id="postal_code"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    />
                    {errors.postal_code && (
                        <span
                            className={
                                'block text-sm font-medium text-red-500 py-2'
                            }
                        >
                            Post Code is required
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-4 flex justify-end py-4 px-4 sm:px-6">
                <button
                    onClick={() => {
                        reset();
                    }}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-sky-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
