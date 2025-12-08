import { Head, router, useForm,Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@/components/ui/input-group"

export default function CreateClass() {

    const form = useForm({
        class_name: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted");
        console.log(form);
        router.post('/classes', {
            class_name: form.data.class_name
        },
            {
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
                onSuccess: (data) => {
                    setLoading(false);
                    form.reset();
                    console.log(data);
                    toast.success("Class created successfully!");
                    window.location.href = "/classes";
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
        <AppLayout breadcrumbs={[{ title: 'Create Class', href: '/classes' }]}>
            <Head title="Create Class" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Class</h1>
                    <Link href={'/classes'} className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer">All class</Link>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-10">

                        <section className="border rounded-lg p-6 space-y-4 bg-card">
                            <h2 className="text-xl font-semibold">Enter the class name</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Class Name</label>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <InputGroupText>CLASS</InputGroupText>
                                        </InputGroupAddon>
                                        <InputGroupInput placeholder="1" value={form.data.class_name} onChange={(e) => form.setData('class_name', e.target.value)} />
                                    </InputGroup>
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
                                    "Create Class"
                                )}
                            </Button>
                        </div>

                    </div>
                </form>

            </div>
        </AppLayout>
    );
}
