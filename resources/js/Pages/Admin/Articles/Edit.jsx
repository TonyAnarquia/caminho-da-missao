import AdminLayout from '@/Layouts/AdminLayout';
import ArticleForm from './ArticleForm';

export default function Edit({ article, candidates }) {
    return (
        <AdminLayout title={`Editar ${article.title}`}>
            <ArticleForm
                article={article}
                candidates={candidates}
                onSubmit={route('admin.articles.update', article.id)}
                submitLabel="Atualizar artigo"
            />
        </AdminLayout>
    );
}
