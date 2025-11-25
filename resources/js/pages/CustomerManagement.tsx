import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function CustomerManagement() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Customer Management (CRM)', href: '/customer-management' }]}> 
            <Head title="Customer Management (CRM)" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Customer Management (CRM)</h1>
                <p>Welcome to the Customer Management (CRM) page.</p>
            </div>
        </AppLayout>
    );
}
