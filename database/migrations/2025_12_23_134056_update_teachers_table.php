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
        Schema::table('teachers', function (Blueprint $table) {
            $table->unsignedBigInteger('designation_id')->nullable()->after('joining_date');
            $table->unsignedBigInteger('employment_type_id')->nullable()->after('designation_id');
            $table->unsignedBigInteger('qualification_id')->nullable()->after('employment_type_id');
            $table->softDeletes();
            
            $table->foreign('designation_id')->references('id')->on('designations');
            $table->foreign('employment_type_id')->references('id')->on('employment_types');
            $table->foreign('qualification_id')->references('id')->on('qualifications');
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
