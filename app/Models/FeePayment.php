<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PaymentMethod;
use App\Models\Student;

class FeePayment extends Model
{
    protected $guarded = [];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
