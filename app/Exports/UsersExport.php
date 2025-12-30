<?php

namespace App\Exports;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use App\Models\User;
class UsersExport implements FromQuery, WithHeadings, WithChunkReading
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        return User::query()
            ->when($this->filters['search'], fn($q) =>
                $q->where('name', 'like', "%{$this->filters['search']}%")
            );
    }

    public function headings(): array
    {
        return ['ID', 'Name', 'Email', 'Created At'];
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
