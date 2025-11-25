import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function InventoryManagement() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Inventory Management', href: '/inventory-management' }]}> 
            <Head title="Inventory Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
                <p>Welcome to the Inventory Management page.</p>
            </div>
        </AppLayout>
    );
}
