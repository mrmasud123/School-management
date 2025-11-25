import { Head,Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// interface Permission {
//   id: number;
//   name: string;
//   guard_name: string;
//   created_at: string;
//   updated_at: string;
// }

export default function CreateRole() {
//   const { permissions } = usePage<{ permissions: Permission[] }>().props;

//   const handleDelete = (id: number) => {
//     if (confirm("Are you sure you want to delete this permission?")) {
//       Inertia.delete(`/permissions/${id}`);
//     }
//   };
    const form = useForm({role_name : ''});
  return (
    <AppLayout breadcrumbs={[{ title: 'Create role', href: '/roles/create' }]}> 
      <Head title="Role Management" />

      <div className="flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Create role</h1>
                  <Link href={'/roles'} className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer">All roles</Link>
        </div>

              <form action="">
              <div className="flex flex-col">
                    <label className="mb-1 font-medium text-sm text-muted-foreground">Enter the role name</label>
                    <Input
                        placeholder="Role Name"
                        value={form.data.role_name}
                        onChange={e => form.setData('role_name', e.target.value)}
                    />
                  </div>
                  <div className="pt-4">
                              <Button type="submit" className="w-full md:w-auto cursor-pointer">Add Role</Button>
                          </div>
                  
        </form>
      </div>
    </AppLayout>
  );
}
