import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthorization } from '@/hooks/use-authorization';
import { Edit, Trash } from 'lucide-react';
interface StudentsProps {
    parents: ParentAccount[];
}

interface ParentAccount {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    students: {
        id: number;
        first_name: string;
        last_name: string;
        student_class: {
            id: number;
            name: string;
        };
        section: {
            id: number;
            name: string;
        };
    }[];
    student_class: { id: number; name: string } | null;
    section: { id: number; name: string } | null;
    email: string;
    address: string | null;
    is_active: number;
}
export default function Index({ parents }: StudentsProps) {
    const { can, canAny, hasRoles } = useAuthorization();
    const baseURL = import.meta.env.VITE_APP_URL;
    const [filterText, setFilterText] = useState('');

    const filteredUsers = parents.filter(
        (parent) =>
            parent.id.toString().includes(filterText) ||
            (parent.first_name &&
                parent.first_name
                    .toLowerCase()
                    .includes(filterText.toLowerCase())) ||
            (parent.last_name &&
                parent.last_name
                    .toLowerCase()
                    .includes(filterText.toLowerCase())),
    );

    const columns: TableColumn<ParentAccount>[] = [
        // { name: 'ID', selector: row => row.id, sortable: true },
        {
            name: 'Parent name',
            cell: (row) => `${row.first_name} ${row.last_name}`,
            sortable: true,
        },
        {
            name: 'Contact',
            cell: (row) => row.phone,
            sortable: false,
        },
        {
            name: 'Assigned Students',
            cell: (row) => (
                <div className="flex max-w-xs flex-wrap gap-2">
                    {row?.students?.length ? (
                        row.students.map((student, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:from-indigo-500 hover:to-blue-500"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px]">
                                    {student.first_name.charAt(0)}
                                    {student.last_name.charAt(0)}
                                </span>
                                {student.first_name} {student.last_name} <br />{' '}
                                Class: {student?.student_class?.name} <br />{' '}
                                Section: {student?.section?.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-400 italic">
                            No students assigned
                        </span>
                    )}
                </div>
            ),
        },

        {
            name: 'Account Status',
            width: '150px',
            cell: (row) => (
                <Select
                    value={String(row.is_active)}
                    // onValueChange={(value) => updateStatus(row.id, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Deactive</SelectItem>
                    </SelectContent>
                </Select>
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
                                        href={`/parent-accounts/${row.id}/edit`}
                                        className="flex w-full items-center rounded-md bg-green-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-green-600"
                                    >
                                        Edit
                                        <DropdownMenuShortcut>
                                            <Edit className="text-white" />
                                        </DropdownMenuShortcut>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link
                                        href={`/parent-accounts/student-parent-mapping/${row.id}`}
                                        className="flex w-full items-center rounded-md bg-yellow-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-yellow-600"
                                    >
                                        Assign Student
                                        <DropdownMenuShortcut>
                                            <Edit className="ms-1 text-white" />
                                        </DropdownMenuShortcut>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="cursor-pointer">
                                    <Button
                                        // onClick={() => handleDelete(row.id)}
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
        <AppLayout
            breadcrumbs={[{ title: 'Parents', href: '/parent-accounts' }]}
        >
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">Parents</h1>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {can('parent.create') && (
                        <Link
                            href={`/parent-accounts/create/`}
                            className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Create New Parent Account
                        </Link>
                    )}

                    <div className="flex items-center">
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
                    customStyles={{
                        rows: {
                            style: {
                                minHeight: '130px',
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
