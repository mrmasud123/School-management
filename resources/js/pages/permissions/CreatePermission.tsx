import { Head,Link, useForm,router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';


export default function CreatePermission() {
  const [loading, setLoading] = useState(false);
  const form = useForm({ permission_name: '' });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    router.post('/permissions',
      {
        name: form.data.permission_name,
      },
      {
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
        onSuccess: () => {
          setLoading(false);
          form.reset();
          toast.success("Permission created successfully!");
          window.location.href = "/permissions";
        },
        onError: (err) => {
          setLoading(false);
          console.log(err);
          toast.error(err.name);
        }

      }
    );


  }
  return (
    <AppLayout breadcrumbs={[{ title: 'Create permission', href: '/permissions/create' }]}> 
      <Head title="Permission Management" />

      <div className="flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Create permission</h1>
                  <Link href={'/permissions'} className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer">All permission</Link>
        </div>

              <form action="" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                    <label className="mb-1 font-medium text-sm text-muted-foreground">Enter the permission name</label>
                    <Input
                        placeholder="Permission Name"
                        value={form.data.permission_name}
                        onChange={e => form.setData('permission_name', e.target.value)}
                    />
                  </div>
                  <div className="pt-4">
                  <Button
              type="submit"
              disabled={loading}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Create Permission"
              )}
            </Button>
                          </div>
                  
        </form>
      </div>
    </AppLayout>
  );
}
