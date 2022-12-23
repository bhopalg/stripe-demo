import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Link from 'next/link';

import Checkout from '../components/checkout/checkout';

export default function Home() {
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
                        <Checkout />
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = withPageAuthRequired();
