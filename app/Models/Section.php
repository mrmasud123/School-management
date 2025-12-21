<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Section extends Model
{
    use SoftDeletes;
    protected $guarded = [];

    public function allClass(){
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function students(){
        return $this->hasMany(Student::class);
    }
    
    public function subjects(){
        return $this->belongsToMany(Subject::class, 'subject_section_mappings', 'section_id', 'subject_id')->withTimestamps();
    }
}
