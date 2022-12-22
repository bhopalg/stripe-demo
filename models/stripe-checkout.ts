export interface CreateStripeCheckoutItem {
    priceData: {
        currency: string;
        productData: {
            images: string[];
            name: string;
        };
        unitAmount: number;
    };
    description: string;
    quantity: number;
}
