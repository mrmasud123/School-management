import { Head,Link, useForm, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export default function CreateRole() {

  const form = useForm({ role_name: '' });
  
const [loading, setLoading] = useState(false);
  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    
    router.post('/roles', 
      {
          name: form.data.role_name,
      },
      {
          onStart: () => setLoading(true),
          onFinish: () => setLoading(false),
          onSuccess: () => {
            form.reset();
            toast.success("Role created successfully!");
            window.location.href = "/roles";
        },
        onError: (err) => {
          console.log(err);
          toast.error(err.name);
          }
          
      }
  );
      
  
  }
  return (
    <AppLayout breadcrumbs={[{ title: 'Create role', href: '/roles/create' }]}> 
      <Head title="Role Management" />

      <div className="flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Create role</h1>
                  <Link href={'/roles'} className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer">All roles</Link>
        </div>

              <form action="" onSubmit={handleSubmit}>
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
