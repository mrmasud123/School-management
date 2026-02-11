<?php 

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->decimal('total_marks_obtained', 8, 2);
            $table->decimal('total_marks', 8, 2);
            $table->decimal('percentage', 5, 2);
            $table->string('overall_grade', 10)->nullable();
            $table->decimal('gpa', 3, 2)->nullable();
            $table->integer('class_rank')->nullable();
            $table->integer('section_rank')->nullable();
            $table->boolean('is_promoted')->nullable();
            $table->text('remarks')->nullable();
            $table->enum('result_status', ['pass', 'fail', 'compartment', 'withheld'])->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->unique(['exam_id', 'student_id'], 'unique_overall_result');
            $table->index(['exam_id', 'class_id']);
            $table->index('class_rank');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_progress');
    }
};