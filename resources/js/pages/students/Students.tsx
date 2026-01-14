import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthorization } from '@/hooks/use-authorization';
import { Edit, NotebookTabs, Trash } from 'lucide-react';
interface StudentsProps {
    students: Student[];
}

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    guardian_phone: string;
    student_class: { id: number; name: string } | null;
    section: { id: number; name: string } | null;
    status: string;
    admission_no: string;
    photo: string | null;
    photo_url: string | null;
}
export default function Students({ students }: StudentsProps) {
    const { can, canAny, hasRoles } = useAuthorization();

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const baseURL = import.meta.env.VITE_APP_URL;
    const updateStatus = (id: number, status: string) => {
        router.put(
            `/students/${id}/status`,
            { status },
            {
                onSuccess: () => toast.success('Status updated'),
                onError: () => toast.error('Update failed'),
            },
        );
        console.log(status);
    };
    const [filterText, setFilterText] = useState('');

    const filteredUsers = students.filter(
        (student) =>
            student.id.toString().includes(filterText) ||
            (student.first_name &&
                student.first_name
                    .toLowerCase()
                    .includes(filterText.toLowerCase())) ||
            (student.last_name &&
                student.last_name
                    .toLowerCase()
                    .includes(filterText.toLowerCase())),
    );
    const downloadIdCard = (id: number) => {
        window.open(`/students/idcard/${id}`, '_blank');
    };

    const handleDelete = (studentId: number) => {
        router.delete(`students/${studentId}`, {
            onSuccess: (data) => {
                console.log(data);
            },
            onFinish: () => {
                console.log('Fininshed!');
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };
    const columns: TableColumn<Student>[] = [
        // { name: 'ID', selector: row => row.id, sortable: true },
        {
            name: 'Name',
            cell: (row) => `${row.first_name} ${row.last_name}`,
            sortable: true,
        },
        {
            name: 'Admission No',
            cell: (row) => (
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
            width: '150px',
        },
        {
            name: 'Guardian Contact',
            cell: (row) => row.guardian_phone,
            sortable: false,
        },

        {
            name: 'Class Level',
            // center:true,
            cell: (row) => (
                <span
                    className={'rounded-md bg-blue-500 p-2 text-xs text-white'}
                >
                    CLASS {row.student_class?.name}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Section',
            // center:true,
            cell: (row) => (
                <span
                    className={'rounded-md bg-pink-500 p-2 text-xs text-white'}
                >
                    {row.section?.name}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Admission Status',
            width: '150px',
            cell: (row) => (
                <Select
                    value={row.status}
                    onValueChange={(value) => updateStatus(row.id, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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
            name: 'Student Image',
            cell: (row) => (
                <div className="h-20 w-20 overflow-hidden rounded-md">
                    <img
                        src={`${row.photo_url}`}
                        className="h-full w-full object-cover"
                        alt="Student"
                    />
                </div>
            ),
        },

        {
            name: 'Action',

            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={`cursor-pointer ${hasRoles(['admin', 'super admin']) ? '' : 'bg-red-400'}`}
                        >
                            {hasRoles(['admin', 'super admin'])
                                ? 'Action'
                                : 'Not allowed'}
                        </Button>
                    </DropdownMenuTrigger>
                    {hasRoles(['admin', 'super admin']) && (
                        <DropdownMenuContent className="" align="start">
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link
                                        href={`/students/${row.id}/edit`}
                                        className="flex w-full items-center rounded-md bg-green-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-green-600"
                                    >
                                        Edit
                                        <DropdownMenuShortcut>
                                            <Edit className="text-white" />
                                        </DropdownMenuShortcut>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Button
                                        onClick={() => downloadIdCard(row.id)}
                                        className="flex w-full items-center rounded-md bg-yellow-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-yellow-600"
                                    >
                                        Download ID Card
                                        <DropdownMenuShortcut>
                                            <NotebookTabs className="text-white" />
                                        </DropdownMenuShortcut>
                                    </Button>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="cursor-pointer">
                                    <Button
                                        onClick={() => handleDelete(row.id)}
                                        className="flex w-full items-center rounded-md bg-red-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-red-600"
                                    >
                                        Delete
                                        <DropdownMenuShortcut>
                                            <Trash className="text-white" />
                                        </DropdownMenuShortcut>
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
            ),

            sortable: false,
        },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">Students</h1>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {can('student.create') && (
                        <Link
                            href={`/students/create/`}
                            className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Admit Student
                        </Link>
                    )}

                    <div className="flex items-center">
                        <Button
                            onClick={() => {
                                const url = route('students.export.excel', {
                                    search: filterText,
                                    page: currentPage,
                                    per_page: perPage,
                                });
                                window.open(url, '_blank');
                            }}
                            className="me-2 bg-green-600 text-white hover:bg-green-700"
                        >
                            Export Excel
                        </Button>
                        <Button
                            onClick={() => {
                                const url = route('students.export.pdf', {
                                    search: filterText,
                                    page: currentPage,
                                    per_page: perPage,
                                });
                                window.open(url, '_blank');
                            }}
                            className="me-2 bg-red-600 text-white hover:bg-red-700"
                        >
                            Export PDF
                        </Button>

                        <Link
                            href={`/trashed-students`}
                            className="me-2 cursor-pointer rounded-md bg-yellow-600 px-3 py-1 text-white hover:bg-yellow-700 disabled:opacity-50"
                        >
                            View trashed students
                        </Link>

                        <input
                            type="text"
                            placeholder="Search by ID, name, or email"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="rounded border border-gray-300 px-3 py-1"
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    // selectableRows
                    highlightOnHover
                    pointerOnHover
                    paginationServer={false}
                    paginationPerPage={perPage}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setPerPage(newPerPage);
                        setCurrentPage(page);
                    }}
                    customStyles={{
                        rows: {
                            style: {
                                minHeight: '100px',
                            },
                        },
                        header: {
                            style: {
                                borderTopLeftRadius: '10px',
                                borderTopRightRadius: '10px',
                            },
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
