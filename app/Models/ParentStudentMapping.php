<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParentStudentMapping extends Model
{
    protected $guarded = [];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }


    public function parents()
    {
        return $this->belongsTo(ParentAccount::class, 'parent_id');
    }
}
