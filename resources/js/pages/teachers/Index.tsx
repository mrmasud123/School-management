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
import { useEffect, useState } from 'react';
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
    teachers: {
        data: Teacher[];
        total: number;
        per_page: number;
        current_page: number;
    };
    filters: {
        search?: string;
        per_page?: number;
    };
}

export default function Teacher({ teachers, filters }: TeacherProps) {
    const { can, canAny, hasRoles } = useAuthorization();

    const [search, setSearch] = useState(filters.search ?? '');
    const [perPage, setPerPage] = useState(filters.per_page ?? 4);
    const [selectTeachers, setSelectTeachers] = useState<Teacher[]>([]);

    const fetchTeachers = (page = 1, per_page = perPage, searchText = search) =>
        router.get(
            '/teachers',
            { page, per_page, search },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchTeachers(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, perPage]);

    const handleSelect = (selectedTeachers: Teacher) => {
        setSelectTeachers((prev) => [...prev, selectedTeachers]);
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
                                        href={`/teachers/${row.id}/edit`}
                                        className="flex items-center gap-2"
                                    >
                                            <Edit className="text-white" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(row.id)} className="cursor-pointer">

                                            <Trash className="text-white" />
                                        Delete
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
        <AppLayout breadcrumbs={[{ title: 'Teachers', href: '/teachers' }]}>
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">Teachers</h1>
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {can('teacher.create') && (
                            <Link
                                href={`/teachers/create/`}
                                className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Create Teacher
                            </Link>
                        )}

                        <Link
                            href={`/teachers/trashed-teachers`}
                            className="me-2 cursor-pointer rounded-md bg-yellow-600 px-3 py-1 text-white hover:bg-yellow-700 disabled:opacity-50"
                        >
                            View trashed teachers
                        </Link>
                    </div>

                    <input
                        type="text"
                        placeholder="Search by name / admission no"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded border border-gray-300 px-3 py-1"
                    />
                </div>

                <DataTable
                    title="All Teachers"
                    columns={columns}
                    data={teachers.data}
                    pagination
                    paginationServer
                    paginationTotalRows={teachers.total}
                    paginationPerPage={teachers.per_page}
                    paginationDefaultPage={teachers.current_page}
                    onChangePage={(page) => fetchTeachers(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setPerPage(newPerPage);
                        fetchTeachers(page, newPerPage);
                    }}
                    customStyles={{
                        table: {
                            style: {
                                borderTopRightRadius: '10px',
                                borderTopLeftRadius: '10px',
                                overflow: 'hidden',
                            },
                        },
                        rows: { style: { minHeight: '100px' } },
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
