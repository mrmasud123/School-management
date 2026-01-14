import { useAuthorization } from '@/hooks/use-authorization';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}
interface Role {
    id: number;
    name: string;
}
interface Props {
    users: User[];
}

export default function User({ users }: Props) {
    const { can, canAny, hasRoles } = useAuthorization();
    const [filterText, setFilterText] = useState('');

    const filteredUsers = users.filter(
        (user) =>
            user.id.toString().includes(filterText) ||
            (user.name &&
                user.name.toLowerCase().includes(filterText.toLowerCase())) ||
            (user.email &&
                user.email.toLowerCase().includes(filterText.toLowerCase())),
    );

    const columns: TableColumn<User>[] = [
        // { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Name', selector: (row) => row.name, sortable: true },
        {
            name: 'Roles',
            cell: (row) =>
                Array.isArray(row.roles) && row.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {row.roles.map((role, index) => (
                            <button
                                key={index}
                                className="rounded-md bg-black px-2 py-1 font-bold text-white"
                            >
                                {role.name}
                            </button>
                        ))}
                    </div>
                ) : (
                    <button className="rounded-md bg-red-600 px-2 py-1 font-bold text-white">
                        No Role
                    </button>
                ),
            sortable: false,
        },
        { name: 'Email', selector: (row) => row.email, sortable: true },
        {
            name: 'Action',

            cell: (row) => (
                <div className="flex gap-2">
                    {hasRoles(['admin', 'super admin']) ? (
                        <>
                            <Link
                                href={`/users/${row.id}/edit`}
                                className="cursor-pointer rounded-md bg-blue-500 px-3 py-2 text-white"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => alert(`Delete user ${row.id}`)}
                                className="cursor-pointer rounded-md bg-red-500 px-3 py-2 text-white"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <span className="rounded-md bg-red-500 px-3 py-1 text-sm text-white">
                            Not action allowed
                        </span>
                    )}
                </div>
            ),
            sortable: false,
            width: '250px',
        },
    ];

    console.log(users);
    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/user' }]}>
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">Users</h1>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {can('user.create') && (
                        <Link
                            href={`/users/create/`}
                            className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Create User
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
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    selectableRows
                    highlightOnHover
                    pointerOnHover
                />
            </div>
        </AppLayout>
    );
}
