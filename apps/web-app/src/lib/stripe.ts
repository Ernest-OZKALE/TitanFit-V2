import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

export const getAbsoluteUrl = (path: string) => {
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${path}`;
};
