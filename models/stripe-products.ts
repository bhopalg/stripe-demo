import Stripe from 'stripe';

export interface ProductWithPrice extends Stripe.Product {
    prices: Stripe.Price[];
}
