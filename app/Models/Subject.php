<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use SoftDeletes;
    protected $guarded=[];
    
    public function teacher(){
        return $this->hasOne(Teacher::class, 'id');
    }
     
    public function teacherAssignments()
    {
        return $this->hasOne(SectionTeacherSubject::class);
    }
 

}
