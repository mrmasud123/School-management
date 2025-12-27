import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
interface Sections{
    capacity:number;
    class_id:number;
    id:number;
  name: string;
  students_count: number;
  all_class: { id: number; name: string; } | null;
}

interface SectionsProps {
  sections: {
    [key: string]: Sections[];
  };
}

export default function Sections({sections}: SectionsProps) {
    const sec= Object.values(sections).flat();
  const [filterText, setFilterText] = useState('');
  console.log(sections);
  const filteredUsers = sec.filter(
    cls =>
      cls.id.toString().includes(filterText) ||
          (cls.name && cls.name.toLowerCase().includes(filterText.toLowerCase()))

  );


    const columns: TableColumn<Sections>[] = [
        // { name: 'ID', selector: row => row.id ?? 'N/A', sortable: true },
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
        <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className='cursor-pointer'>Action</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="" align="start">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className='cursor-pointer'>
                                <Link
                                    href={`/sections/${row.id}/edit`}
                                    className="px-3 flex items-center w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                                >
                                    Edit
                                    <DropdownMenuShortcut><Edit className='text-white' /></DropdownMenuShortcut>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer'>
                                <Link
                                    href={`/sections/section-wise-students/${row.id}`}
                                    className="px-3 flex items-center w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                                >
                                    View Section
                                    <DropdownMenuShortcut><NotebookTabs className='text-white' /></DropdownMenuShortcut>
                                </Link>
                            </DropdownMenuItem>
                            

                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
      ),
      sortable: false, 
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

          title="Section List"
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
