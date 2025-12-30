import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';
// import  route  from 'ziggy-js';
interface ParentProps {
    parent: ParentAccount;
}

interface ParentAccount {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    nid: number,
    students: {
        id: number,
        first_name: string,
        last_name: string,
        student_class: {
            id: number,
            name: string
        },
        section: {
            id: number,
            name: string
        }
    }[],
    student_class: { id: number; name: string; } | null;
    section: { id: number; name: string; } | null;
    email: string;
    address: string | null;
    is_active: number;
}
export default function Edit({ parent }: ParentProps) {
    console.log(parent)
    const form = useForm({
        first_name: parent?.first_name || '',
        last_name: parent?.last_name || '',
        phone: parent?.phone || '',
        email: parent?.email || '',
        nid: parent?.nid || '',
        address: parent?.address || '',
        is_active: parent?.is_active,
        _method: 'PUT'
    });

    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState(parent.students || []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parent_account = parent?.id;

        router.put(`/parent-accounts/${parent_account}`, form.data, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => {
                toast.success('Parent account updated successfully!');
            },
            onError: (err) => {
                toast.error(Object.values(err)[0]);
            },
        });
    };


    const handleRemove = async (parentId: number, studentId: number) => {
        try {
            await axios.get(`/admin/remove-parent-student-mapping/${parentId}/${studentId}`);

            setStudents(prev =>
                prev.filter(student => student.id !== studentId)
            );

            toast.success('Student unassigned successfully');
        } catch (error) {
            console.log(error);
            toast.error('Failed to remove student');
        }
    };


    return (
        <AppLayout breadcrumbs={[{ title: 'Edit Parent Account', href: `/parent-accounts/${parent?.id}/edit` }]}>
            <Head title="Edit Parent Account" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Parent Account</h1>
                    <Link
                        href="/parent-accounts"
                        className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer"
                    >
                        All Parents
                    </Link>
                </div>
                <div className="md:col-span-3">
                    <h2 className="text-xl font-semibold mb-4">Assigned Students</h2>

                    {students?.length === 0 ? (
                        <p className="text-gray-500 italic">
                            No students assigned to this parent.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="
                                                                flex items-start gap-4
                                                                p-4 rounded-xl border
                                                                bg-white shadow-sm
                                                                hover:shadow-md transition
                                                            "
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {student.first_name.charAt(0)}
                                        {student.last_name.charAt(0)}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {student.first_name} {student.last_name}
                                        </h3>

                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                                Class {student.student_class?.name}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-700">
                                                {student.section?.name}
                                            </span>
                                        </div>
                                        <Button onClick={
                                            (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRemove(parent?.id, student.id)
                                            }
                                        } type='button' className='text-sm bg-red-500 cursor-pointer mt-3 p-2'>Remove</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                            <label className="mb-1 font-medium text-sm text-muted-foreground">
                                        Account Status
                                    </label>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="text-sm text-gray-600">Inactive</span>

                                <button
                                    type="button"
                                    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none ${form.data.is_active ==1 ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    onClick={() => form.setData('is_active', form.data.is_active ? 0 : 1)}
                                >
                                    <span
                                        className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md ring-0 transition-transform duration-300 ${form.data.is_active == 1 ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                    ></span>
                                </button>

                                <span className="text-sm text-gray-600">Active</span>
                            </div>
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
                                    'Update Parent Account'
                                )}
                            </Button>


                        </section>

                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
