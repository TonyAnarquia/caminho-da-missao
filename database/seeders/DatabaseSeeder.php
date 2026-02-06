<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@missao.mbl.yt');
        $adminPassword = env('ADMIN_PASSWORD', 'TroqueEssaSenha!2026');

        User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => env('ADMIN_NAME', 'Admin Missao'),
                'password' => bcrypt($adminPassword),
                'role' => 'admin',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
    }
}
