<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('fee_categories', function (Blueprint $table) {
            $table->enum('frequency', ['monthly', 'yearly', 'one_time', 'half_yearly'])->after('name')->default('monthly');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fee_categories', function (Blueprint $table) {
            $table->dropColumn('frequency');
        });
    }
};
