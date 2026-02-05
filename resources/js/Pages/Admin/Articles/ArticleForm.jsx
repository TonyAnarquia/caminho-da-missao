import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';

export default function ArticleForm({ article, candidates, onSubmit, submitLabel }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: article?.title || '',
        slug: article?.slug || '',
        subtitle: article?.subtitle || '',
        excerpt: article?.excerpt || '',
        body: article?.body || '',
        status: article?.status || 'draft',
        published_at: article?.published_at || '',
        candidate_id: article?.candidate_id || '',
        tags_input: article?.tags?.join(', ') || '',
        cover: null,
        audio: null,
    });

    const submit = (event) => {
        event.preventDefault();
        if (article) {
            put(onSubmit, { forceFormData: true });
        } else {
            post(onSubmit, { forceFormData: true });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <InputLabel value="Título" />
                    <TextInput
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-2 w-full"
                    />
                    <InputError message={errors.title} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Slug (opcional)" />
                    <TextInput
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        className="mt-2 w-full"
                    />
                    <InputError message={errors.slug} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Status" />
                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 p-2 text-sm text-slate-100"
                    >
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <InputLabel value="Subtítulo" />
                    <TextInput
                        value={data.subtitle}
                        onChange={(e) => setData('subtitle', e.target.value)}
                        className="mt-2 w-full"
                    />
                </div>
                <div className="md:col-span-2">
                    <InputLabel value="Resumo" />
                    <textarea
                        value={data.excerpt}
                        onChange={(e) => setData('excerpt', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-100"
                        rows={3}
                    />
                    <InputError message={errors.excerpt} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                    <InputLabel value="Conteúdo completo" />
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-100"
                        rows={10}
                    />
                    <InputError message={errors.body} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Candidato vinculado" />
                    <select
                        value={data.candidate_id}
                        onChange={(e) => setData('candidate_id', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 p-2 text-sm text-slate-100"
                    >
                        <option value="">Sem candidato</option>
                        {candidates.map((candidate) => (
                            <option key={candidate.id} value={candidate.id}>
                                {candidate.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <InputLabel value="Data de publicação" />
                    <TextInput
                        type="datetime-local"
                        value={data.published_at}
                        onChange={(e) => setData('published_at', e.target.value)}
                        className="mt-2 w-full"
                    />
                </div>
                <div className="md:col-span-2">
                    <InputLabel value="Tags (separadas por vírgula)" />
                    <TextInput
                        value={data.tags_input}
                        onChange={(e) => setData('tags_input', e.target.value)}
                        className="mt-2 w-full"
                    />
                </div>
                <div>
                    <InputLabel value="Imagem de capa" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('cover', e.target.files[0])}
                        className="mt-2 block w-full text-sm text-slate-200"
                    />
                </div>
                <div>
                    <InputLabel value="Áudio (MP3)" />
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setData('audio', e.target.files[0])}
                        className="mt-2 block w-full text-sm text-slate-200"
                    />
                </div>
            </div>

            <PrimaryButton disabled={processing}>
                {submitLabel}
            </PrimaryButton>
        </form>
    );
}
