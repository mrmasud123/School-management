<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class StudentsExport implements FromQuery, WithHeadings, WithChunkReading
{
    protected $search;

    public function __construct($search)
    {
        $this->search = $search;
    }

    public function query()
    {
        return Student::query()
            ->with(['studentClass', 'section'])
            ->when($this->search, function ($q) {
                $q->where('id', 'like', "%{$this->search}%")
                  ->orWhere('first_name', 'like', "%{$this->search}%")
                  ->orWhere('last_name', 'like', "%{$this->search}%");
            })
            ->select('id', 'first_name', 'last_name', 'guardian_phone', 'status', 'admission_no');
    }

    public function headings(): array
    {
        return [
            'ID',
            'First Name',
            'Last Name',
            'Guardian Phone',
            'Status',
            'Admission No',
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
