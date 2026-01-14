import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Edit, NotebookTabs } from 'lucide-react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

import { Button } from '@/components/ui/button';
import { useAuthorization } from '@/hooks/use-authorization';
interface ClassesProps {
    classes: StudentClass[];
}

interface StudentClass {
    id: number;
    name: string;
    code: string;
    sections_sum_capacity: number;
    students_count: number;
    sections_count: number;
}
export default function Classes({ classes }: ClassesProps) {
    const { can, canAny, hasRoles } = useAuthorization();
    const [filterText, setFilterText] = useState('');
    console.log(classes);
    const filteredUsers = classes.filter(
        (cls) =>
            cls.id.toString().includes(filterText) ||
            (cls.name &&
                cls.name.toLowerCase().includes(filterText.toLowerCase())),
    );

    const columns: TableColumn<StudentClass>[] = [
        {
            name: 'Name',
            selector: (row) => (row.name ? `CLASS ${row.name}` : 'N/A'),
            sortable: true,
        },
        {
            name: 'Class Capacity',
            cell: (row) => (
                <span className="rounded-md bg-sky-700 p-2 text-white">
                    {row.sections_sum_capacity ?? 0}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Total Admitted Student',

            cell: (row) => (
                <span
                    className={`${row.students_count > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-md p-2 text-white`}
                >
                    {row.students_count ?? 'N/A'}
                </span>
            ),
            sortable: true,
        },

        {
            name: 'Total Section',

            cell: (row) => (
                <span
                    className={`${row.sections_count > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-md p-2 text-white`}
                >
                    {row.sections_count ?? 'N/A'}
                </span>
            ),
            sortable: true,
        },

        {
            name: 'Class Code',
            selector: (row) => row.code ?? 'N/A',
            sortable: true,
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
                                <Link
                                    href={`/classes/class-wise-students/${row.id}`}
                                    className="flex w-full items-center rounded-md bg-yellow-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-yellow-600"
                                >
                                    Class Details
                                    <DropdownMenuShortcut>
                                        <NotebookTabs className="text-white" />
                                    </DropdownMenuShortcut>
                                </Link>
                            </DropdownMenuItem>
                            {can('class.edit') && (
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link
                                        href={'#'}
                                        className="flex w-full items-center rounded-md bg-green-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-green-600"
                                    >
                                        Edit
                                        <DropdownMenuShortcut>
                                            <Edit className="text-white" />
                                        </DropdownMenuShortcut>
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            sortable: false,
            // width: '300px',
        },
    ];

    console.log(classes);
    return (
        <AppLayout breadcrumbs={[{ title: 'Classes', href: '/classes' }]}>
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">Classes</h1>
          <div className="mb-4 flex items-center justify-between gap-4">
            {
              can('class.create') && (
                <Link
                        href={`/classes/create/`}
                        className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Create Class
                    </Link>
              )
            }
                    

                    <input
                        type="text"
                        placeholder="Search by ID, name, or email"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="rounded border border-gray-300 p-2"
                    />
                </div>

                <DataTable
                    title="All Classes"
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    selectableRows
                    highlightOnHover
                    pointerOnHover
                    customStyles={{
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
