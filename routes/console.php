<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Services\ContentExportService;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('content:export', function (ContentExportService $service) {
    $service->export();
    $this->info('Conteudos exportados para public/assets/content.');
})->purpose('Exporta candidatos e artigos para JSON estatico');
