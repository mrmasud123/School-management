import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function SalesBilling() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Sales & Billing', href: '/sales-billing' }]}> 
            <Head title="Sales & Billing" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Sales & Billing</h1>
                <p>Welcome to the Sales & Billing page.</p>
            </div>
        </AppLayout>
    );
}
