import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div>
            <div className="relative overflow-hidden bg-sky-700 pb-32">
                <div
                    aria-hidden="true"
                    className={
                        'absolute inset-x-0 left-1/2 w-full inset-y-0 -translate-x-1/2 transform overflow-hidden lg:inset-y-0'
                    }
                >
                    <div className="absolute inset-0 flex">
                        <div
                            className="h-full w-1/2"
                            style={{ backgroundColor: '#0a527b' }}
                        />
                        <div
                            className="h-full w-1/2"
                            style={{ backgroundColor: '#065d8c' }}
                        />
                    </div>
                    <div className="relative flex justify-center">
                        <svg
                            className="flex-shrink-0"
                            width={1750}
                            height={308}
                            viewBox="0 0 1750 308"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M284.161 308H1465.84L875.001 182.413 284.161 308z"
                                fill="#0369a1"
                            />
                            <path
                                d="M1465.84 308L16.816 0H1750v308h-284.16z"
                                fill="#065d8c"
                            />
                            <path
                                d="M1733.19 0L284.161 308H0V0h1733.19z"
                                fill="#0a527b"
                            />
                            <path
                                d="M875.001 182.413L1733.19 0H16.816l858.185 182.413z"
                                fill="#0a4f76"
                            />
                        </svg>
                    </div>
                </div>
                <header className="relative py-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Settings
                        </h1>
                    </div>
                </header>
            </div>

            <main className="relative -mt-32">{children}</main>
        </div>
    );
}
