import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { useAuthorization } from '@/hooks/use-authorization';
import { DownloadIcon, Edit, NotebookTabs } from 'lucide-react';
import toast from 'react-hot-toast';
interface Teacher {
    id: number;
    first_name: string;
    last_name: string;
    photo_url?: string | null;
}

interface TeacherAssignment {
    teacher: Teacher;
}

interface Subject {
    id: number;
    name: string;
    created_at: string;
    pivot: {
        section_id: number;
        subject_id: number;
    };
    teacher_assignments: TeacherAssignment | null;
}

interface Section {
    id: number;
    class_id: number;
    name: string;
    subjects: Subject[];
}

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    admission_no: string;
    email: string;
    guardian_phone: string;
    status: 'pending' | 'approved' | 'rejected';
    photo?: string | null;
    student_class?: { name: string };
    section?: { name: string };
}
interface SectionSubjects {
    id: number;
    name: string;
}
interface StudentsProps {
    students: Student[];
    section: Section;
}
export default function Students({ students, section }: StudentsProps) {
    const { can, canAny, hasRoles } = useAuthorization();
    console.log(section);
    const baseURL = import.meta.env.VITE_APP_URL as string;
    const [filterText, setFilterText] = useState('');
    const [removing, setRemoving] = useState(false);
    const [sectionSubjects, setSectionSubjects] =
        useState<SectionSubjects | null>(null);
    const updateStatus = (id: number, status: string) => {
        router.put(
            `/students/${id}/status`,
            { status },
            {
                onSuccess: () => toast.success('Status updated'),
                onError: () => toast.error('Update failed'),
            },
        );
        console.log(status);
    };

    const filteredUsers = students.filter((student) => {
        const fullName =
            `${student.first_name} ${student.last_name}`.toLowerCase();
        const search = filterText.toLowerCase();

        return (
            student.id.toString().includes(search) ||
            fullName.includes(search) ||
            student.email.toLowerCase().includes(search)
        );
    });

    const downloadIdCard = (id: number) => {
        window.open(`/students/idcard/${id}`, '_blank');
    };

    const columns: TableColumn<Student>[] = [
        {
            name: 'Name',
            cell: (row) => `${row.first_name} ${row.last_name}`,
            sortable: true,
        },
        {
            name: 'Admission No',
            cell: (row) => (
                <span
                    onClick={() => {
                        navigator.clipboard.writeText(row.admission_no);
                        toast.success('Admission Number Copied!');
                    }}
                    className="cursor-pointer text-blue-600 hover:underline"
                >
                    {row.admission_no}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Guardian Contact',
            cell: (row) => row.guardian_phone,
        },
        {
            name: 'Class Level',
            // center: true,
            cell: (row) => (
                <span className="rounded-md bg-blue-500 px-2 py-1 text-xs text-white">
                    CLASS {row.student_class?.name ?? 'N/A'}
                </span>
            ),
        },
        {
            name: 'Section',
            cell: (row) => (
                <span className="rounded-md bg-pink-500 px-2 py-1 text-xs text-white">
                    {row.section?.name ?? 'N/A'}
                </span>
            ),
        },
        {
            name: 'Admission Status',
            cell: (row) => (
                <Select
                    value={row.status}
                    onValueChange={(value) => updateStatus(row.id, value)}
                >
                    <SelectTrigger>
                        <SelectValue />
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
            name: 'Photo',
            cell: (row) => (
                <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img
                        src={
                            row.photo
                                ? `${baseURL}/storage/${row.photo}`
                                : '/images/avatar.png'
                        }
                        className="h-full w-full object-cover"
                    />
                </div>
            ),
        },
        {
            name: 'Action',
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={`cursor-pointer ${hasRoles(['admin', 'super admin']) ? '' : 'bg-red-400'}`}
                        >
                            {hasRoles(['admin', 'super admin'])
                                ? 'Action'
                                : 'Not allowed'}
                        </Button>
                    </DropdownMenuTrigger>
                    {hasRoles(['admin', 'super admin']) && (
                        <DropdownMenuContent className="" align="start">
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer">
                                            <Edit className="text-white" />
                                    <Link
                                        href={`/students/${row.id}/edit`}
                                        className="flex items-center gap-2"
                                    >
                                        Edit
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => downloadIdCard(row.id)} className="cursor-pointer">
                                            <DownloadIcon className="text-white" />ID Card

                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
            ),
        },
    ];

    const removeSubject = async (
        classId: number,
        sectionId: number,
        subjectId: number,
        teacherId: number,
    ) => {
        console.log(classId, sectionId, subjectId, teacherId);

        router.delete('/section-subject-teacher-mapping-remove', {
            data: {
                class_id: classId,
                section_id: sectionId,
                subject_id: subjectId,
                teacher_id: teacherId,
            },
            onSuccess: () => {
                toast.success('Subject removed successfully!');
            },
            onError: () => {
                toast.error('Failed to remove subject');
            },
        });
    };

    const handleRemoveSubject = (sectionId: number, subjectId: number) => {
        // if (!sectionSubjects) return;

        router.delete(`/subject-mapping/${sectionId}/${subjectId}`, {
            onSuccess: (data) => {
                toast.success('Subject removed successfully!');
                console.log(data);
                setSectionSubjects((prevState) => {
                    if (!prevState) return prevState;

                    return {
                        ...prevState,
                        subjects: prevState.subjects.filter(
                            (sub) => sub.id !== subjectId,
                        ),
                    };
                });
            },
            onError: (err) => {
                toast.error(Object.values(err)[0] as string);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Students', href: '/students' }]}>
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">
                    Assigned Subjects for Section{' '}
                    <span className="rounded-md bg-green-500 px-3 py-1 text-white">
                        {section?.name}
                    </span>
                </h1>
                {section?.subjects?.length === 0 ? (
                    <p className="text-gray-500">
                        No subjects assigned to this section.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {section.subjects?.map((subject) => {
                            const isAssigned = !!subject.teacher_assignments;

                            return (
                                <div
                                    key={subject.id}
                                    className={`flex h-full flex-col rounded-lg border p-4 shadow-sm transition ${isAssigned ? 'bg-white' : 'border-red-400 bg-red-50'}`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {subject.name}
                                            </h3>

                                            <p
                                                className={`mt-1 text-sm ${
                                                    isAssigned
                                                        ? 'text-gray-600'
                                                        : 'font-medium text-red-600'
                                                }`}
                                            >
                                                Teacher:{' '}
                                                {isAssigned
                                                    ? `${subject.teacher_assignments!.teacher?.first_name}
                                   ${subject.teacher_assignments!.teacher?.last_name}`
                                                    : 'Not Assigned'}
                                            </p>
                                        </div>

                                        {/* Teacher Avatar */}
                                        <img
                                            className="h-12 w-12 shrink-0 rounded-full border object-cover"
                                            src={
                                                subject.teacher_assignments
                                                    ?.teacher?.photo_url ??
                                                '/images/avatar.png'
                                            }
                                            alt="Teacher"
                                        />
                                    </div>

                                    {/* Meta */}
                                    <p className="mt-2 text-xs text-gray-500">
                                        Assigned on{' '}
                                        {new Date(
                                            subject.created_at,
                                        ).toLocaleDateString()}
                                    </p>

                                    {/* Actions */}
                                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                                        {can('subject.remove-mapping') && (
                                            <Button
                                                type="button"
                                                disabled={removing}
                                                onClick={() =>
                                                    handleRemoveSubject(
                                                        subject.pivot
                                                            .section_id,
                                                        subject.pivot
                                                            .subject_id,
                                                    )
                                                }
                                                className="bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                            >
                                                {removing ? (
                                                    <>
                                                        <Spinner className="mr-1 h-3 w-3" />
                                                        Removing
                                                    </>
                                                ) : (
                                                    'Remove Subject'
                                                )}
                                            </Button>
                                        )}

                                        {can('subject.remove-mapping') &&
                                            subject.teacher_assignments && (
                                                <Button
                                                    type="button"
                                                    disabled={removing}
                                                    onClick={() =>
                                                        removeSubject(
                                                            section.class_id,
                                                            subject.pivot
                                                                .section_id,
                                                            subject.pivot
                                                                .subject_id,
                                                            Number(
                                                                subject
                                                                    .teacher_assignments
                                                                    ?.teacher
                                                                    ?.id,
                                                            ),
                                                        )
                                                    }
                                                    className="bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                                                >
                                                    Remove Mapping
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">
                    Section{' '}
                    <span className="rounded-md bg-green-500 px-3 py-1 text-white">
                        {section?.name}
                    </span>{' '}
                    Students
                </h1>

                <div className="mb-4 flex items-center justify-between gap-4">
                    <Link
                        href="/sections"
                        className="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                        View Sections
                    </Link>

                    <input
                        type="text"
                        placeholder="Search by ID, name, or email"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="rounded border p-2"
                    />
                </div>

                <DataTable
                    title="Student List"
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    highlightOnHover
                    customStyles={{
                        rows: {
                            style: {
                                minHeight: '100px',
                            },
                        },
                        header: {
                            style: {
                                borderTopLeftRadius: '10px',
                                borderTopRightRadius: '10px',
                            },
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
