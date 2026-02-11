<?php
// database/migrations/2024_01_01_000002_create_grade_scales_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('grade_scales', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->decimal('grade_point', 5, 2)->unique();
            $table->string('remarks')->nullable();
            $table->string('color_code')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grade_scales');
    }
};