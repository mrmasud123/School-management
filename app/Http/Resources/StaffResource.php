<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {/* 
        Full texts
        id
        staff_code
        first_name
        last_name
        gender
        date_of_birth
        phone
        email
        address
        joining_date
        staff_type
        employment_status
        is_active */
        return [
            'id' => $this->id,
            'staff_code' => $this->staff_code,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->first_name . ' ' . $this->last_name,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,
            'joining_date' => $this->joining_date,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'staff_type' => $this->staff_type,
            'employment_status' => $this->employment_status,
            'is_active' => $this->is_active,
            'photo_url' => $this->getFirstMediaUrl('staff') ?: null,
        ];
    }
}
