import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, PageProps, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Permission {
    id: number;
    name: string;
    guard_name?: string;
    created_at?: string;
    updated_at?: string;
}

interface Role {
    id: number;
    name: string;
}

type GroupedPermissions = {
    [key: string]: Permission[];
};

export default function AddPermission() {
    const props = usePage<
        PageProps & {
            roles: Role;
            permissions: GroupedPermissions;
            rolePermissions: number[];
        }
    >().props;

    const { roles, permissions, rolePermissions } = props;

    const [loading, setLoading] = useState(false);
    const [selectedPermissions, setSelectedPermissions] =
        useState<number[]>(rolePermissions);

    const handleCheckboxChange = (permissionId: number, checked: boolean) => {
        setSelectedPermissions((prev) =>
            checked
                ? [...prev, permissionId]
                : prev.filter((id) => id !== permissionId),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post(
            `/give-permission/${roles.id}`,
            { selectedPermissions },
            {
                onFinish: () => setLoading(false),
                onSuccess: () => {
                    toast.success('Permissions updated successfully!');
                    window.location.href = '/roles';
                },
                onError: () => {
                    toast.error('Something went wrong!');
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Edit Role', href: '/roles' }]}>
            <div className="p-8">
                <div class="flex items-center justify-between">
                    <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                        Add Permission to:
                        <span className="rounded-md bg-blue-600 px-3 py-1 text-white">
                            {roles.name.toUpperCase()}
                        </span>
                    </h1>
                    <Link
                        href={'/roles'}
                        className="cursor-pointer rounded-md bg-green-600 px-2 py-1.5 text-white"
                    >
                        All roles
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {Object.entries(permissions).map(
                        ([groupName, groupPermissions]) => (
                            <div key={groupName} className="mb-8">
                                <h2 className="mb-3 border-b pb-1 text-lg font-semibold capitalize">
                                    {groupName}
                                </h2>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {groupPermissions.map((permission) => (
                                        <label
                                            key={permission.id}
                                            className="flex cursor-pointer items-center gap-2 rounded border p-2 hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissions.includes(
                                                    permission.id,
                                                )}
                                                onChange={(e) =>
                                                    handleCheckboxChange(
                                                        permission.id,
                                                        e.target.checked,
                                                    )
                                                }
                                                className="form-checkbox"
                                            />

                                            <span className="text-sm capitalize">
                                                {permission.name
                                                    .replace(
                                                        `${groupName}.`,
                                                        '',
                                                    )
                                                    .replace('-', ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ),
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="mt-6 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Add Permissions'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
