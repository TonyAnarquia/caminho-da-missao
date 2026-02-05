<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Candidate;
use Illuminate\Support\Facades\File;

class ContentExportService
{
    public function export(): void
    {
        $basePath = public_path('assets/content');
        $candidatesPath = $basePath . '/candidatos';
        $articlesPath = $basePath . '/artigos';
        $indicesPath = $basePath . '/indices';

        File::ensureDirectoryExists($candidatesPath);
        File::ensureDirectoryExists($articlesPath);
        File::ensureDirectoryExists($indicesPath);

        $candidateIndex = [];

        Candidate::where('is_active', true)
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->each(function (Candidate $candidate) use ($candidatesPath, &$candidateIndex) {
                $photo = $candidate->photo_path ? $this->storageUrl($candidate->photo_path) : 'assets/img/og-image.png';

                $payload = [
                    'id' => $candidate->slug,
                    'nome' => $candidate->name,
                    'cargo' => $candidate->office,
                    'partido' => $candidate->party,
                    'foto' => $photo,
                    'bio' => $candidate->summary ?: $candidate->bio,
                    'socials' => $candidate->social_links ?: [],
                    'status' => $candidate->is_active ? 'published' : 'draft',
                ];

                $candidateIndex[] = [
                    'id' => $candidate->slug,
                    'nome' => $candidate->name,
                    'cargo' => $candidate->office,
                    'partido' => $candidate->party,
                    'foto' => $photo,
                    'status' => $candidate->is_active ? 'published' : 'draft',
                ];

                File::put(
                    $candidatesPath . '/' . $candidate->slug . '.json',
                    json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
                );
            });

        File::put(
            $indicesPath . '/candidatos.json',
            json_encode($candidateIndex, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        $articleIndex = [];

        Article::with('candidate')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->each(function (Article $article) use ($articlesPath, &$articleIndex) {
                $publishedAt = $article->published_at ?? $article->created_at;
                $cover = $article->cover_path ? $this->storageUrl($article->cover_path) : 'assets/img/og-image.png';
                $audio = $article->audio_path ? $this->storageUrl($article->audio_path) : '';
                $tags = $article->tags ?: [];
                $theme = $tags[0] ?? 'Institucional';

                $contentBlocks = $this->bodyToBlocks($article->body);

                $payload = [
                    'id' => 'artigo-' . $article->id,
                    'slug' => $article->slug,
                    'titulo' => $article->title,
                    'resumo' => $article->excerpt,
                    'data' => $publishedAt->format('Y-m-d'),
                    'candidato_id' => $article->candidate?->slug,
                    'tema' => $theme,
                    'tags' => $tags,
                    'imagem' => $cover,
                    'audio_url' => $audio,
                    'status' => $article->status,
                    'conteudo' => $contentBlocks,
                ];

                $articleIndex[] = [
                    'id' => 'artigo-' . $article->id,
                    'slug' => $article->slug,
                    'titulo' => $article->title,
                    'resumo' => $article->excerpt,
                    'data' => $publishedAt->format('Y-m-d'),
                    'candidato_id' => $article->candidate?->slug,
                    'tema' => $theme,
                    'tags' => $tags,
                    'imagem' => $cover,
                    'audio_url' => $audio,
                    'status' => $article->status,
                ];

                File::put(
                    $articlesPath . '/' . $article->slug . '.json',
                    json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
                );
            });

        File::put(
            $indicesPath . '/artigos.json',
            json_encode($articleIndex, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }

    private function storageUrl(string $path): string
    {
        return '/storage/' . ltrim($path, '/');
    }

    private function bodyToBlocks(?string $body): array
    {
        if (!$body) {
            return [];
        }

        $paragraphs = preg_split("/\\R\\R+/", trim($body)) ?: [];
        $blocks = [];

        foreach ($paragraphs as $paragraph) {
            $text = trim($paragraph);
            if ($text === '') {
                continue;
            }
            $blocks[] = [
                'tipo' => 'p',
                'texto' => $text,
            ];
        }

        return $blocks;
    }
}
