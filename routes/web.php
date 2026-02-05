<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CandidateController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;

Route::get('/', function () {
    return Response::file(public_path('site/index.html'));
});

Route::get('/artigos', function () {
    return Response::file(public_path('site/artigos/index.html'));
});

Route::get('/artigos/{slug}', function () {
    return Response::file(public_path('site/artigos/index.html'));
})->where('slug', '.*');

Route::get('/candidato/{slug}', function () {
    return Response::file(public_path('site/candidato/index.html'));
})->where('slug', '.*');

Route::get('/artigos.html', function () {
    return Response::file(public_path('site/artigos.html'));
});

Route::get('/candidato.html', function () {
    return Response::file(public_path('site/candidato.html'));
});

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth'])->name('dashboard');

Route::middleware(['auth', 'role:admin,editor,candidate'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::resource('candidates', CandidateController::class);
    Route::resource('articles', ArticleController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
