<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('office')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->string('party')->nullable();
            $table->text('summary')->nullable();
            $table->longText('bio')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('cover_path')->nullable();
            $table->json('social_links')->nullable();
            $table->json('links')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
