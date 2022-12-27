import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';

interface FormInputs {
    name: string;
    phone: string;
    email: string;
}

export default function Profile() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormInputs>();
    const onSubmit = (data: any) => console.log(data);

    const [phoneValue, setPhoneValue] = useState<string | undefined>(undefined);

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