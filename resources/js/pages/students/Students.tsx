import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Button } from '@/components/ui/button';

export default function Students({students}) {
    console.log(students);
    const baseURL= import.meta.env.VITE_APP_URL;
    // const updateStatus = (id, status) => {
    //     router.put(`/students/${id}/status`, { status }, {
    //         onSuccess: () => toast.success("Status updated"),
    //         onError: () => toast.error("Update failed")
    //     });
    // };
  const [filterText, setFilterText] = useState('');

  const filteredUsers = students.filter(
    student =>
      student.id.toString().includes(filterText) ||
      (student.first_name && student.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
      (student.last_name && student.last_name.toLowerCase().includes(filterText.toLowerCase()))
  );
    const downloadIdCard = (id) => {
        window.open(`/students/idcard/${id}`, "_blank");
    };

    const handleDelete =(studentId:number)=>{

        router.delete(`students/${studentId}`,{
            onSuccess:(data)=>{
                console.log(data);
            },
            onFinish:()=>{
                console.log("Fininshed!");
            },
            onError:(errors)=>{
                console.log(errors);
            },
        });
    }
    const columns: TableColumn<[]>[] = [
    // { name: 'ID', selector: row => row.id, sortable: true },
    {
        name: 'Name',
        cell: row => `${row.first_name} ${row.last_name}`,
        sortable: true },
    {
      name: 'Guardian Contact',
      cell: row => row.guardian_phone,
      sortable: false,
    },

    {
        name: 'Class Level',
        // center:true,
        cell: row => (
            <span className={'p-2 bg-blue-500 text-white text-xs rounded-md'}>CLASS {row.student_class?.name}</span>
        ),
        sortable: true },
        {
            name: 'Section',
            // center:true,
            cell: row => (
                <span className={'p-2 bg-pink-500 text-white text-xs rounded-md'}>{row.section?.name}</span>
        ),
        sortable: true },
        {
            name : 'Admission Status',
            width:'150px',
            cell: row => (
                <Select
                    value={row.status}
                    // onValueChange={(value) => updateStatus(row.id, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            ),
        },
        {
            name: 'Student Image',
            cell: row => (
                <div className="w-20 h-20 overflow-hidden rounded-md">
                    <img
                        src={`${baseURL}/storage/${row.photo ?? ''}`}
                        className="w-full h-full object-cover"
                        alt="Student"
                    />
                </div>
            )
        },


        {
      name: 'Action',

            cell: row => (
                <div className="flex gap-2">
                    <Link
                        href={`/students/${row.id}/edit`}
                        className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                    >
                        Edit
                    </Link>

                    <Button
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                        onClick={() => downloadIdCard(row.id)}
                    >
                        Download ID Card
                    </Button>

                    <button
                        onClick={()=> handleDelete(row.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            ),

            sortable: false,
      width: '350px',
    },

  ];

  return (
    <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Students</h1>
        <div className="flex items-center gap-4 mb-4 justify-between">
          <Link
            href={`/students/create/`}
            className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Admit Student
          </Link>

            <div className="flex items-center">
                <Link
                    href={`/trashed-students`}
                    className="cursor-pointer px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 me-2"
                >
                    View trashed students
                </Link>
                <input
                    type="text"
                    placeholder="Search by ID, name, or email"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    className="px-3 py-1  border border-gray-300 rounded"
                />
            </div>
        </div>


         <DataTable
          title="Student List"
          columns={columns}
          data={filteredUsers}
          pagination
          // selectableRows
          highlightOnHover
          pointerOnHover
          customStyles={{
              rows: {
                  style:{
                      minHeight : "100px"
                  }
              },
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
