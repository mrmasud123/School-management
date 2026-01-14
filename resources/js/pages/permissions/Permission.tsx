import { useAuthorization } from '@/hooks/use-authorization';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export default function PermissionIndex() {
    const { can, hasRoles } = useAuthorization();
    const { permissions } = usePage<{
        permissions: Record<string, Permission[]>;
    }>().props;

    const handleEdit = (permission: Permission) => {
        Swal.fire({
            title: 'Edit Permission',
            html: `
            <input id="permission-name"
                   class="swal2-input text-sm"
                   value="${permission.name}"
                   placeholder="Permission Name">
        `,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const name = (
                    document.getElementById(
                        'permission-name',
                    ) as HTMLInputElement
                ).value;

                if (!name.trim()) {
                    Swal.showValidationMessage(
                        'Permission name cannot be empty',
                    );
                    return false;
                }
                return { name };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(`/permissions/${permission.id}`, result.value, {
                    onSuccess: () => {
                        Swal.fire(
                            'Updated!',
                            'Permission updated successfully.',
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
                router.delete(`/permissions/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            'Deleted!',
                            'The permission has been deleted.',
                            'success',
                        );
                    },
                });
            }
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Permission Management', href: '/permissions' },
            ]}
        >
            <Head title="Permission Management" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Permission Management
                    </h1>
                    {hasRoles(['admin', 'super admin']) && (
                        <Link
                            href="/permissions/create"
                            className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                        >
                            Create Permission
                        </Link>
                    )}
                </div>

                <p className="mb-4 text-muted-foreground">
                    List of all permissions grouped by module.
                </p>

                {Object.entries(permissions).map(([module, perms]) => (
                    <div key={module} className="mb-4 rounded-md border p-4">
                        <h3 className="mb-2 rounded-md bg-green-500 px-2 py-1 font-bold text-white uppercase">
                            {module}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            {perms.map((perm: Permission) => (
                                <div
                                    key={perm.id}
                                    className="flex flex-col items-center justify-between gap-4 rounded-md border p-2"
                                >
                                    <label className="flex cursor-pointer items-center gap-2">
                                        {perm.name.split('.')[1]}
                                    </label>

                                    <div className={'flex gap-2'}>
                                        {hasRoles(['admin', 'super admin']) ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(perm)
                                                    }
                                                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(perm.id)
                                                    }
                                                    className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
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
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
