import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthorization } from '@/hooks/use-authorization';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';

interface Teacher {
    id: number;
    first_name: string;
    last_name: string;
    staff_type: string;
    date_of_birth: string;
    gender: string;
    phone: string;
    joining_date: string;
    is_active: boolean;
    photo_url: string;
}
interface TeacherProps {
    staffs: Teacher[];
}

export default function Index({ staffs }: TeacherProps) {
    const { can, hasRoles } = useAuthorization();
    const [filterText, setFilterText] = useState('');
    const [selectTeachers, setSelectTeachers] = useState<Teacher[]>([]);
    const filteredUsers = staffs.filter(
        (teacher) =>
            teacher.id.toString().includes(filterText) ||
            (teacher.first_name &&
                teacher.first_name
                    .toLowerCase()
                    .includes(filterText.toLowerCase())) ||
            (teacher.last_name &&
                teacher.last_name
                    .toLowerCase()
                    .includes(filterText.toLowerCase())),
    );

    const handleSelect = (selectedTeachers: Teacher) => {
        setSelectTeachers((prev) => [...prev, selectedTeachers]);
    };

    const handleDelete = (staff_id: number) => {
        console.log(staff_id);
        router.delete(`staff-management/${staff_id}`, {
            onSuccess: (data) => {
                toast.success('Staff deleted successfully');
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

    const columns: TableColumn<Teacher>[] = [
        {
            name: 'Name',
            cell: (row) => `${row.first_name} ${row.last_name}`,
            sortable: true,
        },
        {
            name: 'Designation',
            selector: (row) => row.staff_type || 'N/A',
        },
        {
            name: 'Contact',
            selector: (row) => row.phone || 'N/A',
        },
        {
            name: 'Photo',
            cell: (row) => (
                <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img
                        src={row.photo_url}
                        alt={`${row.first_name} ${row.last_name}'s photo`}
                        className="h-full w-full object-cover"
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
                                        href={`/staff-management/${row.id}/edit`}
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
        },
    ];

    console.log(selectTeachers);

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Staffs', href: '/staff-management' }]}
        >
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">Staffs</h1>
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {can('parent.create') && (
                            <Link
                                href={`/staff-management/create/`}
                                className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Create Staff
                            </Link>
                        )}

                        <Link
                            href={`/staff-management/trashed-staffs`}
                            className="me-2 cursor-pointer rounded-md bg-yellow-600 px-3 py-1 text-white hover:bg-yellow-700 disabled:opacity-50"
                        >
                            View trashed staffs
                        </Link>
                    </div>

                    <input
                        type="text"
                        placeholder="Search by ID, name, or email"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="rounded border border-gray-300 p-2"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    selectableRows
                    highlightOnHover
                    pointerOnHover
                    onSelectedRowsChange={(state) =>
                        handleSelect(state.selectedRows[0])
                    }
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
