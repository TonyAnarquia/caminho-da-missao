<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'subtitle',
        'excerpt',
        'body',
        'cover_path',
        'audio_path',
        'status',
        'tags',
        'published_at',
        'view_count',
        'candidate_id',
        'author_id',
    ];

    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
