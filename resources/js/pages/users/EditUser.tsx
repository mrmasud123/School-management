import { Head, Link, useForm, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

export default function Create() {
    const { user, allRoles } = usePage().props;

    console.log("props")
    console.log(user);
    const form = useForm({
        user_name: user?.name ?? "",
        user_email: user?.email ?? "",
        user_password: "",
        role: user?.roles?.map((r: any) => Number(r.id)) ?? []
    });
    
    console.log("Roles : ");
    console.log(form.data.role);
    const [loading, setLoading] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log(form.data.role)
        setLoading(false);
            router.put(`/users/${user?.id}`, {
                user_name: form.data.user_name,
                user_email: form.data.user_email,
                user_password: form.data.user_password,
                role: form.data.role,

            },
                {
                    onStart: () => setLoading(true),
                    onFinish: () => setLoading(false),
                    onSuccess: (data) => {
                        setLoading(false);
                          form.reset();
                        console.log(data);
                        toast.success("User updated successfully!");
                          window.location.href = "/users";
                    },
                    onError: (err) => {
                        setLoading(false);
                        console.log(err);
                        toast.error(Object.values(err)[0] as string);
                    }

                }
            );
    }
    return (
        <AppLayout breadcrumbs={[{ title: 'Update role', href: '/roles/update' }]}>
            <Head title="Role Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create user</h1>
                    <Link href={'/users'} className="px-2 py-1 text-md bg-green-600 rounded-md text-white cursor-pointer">All users</Link>
                </div>

                <form action="" onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-3">
                        <label className="mb-1 font-medium text-sm text-muted-foreground">Enter the user name</label>
                        <Input
                            placeholder="User name"
                            type='text'
                            value={form.data.user_name}
                            onChange={e => form.setData('user_name', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col mb-3">
                        <label className="mb-1 font-medium text-sm text-muted-foreground">Enter the user email</label>
                        <Input
                            placeholder="E-mail"
                            type='email'
                            value={ form.data.user_email}
                            onChange={e => form.setData('user_email', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col mb-3">
                        <label className="mb-1 font-medium text-sm text-muted-foreground">Enter the password</label>
                        <Input
                            type='password'
                            placeholder="Password"
                            value={form.data.user_password}
                            onChange={e => form.setData('user_password', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col mb-3">
                        <label className="mb-1 font-medium text-sm text-muted-foreground">Select Roles</label>

                        <select
                            multiple
                            value={form.data.role}
                            onChange={(e) => {
                                const selectedRoles = Array.from(
                                    e.target.selectedOptions,
                                    option => Number(option.value)
                                );
                                form.setData("role", selectedRoles);
                            }}
                            className="border p-2 rounded w-full h-32"
                        >
                            {allRoles?.map((role: any) => (
                                <option key={role.id} value={role.id.toString()}>
                                    {role.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            //   disabled={loading}
                            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                "Update User"
                            )}
                        </Button>

                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
