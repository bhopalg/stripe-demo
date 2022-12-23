import { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

import { useGetProducts } from '../utils/api/stripe/get-products';
import Price from '../components/global/price';
import { ProductWithPrice } from '../models/stripe-products';
import { usePublishCheckout } from '../utils/api/stripe/checkout';
import { notify } from '../components/global/notifications';
import LoadingSpinner from '../components/global/loading-spinner';

export default function Home() {
    const [selectedProduct, setSelectedProduct] =
        useState<ProductWithPrice | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { data: products } = useGetProducts();
    const mutation = usePublishCheckout();

    async function handleCheckout(product: ProductWithPrice) {
        try {
            setIsLoading(true);
            setSelectedProduct(product);

            const { prices } = product;

            if (prices.length === 0) {
                notify.error('No prices found for this product');
                setIsLoading(false);
                setSelectedProduct(null);
                return;
            }

            const price = prices[0];

            mutation.mutate(
                {
                    priceId: price.id,
                    quantity: 1,
                },
                {
                    onSuccess: async res => {
                        const publishableKey =
                            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
                            '';
                        const stripePromise = loadStripe(publishableKey);
                        const stripe = await stripePromise;

                        if (!stripe) {
                            return;
                        }

                        const result = await stripe.redirectToCheckout({
                            sessionId: res.id,
                        });

                        if (result.error) {
                            notify.error(result.error.message ?? 'Error');
                        }

                        mutation.reset();
                        setIsLoading(false);
                        setSelectedProduct(null);
                    },
                    onError: () => {
                        notify.error('Failed to checkout');
                        setIsLoading(false);
                        setSelectedProduct(null);
                    },
                }
            );
        } catch (e: any) {
            notify.error(e.message);
        }
    }

    return (
        <div className="bg-gray-900 h-screen">
            <div className="relative overflow-hidden pt-32 pb-96 lg:pt-40 h-full">
                <div>
                    <img
                        className="absolute bottom-0 left-1/2 w-[1440px] max-w-none -translate-x-1/2"
                        src="https://tailwindui.com/img/component-images/grid-blur-purple-on-black.jpg"
                        alt=""
                    />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
                    <div className="mx-auto max-w-2xl lg:max-w-4xl">
                        <Link href={'/api/auth/login'}>Log in</Link>
                        <h2 className="text-lg font-semibold leading-8 text-indigo-400">
                            Pricing
                        </h2>
                        <p className="mt-2 text-4xl font-bold tracking-tight text-white">
                            The right price for you,{' '}
                            <br className="hidden sm:inline lg:hidden" />
                            whoever you are
                        </p>
                        <p className="mt-6 text-lg leading-8 text-white/60">
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Velit numquam eligendi quos odit doloribus
                            molestiae voluptatum.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flow-root bg-white pb-32 lg:pb-40">
                <div className="relative -mt-80">
                    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2 lg:gap-8">
                            {products?.map(product => (
                                <button
                                    disabled={
                                        isLoading &&
                                        selectedProduct?.id === product.id
                                    }
                                    type={'button'}
                                    onClick={() => handleCheckout(product)}
                                    key={product.id}
                                    className="flex flex-col rounded-3xl bg-white shadow-xl ring-1 ring-black/10 relative"
                                >
                                    {isLoading &&
                                        selectedProduct?.id === product.id && (
                                            <div className="flex flex-col justify-center items-center absolute z-30 h-full w-full top-0 bg-black/50 rounded-3xl">
                                                <LoadingSpinner />
                                            </div>
                                        )}
                                    <div className="p-8 sm:p-10 relative z-20">
                                        <h3
                                            className="text-lg font-semibold leading-8 tracking-tight text-indigo-600"
                                            id={product.id}
                                        >
                                            {product.name}
                                        </h3>
                                        <Price prices={product.prices ?? []} />
                                        <p className="mt-6 text-base leading-7 text-gray-600">
                                            {product.description}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = withPageAuthRequired();
