import type { NextPage } from 'next';

const Home: NextPage = () => {
    return (
        <div
            className={
                'w-full h-screen relative flex justify-center items-center'
            }
        >
            <h1 className={'text-black text-5xl'}>Starter Project</h1>
        </div>
    );
};

export default Home;
