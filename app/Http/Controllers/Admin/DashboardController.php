<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Candidate;
use App\Models\Upload;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'candidates' => Candidate::count(),
                'articles' => Article::count(),
                'uploads' => Upload::count(),
            ],
        ]);
    }
}
