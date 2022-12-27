import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import Price from '../global/price';
import { ProductWithPrice } from '../../models/stripe-products';
import { useGetProducts } from '../../utils/api/stripe/get-products';
import { usePublishCheckout } from '../../utils/api/stripe/checkout';
import { notify } from '../global/notifications';
import LoadingSpinner from '../global/loading-spinner';
import { useGetUser } from '../../utils/api/auth0/user/get-user';

export default function Checkout() {
    const { data: user } = useGetUser();

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
                    id: user?.user_metadata?.stripe_customer_id,
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
        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2 lg:gap-8">
            {products?.map(product => (
                <button
                    disabled={isLoading && selectedProduct?.id === product.id}
                    type={'button'}
                    onClick={() => handleCheckout(product)}
                    key={product.id}
                    className="flex flex-col rounded-3xl bg-white shadow-xl ring-1 ring-black/10 relative"
                >
                    {isLoading && selectedProduct?.id === product.id && (
                        <div className="flex flex-col justify-center items-center absolute z-30 h-full w-full top-0 bg-black/50 rounded-3xl">
                            <LoadingSpinner />
                        </div>
                    )}
                    <div className="p-8 sm:p-10 relative z-20 w-full">
                        <h3
                            className="text-lg font-semibold leading-8 tracking-tight text-indigo-600 text-left"
                            id={product.id}
                        >
                            {product.name}
                        </h3>
                        <Price prices={product.prices ?? []} />
                        <p className="mt-6 text-base leading-7 text-gray-600 text-left">
                            {product.description}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}
