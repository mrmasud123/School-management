import { Head, Link, router } from '@inertiajs/react';

import { useAuthorization } from '@/hooks/use-authorization';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Edit, NotebookTabs, Trash } from 'lucide-react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
interface Role {
    id: number;
    name: string;
    permissions: Permissions[];
}

interface Permissions {
    id: number;
    name: string;
}

export default function Roles() {
    const { roles } = usePage<{ roles: Role[] }>().props;
    const { can, canAny, hasRoles } = useAuthorization();
    const [filterText, setFilterText] = useState('');

    const filteredRoles = roles.filter(
        (role) =>
            role.id.toString().includes(filterText) ||
            role.name.toLowerCase().includes(filterText.toLowerCase()),
    );
    const handleEdit = (role: Role) => {
        Swal.fire({
            title: 'Edit Role',
            html: `
            <input id="role-name"
                   class="swal2-input text-sm"
                   value="${role.name}"
                   placeholder="Role Name">
        `,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const name = (
                    document.getElementById('role-name') as HTMLInputElement
                ).value;

                if (!name.trim()) {
                    Swal.showValidationMessage('Role name cannot be empty');
                    return false;
                }
                return { name };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(`/roles/${role.id}`, result.value, {
                    onSuccess: () => {
                        Swal.fire(
                            'Updated!',
                            'Role updated successfully.',
                            'success',
                        );
                    },
                    onError: (err) => {
                        console.log(err);
                        Swal.fire('Error', err.name, 'error');
                    },
                });
            }
        });
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/roles/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            'Deleted!',
                            'The role has been deleted.',
                            'success',
                        );
                    },
                });
            }
        });
    };

    const columns: TableColumn<Role>[] = [
        {
            name: 'Role',
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                    {row.name}
                </span>
            ),
        },
        {
            name: 'Permissions',
            grow: 2,
            cell: (row) => {
                const [visibleCount, setVisibleCount] = useState(5);
                const visiblePermissions = row.permissions.slice(
                    0,
                    visibleCount,
                );

                const handleSeeMore = () => {
                    setVisibleCount((prev) => prev + 5);
                };

                return (
                    <div className="flex flex-col items-center justify-between gap-2 py-4">
                        <div className="flex flex-wrap gap-2">
                            {visiblePermissions.length ? (
                                visiblePermissions.map((permission) => (
                                    <span
                                        key={permission.id}
                                        className="rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white"
                                    >
                                        {permission.name}
                                    </span>
                                ))
                            ) : (
                                <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                    No permissions
                                </span>
                            )}
                        </div>

                        {visibleCount < row.permissions.length && (
                            <button
                                onClick={handleSeeMore}
                                className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-blue-600 underline hover:text-blue-800"
                            >
                                See More
                            </button>
                        )}
                    </div>
                );
            },
        },

        {
            name: 'Actions',
            width: '350px',
            cell: (row) => (
                <div className={`flex items-center gap-2`}>
                    {hasRoles(['admin', 'super admin']) ? (
                        <>
                            <Link
                                href={`/add-permission/${row.id}`}
                                className="inline-flex items-center gap-1 rounded-md bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-pink-700"
                            >
                                <NotebookTabs size={14} />
                                Permissions
                            </Link>

                            <button
                                onClick={() => handleEdit(row)}
                                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                                <Edit size={14} />
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(row.id)}
                                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                            >
                                <Trash size={14} />
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
        },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Role Management', href: '/roles' }]}>
            <Head title="Role Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Role Management</h1>
                    {can('roles.create') && (
                        <Link
                            href={'/roles/create'}
                            className="cursor-pointer rounded-md bg-green-600 px-2 py-1 text-sm text-white"
                        >
                            Create Role
                        </Link>
                    )}
                </div>
                <p className="mb-4 text-muted-foreground">
                    List of all roles in the system.
                </p>
                <DataTable
                    title="Role List"
                    columns={columns}
                    data={filteredRoles}
                    pagination
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
