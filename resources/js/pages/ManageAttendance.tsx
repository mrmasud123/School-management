import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface Student {
    id: number;
    name: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
}

// Badge configuration for DRY code
// const statusBadgeMap = {
//     present: { variant: 'success', icon: UserCheck, text: 'Present' },
//     absent: { variant: 'destructive', icon: UserX, text: 'Absent' },
//     late: { variant: 'warning', icon: UserMinus, text: 'Late' },
//     excused: { variant: 'secondary', icon: UserMinus, text: 'Excused' },
// };

// function getStatusBadge(status: Student['status']) {
//     const badge = statusBadgeMap[status];
//     const Icon = badge.icon;
//     return (
//         <Badge variant={badge.variant} className="flex items-center gap-1">
//             <Icon className="w-4 h-4" /> {badge.text}
//         </Badge>
//     );
// }

export default function ManageAttendance() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [students, setStudents] = useState<Student[]>([]);

    // const [selectedClass, setSelectedClass] = useState('');
    // const [selectedSection, setSelectedSection] = useState('');
    // const [selectedSubject, setSelectedSubject] = useState('');

    // const markAll = (status: Student['status']) => {
    //     setStudents(prev => prev.map(s => ({ ...s, status })));
    // };

    const columns: TableColumn<Student>[] = [
        {
            name: 'Name',
            cell: (row) =>
                `${row.first_name ?? 'N/A'} ${row.last_name ?? 'N/A'}`,
            sortable: true,
        },

        {
            name: 'Class',
            cell: (row) => (
                <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                    CLASS {row.student_class?.name}
                </span>
            ),
        },
        {
            name: 'Section',
            cell: (row) => (
                <span className="rounded bg-pink-500 px-2 py-1 text-xs text-white">
                    {row.section?.name}
                </span>
            ),
        },
        {
            name: 'ADM ID',
            cell: (row) => (
                <span className="rounded bg-pink-500 px-2 py-1 text-xs text-white">
                    {row.admission_no ?? 'N/A'}
                </span>
            ),
        },

        {
            name: 'Action',
            cell: (row) => (
                <div>
                    <Button
                        size="sm"
                        variant="outline"
                        // onClick={() => updateStatus(row.id, 'present')}
                    >
                        P
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        // onClick={() => updateStatus(row.id, 'absent')}
                    >
                        A
                    </Button>
                    <Button
                        size="sm"
                        variant="warning"
                        // onClick={() => updateStatus(row.id, 'late')}
                    >
                        L
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        // onClick={() => updateStatus(row.id, 'excused')}
                    >
                        E
                    </Button>
                </div>
            ),
        },
    ];
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Manage Attendance', href: '/manage-attendance' },
            ]}
        >
            <div className="space-y-8 p-8 text-slate-900 dark:text-slate-100">
                {/* Filters */}
                <div className="flex flex-col flex-wrap gap-4 rounded-lg bg-white p-6 shadow md:flex-row dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                    <Select
                    // onValueChange={setSelectedClass}
                    >
                        <SelectTrigger className="w-40 bg-white dark:bg-slate-800 dark:text-slate-100">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:text-slate-100">
                            <SelectItem value="1">Class 1</SelectItem>
                            <SelectItem value="2">Class 2</SelectItem>
                            <SelectItem value="3">Class 3</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                    // onValueChange={setSelectedSection}
                    >
                        <SelectTrigger className="w-40 bg-white dark:bg-slate-800 dark:text-slate-100">
                            <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:text-slate-100">
                            <SelectItem value="A">Section A</SelectItem>
                            <SelectItem value="B">Section B</SelectItem>
                            <SelectItem value="C">Section C</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                    // onValueChange={setSelectedSubject}
                    >
                        <SelectTrigger className="w-40 bg-white dark:bg-slate-800 dark:text-slate-100">
                            <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:text-slate-100">
                            <SelectItem value="math">Math</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Calendar + Summary */}
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Calendar */}
                    <div className="rounded-lg bg-white p-4 shadow dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                        <Calendar
                            selected={date}
                            onSelect={setDate}
                            className="dark:bg-slate-900"
                        />
                    </div>

                    {/* Summary + Actions */}
                    <div className="flex flex-1 flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200 p-4 shadow dark:border dark:border-slate-800 dark:from-indigo-900/40 dark:to-indigo-800/40 dark:shadow-none">
                                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                                    Total Students
                                </p>
                                <p className="text-2xl font-bold">0</p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="dark:border-slate-700 dark:text-slate-200"
                                    // onClick={() => markAll('present')}
                                >
                                    Mark All Present
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="dark:bg-red-600 dark:hover:bg-red-700"
                                    // onClick={() => markAll('absent')}
                                >
                                    Mark All Absent
                                </Button>
                            </div>
                        </div>

                        {/* Attendance Table */}
                        <div className="rounded-lg bg-white p-6 shadow dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                            <DataTable
                                columns={columns}
                                data={students}
                                highlightOnHover
                                pointerOnHover
                                customStyles={{
                                    table: {
                                        style: {
                                            borderTopRightRadius: '10px',
                                            borderTopLeftRadius: '10px',
                                            overflow: 'hidden',
                                        },
                                    },
                                    rows: { style: { minHeight: '100px' } },
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
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
