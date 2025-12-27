import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
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
import { Edit, Trash } from 'lucide-react';

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  joining_date: string;
  experience: string;
  is_active: boolean;
  designation: { id: number; name: string; };
  employment_type: { id: number; type: string; };
  qualification: { id: number; name: string; };
  contact: { email: string; phone: string; address: string; };
  specializations: [{ id: number; name: string; }];
  photo_url: string;
  document_url: string;
}
interface TeacherProps {
  teachers: Teacher[];
}

export default function Teacher({ teachers }: TeacherProps) {
  console.log(teachers)
  const [filterText, setFilterText] = useState('');
  const [selectTeachers, setSelectTeachers] = useState<Teacher[]>([]);
  const filteredUsers = teachers.filter(
    teacher =>
      teacher.id.toString().includes(filterText) ||
      (teacher.first_name && teacher.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
      (teacher.last_name && teacher.last_name.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleSelect = (selectedTeachers: Teacher) => {
    setSelectTeachers(prev => [...prev, selectedTeachers]);
  };

  const handleDelete = (teacherId: number) => {

    router.delete(`teachers/${teacherId}`, {
      onSuccess: (data) => {
        console.log(data);
      },
      onFinish: () => {
        console.log("Fininshed!");
      },
      onError: (errors) => {
        console.log(errors);
      },
    });
  }

  const columns: TableColumn<Teacher>[] = [
    {
      name: 'Name',
      selector: row => row.full_name,
      sortable: true,
    },
    {
      name: 'Designation',
      selector: row => row.designation?.name || 'N/A',
    },
    {
      name: 'Qualification',
      selector: row => row.qualification?.name || 'N/A',
    },
    {
      name: 'Specializations',
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.specializations && row.specializations.length > 0 ? (
            row.specializations.map(spec => (
              <span
                key={spec.id}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {spec.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">N/A</span>
          )}
        </div>
      )
    },
    {
      name: 'Photo',
      cell: (row) => (
        <div className="w-16 h-16 overflow-hidden rounded-md">
          <img
            src={row.photo_url}
            alt={`${row.full_name}'s photo`}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
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
                <Link href={`/teachers/${row.id}/edit`}
                  className="px-3 flex items-center w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200">
                  Edit
                <DropdownMenuShortcut><Edit className='text-white' /></DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <Button
                  onClick={() => handleDelete(row.id)}
                  className="px-3 flex items-center w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                  <DropdownMenuShortcut><Trash className='text-white' /></DropdownMenuShortcut>
                </Button>
              </DropdownMenuItem>

            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  console.log(selectTeachers);



  return (
    <AppLayout breadcrumbs={[{ title: 'Teachers', href: '/teachers' }]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Teachers</h1>
        <div className="flex items-center gap-4 mb-4 justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/teachers/create/`}
              className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Create Teacher
            </Link>

            <Link
              href={`/teachers/trashed-teachers`}
              className="cursor-pointer px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 me-2"
            >
              View trashed teachers
            </Link>
          </div>

          <input
            type="text"
            placeholder="Search by ID, name, or email"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>


        <DataTable
          title="Teacher List"
          columns={columns}
          data={filteredUsers}
          pagination
          selectableRows
          highlightOnHover
          pointerOnHover
          onSelectedRowsChange={(state) => handleSelect(state.selectedRows[0])}
          customStyles={{
            rows: {
              style: {
                minHeight: "100px"
              }
            },
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
