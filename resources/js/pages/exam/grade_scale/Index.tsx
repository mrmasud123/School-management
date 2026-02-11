import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthorization } from '@/hooks/use-authorization';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface GradeScale {
    id: number;
    name: string;
    grade_point: number;
    remarks: string | null;
    color_code: string | null;
    is_active: number;
    created_at: string;
}

interface Props {
    gradeScales: GradeScale[];
}

export default function Index({ gradeScales }: Props) {
    const { hasRoles } = useAuthorization();
    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/grade-scales/${id}`, {
                    onSuccess: () => toast.success('Deleted successfully'),
                });
            }
        });
    };

    const columns: TableColumn<GradeScale>[] = [
        {
            name: 'Grade',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    {row.color_code && (
                        <span
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: row.color_code }}
                        />
                    )}
                    <div>
                        <div className="font-semibold">{row.name}</div>
                        <div className="text-xs text-gray-500">
                            Point: {row.grade_point}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            name: 'Remarks',
            selector: (row) => row.remarks ?? '—',
        },
        {
            name: 'Status',
            cell: (row) => (
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                    }`}
                >
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
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
                                        href={`/grade-scales/${row.id}/edit`}
                                        className="flex items-center gap-2"
                                    >
                                        <Edit className="text-green-500 dark:text-white" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    // onClick={() => handleDelete(row.id)}
                                    className="cursor-pointer"
                                >
                                    <Trash className="text-red-500 dark:text-white" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Grade Scales', href: '/grade-scales' }]}
        >
            <div className="p-8">
                <div className="mb-6 flex justify-between">
                    <h1 className="text-3xl font-bold">🎓 Grade Scales</h1>
                    <Link
                        href="/grade-scales/create"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                        + Add Grade Scale
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={gradeScales}
                    pagination
                    highlightOnHover
                />
            </div>
        </AppLayout>
    );
}
