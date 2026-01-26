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
        Schema::create('fee_payments', function (Blueprint $table) {
            $table->id();

            $table->string('transaction_id')->unique();

            $table->foreignId('student_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->decimal('amount_paid', 10, 2);

            $table->date('payment_date');
            $table->enum('status', ['partial', 'full'])->default('partial');

            $table->foreignId('received_by')
                ->constrained('users');

            $table->text('remarks')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_payments');
    }
};
