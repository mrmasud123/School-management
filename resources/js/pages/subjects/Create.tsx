import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';

export default function Create() {

    const form = useForm({
        subject_name: '',
        status : 0,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted");
        console.log(form);
        router.post('/subjects', {
                name: form.data.subject_name,
                status: form.data.status
            },
            {
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
                onSuccess: (data) => {
                    setLoading(false);
                    form.reset();
                    console.log(data);
                    toast.success("Subject created successfully!");
                    window.location.href = "/subjects";
                },
                onError: (err) => {
                    setLoading(false);
                    console.log(err);
                    toast.error(Object.values(err)[0] as string);
                }
            }
        )
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Create Subject', href: '/subjects/create' }]}>
            <Head title="Create Subject" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Subject</h1>
                    <Link href={'/subjects'} className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer">All subjects</Link>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-10">
                        <section className="border rounded-lg p-6 space-y-4 bg-card">
                            <h2 className="text-xl font-semibold">Enter the subject name</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Subject Name</label>
                                    <Input
                                        type="text"
                                        placeholder='Enter subject name'
                                        value={form.data.subject_name}
                                        onChange={e => form.setData('subject_name', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Subject Status</label>
                                    <Select
                                        onValueChange={value => form.setData('status', Number(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Deactivate</SelectItem>
                                            <SelectItem value="1">Active</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>
                        </section>

                        <div className="">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex cursor-pointer items-center gap-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
                                    "Create subject"
                                )}
                            </Button>
                        </div>

                    </div>
                </form>

            </div>
        </AppLayout>
    );
}
