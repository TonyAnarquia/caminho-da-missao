import AdminLayout from '@/Layouts/AdminLayout';
import ArticleForm from './ArticleForm';

export default function Create({ candidates }) {
    return (
        <AdminLayout title="Novo artigo">
            <ArticleForm
                candidates={candidates}
                onSubmit={route('admin.articles.store')}
                submitLabel="Salvar artigo"
            />
        </AdminLayout>
    );
}
