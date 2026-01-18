import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuthorization } from '@/hooks/use-authorization';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Edit, NotebookTabs, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    guardian_phone: string;
    student_class: { id: number; name: string } | null;
    section: { id: number; name: string } | null;
    status: string;
    admission_no: string;
    photo_url: string | null;
}

interface StudentsProps {
    students: {
        data: Student[];
        total: number;
        per_page: number;
        current_page: number;
    };
    filters: {
        search?: string;
        per_page?: number;
    };
}

export default function Students({ students, filters }: StudentsProps) {
    const { hasRoles, can } = useAuthorization();

    const [search, setSearch] = useState(filters.search ?? '');
    const [perPage, setPerPage] = useState(filters.per_page ?? 10);

    const fetchStudents = (
        page = 1,
        per_page = perPage,
        searchText = search,
    ) => {
        router.get(
            '/students',
            { page, per_page, search },
            { preserveState: true, replace: true },
        );
    };
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchStudents(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const updateStatus = (id: number, status: string) => {
        router.put(
            `/students/${id}/status`,
            { status },
            {
                onSuccess: () => toast.success('Status updated'),
                onError: () => toast.error('Update failed'),
            },
        );
    };

    const downloadIdCard = (id: number) => {
        window.open(`/students/idcard/${id}`, '_blank');
    };

    const handleDelete = (id: number) => {
        router.delete(`/students/${id}`, {
            onSuccess: () => toast.success('Student deleted'),
        });
    };

    const columns: TableColumn<Student>[] = [
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
                        toast.success('Copied!');
                    }}
                    className="cursor-pointer text-blue-600 hover:underline"
                >
                    {row.admission_no}
                </span>
            ),
        },
        {
            name: 'Class',
            cell: (row) => (
                <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                    CLASS {row.student_class?.name}
                </span>
            ),
        },
        {
            name: 'Section',
            cell: (row) => (
                <span className="rounded bg-pink-500 px-2 py-1 text-xs text-white">
                    {row.section?.name}
                </span>
            ),
        },
        {
            name: 'Status',
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
            name: 'Image',
            cell: (row) =>
                row.photo_url ? (
                    <img
                        src={row.photo_url}
                        className="h-16 w-16 rounded object-cover"
                        alt="Student"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
                        N/A
                    </div>
                ),
        },
        {
            name: 'Action',
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Action</Button>
                    </DropdownMenuTrigger>

                    {hasRoles(['admin', 'super admin']) && (
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Link
                                        href={`/students/${row.id}/edit`}
                                        className="flex items-center gap-2"
                                    >
                                        <Edit size={16} /> Edit
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => downloadIdCard(row.id)}
                                >
                                    <NotebookTabs size={16} /> ID Card
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => handleDelete(row.id)}
                                    className="text-red-600"
                                >
                                    <Trash size={16} /> Delete
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
            <div className="p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold">Students</h1>

                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search by name / admission no"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded border border-gray-300 px-3 py-1"
                        />

                        <Button
                            onClick={() => {
                                const url = route('students.export.excel', {
                                    search,
                                    per_page: perPage,
                                });
                                window.open(url, '_blank');
                            }}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            Export Excel
                        </Button>

                        <Button
                            onClick={() => {
                                const url = route('students.export.pdf', {
                                    search,
                                    per_page: perPage,
                                });
                                window.open(url, '_blank');
                            }}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Export PDF
                        </Button>

                        <Link
                            href="/trashed-students"
                            className="rounded bg-yellow-600 px-3 py-2 text-sm text-white hover:bg-yellow-700"
                        >
                            Trashed Students
                        </Link>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={students.data}
                    pagination
                    paginationServer
                    paginationTotalRows={students.total}
                    paginationPerPage={students.per_page}
                    paginationDefaultPage={students.current_page}
                    onChangePage={(page) => fetchStudents(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setPerPage(newPerPage);
                        fetchStudents(page, newPerPage);
                    }}
                    highlightOnHover
                    pointerOnHover
                />
            </div>
        </AppLayout>
    );
}
