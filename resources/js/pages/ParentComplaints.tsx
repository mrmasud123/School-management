import AppLayout from '@/layouts/app-layout';

export default function ParentComplaints() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Parents Complaints', href: '/parent-complaints' }]}>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Parent Complaints</h1>
                <p>Welcome to the Parent Complaints page.</p>
            </div>
        </AppLayout>
    );
}
