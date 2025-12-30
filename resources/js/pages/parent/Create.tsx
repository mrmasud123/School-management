import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';

export default function Create() {

    const form = useForm({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        nid: '',
        address: '',
        is_active: true,
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        router.post('/parent-accounts', form.data, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => {
                form.reset();
                toast.success('Parent account created successfully!');
                // window.location.href = '/parent-accounts';
            },
            onError: (err) => {
                setLoading(false);
                toast.error(Object.values(err)[0]);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Create Parent Account', href: '/parent-accounts' }]}>
            <Head title="Create Parent Account" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Parent Account</h1>
                    <Link
                        href="/parent-accounts"
                        className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer"
                    >
                        All Parents
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-10">

                        <section className="border rounded-lg p-6 space-y-4 bg-card">
                            <h2 className="text-xl font-semibold">Parent Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">
                                        First Name
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Enter first name"
                                        value={form.data.first_name}
                                        onChange={e => form.setData('first_name', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">
                                        Last Name
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Enter last name"
                                        value={form.data.last_name}
                                        onChange={e => form.setData('last_name', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">
                                        Phone
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="03xxxxxxxxx"
                                        value={form.data.phone}
                                        onChange={e => form.setData('phone', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="parent@email.com"
                                        value={form.data.email}
                                        onChange={e => form.setData('email', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">
                                        NID
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="xxxxx-xxxxx"
                                        value={form.data.nid}
                                        onChange={e => form.setData('nid', e.target.value)}
                                        className="no-spinner"
                                    />
                                </div>

                                <div className="flex flex-col md:col-span-3">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">
                                        Address
                                    </label>
                                    <Textarea value={form.data.address}
                                        placeholder='Enter parent address'
                                        onChange={e => form.setData('address', e.target.value)}
                                    ></Textarea>
                                </div>

                            </div>
                        </section>

                        <div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex cursor-pointer items-center gap-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        Saving...
                                    </>
                                ) : (
                                    'Create Parent Account'
                                )}
                            </Button>
                        </div>

                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
