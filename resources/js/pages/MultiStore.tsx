import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function MultiStore() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Multi-Store / Multi-Branch Support', href: '/multi-store' }]}> 
            <Head title="Multi-Store / Multi-Branch Support" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Multi-Store / Multi-Branch Support</h1>
                <p>Welcome to the Multi-Store / Multi-Branch Support page.</p>
            </div>
        </AppLayout>
    );
}
