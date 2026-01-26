import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { AlertCircle, DollarSign, FileText, Plus, Wallet } from 'lucide-react';

export default function Index() {
    return (
        <AppLayout
            breadcrumbs={[{ title: 'Accountants', href: '/accountants' }]}
        >
            <div className="space-y-8 p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Accountant Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Manage collections, expenses, and invoices
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link href="/accountants/collect-fee">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Collect Fee
                            </Button>
                        </Link>

                        <Link href="/accountants/add-expense">
                            <Button variant={'outline'}>
                                <FileText className="mr-2 h-4 w-4" />
                                Add Expense
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Today's Collection"
                        value="₹12,500"
                        icon={<DollarSign className="h-7 w-7 text-blue-500" />}
                    />
                    <StatCard
                        title="This Month Income"
                        value="₹1,25,000"
                        icon={<Wallet className="h-7 w-7 text-green-500" />}
                    />
                    <StatCard
                        title="Pending Invoices"
                        value="18"
                        icon={
                            <AlertCircle className="h-7 w-7 text-yellow-500" />
                        }
                    />
                    <StatCard
                        title="Total Expenses"
                        value="₹45,000"
                        icon={<FileText className="h-7 w-7 text-red-500" />}
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ActionCard
                        title="Collect Student Fee"
                        description="Record a new fee payment from a student"
                        href="/accountants/collect-fee"
                        primary
                    />
                    <ActionCard
                        title="Student Fee Category"
                        description="Record a new fee category"
                        href="/accountants/fee-category"
                        primary
                    />
                    <ActionCard
                        title="Student Fee Structure"
                        description="Add fee structure for students"
                        href="/accountants/fee-structure"
                        primary
                    />
                    <ActionCard
                        title="Academic Year"
                        description="Add academic year"
                        href="/accountants/academic-year"
                        primary
                    />
                </div>
            </div>
        </AppLayout>
    );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value, icon }) {
    return (
        <div className="flex items-center justify-between rounded-xl border bg-background p-6 shadow-sm">
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
            </div>
            <div className="rounded-full bg-muted p-3">{icon}</div>
        </div>
    );
}

function ActionCard({ title, description, href, primary = false }) {
    const Wrapper = href ? Link : 'div';

    return (
        <Wrapper
            href={href}
            className={`rounded-xl border p-6 shadow-sm transition hover:shadow-md ${
                primary ? 'bg-primary text-primary-foreground' : ''
            }`}
        >
            <h3 className="text-lg font-semibold">{title}</h3>
            <p
                className={`mt-1 text-sm ${
                    primary
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                }`}
            >
                {description}
            </p>
        </Wrapper>
    );
}
