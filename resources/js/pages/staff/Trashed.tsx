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
import toast from 'react-hot-toast';

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  staff_type: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  joining_date: string; 
  is_active: boolean;
  photo_url: string; 
}
interface TeacherProps {
  staffs: Teacher[];
}

export default function Trashed({ staffs }: TeacherProps) {
  console.log(staffs)
  const [filterText, setFilterText] = useState('');
  const [selectTeachers, setSelectTeachers] = useState<Teacher[]>([]);
  const filteredUsers = staffs.filter(
    teacher =>
      teacher.id.toString().includes(filterText) ||
      (teacher.first_name && teacher.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
      (teacher.last_name && teacher.last_name.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleSelect = (selectedTeachers: Teacher) => {
    setSelectTeachers(prev => [...prev, selectedTeachers]);
  };
  
  const handleRestore = (staffId: number) => {
      router.patch(`/staff-management/restore/${staffId}`, {}, {
      onSuccess: () => {
        toast.success('Staff restored successfully!');
      },
      onError: (errors) => {
        toast.error('Failed to restore staff');
      },
    });
  };
  
  const handleDelete = (staff: number) => {
 
    router.delete(`${staff}/staff-force`, {
      onSuccess: (data) => {
        toast.success("Staff deleted successfully");
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
      cell: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: 'Designation',
      selector: row => row.staff_type || 'N/A',
    },
    {
      name: 'Contact',
      selector: row => row.phone || 'N/A',
    },
        {
      name: 'Photo',
      cell: (row) => (
        <div className="w-16 h-16 overflow-hidden rounded-md">
          <img
            src={row.photo_url}
            alt={`${row.first_name} ${row.last_name}'s photo`}
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
                          <Button 
                              onClick={()=> handleRestore(row.id)}
                  className="px-3 flex items-center w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200">
                  Restore
                <DropdownMenuShortcut><Edit className='text-white' /></DropdownMenuShortcut>
                </Button>
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


  return (
    <AppLayout breadcrumbs={[{ title: 'Trashed Staffs', href: '/staff-management' }]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Trashed Staffs</h1>
        <div className="flex items-center gap-4 mb-4 justify-between">
          <div className="flex items-center gap-4">
            
            <Link
              href={`/staff-management`}
              className="cursor-pointer px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 me-2"
            >
              View all staffs
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
          title="Staff List"
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
