<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExamScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'exam_id' => 'required|exists:exam_types,id',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'section_id' => 'nullable|exists:sections,id',

            'exam_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'duration_minutes' => 'required|integer|min:1',

            'room_id' => 'nullable|integer',
            'invigilator_id' => 'nullable|exists:teachers,id',

            'total_marks' => 'required|numeric|min:1',
            'passing_marks' => 'required|numeric|min:0|lte:total_marks',

            'instructions' => 'nullable|string',
            'status' => ['required', Rule::in(['scheduled', 'ongoing', 'completed', 'cancelled'])],

            'is_mark_entry_locked' => 'required|boolean',
            'mark_entry_deadline' => 'nullable|date|after_or_equal:exam_date',
        ];
    }
}
