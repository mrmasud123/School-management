import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthorization } from '@/hooks/use-authorization';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, NotebookTabs, Trash } from 'lucide-react';

export default function Trashed({students}) {
    const { hasRoles, can } = useAuthorization();
    const baseURL= import.meta.env.VITE_APP_URL;
    const [filterText, setFilterText] = useState('');

    const filteredUsers = students.filter(
        student =>
            student.id.toString().includes(filterText) ||
            (student.first_name && student.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
            (student.last_name && student.last_name.toLowerCase().includes(filterText.toLowerCase()))
    );

    const handleForceDelete =(studentId:number)=>{

        router.delete(`/${studentId}/force`,{
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

    const handleRestore =(studentId:number)=>{
        router.patch(`/students/${studentId}/restore`,{
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Action</Button>
                    </DropdownMenuTrigger>

                    {hasRoles(['admin', 'super admin']) && (
                        <DropdownMenuContent>
                            <DropdownMenuGroup>


                                <DropdownMenuItem
                                    onClick={()=> handleRestore(row.id)}
                                >
                                    <NotebookTabs size={16} /> Restore
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={()=> handleForceDelete(row.id)}
                                    className="text-red-600"
                                >
                                    <Trash size={16} /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
            ),
            sortable: false,
            width:"250px",
        },

    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Trashed students', href: '/trashed-students' }]}>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Trashed Students</h1>
                <div className="flex items-center gap-4 mb-4 justify-between">
                    <Link
                        href={`/students`}
                        className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        View All Student
                    </Link>

                    <div className="flex items-center">

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
                    title="Trashed Student List"
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
