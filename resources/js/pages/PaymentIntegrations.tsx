import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function PaymentIntegrations() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Payment Integrations', href: '/payment-integrations' }]}> 
            <Head title="Payment Integrations" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-4">Payment Integrations</h1>
                <p>Welcome to the Payment Integrations page.</p>
            </div>
        </AppLayout>
    );
}
