import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Edit, NotebookTabs, Trash } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Spinner } from '@/components/ui/spinner';

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
    admission_no: string;
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
interface Subject {
    id: number;
    name: string;
    status: number;

}
interface StudentsProps {
    students: Student[];
    section: Section;
    subjects: Subject[]
}

export default function Students({ students, section }: StudentsProps) {
    console.log(section);
    const baseURL = import.meta.env.VITE_APP_URL as string;
    const [filterText, setFilterText] = useState('');
    const [removing, setRemoving] = useState(false);
    const updateStatus = (id: number, status: string) => {
        router.put(`/students/${id}/status`, { status }, {
            onSuccess: () => toast.success("Status updated"),
            onError: () => toast.error("Update failed")
        });
        console.log(status)
    };

    const filteredUsers = students.filter((student) => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const search = filterText.toLowerCase();

        return (
            student.id.toString().includes(search) ||
            fullName.includes(search) ||
            student.email.toLowerCase().includes(search)
        );
    });

    const downloadIdCard = (id: number) => {
        window.open(`/students/idcard/${id}`, "_blank");
    };

    const columns: TableColumn<Student>[] = [
        {
            name: 'Name',
            cell: (row) => `${row.first_name} ${row.last_name}`,
            sortable: true,
        },
        {
            name: 'Admission No',
            cell: row => (
                <span
                    onClick={() => {
                        navigator.clipboard.writeText(row.admission_no);
                        toast.success('Admission Number Copied!');
                    }}
                    className="cursor-pointer text-blue-600 hover:underline"
                >
                    {row.admission_no}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Guardian Contact',
            cell: (row) => row.guardian_phone,
        },
        {
            name: 'Class Level',
            // center: true,
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
                <Select value={row.status} onValueChange={(value) => updateStatus(row.id, value)}>
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
        {
            name: 'Action',
            cell: row => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className='cursor-pointer'>Action</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="" align="start">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className='cursor-pointer'>
                                <Link
                                    href={`/students/${row.id}/edit`}
                                    className="px-3 flex items-center w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                                >
                                    Edit
                                    <DropdownMenuShortcut><Edit className='text-white' /></DropdownMenuShortcut>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className='cursor-pointer'>
                                <Button
                                    className="px-3 cursor-pointer py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                                    onClick={() => downloadIdCard(row.id)}
                                >
                                    Download ID Card
                                    <DropdownMenuShortcut><NotebookTabs className='text-white' /></DropdownMenuShortcut>
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    const removeSubject = async (classId, sectionId, subjectId, teacherId) => {
        console.log(classId, sectionId, subjectId, teacherId);

        router.delete('/section-subject-teacher-mapping-remove', {
            data: {
                class_id: classId,
                section_id: sectionId,
                subject_id: subjectId,
                teacher_id: teacherId,
            },
            onSuccess: () => {
                toast.success("Subject removed successfully!");
            },
            onError: () => {
                toast.error("Failed to remove subject");
            },
        });
    };


    return (
        <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>

            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">
                    Assigned Subjects for Section{' '}
                    <span className="bg-green-500 text-white rounded-md px-3 py-1">
                        {section?.name}
                    </span>
                </h1>
                {section?.subjects?.length === 0 ? (
                    <p className="text-gray-500">
                        No subjects assigned to this section.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {section.subjects?.map((subject) => {
                            const isAssigned = subject?.teacher_assignments ?? null;
                            return (
                                <div
                                    key={subject.id}
                                    className={`border rounded-lg p-4 shadow-sm flex items-start justify-between
                                        ${isAssigned ? 'bg-white' : 'bg-red-50 border-red-400'}
                                    `}
                                >
                                    <div>
                                        <h3 className="font-semibold">
                                            {subject.name}
                                        </h3>
                                        <p className={`text-sm mt-1 ${isAssigned ? 'text-gray-600' : 'text-red-600 font-medium'}`}>
                                            Teacher: {isAssigned
                                                ? `${subject?.teacher_assignments?.teacher?.first_name} ${subject?.teacher_assignments?.teacher?.last_name}`
                                                : 'Not Assigned'}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Assigned on{" "}
                                            {new Date(subject.created_at).toLocaleDateString()}
                                        </p>

                                        <Button
                                            type="submit"
                                            disabled={removing}
                                            className="flex cursor-pointer items-center gap-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            onClick={()=> removeSubject(
                                                section?.class_id,
                                                subject?.pivot?.section_id,
                                                subject?.pivot?.subject_id,
                                                subject?.teacher_assignments?.teacher?.id
                                            )}
                                        >
                                            {removing ? (
                                                <>
                                                    <Spinner />
                                                    Removing...
                                                </>
                                            ) : (
                                                "Remove"
                                            )}
                                        </Button>
                                    </div>

                                    <img className="w-15 h-15 rounded-full object-cover" src={subject?.teacher_assignments?.teacher?.photo_url} alt="Teacher Image" />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">
                    Section{' '}
                    <span className="bg-green-500 text-white rounded-md px-3 py-1">
                        {section?.name}
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
                            style: {
                                minHeight: "100px"
                            }
                        },
                        header: {
                            style: {
                                borderTopLeftRadius: "10px",
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
