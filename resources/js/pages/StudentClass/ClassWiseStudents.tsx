import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Edit, NotebookTabs, Trash } from 'lucide-react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { useAuthorization } from '@/hooks/use-authorization';
interface StudentDetails {
    id: number;
    first_name: string;
    last_name: string;
    admission_no: string;
    guardian_phone: string;
    status: string;
    photo: string | null;
    student_class: { name: string } | null;
    sections: {
        id: number;
        name: string;
        created_at: string;
    };
}

interface StudentClass {
    id: number;
    name: string;
    sections: {
        id: number;
        name: string;
        created_at: string;
    }[];
}

interface Props {
    students: StudentDetails[];
    stdntClass: StudentClass;
}
export default function ClassWiseStudents({ students, stdntClass }: Props) {
    const baseURL = import.meta.env.VITE_APP_URL;
    const [filterText, setFilterText] = useState('');
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
    const filteredUsers = students.filter(
        (student) =>
            student.id.toString().includes(filterText) ||
            student.first_name
                .toLowerCase()
                .includes(filterText.toLowerCase()) ||
            student.last_name
                .toLowerCase()
                .includes(filterText.toLowerCase()) ||
            student.sections?.name
                .toLowerCase()
                .includes(filterText.toLowerCase()),
    );

    const { can, canAny, hasRoles } = useAuthorization();
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

    const columns: TableColumn<StudentDetails>[] = [
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
        },
        {
            name: 'Guardian Contact',
            selector: (row) => row.guardian_phone,
        },
        {
            name: 'Section',
            cell: (row) => (
                <span className="rounded-md bg-pink-500 p-2 text-xs text-white">
                    {row.sections?.name ?? 'N/A'}
                </span>
            ),
        },
        {
            name: 'Admission Status',
            cell: (row) => (
                <Select
                    value={row.status}
                    onValueChange={(value) => updateStatus(row.id, value)}
                >
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
            name: 'Student Image',
            cell: (row) => (
                <div className="h-20 w-20 overflow-hidden rounded-md">
                    <img
                        src={`${baseURL}/storage/${row.photo ?? ''}`}
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
                                        className="w-full cursor-pointer rounded-md bg-blue-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
                                        onClick={() => downloadIdCard(row.id)}
                                    >
                                        Download ID Card
                                        <DropdownMenuShortcut>
                                            <NotebookTabs className="text-white" />
                                        </DropdownMenuShortcut>
                                    </Button>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => handleDelete(row.id)}
                                >
                                    <Button
                                        onClick={() => handleDelete(row.id)}
                                        className="w-full cursor-pointer rounded-md bg-red-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-red-600"
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
        },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">
                    Class{' '}
                    <span
                        className={`rounded-md bg-green-500 px-3 py-1 text-white dark:text-white`}
                    >
                        {stdntClass?.name}
                    </span>{' '}
                    students
                </h1>

                <div className="mb-4 flex items-center justify-between gap-4">
                    <Link
                        href={`/classes`}
                        className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        View Classes
                    </Link>

                    <input
                        type="text"
                        placeholder="Search by ID, name, or email"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="rounded border border-gray-300 p-2"
                    />
                </div>

                <div className="">
                    <h1 className="mb-4 text-2xl font-bold">
                        Assigned Sections
                    </h1>

                    {stdntClass.sections?.length === 0 ? (
                        <p className="text-gray-500">
                            No section assigned to this class.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {stdntClass.sections?.map((section) => (
                                <div
                                    key={section.id}
                                    className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                                >
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {section.name}
                                    </h3>

                                    <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                                        Active
                                    </span>

                                    <p className="mt-3 text-xs text-gray-500">
                                        Assigned on{' '}
                                        {new Date(
                                            section.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <DataTable
                    title="Student List"
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    // selectableRows
                    highlightOnHover
                    pointerOnHover
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
