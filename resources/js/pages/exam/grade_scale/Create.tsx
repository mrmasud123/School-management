import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Create() {
    const { data, setData, errors } = useForm({
        name: '',
        grade_point: '',
        remarks: '',
        color_code: '#3b82f6',
        is_active: '1',
    });

    const [loading, setLoading] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        router.post('/grade-scales', data, {
            onSuccess: () => toast.success('Created successfully'),
            onError: (error) => {
                toast.error(Object.values(error)[0] as string);
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Grade Scales', href: '/grade-scales' }]}
        >
            <Head title="Create Grade Scale" />

            <div className="p-8">
                <h1 className="mb-6 text-3xl font-bold">
                    ➕ Create Grade Scale
                </h1>
                <form onSubmit={submit}>
                    <section className="space-y-6 rounded-lg border bg-card p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label className="mb-2">Name</Label>
                                <Input
                                    placeholder="e.g. A+, A, B, Excellent"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2">Grade Point</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 4.00, 3.75, 3.50"
                                    value={data.grade_point}
                                    onChange={(e) =>
                                        setData('grade_point', e.target.value)
                                    }
                                />
                                {errors.grade_point && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.grade_point}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2">Remarks</Label>
                                <Textarea
                                    placeholder="Optional remarks like Outstanding performance"
                                    value={data.remarks}
                                    onChange={(e) =>
                                        setData('remarks', e.target.value)
                                    }
                                />
                                {errors.remarks && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.remarks}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-2">Color</Label>
                                <Input
                                    type="color"
                                    title="Pick a color for this grade badge"
                                    value={data.color_code}
                                    onChange={(e) =>
                                        setData('color_code', e.target.value)
                                    }
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    This color will be used to display the grade
                                    badge.
                                </p>
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
                                'Create Grade Scale'
                            )}
                        </Button>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
}
