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
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { UserCheck, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    admission_no: string;
    student_class: {
        name: string;
    };
    section: {
        name: string;
    };
    status: 'present' | 'absent';
    remarks?: string;
}

interface AllClass {
    id: number;
    name: string;
}

interface PropList {
    all_classes: AllClass[];
}
export default function ManageAttendance({ all_classes }: PropList) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [students, setStudents] = useState<Student[]>([]);
    const [sections, setSections] = useState<any>([]);
    const [loadSection, setLoadSection] = useState(false);
    const [loadStudents, setLoadStudents] = useState(false);
    const [attendanceAvailable, setAttendanceAvailable] = useState(false);

    const { setData, data, post } = useForm({
        class_id: '',
        section_id: '',
        date: new Date().toISOString().split('T')[0],
        students: students,
    });

    useEffect(() => {
        setData('students', students);
    }, [students]);

    const updateStatus = (studentId: number, status) => {
        setStudents((prev) =>
            prev.map((student) =>
                student.id === studentId
                    ? {
                          ...student,
                          status:
                              student.status === status ? undefined : status,
                      }
                    : student,
            ),
        );
    };

    const markAll = (status: Student['status']) => {
        setStudents((prev) => prev.map((student) => ({ ...student, status })));
    };

    function formatLocalDate(date: Date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    console.log(date);

    const getDateWiseAttendance = (
        selectedDate: Date,
        classId?: string,
        sectionId?: string,
    ) => {
        const formattedDate = formatLocalDate(selectedDate);
        setDate(selectedDate);

        const cId = classId ?? data.class_id;
        const sId = sectionId ?? data.section_id;

        setData((prev) => ({
            ...prev,
            class_id: cId,
            section_id: sId,
            date: formattedDate,
        }));

        Swal.fire({
            title: 'Checking Attendance...',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        axios
            .get(
                `/manage-attendance/check-date-wise/${formattedDate}/${cId}/${sId}`,
            )
            .then((res) => {
                if (res.data) {
                    setAttendanceAvailable(false);
                    Swal.fire({
                        title: 'Attendance Already Marked',
                        text: 'Attendance already marked for this date',
                        icon: 'warning',
                        confirmButtonText: 'OK',
                    });
                } else {
                    setAttendanceAvailable(true);
                    Swal.fire({
                        title: 'Attendance Not Marked',
                        text: 'Attendance not marked for this date',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                setAttendanceAvailable(false);
                Swal.close();
            });
    };

    const columns: TableColumn<Student>[] = [
        {
            name: 'Name',
            cell: (row) =>
                `${row.first_name ?? 'N/A'} ${row.last_name ?? 'N/A'}`,
            sortable: true,
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
                <div className="flex gap-2">
                    <button
                        title="Present"
                        onClick={() => updateStatus(row.id, 'present')}
                        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-green-500 transition ${
                            row.status === 'present'
                                ? 'bg-green-700 text-white'
                                : 'bg-transparent text-green-600 hover:bg-green-100'
                        } `}
                    >
                        <UserCheck size={16} />
                    </button>

                    <button
                        title="Absent"
                        onClick={() => updateStatus(row.id, 'absent')}
                        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-red-500 transition ${
                            row.status === 'absent'
                                ? 'bg-red-700 text-white'
                                : 'bg-transparent text-red-600 hover:bg-red-100'
                        } `}
                    >
                        <UserX size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const handleClassChange = async (value: string) => {
        setAttendanceAvailable(false);
        setData({
            class_id: value,
            section_id: '',
            date: new Date(),
        });
        Swal.fire({
            title: 'Fetching Sections...',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        setLoadSection(true);
        setSections([]);
        setStudents([]);

        try {
            const response = await axios.get(
                `/fetch-sections-student-admission/${value}`,
            );
            setSections(response.data.sections);

            Swal.close();
        } catch {
            toast.error('Failed to load sections');
            Swal.close();
        } finally {
            setLoadSection(false);
            Swal.close();
        }
    };

    const handleSectionChange = async (value: string) => {
        const today = new Date();
        const formattedDate = formatLocalDate(today);

        setData({
            class_id: data.class_id,
            section_id: value,
            date: formattedDate,
            students: students,
        });

        setAttendanceAvailable(false);
        Swal.fire({
            title: 'Fetching Students...',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        setLoadStudents(true);
        setStudents([]);

        try {
            const response = await axios.get(`/fetch-students/${value}`);
            const studentsWithNullStatus = response.data.students.map(
                (student: any) => ({
                    ...student,
                    status: null,
                }),
            );
            setStudents(studentsWithNullStatus);

            getDateWiseAttendance(today, data.class_id, value);

            Swal.close();
        } catch {
            toast.error('Failed to load students');
            Swal.close();
        } finally {
            setLoadStudents(false);
            Swal.close();
        }
    };

    const submit = () => {
        console.log(data);
        if (!attendanceAvailable) {
            toast.error('Attendance already marked for this date');
            return;
        }

        post('/manage-attendance', {
            preserveScroll: true,
            onSuccess: (page) => {
                toast.success('Attendance recorded successfully');
                window.location.reload();
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Manage Attendance', href: '/manage-attendance' },
            ]}
        >
            <div className="space-y-8 p-8 text-slate-900 dark:text-slate-100">
                <div className="flex flex-col flex-wrap gap-4 rounded-lg bg-white p-6 shadow md:flex-row dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                    <Select onValueChange={handleClassChange}>
                        <SelectTrigger className="w-40 bg-white dark:bg-slate-800 dark:text-slate-100">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:text-slate-100">
                            {all_classes.map((cls) => (
                                <SelectItem key={cls.id} value={String(cls.id)}>
                                    Class - {cls.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={handleSectionChange}
                        disabled={loadSection || sections.length === 0}
                    >
                        <SelectTrigger className="w-40 bg-white dark:bg-slate-800 dark:text-slate-100">
                            <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:text-slate-100">
                            {sections.map((section) => (
                                <SelectItem
                                    key={section.id}
                                    value={String(section.id)}
                                >
                                    {section.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col items-start gap-6 md:flex-row">
                    <div className="rounded-lg bg-white p-4 shadow dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                        <Calendar
                            selected={date}
                            onSelect={(date) => {
                                if (date) {
                                    getDateWiseAttendance(
                                        date,
                                        data.class_id,
                                        data.section_id,
                                    );
                                }
                            }}
                            className="dark:bg-slate-900"
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200 p-4 shadow dark:border dark:border-slate-800 dark:from-indigo-900/40 dark:to-indigo-800/40 dark:shadow-none">
                                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                                    Total Students
                                </p>
                                <p className="text-2xl font-bold">
                                    {students.length}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    disabled={!attendanceAvailable}
                                    onClick={submit}
                                    className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                >
                                    Record Attendance
                                </Button>

                                <Button
                                    onClick={() => markAll('present')}
                                    variant="outline"
                                    className="cursor-pointer border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500/10"
                                >
                                    Mark All Present
                                </Button>

                                <Button
                                    onClick={() => markAll('absent')}
                                    variant="outline"
                                    className="cursor-pointer border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                    Mark All Absent
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                            <DataTable
                                columns={columns}
                                data={students}
                                highlightOnHover
                                customStyles={{
                                    table: {
                                        style: {
                                            borderTopRightRadius: '10px',
                                            borderTopLeftRadius: '10px',
                                            overflow: 'hidden',
                                        },
                                    },
                                    rows: { style: { minHeight: '50px' } },
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
