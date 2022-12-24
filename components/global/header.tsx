import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

function profileImageLoader({
    src,
    width,
    quality,
}: {
    src: string;
    width: number;
    quality?: number;
}) {
    return `${src}?w=${width}&q=${quality || 75}`;
}

export default function Header() {
    const { user } = useUser();

    console.log(user);

    return (
        <header
            className={'z-50 w-full absolute top-0 px-10 py-5 flex justify-end'}
        >
            {user && (
                <Link
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    href={'/api/auth/logout'}
                >
                    Log Out
                </Link>
            )}

            {!user && (
                <Link
                    href={'/api/auth/login'}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Log In
                </Link>
            )}
            {user && (
                <Link
                    href={'/settings'}
                    className="inline-flex items-center rounded-full border border-transparent text-white shadow-sm"
                >
                    {user.picture && (
                        <Image
                            className={'rounded-full'}
                            src={user.picture}
                            alt={user.name ?? 'Name'}
                            width={42}
                            height={42}
                            loader={profileImageLoader}
                        />
                    )}
                </Link>
            )}
        </header>
    );
}
