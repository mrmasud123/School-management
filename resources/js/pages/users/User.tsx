import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}
interface Role {
  id: number;
  name: string;
}
interface Props {
  users: User[];
}

export default function User({ users }: Props) {
  const [filterText, setFilterText] = useState('');

  const filteredUsers = users.filter(
    user =>
      user.id.toString().includes(filterText) ||
      (user.name && user.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(filterText.toLowerCase()))
  );

  const columns: TableColumn<User>[] = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    {
      name: 'Roles',
      cell: row =>
        Array.isArray(row.roles) && row.roles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {row.roles.map((role, index) => (
              <button
                key={index}
                className="px-2 py-1 bg-black text-white rounded-md font-bold"
              >
                {role.name}
              </button>
            ))}
          </div>
        ) : (
          <button
            className="px-2 py-1 bg-red-600 text-white rounded-md font-bold"
          >
            No Role
          </button>
        ),
      sortable: false,
    },
    { name: 'Email', selector: row => row.email, sortable: true },
    {
      name: 'Action',

      cell: row => (
        <div className="flex gap-2">
          <Link
            
            href={`/users/${row.id}/edit`}
            className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded-md"
          >
            Edit
          </Link>
          <button
            onClick={() => alert(`Delete user ${row.id}`)}
            className="cursor-pointer px-3 py-2 bg-red-500 text-white rounded-md"
          >
            Delete
          </button>

        </div>
      ),
      sortable: false,
      width: '250px',
    },

  ];

  console.log(users);
  return (
    <AppLayout breadcrumbs={[{ title: 'Users', href: '/user' }]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <div className="flex items-center gap-4 mb-4 justify-between">
          <Link
            href={`/users/create/`}
            className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Create User
          </Link>

          <input
            type="text"
            placeholder="Search by ID, name, or email"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>


        <DataTable
          title="User List"
          columns={columns}
          data={filteredUsers}
          pagination
          selectableRows
          highlightOnHover
          pointerOnHover
        />
      </div>
    </AppLayout>
  );
}
