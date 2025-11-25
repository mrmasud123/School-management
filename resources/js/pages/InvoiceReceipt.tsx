import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function InvoiceReceipt() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Invoice & Receipt Generation', href: '/invoice-receipt' }]}> 
            <Head title="Invoice & Receipt Generation" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Invoice & Receipt Generation</h1>
                <p>Welcome to the Invoice & Receipt Generation page.</p>
            </div>
        </AppLayout>
    );
}
