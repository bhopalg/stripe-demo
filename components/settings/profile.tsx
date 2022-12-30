import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useEffect, useState } from 'react';
import Stripe from 'stripe';

import { useUpdateStripeCustomer } from '../../utils/api/stripe/customer-update';
import { notify } from '../global/notifications';
import { queryClient } from '../../pages/_app';

interface FormInputs {
    name: string;
    phone: string;
    email: string;
}

export default function Profile({ user }: { user: Stripe.Customer }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<FormInputs>();

    const stripeCustomerId = user.id;

    const updateCustomerMutation = useUpdateStripeCustomer();

    const onSubmit = (data: FormInputs) => {
        updateCustomerMutation.mutate(
            {
                id: stripeCustomerId,
                options: {
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                },
            },
            {
                onSuccess: async () => {
                    updateCustomerMutation.reset();
                    reset();
                    await queryClient.invalidateQueries([
                        'stripeUser',
                        stripeCustomerId,
                    ]);
                    notify.success('Successfully updated customer!');
                },
                onError: () => {
                    notify.error('Failed to update');
                },
            }
        );
    };

    const [phoneValue, setPhoneValue] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (user) {
            setValue('name', user.name ?? '');
            setValue('email', user.email ?? '');
            setValue('phone', user.phone ?? '');
            setPhoneValue(user.phone ?? undefined);
        }
    }, [user]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="divide-y divide-gray-200 lg:col-span-9"
        >
            {/* Profile section */}
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                        Profile
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        This information will be displayed publicly so be
                        careful what you share.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-12 gap-6">
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
                        {errors.name && (
                            <span
                                className={
                                    'block text-sm font-medium text-red-500 py-2'
                                }
                            >
                                Name is required
                            </span>
                        )}
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <div className="block text-sm font-medium text-gray-700">
                            Email
                        </div>
                        <input
                            {...register('email', { required: true })}
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                        />
                        {errors.email && (
                            <span
                                className={
                                    'block text-sm font-medium text-red-500 py-2'
                                }
                            >
                                Email is required
                            </span>
                        )}
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <div className="block text-sm font-medium text-gray-700">
                            Phone
                        </div>
                        <PhoneInput
                            country="US"
                            placeholder="Enter phone number"
                            value={phoneValue}
                            onChange={value => {
                                setValue('phone', value ?? '');
                                setPhoneValue(value);
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-[0.35rem] px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                        />
                        {/* Hidden input for form validation */}
                        <input
                            {...register('phone', { required: true })}
                            type="text"
                            name="phone"
                            id="phone"
                            className="hidden"
                        />
                        {errors.phone && (
                            <span
                                className={
                                    'block text-sm font-medium text-red-500 py-2'
                                }
                            >
                                Phone is required
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end py-4 px-4 sm:px-6">
                <button
                    onClick={() => {
                        setValue('name', user.name ?? '');
                        setValue('email', user.email ?? '');
                        setValue('phone', user.phone ?? '');
                        setPhoneValue(user.phone ?? undefined);
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
