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
        Schema::table('students', function (Blueprint $table) {
            $table->string('father_name')->after('email');
            $table->string('mother_name')->after('father_name');
            $table->string('father_occupation')->nullable()->after('mother_name');
            $table->string('mother_occupation')->nullable()->after('father_occupation');
            $table->string('nationality')->after('mother_occupation');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
