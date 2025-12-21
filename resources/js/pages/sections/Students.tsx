import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Subject {
    id: number;
    name: string;
    status: number;
    pivot: {
        section_id: number;
        subject_id: number;
        created_at: string;
        updated_at: string | null;
    };
}

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    guardian_phone: string;
    student_class?: {
        name: string;
    };
    section?: {
        name: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    photo?: string;
}

interface Section {
    id: number;
    name: string;
    subjects?: Subject[];
}

interface StudentsProps {
    students: Student[];
    section: Section;
}

export default function Students({ students, section,subjects }: StudentsProps) {
    const baseURL = import.meta.env.VITE_APP_URL as string;
    const [filterText, setFilterText] = useState('');
    console.log('subjects', subjects);


    const filteredUsers = students.filter((student) => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const search = filterText.toLowerCase();

        return (
            student.id.toString().includes(search) ||
            fullName.includes(search) ||
            student.email.toLowerCase().includes(search)
        );
    });


    const columns: TableColumn<Student>[] = [
        {
            name: 'Name',
            cell: (row) => `${row.first_name} ${row.last_name}`,
            sortable: true,
        },
        {
            name: 'Guardian Contact',
            cell: (row) => row.guardian_phone,
        },
        {
            name: 'Class Level',
            center: true,
            cell: (row) => (
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-md">
                    CLASS {row.student_class?.name ?? 'N/A'}
                </span>
            ),
        },
        {
            name: 'Section',
            cell: (row) => (
                <span className="px-2 py-1 bg-pink-500 text-white text-xs rounded-md">
                    {row.section?.name ?? 'N/A'}
                </span>
            ),
        },
        {
            name: 'Admission Status',
            cell: (row) => (
                <Select value={row.status}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            ),
        },
        {
            name: 'Photo',
            cell: (row) => (
                <div className="w-16 h-16 overflow-hidden rounded-md">
                    <img
                        src={
                            row.photo
                                ? `${baseURL}/storage/${row.photo}`
                                : '/images/avatar.png'
                        }
                        className="w-full h-full object-cover"
                    />
                </div>
            ),
        },
    ];


    return (
        <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>

            <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">
                    Assigned Subjects for Section{' '}
                    <span className="bg-green-500 text-white rounded-md px-3 py-1">
                        {section.name}
                    </span>
                </h1>

                {subjects?.subjects?.length === 0 ? (
                    <p className="text-gray-500">
                        No subjects assigned to this section.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {subjects?.subjects?.map((subject) => (
                            <div
                                key={subject.id}
                                className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
                            >
                                <h3 className="text-lg font-bold text-gray-800">
                                    {subject.name}
                                </h3>

                                <span className="inline-block mt-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                    Active
                                </span>

                                <p className="mt-3 text-xs text-gray-500">
                                    Assigned on{' '}
                                    {new Date(
                                        subject.pivot.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">
                    Section{' '}
                    <span className="bg-green-500 text-white rounded-md px-3 py-1">
                        {section.name}
                    </span>{' '}
                    Students
                </h1>

                <div className="flex items-center justify-between gap-4 mb-4">
                    <Link
                        href="/sections"
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        View Sections
                    </Link>

                    <input
                        type="text"
                        placeholder="Search by ID, name, or email"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>

                <DataTable
                    title="Student List"
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    highlightOnHover
                    customStyles={{
                        rows: {
                            style:{
                                minHeight : "100px"
                            }
                        },
                        header: {
                            style:{
                                borderTopLeftRadius:"10px",
                                borderTopRightRadius: "10px"
                            }
                        },
                        pagination: {
                            style: {
                                borderBottomLeftRadius: '10px',
                                borderBottomRightRadius: '10px',
                                overflow: 'hidden',
                            },
                        },
                    }}
                />
            </div>

        </AppLayout>
    );
}
