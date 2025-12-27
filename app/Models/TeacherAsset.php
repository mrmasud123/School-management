<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Image\Enums\Fit;

class TeacherAsset extends Model implements HasMedia
{
    use InteractsWithMedia; 

    protected $guarded = [];
    protected $with = ['media'];
    

    public function registerMediaConversions(?Media $media = null): void{
        // Convert all images to webp format for better performance
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
}
