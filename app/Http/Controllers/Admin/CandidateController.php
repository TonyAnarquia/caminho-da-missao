<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isCandidate() && !$user->candidate_id) {
            return Inertia::render('Admin/Candidates/Empty');
        }

        $query = Candidate::query();

        if ($request->filled('search')) {
            $search = trim($request->string('search')->value());
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
                    ->orWhere('office', 'like', "%{$search}%");
            });
        }

        if (!$user->canManageAll()) {
            $query->where('id', $user->candidate_id);
        }

        $candidates = $query
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Candidates/Index', [
            'candidates' => $candidates,
            'filters' => [
                'search' => $request->string('search')->value(),
            ],
            'canManageAll' => $user->canManageAll(),
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureManager($request);

        return Inertia::render('Admin/Candidates/Create');
    }

    public function store(Request $request)
    {
        $this->ensureManager($request);

        $data = $this->validatedData($request);
        $data['social_links'] = $this->normalizeLinks($data['social_links'] ?? []);
        $data['links'] = $this->normalizeLinks($data['links'] ?? []);
        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);

        $candidate = Candidate::create($data);

        $this->handleUploads($request, $candidate);

        return redirect()
            ->route('admin.candidates.edit', $candidate)
            ->with('success', 'Candidato criado.');
    }

    public function edit(Request $request, Candidate $candidate)
    {
        $this->ensureCanEdit($request, $candidate);

        return Inertia::render('Admin/Candidates/Edit', [
            'candidate' => $candidate,
        ]);
    }

    public function update(Request $request, Candidate $candidate)
    {
        $this->ensureCanEdit($request, $candidate);

        $data = $this->validatedData($request, $candidate->id);
        $data['social_links'] = $this->normalizeLinks($data['social_links'] ?? []);
        $data['links'] = $this->normalizeLinks($data['links'] ?? []);
        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);

        $candidate->update($data);

        $this->handleUploads($request, $candidate);

        return redirect()
            ->route('admin.candidates.edit', $candidate)
            ->with('success', 'Candidato atualizado.');
    }

    public function destroy(Request $request, Candidate $candidate)
    {
        $this->ensureManager($request);

        $candidate->delete();

        return redirect()
            ->route('admin.candidates.index')
            ->with('success', 'Candidato removido.');
    }

    private function validatedData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => [
                'nullable',
                'string',
                'max:120',
                Rule::unique('candidates', 'slug')->ignore($ignoreId),
            ],
            'name' => ['required', 'string', 'max:200'],
            'office' => ['nullable', 'string', 'max:120'],
            'state' => ['nullable', 'string', 'max:10'],
            'city' => ['nullable', 'string', 'max:120'],
            'party' => ['nullable', 'string', 'max:120'],
            'summary' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string'],
            'social_links' => ['nullable', 'array'],
            'social_links.*.label' => ['nullable', 'string', 'max:40'],
            'social_links.*.url' => ['nullable', 'string', 'max:255'],
            'links' => ['nullable', 'array'],
            'links.*.label' => ['nullable', 'string', 'max:60'],
            'links.*.url' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    private function handleUploads(Request $request, Candidate $candidate): void
    {
        $disk = 'public';
        $basePath = 'uploads/candidates/' . $candidate->slug;

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store($basePath, $disk);
            $candidate->update(['photo_path' => $photoPath]);
        }

        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store($basePath, $disk);
            $candidate->update(['cover_path' => $coverPath]);
        }
    }

    private function normalizeLinks(array $links): array
    {
        $normalized = [];

        foreach ($links as $link) {
            $label = trim((string) ($link['label'] ?? ''));
            $url = trim((string) ($link['url'] ?? ''));

            if ($label === '' && $url === '') {
                continue;
            }

            $normalized[] = [
                'label' => $label,
                'url' => $url,
            ];
        }

        return $normalized;
    }

    private function ensureManager(Request $request): void
    {
        if (!$request->user()->canManageAll()) {
            abort(403);
        }
    }

    private function ensureCanEdit(Request $request, Candidate $candidate): void
    {
        $user = $request->user();

        if ($user->canManageAll()) {
            return;
        }

        if ($user->candidate_id !== $candidate->id) {
            abort(403);
        }
    }
}
