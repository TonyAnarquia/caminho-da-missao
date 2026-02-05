import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats }) {
    return (
        <AdminLayout title="Visão geral">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <div className="text-sm uppercase text-slate-400">
                        Candidatos
                    </div>
                    <div className="mt-3 text-3xl font-semibold">
                        {stats?.candidates ?? 0}
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <div className="text-sm uppercase text-slate-400">
                        Artigos
                    </div>
                    <div className="mt-3 text-3xl font-semibold">
                        {stats?.articles ?? 0}
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <div className="text-sm uppercase text-slate-400">
                        Arquivos
                    </div>
                    <div className="mt-3 text-3xl font-semibold">
                        {stats?.uploads ?? 0}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
