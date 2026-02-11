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
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    gradeScale: any;
}

export default function Edit({ gradeScale }: Props) {
    const [loading, setLoading] = useState(false);
    const { data, setData } = useForm({
        name: gradeScale.name,
        grade_point: gradeScale.grade_point,
        remarks: gradeScale.remarks ?? '',
        color_code: gradeScale.color_code ?? '#3b82f6',
        is_active: gradeScale.is_active ? '1' : '0',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        router.put(`/grade-scales/${gradeScale.id}`, data, {
            onSuccess: () => toast.success('Updated successfully'),
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string);
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Grade Scales', href: '/grade-scales' }]}
        >
            <Head title="Edit Grade Scale" />

            <div className="p-8">
                <h1 className="mb-6 text-3xl font-bold">✏️ Edit Grade Scale</h1>
                <form onSubmit={submit}>
                    <section className="space-y-6 rounded-lg border bg-card p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label className="mb-2">Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Grade Point</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.grade_point}
                                    onChange={(e) =>
                                        setData('grade_point', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Remarks</Label>
                                <Textarea
                                    value={data.remarks}
                                    onChange={(e) =>
                                        setData('remarks', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Color</Label>
                                <Input
                                    type="color"
                                    value={data.color_code}
                                    onChange={(e) =>
                                        setData('color_code', e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label className="mb-2">Status</Label>
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
                                'Update Grade Scale'
                            )}
                        </Button>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
}
