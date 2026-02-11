import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface ExamSchedule {
    id: number;
    exam_name: string;
    class_id: number;
    section_id: number;
    subject_id: number;
    academic_year_id: number;
    exam_date: string;
    start_time: string;
    end_time: string;
    room: string;
    status: number;
    created_by: number;
    school_class: {
        id: number;
        name: string;
    };
    section: {
        id: number;
        name: string;
    };
    subject: {
        id: number;
        name: string;
    };
    academic_year: {
        id: number;
        name: string;
    };
}

const customStyles = {
    table: {
        style: {
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            overflow: 'hidden',
        },
    },
    headRow: {
        style: {
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
        },
    },
    headCells: {
        style: {
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: '#475569',
            paddingLeft: '20px',
            paddingRight: '20px',
        },
    },
    rows: {
        style: {
            minHeight: '70px',
            fontSize: '14px',
            color: '#0f172a',
            backgroundColor: '#ffffff',
        },
        highlightOnHoverStyle: {
            backgroundColor: '#f1f5f9',
            cursor: 'pointer',
        },
    },
    cells: {
        style: {
            paddingLeft: '20px',
            paddingRight: '20px',
        },
    },
    pagination: {
        style: {
            borderTop: '1px solid #e5e7eb',
            padding: '12px',
        },
    },
};

interface ExamSchedule {
    schedules: ExamSchedule[];
}

export default function Index({ schedules }: ExamSchedule) {
    console.log(schedules);
    const columns: TableColumn<ExamSchedule>[] = [
        {
            name: 'Exam',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">
                        {row.exam_name}
                    </span>
                    <span className="text-xs text-slate-500">
                        Room {row.room}
                    </span>
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Class',
            cell: (row) => (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {row.school_class.name}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Section',
            cell: (row) => (
                <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    Section {row.section.name}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Subject',
            cell: (row) => (
                <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                    {row.subject.name}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Date',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-700">
                        {row.exam_date}
                    </span>
                    <span className="text-xs text-slate-500">
                        {row.academic_year.name}
                    </span>
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Time',
            cell: (row) => (
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                    <div className="text-sm font-semibold text-slate-700">
                        {row.start_time}
                    </div>
                    <div className="text-xs text-slate-500">
                        to {row.end_time}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Subjects', href: '/subjects' }]}>
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">All Subject</h1>
                <div className="mb-4 flex items-center justify-between gap-4">
                    <Link
                        href={`/exam-schedule/create/`}
                        className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        Create Exam Schedule
                    </Link>
                </div>

                <DataTable
                    title="📅 Exam Schedule List"
                    columns={columns}
                    data={schedules}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>
        </AppLayout>
    );
}
