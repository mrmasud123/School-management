<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class StudentFee extends Model
{
    protected $appends = ['month','category_name'];
    protected $guarded = [];

    public function feePayment()
    {
        return $this->belongsTo(FeePayment::class, 'transaction_id', 'transaction_id');
    }

    public function getMonthAttribute()
    {
        if (!$this->feePayment) {
            return null;
        }

        return Carbon::parse(
            $this->feePayment->payment_date
        )->format('F-Y');
    }

    public function feeStructure()
    {
        return $this->belongsTo(FeeStructure::class, 'fee_structure_id');
    }

    public function getCategoryNameAttribute()
    {
        return optional(
            optional($this->feeStructure)->feeCategory
        )->name;
    }
}
