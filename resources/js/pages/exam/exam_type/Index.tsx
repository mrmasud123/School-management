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
import { Link } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import DataTable, { TableColumn } from 'react-data-table-component';
interface ExamType {
    id: number;
    name: string;
    code: string;
    description: string | null;
    is_active: number;
    created_at: string;
}

const customStyles = {
    table: {
        style: {
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            overflow: 'hidden',
        },
    },
    headRow: {
        style: {
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
        },
    },
    headCells: {
        style: {
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: '#475569',
            paddingLeft: '20px',
            paddingRight: '20px',
        },
    },
    rows: {
        style: {
            minHeight: '70px',
            fontSize: '14px',
            color: '#0f172a',
            backgroundColor: '#ffffff',
        },
        highlightOnHoverStyle: {
            backgroundColor: '#f1f5f9',
            cursor: 'pointer',
        },
    },
    cells: {
        style: {
            paddingLeft: '20px',
            paddingRight: '20px',
        },
    },
    pagination: {
        style: {
            borderTop: '1px solid #e5e7eb',
            padding: '12px',
        },
    },
};

interface ExamTypesProps {
    examTypes: ExamType[];
}

export default function Index({ examTypes }: ExamTypesProps) {
    console.log(examTypes);
    const { hasRoles } = useAuthorization();
    const columns: TableColumn<ExamType>[] = [
        {
            name: 'Exam Type',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-base font-semibold text-slate-800">
                        {row.name}
                    </span>
                    <span className="mt-1 inline-block w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {row.code}
                    </span>
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Description',
            cell: (row) => (
                <span className="text-sm text-slate-600">
                    {row.description ?? '—'}
                </span>
            ),
        },
        {
            name: 'Status',
            cell: (row) => (
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-600'
                    }`}
                >
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Created',
            cell: (row) => (
                <span className="text-sm text-slate-500">
                    {new Date(row.created_at).toLocaleDateString()}
                </span>
            ),
            sortable: true,
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
                                        href={`/exam-types/${row.id}/edit`}
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
        <AppLayout breadcrumbs={[{ title: 'Exam Types', href: '/exam-types' }]}>
            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            📚 Exam Types
                        </h1>
                        <p className="text-sm text-slate-500">
                            Manage all available exam categories
                        </p>
                    </div>

                    <Link
                        href="/exam-types/create"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-blue-700"
                    >
                        + Create Exam Type
                    </Link>
                </div>

                <DataTable
                    title="📅 Exam Type List"
                    columns={columns}
                    data={examTypes}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>
        </AppLayout>
    );
}
