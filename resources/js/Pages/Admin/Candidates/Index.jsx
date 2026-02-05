import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Index({ candidates, filters, canManageAll }) {
    const { data, setData, get } = useForm({
        search: filters?.search || '',
    });

    const submit = (event) => {
        event.preventDefault();
        get(route('admin.candidates.index'), { preserveState: true });
    };

    return (
        <AdminLayout title="Candidatos">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <form onSubmit={submit} className="flex gap-2">
                    <input
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Buscar por nome, estado, cargo"
                        className="w-72 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                    />
                    <button
                        type="submit"
                        className="rounded-lg border border-amber-400 px-4 py-2 text-sm text-amber-200"
                    >
                        Buscar
                    </button>
                </form>
                {canManageAll && (
                    <Link
                        href={route('admin.candidates.create')}
                        className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900"
                    >
                        Novo candidato
                    </Link>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {candidates.data.map((candidate) => (
                    <div
                        key={candidate.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-lg font-semibold">
                                    {candidate.name}
                                </div>
                                <div className="text-sm text-slate-400">
                                    {candidate.office || 'Cargo não informado'} ·{' '}
                                    {candidate.state || 'UF'}
                                </div>
                            </div>
                            <div className="text-xs uppercase text-slate-500">
                                {candidate.is_active ? 'Ativo' : 'Inativo'}
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-slate-300">
                            {candidate.summary || 'Sem resumo cadastrado.'}
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <Link
                                href={route('admin.candidates.edit', candidate.id)}
                                className="text-sm text-amber-300"
                            >
                                Editar
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
