<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_schedule_id')->constrained('exam_schedules')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->decimal('marks_obtained', 6, 2);
            $table->decimal('total_marks', 6, 2);
            $table->decimal('percentage', 5, 2);
            $table->string('grade', 10)->nullable();
            $table->decimal('grade_point', 3, 2)->nullable();
            $table->boolean('is_absent')->default(false);
            $table->boolean('is_passed')->default(false);
            $table->text('remarks')->nullable();
            $table->enum('status', ['pending', 'draft', 'submitted', 'verified', 'published'])->default('pending');
            $table->foreignId('created_by')->nullable()->constrained('teachers')->onDelete('set null');
            $table->timestamp('created_at')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('teachers')->onDelete('set null');
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();

            $table->unique(['exam_schedule_id', 'student_id'], 'unique_student_exam_result');

            $table->index(['student_id', 'exam_schedule_id']);
            $table->index('status');
            $table->index('is_absent');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_results');
    }
};