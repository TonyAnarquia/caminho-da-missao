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
                        className="ui-input w-64"
                    />
                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="ui-select w-44"
                    >
                        <option value="">Todos</option>
                        <option value="draft">Rascunhos</option>
                        <option value="published">Publicados</option>
                    </select>
                    <button
                        type="submit"
                        className="ui-button-secondary"
                    >
                        Filtrar
                    </button>
                </form>
                {canManageAll && (
                    <Link
                        href={route('admin.articles.create')}
                        className="ui-button-primary"
                    >
                        Novo artigo
                    </Link>
                )}
            </div>

            <div className="space-y-4">
                {articles.data.map((article) => (
                    <div
                        key={article.id}
                        className="ui-card"
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
                                className="ui-link"
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
