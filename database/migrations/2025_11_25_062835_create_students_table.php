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
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->string('admission_no')->unique();
        $table->string('first_name');
        $table->string('last_name');
        $table->date('dob');
        $table->string('blood_group')->nullable();
        $table->enum('gender', ['male','female','other']);
        $table->string('email')->unique()->nullable();
        $table->string('guardian_phone')->unique();
        $table->foreignId('class_id')->constrained()->cascadeOnDelete();
        $table->foreignId('section_id')->constrained()->cascadeOnDelete();
        $table->date('admission_date');
        $table->string('academic_year');
        $table->boolean('student_status')->default(0);
        $table->string('previous_school')->nullable();
        $table->text('address')->nullable();
        $table->string('photo')->nullable();
        $table->enum('status', ['pending','approved','rejected'])->default('pending');
        $table->timestamps();
        $table->softDeletes();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
