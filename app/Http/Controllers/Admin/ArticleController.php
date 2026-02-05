<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Article::query()->with('candidate');

        if ($request->filled('search')) {
            $search = trim($request->string('search')->value());
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->value());
        }

        if (!$user->canManageAll()) {
            $query->where('author_id', $user->id)
                ->orWhere('candidate_id', $user->candidate_id);
        }

        $articles = $query->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'filters' => [
                'search' => $request->string('search')->value(),
                'status' => $request->string('status')->value(),
            ],
            'canManageAll' => $user->canManageAll(),
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureManager($request);

        return Inertia::render('Admin/Articles/Create', [
            'candidates' => Candidate::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureManager($request);

        $data = $this->validatedData($request);
        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['author_id'] = $request->user()->id;

        $data['tags'] = $this->normalizeTags($request->input('tags_input'));

        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $article = Article::create($data);

        $this->handleUploads($request, $article);

        return redirect()
            ->route('admin.articles.edit', $article)
            ->with('success', 'Artigo criado.');
    }

    public function edit(Request $request, Article $article)
    {
        $this->ensureCanEdit($request, $article);

        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article,
            'candidates' => Candidate::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $this->ensureCanEdit($request, $article);

        $data = $this->validatedData($request, $article->id);
        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['tags'] = $this->normalizeTags($request->input('tags_input'));

        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $article->update($data);

        $this->handleUploads($request, $article);

        return redirect()
            ->route('admin.articles.edit', $article)
            ->with('success', 'Artigo atualizado.');
    }

    public function destroy(Request $request, Article $article)
    {
        $this->ensureManager($request);

        $article->delete();

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'Artigo removido.');
    }

    private function validatedData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => [
                'nullable',
                'string',
                'max:160',
                Rule::unique('articles', 'slug')->ignore($ignoreId),
            ],
            'title' => ['required', 'string', 'max:200'],
            'subtitle' => ['nullable', 'string', 'max:200'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'candidate_id' => ['nullable', 'exists:candidates,id'],
        ]);
    }

    private function normalizeTags(?string $tagsInput): array
    {
        if (!$tagsInput) {
            return [];
        }

        $tags = array_map('trim', explode(',', $tagsInput));
        $tags = array_filter($tags, fn ($tag) => $tag !== '');

        return array_values($tags);
    }

    private function handleUploads(Request $request, Article $article): void
    {
        $disk = 'public';
        $basePath = 'uploads/articles/' . $article->slug;

        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store($basePath, $disk);
            $article->update(['cover_path' => $coverPath]);
        }

        if ($request->hasFile('audio')) {
            $audioPath = $request->file('audio')->store($basePath, $disk);
            $article->update(['audio_path' => $audioPath]);
        }
    }

    private function ensureManager(Request $request): void
    {
        if (!$request->user()->canManageAll()) {
            abort(403);
        }
    }

    private function ensureCanEdit(Request $request, Article $article): void
    {
        $user = $request->user();

        if ($user->canManageAll()) {
            return;
        }

        if ($article->author_id !== $user->id && $article->candidate_id !== $user->candidate_id) {
            abort(403);
        }
    }
}
