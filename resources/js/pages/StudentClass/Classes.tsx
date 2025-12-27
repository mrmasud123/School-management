import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Edit, NotebookTabs, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
interface ClassesProps {
  classes: StudentClass[];
}

interface StudentClass {
  id: number;
  name: string;
  code: string;
  sections_sum_capacity: number;
  students_count: number;
  sections_count: number;
}
export default function Classes({ classes }: ClassesProps) {
  const [filterText, setFilterText] = useState('');
  console.log(classes);
  const filteredUsers = classes.filter(
    cls =>
      cls.id.toString().includes(filterText) ||
      (cls.name && cls.name.toLowerCase().includes(filterText.toLowerCase()))

  );

  const columns: TableColumn<StudentClass>[] = [
    { name: 'Name', selector: row => row.name ? `CLASS ${row.name}` : 'N/A', sortable: true },
    {
      name: 'Class Capacity',
      cell: row => (
        <span className='p-2 rounded-md text-white bg-sky-700'>{row.sections_sum_capacity ?? 0}</span>
      ),
      sortable: true
    },
    {
      name: 'Total Admitted Student',

      cell: row => (
        <span className={`${row.students_count > 0 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded-md text-white`}>
          {row.students_count ?? 'N/A'}
        </span>
      ),
      sortable: true
    },

    {
      name: 'Total Section',

      cell: row => (
        <span className={`${row.sections_count > 0 ? 'bg-green-500' : 'bg-red-500'} p-2 rounded-md text-white`}>
          {row.sections_count ?? 'N/A'}
        </span>
      ),
      sortable: true
    },

    { name: 'Class Code', selector: row => row.code ?? 'N/A', sortable: true },
    {
      name: 'Action',

      cell: row => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className='cursor-pointer'>Action</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem className='cursor-pointer'>
                <Link
                  href={`/classes/class-wise-students/${row.id}`}
                  className="px-3 flex items-center w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                >
                  Class Details
                <DropdownMenuShortcut><NotebookTabs className='text-white' /></DropdownMenuShortcut>
                </Link>

              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <Link
                  href={'#'}
                  className="px-3 flex items-center w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                >
                  Edit
                  <DropdownMenuShortcut><Edit className='text-white' /></DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>

            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
              style: {
                borderTopLeftRadius: "10px",
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
