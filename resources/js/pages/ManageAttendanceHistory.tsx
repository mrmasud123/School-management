import AttendanceDrawer from '@/components/custom/AttendanceDrawer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuthorization } from '@/hooks/use-authorization';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, Clipboard, Edit, User, Users } from 'lucide-react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';

interface AttendanceRow {
    id: number;
    student: {
        first_name: string;
        last_name: string;
        admission_no: string;
    };
    status: 'present' | 'absent';
    class: { name: string };
    section: { name: string };
    attendance_date: string;
}

interface Props {
    all_classes: any[];
    attendances: {
        data: AttendanceRow[];
        total: number;
        per_page: number;
        current_page: number;
    };
}

export default function AttendanceHistory({ all_classes, attendances }: Props) {
    console.log('Attendances from server:', attendances);
    const { can, hasRoles } = useAuthorization();
    const [sections, setSections] = useState<any[]>([]);
    const [classId, setClassId] = useState<string | null>(null);
    const [sectionId, setSectionId] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingRow, setEditingRow] = useState<AttendanceRow | null>(null);
    const [editStudents, setEditStudents] = useState<any[]>([]);
    const [loadingEditData, setLoadingEditData] = useState(false);

    const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(
        new Date(),
    );

    const [perPage, setPerPage] = useState(10);
    const [loadingSections, setLoadingSections] = useState(false);

    const fetchAttendance = (
        page = 1,
        per_page = perPage,
        overrides?: {
            class_id?: string | null;
            section_id?: string | null;
            attendance_date?: string | null;
        },
    ) => {
        router.get(
            '/manage-attendance/history/data',
            {
                page,
                per_page,
                class_id: overrides?.class_id ?? classId,
                section_id: overrides?.section_id ?? sectionId,
                attendance_date:
                    overrides?.attendance_date ??
                    (attendanceDate ? formatLocalDate(attendanceDate) : null),
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    function formatLocalDate(date: Date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    const handleClassChange = async (value: string) => {
        setClassId(value);
        setSectionId(null);
        setSections([]);
        setLoadingSections(true);

        fetchAttendance(1, perPage, {
            class_id: value,
            section_id: null,
            attendance_date: formatLocalDate(attendanceDate as Date),
        });

        try {
            const res = await axios.get(
                `/fetch-sections-student-admission/${value}`,
            );
            setSections(res.data.sections ?? []);
        } catch (e) {
            console.error('Failed to fetch sections', e);
            setSections([]);
        } finally {
            setLoadingSections(false);
        }
    };

    const handleSectionChange = async (value: string) => {
        setSectionId(value);
        fetchAttendance(1, perPage, {
            class_id: classId,
            section_id: value,
            attendance_date: formatLocalDate(attendanceDate as Date),
        });
    };

    const handleEditClick = async (row: AttendanceRow) => {
        setEditingRow(row);
        setDrawerOpen(true);
        setLoadingEditData(true);

        try {
            const res = await axios.get(`/manage-attendance/edit-data`, {
                params: {
                    class_id: row.class?.id,
                    section_id: row.section?.id,
                    attendance_date: row?.attendance_date,
                },
            });

            setEditStudents(res.data.students);
            console.log(res);
        } catch (e) {
            console.log(e);
            console.error('Failed to load attendance', e);
        } finally {
            setLoadingEditData(false);
        }
    };

    const columns: TableColumn<AttendanceRow>[] = [
        {
            name: 'Student',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                        <User size={14} />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                        {row.student.first_name} {row.student.last_name}
                    </span>
                </div>
            ),
        },
        {
            name: 'Admission No',
            selector: (row) => row.student.admission_no,
            cell: (row) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    #{row.student.admission_no}
                </span>
            ),
        },
        {
            name: 'Class',
            cell: (row) => (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <Clipboard size={14} className="text-gray-400" />
                    Class - {row.class.name}
                </div>
            ),
        },
        {
            name: 'Section',
            cell: (row) => (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <Users size={14} className="text-gray-400" />
                    {row.section.name}
                </div>
            ),
        },
        {
            name: 'Date',
            cell: (row) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(row.attendance_date).toLocaleDateString()}
                </span>
            ),
        },
        {
            name: 'Status',
            cell: (row) => (
                <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        row.status === 'present'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                    }`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Action',
            cell: (row) => (
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleEditClick(row)}
                >
                    <Edit size={16} className="mr-1 text-green-600" />
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Attendance History',
                    href: '/manage-attendance/history',
                },
            ]}
        >
            <div className="space-y-6 p-8">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 rounded bg-white p-6 shadow">
                    <Select onValueChange={handleClassChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {all_classes.map((cls) => (
                                <SelectItem key={cls.id} value={String(cls.id)}>
                                    Class {cls.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        disabled={!sections.length || loadingSections}
                        onValueChange={handleSectionChange}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                            {sections.map((sec) => (
                                <SelectItem key={sec.id} value={String(sec.id)}>
                                    {sec.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-[200px] justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {attendanceDate
                                    ? format(attendanceDate, 'PPP')
                                    : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={attendanceDate}
                                onSelect={(date) => {
                                    setAttendanceDate(date);

                                    fetchAttendance(1, perPage, {
                                        class_id: classId,
                                        section_id: sectionId,
                                        attendance_date: date
                                            ? formatLocalDate(date)
                                            : null,
                                    });
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Table */}
                <div className="rounded bg-white p-6 shadow">
                    <DataTable
                        columns={columns}
                        data={attendances.data}
                        pagination
                        paginationServer
                        paginationTotalRows={attendances.total}
                        paginationPerPage={attendances.per_page}
                        paginationDefaultPage={attendances.current_page}
                        onChangePage={(page) => fetchAttendance(page)}
                        onChangeRowsPerPage={(rows, page) => {
                            setPerPage(rows);
                            fetchAttendance(page, rows);
                        }}
                        highlightOnHover
                    />
                </div>
            </div>

            <AttendanceDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                loading={loadingEditData}
                students={editStudents}
                editingRow={editingRow}
                onChangeStudents={setEditStudents}
                onSave={async () => {
                    Swal.fire({
                        title: 'Updating Attendances',
                        text: 'Please wait...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });
                    await axios
                        .put('/manage-attendance/update', {
                            attendance_date: editingRow?.attendance_date,
                            class_id: editingRow?.class?.id,
                            section_id: editingRow?.section?.id,
                            students: editStudents,
                        })
                        .then(() => {
                            Swal.close();
                            Swal.fire({
                                title: 'Success',
                                text: 'Attendance updated successfully',
                                icon: 'success',
                                timer: 2000,
                                showConfirmButton: false,
                            });
                        })
                        .catch((error) => {
                            Swal.close();
                            Swal.fire({
                                title: 'Error',
                                text: 'Something went wrong',
                                icon: 'error',
                            });
                        });

                    setDrawerOpen(false);
                    fetchAttendance();
                }}
            />
        </AppLayout>
    );
}
