import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

interface Sections{
    all_class : [];
    capacity:number;
    class_id:number;
    id:number;
    name:string;
}
export default function Sections({sections}) {
    const sec= Object.values(sections).flat();
  const [filterText, setFilterText] = useState('');
  console.log(sec);
  const filteredUsers = sec.filter(
    cls =>
      cls.id.toString().includes(filterText) ||
          (cls.name && cls.name.toLowerCase().includes(filterText.toLowerCase()))

  );


    const columns: TableColumn<[]>[] = [
        { name: 'ID', selector: row => row.id ?? 'N/A', sortable: true },
        { name: 'Name', selector: row => row.name ?? 'N/A', sortable: true },
        {
            name: 'Total Student',
            cell: row => (
              <span className={`${row.students_count > 0 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded-md text-white`}>
                {row.students_count ?? 'N/A'}
              </span>
            ),
            sortable: true
          },

    { name: 'Class Level', cell: row => (
        <span className='p-2 rounded-md text-white bg-yellow-500'>Class {row.all_class?.name ?? 'N/A'}</span>
        ) , sortable: true },
        { name: 'Section Capacity', cell: row => (
        <span className='p-2 rounded-md text-white bg-sky-700'>{row.capacity ?? 'N/A'}</span>
        ) , sortable: true },
    {
      name: 'Action',
      cell: row => (
        <div className="flex gap-2">
          <Link
              href={`/sections/${row.id}/edit`}
            className="cursor-pointer px-3 py-2 bg-blue-500 text-white transition-all rounded-md hover:text-black"
          >
            Edit
          </Link>
            <Link

            href={`/sections/section-wise-students/${row.id}`}
            className="cursor-pointer px-3 py-2 bg-yellow-500 text-white rounded-md"
          >
            View Students
          </Link>
        </div>
      ),
      sortable: false,
      width: '300px',
    },
  ];

//   console.log(classes);
  return (
    <AppLayout breadcrumbs={[{ title: 'Sections', href: '/sections' }]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Sections</h1>
        <div className="flex items-center gap-4 mb-4 justify-between">
          <Link
            href={`/sections/create/`}
            className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Create Section
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
          // selectableRows
          highlightOnHover
          pointerOnHover
          customStyles={{
              header: {
                  style: {
                      borderTopLeftRadius: '10px',
                      borderTopRightRadius: '10px',
                  },
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
