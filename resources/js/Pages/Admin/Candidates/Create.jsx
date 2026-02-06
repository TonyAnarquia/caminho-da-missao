import AdminLayout from '@/Layouts/AdminLayout';
import CandidateForm from './CandidateForm';

export default function Create() {
    return (
        <AdminLayout title="Novo candidato">
            <CandidateForm
                onSubmit={route('admin.candidates.store')}
                submitLabel="Salvar candidato"
            />
        </AdminLayout>
    );
}
