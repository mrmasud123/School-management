import { Head, router, useForm, Link } from '@inertiajs/react';
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
import { Spinner } from '@/components/ui/spinner';

interface Props {
    allClasses: ClassList[];
}
interface ClassList {
    id: number;
    name: string;
    code: string;
}
export default function CreateClass({ allClasses }: Props) {

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
                <div className="space-y-10">

                    <section className="border rounded-lg p-6 space-y-4 bg-card">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <form onSubmit={handleSubmit}>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Class Name</label>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <InputGroupText>CLASS</InputGroupText>
                                        </InputGroupAddon>
                                        <InputGroupInput type='number' placeholder="1" value={form.data.class_name} onChange={(e) => form.setData('class_name', e.target.value)} />
                                    </InputGroup>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex cursor-pointer mt-3 items-center gap-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner />
                                            Saving...
                                        </>
                                    ) : (
                                        "Create Class"
                                    )}
                                </Button>
                            </form>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    All Classes
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allClasses.map((cls) => (
                                        <div
                                            key={cls.id}
                                            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                        >
                                            {/* Accent bar */}
                                            <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 group-hover:bg-indigo-500 transition-colors" />

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        Class {cls.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Code: <span className="font-medium text-gray-700">{cls.code}</span>
                                                    </p>
                                                </div>

                                                {/* Badge */}
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>

                    </section>

                </div>

            </div>
        </AppLayout >
    );
}
