import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="mb-6 flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Ibhayi Pharmacy System</h1>
                </div>

                <p className="mb-10 max-w-xl text-center text-gray-600 dark:text-gray-300">
                    Welcome to the digital prescription and repeat management platform for Ibhayi Pharmacy. Track prescriptions, request repeats, and
                    manage your health seamlessly.
                </p>

                <div className="flex gap-4">
                    <Button asChild>
                        <Link href={route('login')}>Login</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route('register')}>Register</Link>
                    </Button>
                </div>

                <footer className="mt-16 text-xs text-gray-400 dark:text-gray-500">
                    &copy; {new Date().getFullYear()} Ibhayi Pharmacy. All rights reserved.
                </footer>
            </div>
        </>
    );
}
