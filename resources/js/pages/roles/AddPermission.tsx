import AppLayout from '@/layouts/app-layout';
import { usePage, PageProps, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
}



export default function AddPermission() {

    const props = usePage<PageProps & Role & Permission>().props;
    const { roles, permissions, rolePermissions } = props;

    const [loading, setLoading] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(rolePermissions);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post(`/give-permission/${roles.id}`, 
            { selectedPermissions }, 
            {
                onFinish: () => setLoading(false),
                onSuccess: () => {
                    toast.success('Permissions updated successfully!');
                    window.location.href = "/roles";
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Something went wrong!');
                }
            }
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Edit Role", href: '/roles' }]}>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 flex items-center">
                    Add Permission to:
                    <span className="p-2 ml-2 bg-blue-600 text-white rounded-md">
                        {roles.name.toUpperCase()}
                    </span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {permissions.map((permission : Permission) => (
                            <label
                                key={permission.id}
                                className="flex cursor-pointer items-center gap-2 border p-2 rounded"
                            >
                                <input
                                    type="checkbox"
                                    value={permission.id}
                                    checked={selectedPermissions.includes(permission.id)}
                                    onChange={(e) => {
                                        const id = permission.id;
                                        if (e.target.checked) {
                                            setSelectedPermissions([...selectedPermissions, id]);
                                        } else {
                                            setSelectedPermissions(selectedPermissions.filter(p => p !== id));
                                        }
                                    }}
                                    className="form-checkbox"
                                />
                                {permission.name}
                            </label>
                        ))}
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex cursor-pointer mt-4 items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Add Permissions"}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
