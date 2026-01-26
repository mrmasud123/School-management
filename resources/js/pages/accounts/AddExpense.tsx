import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function AddExpense({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        expense_category_id: '',
        amount: '',
        expense_date: new Date().toISOString().slice(0, 10),
        description: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/accounting/expenses');
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Add Expense', href: '/accountants/add-expense' },
            ]}
        >
            <form onSubmit={submit} className="max-w-xl space-y-6 p-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Add Expense</h1>
                    <Link href="/accountants">
                        <Button className="cursor-pointer">
                            <ArrowLeft /> Back
                        </Button>
                    </Link>
                </div>
                {/* Category */}
                <div>
                    <Label>Expense Category</Label>
                    <Select
                        value={data.expense_category_id}
                        onValueChange={(v) => setData('expense_category_id', v)}
                    >
                        {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                <div>
                    <Label>Amount</Label>
                    <Input
                        type="number"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                    />
                </div>

                <div>
                    <Label>Expense Date</Label>
                    <Input
                        type="date"
                        value={data.expense_date}
                        onChange={(e) =>
                            setData('expense_date', e.target.value)
                        }
                    />
                </div>

                <div>
                    <Label>Description</Label>
                    <Textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                </div>

                <Button disabled={processing}>Save Expense</Button>
            </form>
        </AppLayout>
    );
}
