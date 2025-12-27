<?php

namespace App\MediaLibrary;

use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class TeacherPathGenerator implements PathGenerator
{
    public function getPath(Media $media): string
    {
        return match ($media->collection_name) {
            'images' => 'teacher/images/',
            'files'  => 'teacher/files/',
            default  => 'teacher/other/',
        };
    }

    public function getPathForConversions(Media $media): string
    {
        return $this->getPath($media) . 'conversions/';
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->getPath($media) . 'responsive/';
    }
}
