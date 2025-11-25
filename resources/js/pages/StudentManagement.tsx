import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function StudentManagement() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Student Management', href: '/inventory-management' }]}> 
            <Head title="Student Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Student Management</h1>
                <p>Welcome to the Student Management page.</p>
            </div>
        </AppLayout>
    );
}
