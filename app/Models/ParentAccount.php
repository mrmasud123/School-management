<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentAccount extends Model
{
    use SoftDeletes;
    protected $guarded = [];


    public function students()
    {
        return $this->belongsToMany(
            Student::class,
            'parent_student_mappings',
            'parent_id',
            'student_id'
        );
    }
}
