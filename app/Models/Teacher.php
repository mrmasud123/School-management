<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Image\Enums\Fit;

class Teacher extends Model implements HasMedia
{
    use SoftDeletes;
    use InteractsWithMedia;
    protected $guarded = [];

    protected $with = ['media'];

    protected $appends = ['photo_url'];
    protected $hidden = ['media'];
    public function getPhotoUrlAttribute()
    {
        return $this->getFirstMediaUrl('images') ?: null;
    }
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->format('webp')
            ->nonQueued();

        $this->addMediaConversion('thumb')
            ->format('webp')
            ->width(300)
            ->height(200)
            ->sharpen(10)
            ->nonQueued();
    }
    public function contact()
    {
        return $this->hasOne(TeacherContact::class);
    }

    public function specializations()
    {
        return $this->belongsToMany(
            Specialization::class,
            'teacher_specializations'
        );
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    public function employmentType()
    {
        return $this->belongsTo(EmployementType::class);
    }

    public function qualification()
    {
        return $this->belongsTo(Qualification::class);
    }
}
