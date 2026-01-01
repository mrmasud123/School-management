<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Image\Enums\Fit;

class Staff extends Model implements HasMedia
{
    use SoftDeletes;
    use InteractsWithMedia;
    protected $guarded = [];
    protected $table='staffs';
    
    protected $with = ['media'];
    
    // public function registerMediaConversions(?Media $media = null): void
    // {
    //     $this->addMediaConversion('webp')
    //         ->format('webp')
    //         ->nonQueued();

    //     $this->addMediaConversion('thumb')
    //         ->format('webp')
    //         ->width(300)
    //         ->height(200)
    //         ->sharpen(10)
    //         ->nonQueued();
    // }
}
