import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function AdminLayout({ title, children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;

    const navClass = (isActive) =>
        `text-sm ${isActive ? 'text-amber-300' : 'text-slate-300 hover:text-white'}`;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-lg font-semibold tracking-wide">
                            Missão Admin
                        </Link>
                        <nav className="hidden items-center gap-4 md:flex">
                            <Link
                                href={route('admin.dashboard')}
                                className={navClass(route().current('admin.dashboard'))}
                            >
                                Visão geral
                            </Link>
                            <Link
                                href={route('admin.candidates.index')}
                                className={navClass(route().current('admin.candidates.*'))}
                            >
                                Candidatos
                            </Link>
                            <Link
                                href={route('admin.articles.index')}
                                className={navClass(route().current('admin.articles.*'))}
                            >
                                Artigos
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-slate-300 md:inline">
                            {user?.name}
                        </span>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-200 hover:bg-slate-700"
                                >
                                    Conta
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Perfil
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Sair
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl px-6 py-8">
                {title && (
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">{title}</h1>
                    </div>
                )}
                {flash?.success && (
                    <div className="mb-6 rounded-xl border border-emerald-600/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 rounded-xl border border-red-600/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {flash.error}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
