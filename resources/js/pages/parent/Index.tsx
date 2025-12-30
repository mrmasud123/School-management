import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
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
import { students } from '@/routes/section/wise';
interface StudentsProps {
    parents: ParentAccount[];
}

interface ParentAccount {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    students: {
        id: number,
        first_name: string,
        last_name: string,
        student_class: {
            id: number,
            name:string
        },
        section:{
            id: number,
            name: string
        }
    }[],
    student_class: { id: number; name: string; } | null;
    section: { id: number; name: string; } | null;
    email: string;
    address: string | null;
    is_active: number;
}
export default function Index({ parents }: StudentsProps) {
    console.log(parents)
    const baseURL = import.meta.env.VITE_APP_URL;
    const [filterText, setFilterText] = useState('');

    const filteredUsers = parents.filter(
        parent =>
            parent.id.toString().includes(filterText) ||
            (parent.first_name && parent.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
            (parent.last_name && parent.last_name.toLowerCase().includes(filterText.toLowerCase()))
    );
    
    const columns: TableColumn<ParentAccount>[] = [
        // { name: 'ID', selector: row => row.id, sortable: true },
        {
            name: 'Parent name',
            cell: row => `${row.first_name} ${row.last_name}`,
            sortable: true
        },
        {
            name: 'Contact',
            cell: row => row.phone,
            sortable: false,
        },
        {
            name: 'E-mail',
            cell: row => row.email,
            sortable: false,
        },
        {
            name: 'Assigned Students',
            cell: row => (
                <div className="flex flex-wrap gap-2 max-w-xs">
                    {row?.students?.length ? (
                        row.students.map((student, index) => (
                            <span
                                key={index}
                                className="
                                    inline-flex items-center gap-2
                                    px-3 py-1 rounded-full
                                    bg-gradient-to-r from-blue-500 to-indigo-500
                                    text-white text-xs font-medium
                                    shadow-sm
                                    hover:from-indigo-500 hover:to-blue-500
                                    transition
                                "
                            >
                                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-[10px]">
                                    {student.first_name.charAt(0)}
                                    {student.last_name.charAt(0)}
                                </span>
                                {student.first_name} {student.last_name} <br /> Class: { student?.student_class?.name} <br /> Section: {student?.section?.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 italic text-sm">
                            No students assigned
                        </span>
                    )}
                </div>
            )
        },
        
        {
            name: 'Account Status',
            width: '150px',
            cell: row => (
                <Select
                    value={String(row.is_active)}
                    // onValueChange={(value) => updateStatus(row.id, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Deactive</SelectItem>
                    </SelectContent>
                </Select>
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
                                <Link
                                    href={`/parent-accounts/${row.id}/edit`}
                                    className="px-3 flex items-center w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                                >
                                    Edit
                                    <DropdownMenuShortcut><Edit className='text-white' /></DropdownMenuShortcut>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer'>
                                <Link
                                    href={`/parent-accounts/student-parent-mapping/${row.id}`}
                                    className="px-3 flex items-center w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                                >
                                    Assign Student
                                    <DropdownMenuShortcut><Edit className='text-white ms-1' /></DropdownMenuShortcut>
                                </Link>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem className='cursor-pointer'>
                                <Button
                                    // onClick={() => handleDelete(row.id)}
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

            sortable: false
        },

    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Parents', href: '/parent-accounts' }]}>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Parents</h1>
                <div className="flex items-center gap-4 mb-4 justify-between">
                    <Link
                        href={`/parent-accounts/create/`}
                        className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        Create New Parent Account
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
                    
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    // selectableRows
                    highlightOnHover
                    pointerOnHover
                    customStyles={{
                        rows: {
                            style: {
                                minHeight: "130px"
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
