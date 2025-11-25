import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Roles() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Roles Management', href: '/roles' }]}> 
            <Head title="Roles Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Roles Management</h1>
                <p>Welcome to the Roles Management page.</p>
            </div>
        </AppLayout>
    );
}
