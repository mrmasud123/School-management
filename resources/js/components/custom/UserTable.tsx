import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

export interface Role {
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [filterText, setFilterText] = useState('');

  // Filter users by ID, name, email, or roles
  const filteredUsers = users.filter(user =>
    user.id.toString().includes(filterText) ||
    user.name.toLowerCase().includes(filterText.toLowerCase()) ||
    user.email.toLowerCase().includes(filterText.toLowerCase()) ||
    (user.roles && user.roles.some(role => role.name.toLowerCase().includes(filterText.toLowerCase())))
  );

  const columns: TableColumn<User>[] = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    {
      name: 'Roles',
      cell: row =>
        row.roles && row.roles.length > 0 ? (
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
          'No Role'
        ),
      sortable: false,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => alert(`Edit user ${row.id}`)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md"
          >
            Edit
          </button>
          <button
            onClick={() => alert(`Delete user ${row.id}`)}
            className="px-3 py-1 bg-red-500 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div>
      <input
        type="text"
        placeholder="Search by ID, Name, Email, or Role"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
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
  );
}
