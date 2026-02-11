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

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        description: '',
        is_active: '1',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/exam-types', data, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => {
                toast.success('Exam Type created successfully!');
                reset();
                router.visit('/exam-types');
            },
            onError: (error) => {
                toast.error(Object.values(error)[0]);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Create Exam Type',
                    href: '/exam-types/create',
                },
            ]}
        >
            <Head title="Create Exam Type" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Exam Type</h1>

                    <Link
                        href="/exam-types"
                        className="rounded-md bg-green-600 px-3 py-1 text-sm text-white"
                    >
                        All Exam Types
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <section className="space-y-6 rounded-lg border bg-card p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="flex flex-col">
                                <Label className="mb-2">Exam Type Name</Label>
                                <Input
                                    type="text"
                                    value={data.name}
                                    placeholder="e.g. Mid Term"
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label className="mb-2">Exam Code</Label>
                                <Input
                                    type="text"
                                    value={data.code}
                                    placeholder="e.g. MID2026"
                                    onChange={(e) =>
                                        setData('code', e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label className="mb-2">Status</Label>
                                <Select
                                    value={data.is_active}
                                    onValueChange={(v) =>
                                        setData('is_active', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
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

                            <div className="flex flex-col md:col-span-2">
                                <Label className="mb-2">Description</Label>
                                <Textarea
                                    value={data.description}
                                    placeholder="Optional description..."
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {loading ? (
                                <>
                                    <Spinner />
                                    Saving...
                                </>
                            ) : (
                                'Create Exam Type'
                            )}
                        </Button>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
}
