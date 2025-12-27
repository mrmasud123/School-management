<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->first_name . ' ' . $this->last_name,

            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,
            'joining_date' => $this->joining_date,
            'experience_years' => $this->experience_years,
            'is_active' => (bool) $this->is_active,
            
            'designation' => $this->whenLoaded('designation', fn () => [
                'id' => $this->designation->id,
                'name' => $this->designation->name,
            ]),

            'employment_type' => $this->whenLoaded('employmentType', fn () => [
                'id' => $this->employmentType->id,
                'type' => $this->employmentType->type,
            ]),

            'qualification' => $this->whenLoaded('qualification', fn () => [
                'id' => $this->qualification->id,
                'name' => $this->qualification->name,
            ]),

            'contact' => $this->whenLoaded('contact', fn () => [
                'email' => $this->contact->email,
                'phone' => $this->contact->phone,
                'address' => $this->contact->address,
            ]),

            'specializations' => $this->whenLoaded('specializations', function () {
                return $this->specializations->map(fn ($spec) => [
                    'id' => $spec->id,
                    'name' => $spec->name,
                ]);
            }),

            'photo_url' => $this->getFirstMediaUrl('images') ?: null,
            'document_url' => $this->getFirstMediaUrl('files') ?: null,

            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
