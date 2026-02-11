<?php
// database/migrations/2024_01_01_000004_create_exam_schedules_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('section_id')->nullable()->constrained('sections')->onDelete('cascade');
            $table->date('exam_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_minutes');
            $table->foreignId('room_id')->nullable();
            $table->foreignId('invigilator_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->decimal('total_marks', 6, 2);
            $table->decimal('passing_marks', 6, 2);
            $table->text('instructions')->nullable();
            $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled'])->default('scheduled');
            $table->boolean('is_mark_entry_locked')->default(false);
            $table->timestamp('mark_entry_deadline')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Prevent duplicate schedules
            $table->unique(['exam_id', 'class_id', 'subject_id', 'section_id'], 'unique_exam_schedule');

            // Indexes
            $table->index(['exam_id', 'class_id']);
            $table->index('exam_date');
            $table->index('invigilator_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_schedules');
    }
};