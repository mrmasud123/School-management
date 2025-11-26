import { Head, Link, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

import Swal from 'sweetalert2';
interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export default function Permission() {
  const { permissions } = usePage<{ permissions: Permission[] }>().props;

  const handleEdit = (permission: Permission) => {
    Swal.fire({
      title: "Edit Permission",
      html: `
            <input id="permission-name" 
                   class="swal2-input text-sm" 
                   value="${permission.name}" 
                   placeholder="Permission Name">
        `,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const name = (document.getElementById('permission-name') as HTMLInputElement).value;

        if (!name.trim()) {
          Swal.showValidationMessage("Permission name cannot be empty");
          return false;
        }
        return { name };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.put(`/permissions/${permission.id}`, result.value, {
          onSuccess: () => {
            Swal.fire("Updated!", "Permission updated successfully.", "success");
          },
          onError: (err) => {
            console.log(err);
            Swal.fire("Error", err.name, "error");
          }
        });
      }
    });
  };
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/permissions/${id}`, {
          onSuccess: () => {
            Swal.fire("Deleted!", "The permission has been deleted.", "success");
          },
        });
      }
    });
  };
  return (
    <AppLayout breadcrumbs={[{ title: 'Permission Management', href: '/permissions' }]}>
      <Head title="Permission Management" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Permission Management</h1>
          <Link href={'/permissions/create'} className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer">Create permission</Link>
        </div>
        <p className="text-muted-foreground mb-4">List of all permissions in the system.</p>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{perm.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{perm.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
                    <button
                      // onClick={handleEdit(perm)}
                      onClick={() => handleEdit(perm)}
                      className="cursor-pointer px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(perm.id)}
                      className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
