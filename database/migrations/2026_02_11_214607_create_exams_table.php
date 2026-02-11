<?php 

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->foreignId('exam_type_id')->constrained('exam_types')->onDelete('restrict');
            $table->string('name'); 
            $table->string('code')->nullable()->unique(); 
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->date('result_publish_date')->nullable();
            $table->enum('status', ['draft', 'scheduled', 'ongoing', 'completed', 'published', 'cancelled'])->default('draft');
            $table->boolean('is_final_exam')->default(false);
            $table->text('instructions')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
 
            $table->index(['academic_year_id', 'exam_type_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};