import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import MigrateSingleStudent from '@/components/custom/MigrateSingleStudent';
import MigrateSingleClassStudent from '@/components/custom/MigrateSingleClassStudent';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Migrate Student', href: '/migrate' },
];

interface schoolClass{
    id: number;
    name: string;
    code: string;
    order: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface allClass{
    classes: schoolClass[]
}

export default function MigrateStudent({ classes }:allClass) {
    console.log(classes);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Migrate Student" />

            <div className="w-[90%] mx-auto mt-8">
                <h1 className="text-2xl font-semibold dark:text-white text-gray-800 mb-6">Migrate Student</h1>
                <MigrateSingleStudent classes={classes}/>
                <MigrateSingleClassStudent classes={classes}/>
            </div>
        </AppLayout>
    );
}
