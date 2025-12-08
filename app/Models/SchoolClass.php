<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SchoolClass extends Model
{
    use SoftDeletes;
    protected $table="classes";
    protected $guarded = [];

    public function students(){
        return $this->hasMany(Student::class, 'class_id');
    }

    public function sections(){
        return $this->hasMany(Section::class, 'class_id');
    }

    public function section(){
        return $this->hasMany(Section::class, 'class_id');
    }
}
