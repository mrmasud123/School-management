import AppLayout from '@/layouts/app-layout';

export default function Accountants() {
    return (
        <AppLayout breadcrumbs={[{title: "Accountants", href: '/accountants'}]}>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Accountants</h1>
                <p>Welcome to the Accountants page.</p>
            </div>
        </AppLayout>
    );
}
