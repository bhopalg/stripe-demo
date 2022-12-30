import Stripe from 'stripe';
import Autocomplete from 'react-google-autocomplete';
import { useState } from 'react';

import { GooglePlaceResult } from '../../models/google-maps';
import AddressForm from './components/address-form';

export default function Address({ user }: { user: Stripe.Customer }) {
    const [placeResult, setPlaceResult] = useState<GooglePlaceResult | null>();

    return (
        <div className="divide-y divide-gray-200 lg:col-span-9">
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                        Address
                    </h2>
                </div>

                <div className="mt-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <div className="block text-sm font-medium text-gray-700">
                            Search
                        </div>
                        <Autocomplete
                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                            onPlaceSelected={place => setPlaceResult(place)}
                            options={{
                                types: ['(regions)'],
                                componentRestrictions: { country: 'gb' },
                            }}
                            defaultValue={'Search...'}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <AddressForm
                    user={user}
                    placeResult={placeResult}
                    setPlaceResult={setPlaceResult}
                />
            </div>
        </div>
    );
}
