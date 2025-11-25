import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

import { BarChart2, Users, ShoppingBasket, Wallet, Store, FileText } from 'lucide-react';

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-8 p-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome back!</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Example Stat Cards */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex items-center gap-4">
                        <ShoppingBasket className="w-10 h-10 text-blue-500" />
                        <div>
                            <div className="text-2xl font-bold">1,250</div>
                            <div className="text-slate-500 dark:text-slate-400">Products</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex items-center gap-4">
                        <Users className="w-10 h-10 text-green-500" />
                        <div>
                            <div className="text-2xl font-bold">320</div>
                            <div className="text-slate-500 dark:text-slate-400">Customers</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex items-center gap-4">
                        <Wallet className="w-10 h-10 text-yellow-500" />
                        <div>
                            <div className="text-2xl font-bold">$12,400</div>
                            <div className="text-slate-500 dark:text-slate-400">Sales (This Month)</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex items-center gap-4">
                        <Store className="w-10 h-10 text-purple-500" />
                        <div>
                            <div className="text-2xl font-bold">5</div>
                            <div className="text-slate-500 dark:text-slate-400">Stores</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex items-center gap-4">
                        <FileText className="w-10 h-10 text-pink-500" />
                        <div>
                            <div className="text-2xl font-bold">87</div>
                            <div className="text-slate-500 dark:text-slate-400">Invoices</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex items-center gap-4">
                        <BarChart2 className="w-10 h-10 text-cyan-500" />
                        <div>
                            <div className="text-2xl font-bold">98%</div>
                            <div className="text-slate-500 dark:text-slate-400">Uptime</div>
                        </div>
                    </div>
                </div>
                {/* Placeholder for charts or quick links */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 min-h-[220px] flex flex-col justify-center items-center">
                        <BarChart2 className="w-12 h-12 text-cyan-400 mb-2" />
                        <div className="text-lg text-slate-500 dark:text-slate-400">Sales Analytics (Coming Soon)</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 min-h-[220px] flex flex-col justify-center items-center">
                        <Users className="w-12 h-12 text-green-400 mb-2" />
                        <div className="text-lg text-slate-500 dark:text-slate-400">Recent Activity (Coming Soon)</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
