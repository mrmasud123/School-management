<?php

namespace App\Exports;
// app/Exports/StudentsExport.php

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StudentsExport implements FromCollection, WithHeadings
{
    protected $search;
    protected $page;
    protected $perPage;

    public function __construct($search, $page, $perPage)
    {
        $this->search = $search;
        $this->page = (int) $page;
        $this->perPage = (int) $perPage;
    }

    public function collection()
    {
        return Student::query()
            ->when($this->search, function ($q) {
                $q->where('id', 'like', "%{$this->search}%")
                  ->orWhere('first_name', 'like', "%{$this->search}%")
                  ->orWhere('last_name', 'like', "%{$this->search}%");
            })
            ->offset(($this->page - 1) * $this->perPage)
            ->limit($this->perPage)
            ->get([
                'id',
                'first_name',
                'last_name',
                'guardian_phone',
                'status',
                'admission_no',
            ]);
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
}
