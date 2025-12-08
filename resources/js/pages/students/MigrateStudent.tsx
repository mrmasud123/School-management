import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Migrate Student',
        href: '/migrate',
    },
];


export default function MigrateStudent() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Migrate Student" />
        </AppLayout>
    );
}
