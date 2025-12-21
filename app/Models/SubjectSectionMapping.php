<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubjectSectionMapping extends Model
{
    protected $guarded = [];
    
    public function subject(){
        return $this->belongsTo(Subject::class, 'subject_id');
    }
    
    public function section(){
        return $this->belongsTo(Section::class, 'section_id');
    }
    
}
