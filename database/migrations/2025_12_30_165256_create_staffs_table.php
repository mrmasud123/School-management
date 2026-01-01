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
        Schema::create('staffs', function (Blueprint $table) {
            $table->id(); 
            $table->string('staff_code')->unique();

            $table->string('first_name');
            $table->string('last_name')->nullable();

            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('date_of_birth')->nullable();

            $table->string('phone');
            $table->string('email')->nullable();
            $table->text('address')->nullable();

            $table->date('joining_date');
 
            $table->enum('staff_type', ['support'])->default('support');

            $table->enum('employment_status', [
                'probation',
                'permanent',
                'contract',
                'resigned'
            ])->default('permanent');

            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
