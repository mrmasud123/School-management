import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useAuthorization } from '@/hooks/use-authorization';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Teacher {
    id: number;
    first_name: string;
    last_name: string;
    photo_url: string | null;
}

interface TeacherAssignment {
    teacher: Teacher;
}

interface AssignedSubject {
    id: number;
    name: string;
    created_at: string;
    teacher_assignments?: TeacherAssignment | null;
    pivot: {
        section_id: number;
        subject_id: number;
        created_at: string;
    };
}

interface SectionSubjects {
    id: number;
    name: string;
    class_id: number;
    subjects: AssignedSubject[];
}

export default function AssignSubject({ subjects, classes }: Props) {
    const { can, canAny, hasRoles } = useAuthorization();
    const [loadSection, setLoadSection] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [sections, setSections] = useState<Section[]>([]);
    const [sectionSubjects, setSectionSubjects] =
        useState<SectionSubjects | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        subject_id: 0,
        section_id: 0,
        class_id: 0,
    });
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/subject-mapping', form.data, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => {
                toast.success('Subject assigned successfully!');
                form.reset();
                setSectionSubjects(null);
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string);
            },
        });
    };

    const handleClassChange = async (value: string) => {
        form.setData('class_id', Number(value));
        setLoadSection(true);
        setSectionSubjects(null);

        try {
            const response = await axios.get(
                `/fetch-sections-student-admission/${value}`,
            );

            setSections(response.data.sections);
            form.setData('section_id', 0);
        } catch (error) {
            toast.error('Failed to load sections');
        } finally {
            setLoadSection(false);
        }
    };
    const handleSectionChange = async (value: string) => {
        form.setData('section_id', Number(value));

        try {
            const response = await axios.get(
                `/sections-wise-subjects/${value}`,
            );
            setSectionSubjects(response.data);
        } catch (error) {
            toast.error('Failed to load assigned subjects');
        }
    };

    const handleRemoveSubject = (sectionId: number, subjectId: number) => {
        if (!sectionSubjects) return;

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
        <AppLayout
            breadcrumbs={[
                { title: 'Assign Subject', href: `/subjects/assign-subject` },
            ]}
        >
            <Head title="Assign Subject" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Assign Subject</h1>
                    <Link
                        href="/subjects"
                        className="rounded-md bg-green-600 px-2 py-1 text-sm text-white"
                    >
                        All subjects
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <section className="space-y-6 rounded-lg border bg-card p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="text-sm font-medium">
                                    Select Class
                                </label>
                                <Select onValueChange={handleClassChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem
                                                key={cls.id}
                                                value={`${cls.id}`}
                                            >
                                                Class {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Select Section
                                </label>
                                <Select
                                    disabled={
                                        loadSection || sections.length === 0
                                    }
                                    onValueChange={handleSectionChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sections.map((sec) => (
                                            <SelectItem
                                                key={sec.id}
                                                value={`${sec.id}`}
                                            >
                                                {sec.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Select Subject
                                </label>
                                <Select
                                    onValueChange={(value) =>
                                        form.setData(
                                            'subject_id',
                                            Number(value),
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((sub) => (
                                            <SelectItem
                                                key={sub.id}
                                                value={`${sub.id}`}
                                            >
                                                {sub.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {sectionSubjects && (
                            <div className="p-8">
                                <h1 className="mb-4 text-2xl font-bold">
                                    Assigned Subjects for Section{' '}
                                    <span className="rounded-md bg-green-500 px-3 py-1 text-white">
                                        {sectionSubjects?.name}
                                    </span>
                                </h1>
                                {sectionSubjects?.subjects?.length === 0 ? (
                                    <p className="text-gray-500">
                                        No subjects assigned to this section.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                        {sectionSubjects.subjects?.map(
                                            (subject) => {
                                                const isAssigned =
                                                    !!subject?.teacher_assignments;

                                                return (
                                                    <div
                                                        key={subject.id}
                                                        className={`flex h-full flex-col justify-between rounded-lg border p-4 shadow-sm ${isAssigned ? 'bg-white' : 'border-red-400 bg-red-50'}`}
                                                    >
                                                        {/* Header */}
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900">
                                                                    {
                                                                        subject.name
                                                                    }
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
                                                                        ? `${subject.teacher_assignments?.teacher?.first_name}
                                   ${subject.teacher_assignments?.teacher?.last_name}`
                                                                        : 'Not Assigned'}
                                                                </p>
                                                            </div>

                                                            {/* Teacher Image */}
                                                            <img
                                                                className="h-14 w-14 shrink-0 rounded-full border object-cover"
                                                                src={
                                                                    subject
                                                                        ?.teacher_assignments
                                                                        ?.teacher
                                                                        ?.photo_url ??
                                                                    '/images/avatar-placeholder.png'
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

                                                        {/* Footer Actions */}
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            <Button
                                                                type="button"
                                                                disabled={
                                                                    removing
                                                                }
                                                                onClick={() =>
                                                                    handleRemoveSubject(
                                                                        form
                                                                            .data
                                                                            .section_id,
                                                                        subject.id,
                                                                    )
                                                                }
                                                                className="bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                                                            >
                                                                {removing ? (
                                                                    <>
                                                                        <Spinner />
                                                                        Removing...
                                                                    </>
                                                                ) : (
                                                                    'Remove Subject'
                                                                )}
                                                            </Button>

                                                            {can(
                                                                'subject.remove-mapping',
                                                            ) &&
                                                                subject.teacher_assignments && (
                                                                    <Button
                                                                        type="button"
                                                                        disabled={
                                                                            removing
                                                                        }
                                                                        onClick={() =>
                                                                            removeSubject(
                                                                                sectionSubjects.class_id,
                                                                                subject
                                                                                    .pivot
                                                                                    .section_id,
                                                                                subject
                                                                                    .pivot
                                                                                    .subject_id,
                                                                                subject
                                                                                    .teacher_assignments
                                                                                    .teacher
                                                                                    .id,
                                                                            )
                                                                        }
                                                                        className="bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                                                                    >
                                                                        {removing ? (
                                                                            <>
                                                                                <Spinner />
                                                                                Removing...
                                                                            </>
                                                                        ) : (
                                                                            'Remove Mapping'
                                                                        )}
                                                                    </Button>
                                                                )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? 'Saving...' : 'Map subject'}
                        </Button>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
}
