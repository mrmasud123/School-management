import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart2,
    DollarSign,
    FileText,
    Users,
    Wallet,
} from 'lucide-react';

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-8 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                        Welcome back 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Here’s a quick overview of today’s activity
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Today's Collection"
                        value="₹12,500"
                        icon={<DollarSign className="h-8 w-8 text-blue-500" />}
                    />
                    <StatCard
                        title="This Month Income"
                        value="₹1,25,000"
                        icon={<Wallet className="h-8 w-8 text-green-500" />}
                    />
                    <StatCard
                        title="Pending Invoices"
                        value="18"
                        icon={
                            <AlertCircle className="h-8 w-8 text-yellow-500" />
                        }
                    />
                    <StatCard
                        title="Total Expenses"
                        value="₹45,000"
                        icon={<FileText className="h-8 w-8 text-red-500" />}
                    />
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Payments */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <div className="mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-500" />
                            <h2 className="text-lg font-semibold">
                                Recent Payments
                            </h2>
                        </div>

                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="py-2">Student</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th className="text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow
                                    name="John Doe"
                                    amount="₹2,000"
                                    method="Cash"
                                    date="Today"
                                />
                                <TableRow
                                    name="Jane Smith"
                                    amount="₹3,500"
                                    method="Bank"
                                    date="Yesterday"
                                />
                            </tbody>
                        </table>
                    </div>

                    {/* Recent Expenses */}
                    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800">
                        <div className="mb-4 flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-red-500" />
                            <h2 className="text-lg font-semibold">
                                Recent Expenses
                            </h2>
                        </div>

                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="py-2">Category</th>
                                    <th>Amount</th>
                                    <th className="text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow
                                    name="Electricity"
                                    amount="₹5,000"
                                    date="Today"
                                />
                                <TableRow
                                    name="Maintenance"
                                    amount="₹2,000"
                                    date="Yesterday"
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ---------------- Reusable Components ---------------- */

function StatCard({ title, value, icon }) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow dark:bg-slate-800">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {title}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {value}
                </p>
            </div>
            <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-700">
                {icon}
            </div>
        </div>
    );
}

function TableRow({ name, amount, method, date }) {
    return (
        <tr className="border-b last:border-0">
            <td className="py-2">{name}</td>
            <td>{amount}</td>
            {method && <td>{method}</td>}
            <td className="text-right text-slate-500">{date}</td>
        </tr>
    );
}
