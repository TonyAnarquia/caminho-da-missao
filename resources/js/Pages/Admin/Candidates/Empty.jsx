import AdminLayout from '@/Layouts/AdminLayout';

export default function Empty() {
    return (
        <AdminLayout title="Candidatos">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <p className="text-slate-300">
                    Seu usuário ainda não está vinculado a nenhum candidato.
                    Solicite ao administrador para liberar o acesso.
                </p>
            </div>
        </AdminLayout>
    );
}
