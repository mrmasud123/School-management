import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function EmployeeManagement() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Employee / Staff Management', href: '/employee-management' }]}> 
            <Head title="Employee / Staff Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Employee / Staff Management</h1>
                <p>Welcome to the Employee / Staff Management page.</p>
            </div>
        </AppLayout>
    );
}
