import Stripe from 'stripe';
import { useGetOrders } from '../../utils/api/stripe/get-orders';

export default function Orders({ user }: { user: Stripe.Customer }) {
    const { data } = useGetOrders(user.id);
    console.log(data, 'data');
    return <div />;
}
