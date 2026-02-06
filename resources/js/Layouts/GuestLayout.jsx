import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 pt-8 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-amber-300" />
                </Link>
            </div>

            <div className="ui-card mt-6 w-full max-w-md px-6 py-6">
                {children}
            </div>
        </div>
    );
}
