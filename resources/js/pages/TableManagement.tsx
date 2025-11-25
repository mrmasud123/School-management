import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function TableManagement() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Table Management (Dine-in)', href: '/table-management' }]}> 
            <Head title="Table Management (Dine-in)" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Table Management (Dine-in)</h1>
                <p>Welcome to the Table Management (Dine-in) page.</p>
            </div>
        </AppLayout>
    );
}
