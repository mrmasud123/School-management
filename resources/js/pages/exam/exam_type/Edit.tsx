import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ExamType {
    id: number;
    name: string;
    code: string;
    description: string | null;
    is_active: number;
}

interface Props {
    examType: ExamType;
}

export default function Edit({ examType }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: examType.name,
        code: examType.code,
        description: examType.description ?? '',
        is_active: examType.is_active ? '1' : '0',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.put(`/exam-types/${examType.id}`, data, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => {
                toast.success('Exam Type updated successfully!');
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Exam Types', href: '/exam-types' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Exam Type" />

            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            ✏️ Edit Exam Type
                        </h1>
                        <p className="text-sm text-slate-500">
                            Update exam type information
                        </p>
                    </div>

                    <Link
                        href="/exam-types"
                        className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        Back
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="rounded-xl border bg-white p-8 shadow-sm">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label>Exam Type Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label>Exam Code</Label>
                                <Input
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value)
                                    }
                                />
                                {errors.code && (
                                    <p className="text-sm text-red-500">
                                        {errors.code}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select
                                    value={data.is_active}
                                    onValueChange={(v) =>
                                        setData('is_active', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="0">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Exam Type'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
