import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function FeeCategory({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post('/accountants/store-fee-category', {
            onSuccess: (data) => {
                toast.success('Fee category created');
                reset();
            },
            onError: (err) => {
                toast.error(err.name);
            },
        });
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Fee Category', href: '/accountants/fee-category' },
            ]}
        >
            <div className="grid grid-cols-2 gap-6">
                <form onSubmit={submit} className="max-w-xl space-y-6 p-8">
                    <h2 className="text-2xl font-bold">Fee Category</h2>

                    <div>
                        <Label className="mb-3">Category Name</Label>
                        <Input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label className="mb-3">Description</Label>
                        <Textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <Spinner />
                                Saving...
                            </div>
                        ) : (
                            'Save Category'
                        )}
                    </Button>
                </form>

                <div className="max-w-xl space-y-6 p-8">
                    <h2 className="text-2xl font-bold">All Categories</h2>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="py-2">Category</th>
                                <th>Amount</th>
                                <th className="text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <TableRow
                                    key={category.id}
                                    name={category.name}
                                    description={category.description ?? 'N/A'}
                                    date={category.created_at}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

function TableRow({
    name,
    description,
    date,
}: {
    name: string;
    description: string;
    date: string;
}) {
    return (
        <tr className="border-b last:border-0">
            <td className="py-2">{name}</td>
            <td>{description}</td>
            <td className="text-right text-slate-500">{date.split('T')[0]}</td>
        </tr>
    );
}
