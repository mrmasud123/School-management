import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

export default function Classes({classes}) {
  const [filterText, setFilterText] = useState('');

  const filteredUsers = classes.filter(
    cls =>
      cls.id.toString().includes(filterText) ||
          (cls.name && cls.name.toLowerCase().includes(filterText.toLowerCase()))

  );

    const columns: TableColumn<[]>[] = [
        // { name: 'ID', selector: row => row.id ?? 'N/A', sortable: true },
        { name: 'Name', selector: row => row.name ? `CLASS ${row.name}`: 'N/A', sortable: true },
        {
            name: 'Class Capacity',
            cell: row => (
                <span className='p-2 rounded-md text-white bg-sky-700'>{row.sections_sum_capacity ??  0}</span>
            ),
            sortable: true },
        {
            name: 'Total Admitted Student',

            cell: row => (
              <span className={`${row.students_count > 0 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded-md text-white`}>
                {row.students_count ?? 'N/A'}
              </span>
            ),
            sortable: true
          },

    { name: 'Total Section',

        cell: row => (
          <span className={`${row.sections_count > 0 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded-md text-white`}>
            {row.sections_count ?? 'N/A'}
          </span>
        ),
        sortable: true },

    { name: 'Class Code', selector: row => row.code ?? 'N/A', sortable: true },
    {
      name: 'Action',

      cell: row => (
        <div className="flex gap-2">
            <Link
                href={`/classes/class-wise-students/${row.id}`}
                className="cursor-pointer px-3 py-2 bg-yellow-500 text-white rounded-md"
            >
                View Students
            </Link>
        </div>
      ),
      sortable: false,
      // width: '300px',
    },

  ];

  console.log(classes);
  return (
    <AppLayout breadcrumbs={[{ title: 'Classes', href: '/classes' }]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Classes</h1>
        <div className="flex items-center gap-4 mb-4 justify-between">
          <Link
            href={`/classes/create/`}
            className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Create Class
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
          title="All Classes"
          columns={columns}
          data={filteredUsers}
          pagination
          selectableRows
          highlightOnHover
          pointerOnHover
          customStyles={{
              header: {
                  style:{
                  borderTopLeftRadius:"10px",
                  borderTopRightRadius: "10px"
                }
              },
                  pagination: {
                  style: {
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px',
                  overflow: 'hidden',
              },
            },
          }}
        />
      </div>
    </AppLayout>
  );
}
