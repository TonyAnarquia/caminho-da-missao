import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Index({ articles, filters, canManageAll }) {
    const { data, setData, get } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
    });

    const submit = (event) => {
        event.preventDefault();
        get(route('admin.articles.index'), { preserveState: true });
    };

    return (
        <AdminLayout title="Artigos">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <form onSubmit={submit} className="flex flex-wrap gap-2">
                    <input
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Buscar por título"
                        className="w-64 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                    />
                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                    >
                        <option value="">Todos</option>
                        <option value="draft">Rascunhos</option>
                        <option value="published">Publicados</option>
                    </select>
                    <button
                        type="submit"
                        className="rounded-lg border border-amber-400 px-4 py-2 text-sm text-amber-200"
                    >
                        Filtrar
                    </button>
                </form>
                {canManageAll && (
                    <Link
                        href={route('admin.articles.create')}
                        className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900"
                    >
                        Novo artigo
                    </Link>
                )}
            </div>

            <div className="space-y-4">
                {articles.data.map((article) => (
                    <div
                        key={article.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                    >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="text-lg font-semibold">
                                    {article.title}
                                </div>
                                <div className="text-sm text-slate-400">
                                    {article.candidate?.name || 'Sem candidato'} ·{' '}
                                    {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                                </div>
                            </div>
                            <Link
                                href={route('admin.articles.edit', article.id)}
                                className="text-sm text-amber-300"
                            >
                                Editar
                            </Link>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">
                            {article.excerpt || 'Sem resumo cadastrado.'}
                        </p>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
