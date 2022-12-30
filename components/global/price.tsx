import Stripe from 'stripe';
import { useMemo } from 'react';

export const currencySymbols: { [key: string]: string } = {
    USD: '$', // US Dollar
    EUR: '€', // Euro
    CRC: '₡', // Costa Rican Colón
    GBP: '£', // British Pound Sterling
    ILS: '₪', // Israeli New Sheqel
    INR: '₹', // Indian Rupee
    JPY: '¥', // Japanese Yen
    KRW: '₩', // South Korean Won
    NGN: '₦', // Nigerian Naira
    PHP: '₱', // Philippine Peso
    PLN: 'zł', // Polish Zloty
    PYG: '₲', // Paraguayan Guarani
    THB: '฿', // Thai Baht
    UAH: '₴', // Ukrainian Hryvnia
    VND: '₫', // Vietnamese Dong
};

interface PriceProps {
    prices: Stripe.Price[];
}

export default function Price({ prices }: PriceProps) {
    const price: Stripe.Price | null = useMemo(() => {
        if (prices.length === 0) {
            return null;
        }

        return prices[0];
    }, [prices]);

    if (price && price.unit_amount) {
        return (
            <div className="mt-4 flex items-baseline text-5xl font-bold tracking-tight text-gray-900">
                {currencySymbols[price.currency.toUpperCase()]}
                {price.unit_amount / 100}
                <span className="text-lg font-semibold leading-8 tracking-normal text-gray-500">
                    {price.type === 'one_time' ? '/ One Time' : 'Recurring'}
                </span>
            </div>
        );
    }
    return (
        <div className="mt-4 flex items-baseline text-5xl font-bold tracking-tight text-gray-900">
            No Prices
        </div>
    );
}
