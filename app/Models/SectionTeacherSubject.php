<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SectionTeacherSubject extends Model
{
    protected $guarded = [];
    // protected $appends = ['section_name'];

    // public function getSectionNameAttribute(){
    //     return $this->section?->name;
    // }
    
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}

