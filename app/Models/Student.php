<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Student extends Model
{
    use SoftDeletes;
    protected $guarded = [];


    public function studentClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id', 'id');
    }

    public function sections()
    {
        return $this->belongsTo(Section::class, 'section_id', 'id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class,'section_id' );
    }

}
