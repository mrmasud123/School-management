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
import { Link } from '@inertiajs/react';
import { Edit, NotebookTabs } from 'lucide-react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
interface Sections {
    capacity: number;
    class_id: number;
    id: number;
    name: string;
    students_count: number;
    all_class: { id: number; name: string } | null;
}

interface SectionsProps {
    sections: {
        [key: string]: Sections[];
    };
}

export default function Sections({ sections }: SectionsProps) {
    const { can, canAny, hasRoles } = useAuthorization();
    const sec = Object.values(sections).flat();
    const [filterText, setFilterText] = useState('');
    console.log(sections);
    const filteredUsers = sec.filter(
        (cls) =>
            cls.id.toString().includes(filterText) ||
            (cls.name &&
                cls.name.toLowerCase().includes(filterText.toLowerCase())),
    );

    const columns: TableColumn<Sections>[] = [
        // { name: 'ID', selector: row => row.id ?? 'N/A', sortable: true },
        { name: 'Name', selector: (row) => row.name ?? 'N/A', sortable: true },
        {
            name: 'Total Student',
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
            name: 'Class Level',
            cell: (row) => (
                <span className="rounded-md bg-yellow-500 p-2 text-white">
                    Class {row.all_class?.name ?? 'N/A'}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Section Capacity',
            cell: (row) => (
                <span className="rounded-md bg-sky-700 p-2 text-white">
                    {row.capacity ?? 'N/A'}
                </span>
            ),
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
                            {can('section.edit') && (
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link
                                        href={`/sections/${row.id}/edit`}
                                        className="flex w-full items-center rounded-md bg-green-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-green-600"
                                    >
                                        Edit
                                        <DropdownMenuShortcut>
                                            <Edit className="text-white" />
                                        </DropdownMenuShortcut>
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="cursor-pointer">
                                <Link
                                    href={`/sections/section-wise-students/${row.id}`}
                                    className="flex w-full items-center rounded-md bg-yellow-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-yellow-600"
                                >
                                    View Section
                                    <DropdownMenuShortcut>
                                        <NotebookTabs className="text-white" />
                                    </DropdownMenuShortcut>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            sortable: false,
        },
    ];

    //   console.log(classes);
    return (
        <AppLayout breadcrumbs={[{ title: 'Sections', href: '/sections' }]}>
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">Sections</h1>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {can('section.create') && (
                        <Link
                            href={`/sections/create/`}
                            className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Create Section
                        </Link>
                    )}

                    <input
                        type="text"
                        placeholder="Search by ID, name, or email"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="rounded border border-gray-300 p-2"
                    />
                </div>

                <DataTable
                    title="Section List"
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    // selectableRows
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
