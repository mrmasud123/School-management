import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
interface classes {
    id: number;
    name: string;
}
interface Section {
    id: number;
    name: string;
    class_id: number;
    capacity: number;
    students_count: number;
}
interface Props {
    classes: classes[];
    section: Section | null;
}
export default function Edit({ classes, section }: Props) {

    console.log(classes, section)
    const form = useForm({
        section_name: section?.name ?? '',
        class_id: section?.class_id ?? '0',
        capacity: section?.capacity ?? 0,
    });
    // debugger;

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted");
        console.log(form);
        setLoading(true);
        router.put(`/sections/${section?.id}`, {
            section_name: form.data.section_name,
            class_id: form.data.class_id,
            capacity: form.data.capacity,
        },
            {
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
                onSuccess: (data) => {
                    setLoading(false);
                    // form.reset();
                    console.log(data);
                    toast.success("Section updated successfully!");
                    // window.location.href = "/sections";
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
        <AppLayout breadcrumbs={[{ title: 'Edit Section', href: `/section/${section?.id}/edit` }]}>
            <Head title="Edit Section" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Section <span className={`bg-green-500 text-white rounded-md px-3 py-1`}>{section?.name}</span></h1>
                    <Link href={'/sections'} className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer">All sections</Link>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-10">
                        <section className="border rounded-lg p-6 space-y-4 bg-card">

                            <Button className='pe-0 rounded-tr-[20px] rounded-br-[20px]' type='button'>Current Student <span className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center'>{section?.students_count}</span></Button>

                            <div className="grid grid-cols-1 mt-3 md:grid-cols-3 gap-4">

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Section Name</label>
                                    <Input
                                        type="text"
                                        placeholder='Enter section name'
                                        value={form.data.section_name}
                                        onChange={e => form.setData('section_name', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Class Name</label>
                                    <Select
                                        onValueChange={value => form.setData("class_id", Number(value))}
                                        value={form.data.class_id.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes?.length > 0 ? (
                                                classes.map(cls => (
                                                    <SelectItem key={cls.id} value={String(cls.id)}>
                                                        Class {cls.name ?? "N/A"}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="0">No Classes Found</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>

                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Total Students</label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={form.data.capacity}
                                        onChange={e => form.setData('capacity', Number(e.target.value))}
                                    />
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
                                    <>
                                        <Save /> Update section
                                    </>
                                )}
                            </Button>

                        </div>

                    </div>
                </form>

            </div>
        </AppLayout>
    );
}
