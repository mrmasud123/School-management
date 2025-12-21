import React, { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';
export default function ClassWiseStudents({students,stdntClass}) {
    console.log(students,stdntClass);
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
            (
                student.first_name && student.first_name.toLowerCase().includes(filterText.toLowerCase())) ||(student.last_name && student.last_name.toLowerCase().includes(filterText.toLowerCase())
                || (student?.sections?.name && student?.sections?.name.toLowerCase().includes(filterText.toLowerCase()))
            )
    );

    const columns: TableColumn<[]>[] = [
        // { name: 'ID', selector: row => row.id, sortable: true },
        {
            name: 'Name',
            cell: row => `${row.first_name} ${row.last_name}`,
            sortable: true
        },
        {
            name: 'Admission No',
            sortable: true,
            cell: (row) => {
                const value = row.admission_no;

                const handleCopy = () => {
                    // extract digits only
                    const integerPart = value.replace(/\D/g, '');

                    if (integerPart) {
                        navigator.clipboard.writeText(integerPart);
                        toast.success("Admission Number Copied!");
                    }
                };

                return (
                    <span
                        onClick={handleCopy}
                        className="cursor-pointer text-blue-600 hover:underline"
                        title="Click to copy admission number"
                    >
                {value}
            </span>
                );
            },
        }
        ,

        {
            name: 'Guardian Contact',
            cell: row => row.guardian_phone,
            sortable: false,
        },
        {
            name: 'Class Level',
            center:true,
            cell: row => (
                <span className={'p-2 bg-blue-500 text-white text-xs rounded-md'}>CLASS {row.student_class?.name}</span>
            ),
            sortable: true },
        {
            name: 'Section',
            // center:true,
            cell: row => (
                <span className={'p-2 bg-pink-500 text-white text-xs rounded-md'}>{row.sections?.name}</span>
            ),
            sortable: true },
        {
            name : 'Admission Status',
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

    ];


    return (
        <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>
   
            
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Class <span className={`bg-green-500 text-white dark:text-white rounded-md px-3 py-1`}>{stdntClass?.name}</span> students</h1>

                <div className="flex items-center gap-4 mb-4 justify-between">
                    <Link
                        href={`/classes`}
                        className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        View Classes
                    </Link>

                    <input
                        type="text"
                        placeholder="Search by ID, name, or email"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    />
                </div>
                
                <div className="">
            <h1 className="text-2xl font-bold mb-4">Assigned Sections</h1>

                {stdntClass.sections?.length === 0 ? (
                    <p className="text-gray-500">
                        No section assigned to this class.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {stdntClass.sections?.map((section) => (
                            <div
                                key={section.id}
                                className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
                            >
                                <h3 className="text-lg font-bold text-gray-800">
                                    {section.name}
                                </h3>

                                <span className="inline-block mt-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                    Active
                                </span>

                                <p className="mt-3 text-xs text-gray-500">
                                    Assigned on{' '}
                                    {new Date(
                                        section.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
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
