import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ReportsAnalytics() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Reports & Analytics', href: '/reports-analytics' }]}> 
            <Head title="Reports & Analytics" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
                <p>Welcome to the Reports & Analytics page.</p>
            </div>
        </AppLayout>
    );
}
