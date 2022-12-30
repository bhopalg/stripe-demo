import Stripe from 'stripe';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import classNames from 'classnames';

import { GooglePlaceResult } from '../../../models/google-maps';
import {
    UpdateStripeCustomerOptions,
    useUpdateStripeCustomer,
} from '../../../utils/api/stripe/customer-update';
import { queryClient } from '../../../pages/_app';
import { notify } from '../../global/notifications';

interface AddressFormProps {
    user: Stripe.Customer;
    placeResult?: GooglePlaceResult | null;
    setPlaceResult: (placeResult: GooglePlaceResult | null) => void;
}

interface FormInputs {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
}

export default function AddressForm({
    user,
    placeResult,
    setPlaceResult,
}: AddressFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<FormInputs>();

    const [isSameShipping, setIsSameShipping] = useState<boolean>(true);

    console.log(user);
    useEffect(() => {
        if (user.address !== null) {
            setValue('line1', user.address?.line1 ?? '');
            setValue('line2', user.address?.line2 ?? '');
            setValue('state', user.address?.state ?? '');
            setValue('city', user.address?.city ?? '');
            setValue('country', user.address?.country ?? '');
            setValue('postal_code', user.address?.postal_code ?? '');
            setPlaceResult(null);
            if (user.shipping !== null) {
                setIsSameShipping(true);
            }
        }
    }, [user]);

    useEffect(() => {
        if (placeResult !== null && placeResult !== undefined) {
            const addressComponents = placeResult.address_components;
            const postalCode = addressComponents.find(({ types }) =>
                types.includes('postal_code')
            );
            setValue('postal_code', postalCode?.long_name ?? '');

            const route = addressComponents.find(({ types }) =>
                types.includes('route')
            );
            setValue('line1', route?.long_name ?? '');

            const town = addressComponents.find(({ types }) =>
                types.includes('sublocality')
            );

            setValue('line2', town?.long_name ?? '');

            const city = addressComponents.find(({ types }) =>
                types.includes('postal_town')
            );
            setValue('city', city?.long_name ?? '');

            const state = addressComponents.find(({ types }) =>
                types.includes('administrative_area_level_2')
            );
            setValue('state', state?.long_name ?? '');

            const country = addressComponents.find(({ types }) =>
                types.includes('country')
            );
            setValue('country', country?.short_name ?? '');
            setPlaceResult(null);
        }
    }, [placeResult]);

    const updateCustomerMutation = useUpdateStripeCustomer();
    const stripeCustomerId = user.id;

    const onSubmit = (data: FormInputs) => {
        const options: UpdateStripeCustomerOptions = {
            address: {
                ...data,
            },
        };

        if (isSameShipping && user.name) {
            options.shipping = {
                address: {
                    ...data,
                },
                phone: user.phone ?? undefined,
                name: user.name,
            };
        }

        updateCustomerMutation.mutate(
            {
                id: stripeCustomerId,
                options: options,
            },
            {
                onSuccess: async () => {
                    updateCustomerMutation.reset();
                    reset();
                    setPlaceResult(null);
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

    return (
        <form
            className={'divide-y divide-gray-200'}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="mt-6 grid grid-cols-12 gap-6">
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
            <div className="mt-4 flex justify-between py-4 px-4 sm:px-6">
                <div>
                    <Switch.Group as="div" className="flex items-center">
                        <Switch
                            checked={isSameShipping}
                            onChange={setIsSameShipping}
                            className={classNames(
                                {
                                    'bg-sky-700': isSameShipping,
                                    'bg-grey-200': !isSameShipping,
                                },
                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-sky-50 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                            )}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    {
                                        'translate-x-5': isSameShipping,
                                        'translate-x-0': !isSameShipping,
                                    },
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                        <Switch.Label as="span" className="ml-3">
                            <span className="text-sm font-medium text-gray-900">
                                Shipping same as billing
                            </span>
                        </Switch.Label>
                    </Switch.Group>
                </div>
                <div>
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
            </div>
        </form>
    );
}
