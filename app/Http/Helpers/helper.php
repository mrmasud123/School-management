<?php

use Illuminate\Support\Facades\DB;


public function generateAdmissionNo()
{
    $year = date('Y');

    $sequence = DB::table('admission_sequences')
        ->where('year', $year)
        ->orderBy('number', 'desc')
        ->first();

    $nextNumber = $sequence ? $sequence->number + 1 : 1;

    DB::table('admission_sequences')->insert([
        'year' => $year,
        'number' => $nextNumber,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return $year . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
}



?>
