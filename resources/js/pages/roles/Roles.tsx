import { Head, Link, router } from '@inertiajs/react';

import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Swal from 'sweetalert2';

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export default function Roles() {
  const { roles } = usePage<{ roles: Role[] }>().props;
  const handleEdit = (role: Role) => {
    Swal.fire({
      title: "Edit Role",
      html: `
            <input id="role-name" 
                   class="swal2-input text-sm" 
                   value="${role.name}" 
                   placeholder="Role Name">
        `,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const name = (document.getElementById('role-name') as HTMLInputElement).value;

        if (!name.trim()) {
          Swal.showValidationMessage("Role name cannot be empty");
          return false;
        }
        return { name };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.put(`/roles/${role.id}`, result.value, {
          onSuccess: () => {
            Swal.fire("Updated!", "Role updated successfully.", "success");
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
        router.delete(`/roles/${id}`, {
          onSuccess: () => {
            Swal.fire("Deleted!", "The role has been deleted.", "success");
          },
        });
      }
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Role Management', href: '/roles' }]}>
      <Head title="Role Management" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Role Management</h1>
          <Link href={'/roles/create'} className="px-2 py-1 text-sm bg-green-600 rounded-md text-white cursor-pointer">Create Role</Link>
        </div>
        <p className="text-muted-foreground mb-4">List of all roles in the system.</p>

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
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 bg-yellow-500 rounded-md text-white font-bold">{role.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
