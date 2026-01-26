<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    protected $guarded = [];

    public function studentClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id', 'id');
    }

    public function feeCategory()
    {
        return $this->belongsTo(FeeCategory::class, 'fee_category_id', 'id');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id', 'id');
    }

    public function studentFees()
    {
        return $this->hasMany(StudentFee::class, 'fee_structure_id', 'id');
    }



}
