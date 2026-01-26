import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

export default function Index({ subjects }) {
    console.log(subjects);
    // const baseURL:string= import.meta.env.VITE_APP_URL;
    const [filterText, setFilterText] = useState('');

    const filteredSubjects = subjects.filter(
        (subject) =>
            subject.id.toString().includes(filterText) ||
            (subject.name &&
                subject.name.toLowerCase().includes(filterText.toLowerCase())),
    );

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
    const columns: TableColumn<[]>[] = [
        // { name: 'ID', selector: row => row.id, sortable: true },
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Status',
            width: '300px',
            cell: (row) => (
                <Select
                    value={String(row.status)}
                    // onValueChange={(value) => updateStatus(row.id, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Deactivate</SelectItem>
                    </SelectContent>
                </Select>
            ),
        },
        {
            name: 'Action',

            cell: (row) => (
                <div className="flex gap-2">
                    <Link
                        href={`/students/${row.id}/edit`}
                        className="rounded-md bg-green-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-green-600"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={() => handleDelete(row.id)}
                        className="rounded-md bg-red-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            ),

            sortable: false,
            width: '350px',
        },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Subjects', href: '/subjects' }]}>
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">All Subject</h1>
                <div className="mb-4 flex items-center justify-between gap-4">
                    <Link
                        href={`/subjects/create/`}
                        className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Create Subject
                    </Link>

                    <div className="flex items-center">
                        <Link
                            href={`/subjects/assign`}
                            className="me-2 rounded-md bg-cyan-500 px-3 py-1 text-white transition-colors duration-200 hover:bg-cyan-600"
                        >
                            Assign Subject to Section
                        </Link>
                        <Link
                            href={`/subjects/subject-teacher-mapping`}
                            className="me-2 rounded-md bg-yellow-500 px-3 py-1 text-white transition-colors duration-200 hover:bg-yellow-600"
                        >
                            Assign Teacher to Subject
                        </Link>
                        <input
                            type="text"
                            placeholder="Search by ID, name"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="rounded border border-gray-300 px-3 py-1"
                        />
                    </div>
                </div>

                <DataTable
                    title="Subject List"
                    columns={columns}
                    data={filteredSubjects}
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
