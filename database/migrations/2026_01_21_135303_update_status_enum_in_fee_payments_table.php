<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    { 
        DB::table('fee_payments')->where('status', 'full')->update(['status' => 'paid']);
 
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->enum('status', ['partial', 'paid', 'overpaid'])->default('partial')->change();
        });
    }

    public function down(): void
    { 
        Schema::table('fee_payments', function (Blueprint $table) {
            $table->enum('status', ['partial', 'full'])->default('partial')->change();
        });
 
        DB::table('fee_payments')->where('status', 'paid')->update(['status' => 'full']);
    }
};
