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

interface Teacher {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    date_of_birth: string;
    gender: string;
    joining_date: string;
    experience: string;
    is_active: boolean;
    designation: { id: number; name: string };
    employment_type: { id: number; type: string };
    qualification: { id: number; name: string };
    contact: { email: string; phone: string; address: string };
    specializations: [{ id: number; name: string }];
    photo_url: string;
    document_url: string;
}
interface TeacherProps {
    teachers: Teacher[];
}

export default function Teacher({ teachers }: TeacherProps) {
    const { can, canAny, hasRoles } = useAuthorization();
    const [filterText, setFilterText] = useState('');
    const [selectTeachers, setSelectTeachers] = useState<Teacher[]>([]);
    const filteredUsers = teachers.filter(
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

    const handleRestore = (teacherId: number) => {
        router.patch(`/${teacherId}/restore`, {
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

    const handleDelete = (teacherId: number) => {
        router.delete(`teachers/${teacherId}`, {
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

    const columns: TableColumn<Teacher>[] = [
        {
            name: 'Name',
            selector: (row) => row.full_name,
            sortable: true,
        },
        {
            name: 'Designation',
            selector: (row) => row.designation?.name || 'N/A',
        },
        {
            name: 'Qualification',
            selector: (row) => row.qualification?.name || 'N/A',
        },
        {
            name: 'Specializations',
            cell: (row) => (
                <div className="flex flex-wrap gap-2">
                    {row.specializations && row.specializations.length > 0 ? (
                        row.specializations.map((spec) => (
                            <span
                                key={spec.id}
                                className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                            >
                                {spec.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                    )}
                </div>
            ),
        },
        {
            name: 'Photo',
            cell: (row) => (
                <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img
                        src={row.photo_url}
                        alt={`${row.full_name}'s photo`}
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
                        <Button variant="outline" className="cursor-pointer">
                            Action
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="" align="start">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                                {hasRoles(['admin', 'super admin']) && (
                                    <Button
                                        onClick={() => handleRestore(row.id)}
                                        className="flex w-full items-center rounded-md bg-green-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-green-600"
                                    >
                                        Restore
                                        <DropdownMenuShortcut>
                                            <Edit className="text-white" />
                                        </DropdownMenuShortcut>
                                    </Button>
                                )}
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
                </DropdownMenu>
            ),
        },
    ];

    console.log(selectTeachers);

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Trashed Teachers',
                    href: '/teachers/trashed-teachers',
                },
            ]}
        >
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">Trashed Teachers</h1>
                <div className="mb-4 flex items-center justify-between gap-4">
                    <Link
                        href={`/teachers`}
                        className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        All Teacher
                    </Link>

                    <input
                        type="text"
                        placeholder="Search by ID, name, or email"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="rounded border border-gray-300 p-2"
                    />
                </div>

                <DataTable
                    title="Teacher List"
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
