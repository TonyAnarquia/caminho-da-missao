<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'office',
        'state',
        'city',
        'party',
        'summary',
        'bio',
        'photo_path',
        'cover_path',
        'social_links',
        'links',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'social_links' => 'array',
        'links' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
