<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
class Student extends Model implements HasMedia
{
    use SoftDeletes;
    use InteractsWithMedia;
    protected $guarded = [];
//    protected $with = ['media'];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute()
    {
        return $this->getFirstMediaUrl('students') ?: null;
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
