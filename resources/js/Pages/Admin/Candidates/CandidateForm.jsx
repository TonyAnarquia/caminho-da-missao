import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';

export default function CandidateForm({ candidate, onSubmit, submitLabel }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: candidate?.name || '',
        slug: candidate?.slug || '',
        office: candidate?.office || '',
        state: candidate?.state || '',
        city: candidate?.city || '',
        party: candidate?.party || '',
        summary: candidate?.summary || '',
        bio: candidate?.bio || '',
        sort_order: candidate?.sort_order ?? 0,
        is_featured: candidate?.is_featured ?? false,
        is_active: candidate?.is_active ?? true,
        social_links: candidate?.social_links || [{ label: '', url: '' }],
        links: candidate?.links || [{ label: '', url: '' }],
        photo: null,
        cover: null,
    });

    const submit = (event) => {
        event.preventDefault();
        if (candidate) {
            put(onSubmit, {
                forceFormData: true,
            });
        } else {
            post(onSubmit, {
                forceFormData: true,
            });
        }
    };

    const updateSocial = (index, key, value) => {
        const next = [...data.social_links];
        next[index] = { ...next[index], [key]: value };
        setData('social_links', next);
    };

    const updateLink = (index, key, value) => {
        const next = [...data.links];
        next[index] = { ...next[index], [key]: value };
        setData('links', next);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <InputLabel value="Nome completo" />
                    <TextInput
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-2 w-full"
                    />
                    <InputError message={errors.name} className="mt-1" />
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
                    <InputLabel value="Cargo" />
                    <TextInput
                        value={data.office}
                        onChange={(e) => setData('office', e.target.value)}
                        className="mt-2 w-full"
                    />
                </div>
                <div>
                    <InputLabel value="Estado (UF)" />
                    <TextInput
                        value={data.state}
                        onChange={(e) => setData('state', e.target.value)}
                        className="mt-2 w-full"
                    />
                </div>
                <div>
                    <InputLabel value="Cidade" />
                    <TextInput
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className="mt-2 w-full"
                    />
                </div>
                <div>
                    <InputLabel value="Partido / Movimento" />
                    <TextInput
                        value={data.party}
                        onChange={(e) => setData('party', e.target.value)}
                        className="mt-2 w-full"
                    />
                </div>
                <div className="md:col-span-2">
                    <InputLabel value="Resumo curto" />
                    <textarea
                        value={data.summary}
                        onChange={(e) => setData('summary', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-100"
                        rows={2}
                    />
                    <InputError message={errors.summary} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                    <InputLabel value="Biografia completa" />
                    <textarea
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-100"
                        rows={6}
                    />
                    <InputError message={errors.bio} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Foto" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('photo', e.target.files[0])}
                        className="mt-2 block w-full text-sm text-slate-200"
                    />
                </div>
                <div>
                    <InputLabel value="Capa" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('cover', e.target.files[0])}
                        className="mt-2 block w-full text-sm text-slate-200"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="mb-3 text-sm font-semibold text-slate-200">
                        Redes sociais
                    </div>
                    {data.social_links.map((item, index) => (
                        <div key={`social-${index}`} className="mb-3 grid gap-2 md:grid-cols-2">
                            <TextInput
                                placeholder="Label"
                                value={item.label}
                                onChange={(e) => updateSocial(index, 'label', e.target.value)}
                                className="w-full"
                            />
                            <TextInput
                                placeholder="URL"
                                value={item.url}
                                onChange={(e) => updateSocial(index, 'url', e.target.value)}
                                className="w-full"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            setData('social_links', [...data.social_links, { label: '', url: '' }])
                        }
                        className="text-sm text-amber-400"
                    >
                        + Adicionar rede
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="mb-3 text-sm font-semibold text-slate-200">
                        Links úteis
                    </div>
                    {data.links.map((item, index) => (
                        <div key={`link-${index}`} className="mb-3 grid gap-2 md:grid-cols-2">
                            <TextInput
                                placeholder="Label"
                                value={item.label}
                                onChange={(e) => updateLink(index, 'label', e.target.value)}
                                className="w-full"
                            />
                            <TextInput
                                placeholder="URL"
                                value={item.url}
                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                                className="w-full"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setData('links', [...data.links, { label: '', url: '' }])}
                        className="text-sm text-amber-400"
                    >
                        + Adicionar link
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-200">
                    <input
                        type="checkbox"
                        checked={data.is_featured}
                        onChange={(e) => setData('is_featured', e.target.checked)}
                    />
                    Destaque nacional
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-200">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                    />
                    Ativo
                </label>
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>
                    {submitLabel}
                </PrimaryButton>
            </div>
        </form>
    );
}
