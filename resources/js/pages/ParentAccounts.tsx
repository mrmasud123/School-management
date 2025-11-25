import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ParentAccounts() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Parents Accounts', href: '/parent-accounts' }]}> 
            <Head title="Parents Accounts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Parents Accounts</h1>
                <p>Welcome to the Parents Accounts page.</p>
            </div>
        </AppLayout>
    );
}
