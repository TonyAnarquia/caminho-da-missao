import AdminLayout from '@/Layouts/AdminLayout';
import CandidateForm from './CandidateForm';

export default function Edit({ candidate }) {
    return (
        <AdminLayout title={`Editar ${candidate.name}`}>
            <CandidateForm
                candidate={candidate}
                onSubmit={route('admin.candidates.update', candidate.id)}
                submitLabel="Atualizar candidato"
            />
        </AdminLayout>
    );
}
