import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface ExamScheduleCreateProps {
    classes: any[];
    academicYears: any[];
}

export default function Create({
    classes,
    academicYears,
}: ExamScheduleCreateProps) {
    const [sections, setSections] = useState([]);
    const [loadingSections, setLoadingSections] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const { data, processing, reset, post, setData } = useForm({
        exam_name: '',
        class_id: '',
        section_id: '',
        subject_id: '',
        academic_year_id: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        room: '',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data);
        router.post('/exam-schedule', data, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => {
                toast.success('Exam schedule created successfully!');
                reset();
                router.visit('/exam-schedule');
            },
            onError: (err) => {
                toast.error(Object.values(err)[0]);
            },
        });
    };

    const handleClassChange = async (value: string) => {
        setData('class_id', value);
        setSubjects([]);

        Swal.fire({
            title: 'Fetching Sections...',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        setLoadingSections(true);
        setSections([]);

        try {
            const response = await axios.get(
                `/fetch-sections-student-admission/${value}`,
                {
                    params: {
                        class_id: data.class_id,
                    },
                },
            );
            console.log(response);
            setSections(response.data.sections);
            Swal.close();
        } catch {
            toast.error('Failed to load sections');
            Swal.close();
        } finally {
            setLoadingSections(false);
            Swal.close();
        }
    };

    const handleSectionChange = async (value: string) => {
        setData('section_id', value);
        Swal.fire({
            title: 'Fetching Subjects...',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        try {
            const response = await axios.get(
                `/sections-wise-subjects/${value}`,
            );
            console.log(response.data);
            setSubjects(response.data.subjects);
            Swal.close();
        } catch (error) {
            Swal.update({
                title: 'Failed to load subjects',
                text: 'Please try again',
                icon: 'error',
                allowOutsideClick: false,
            });
        }
    };
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Create Exam Schedule',
                    href: '/exam-schedule/create',
                },
            ]}
        >
            <Head title="Create Exam Schedule" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Exam Schedule</h1>
                    <Link
                        href={'/exam-schedule'}
                        className="cursor-pointer rounded-md bg-green-600 px-2 py-1 text-sm text-white"
                    >
                        All Exam Schedules
                    </Link>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-10">
                        <section className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col">
                                    <Label className="mb-2">Exam Type</Label>
                                    <Input
                                        type="text"
                                        value={data.exam_name}
                                        placeholder="Enter the exam name"
                                        onChange={(e) =>
                                            setData('exam_name', e.target.value)
                                        }
                                    />
                                    {/* <Select
                                        onValueChange={(v) =>
                                            setData('exam_name', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select exam type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mid Term">
                                                Mid Term
                                            </SelectItem>
                                            <SelectItem value="Final">
                                                Final
                                            </SelectItem>
                                        </SelectContent>
                                    </Select> */}
                                </div>

                                <div className="flex flex-col">
                                    <Label className="mb-2">Class</Label>
                                    <Select onValueChange={handleClassChange}>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Select Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((cls) => (
                                                <SelectItem
                                                    key={cls.id}
                                                    value={String(cls.id)}
                                                >
                                                    Class - {cls.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <Label className="mb-2">Section</Label>
                                    <Select onValueChange={handleSectionChange}>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Select Section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sections.length == 0 ? (
                                                <SelectItem disabled value="0">
                                                    No Section Found
                                                </SelectItem>
                                            ) : (
                                                sections.map((section) => (
                                                    <SelectItem
                                                        key={section?.id}
                                                        value={String(
                                                            section?.id,
                                                        )}
                                                    >
                                                        {section?.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <Label className="mb-2">Subject</Label>
                                    <Select
                                        onValueChange={(v) =>
                                            setData('subject_id', v)
                                        }
                                        // disabled={subjects.length === 0}
                                    >
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.length === 0 ? (
                                                <SelectItem value="0" disabled>
                                                    No subjects found
                                                </SelectItem>
                                            ) : (
                                                subjects.map((subject) => {
                                                    const teacherAssignment =
                                                        subject
                                                            ?.teacher_assignments
                                                            ?.teacher;

                                                    const teacherName =
                                                        teacherAssignment
                                                            ? `${teacherAssignment.first_name} ${teacherAssignment.last_name}`
                                                            : 'No Teacher Assigned';

                                                    return (
                                                        <SelectItem
                                                            key={subject?.id}
                                                            value={String(
                                                                subject?.id,
                                                            )}
                                                            disabled={
                                                                !teacherAssignment
                                                            }
                                                        >
                                                            {subject?.name} -{' '}
                                                            <span
                                                                className={`text-xs ${teacherAssignment ? 'rounded-md px-2 py-1 text-green-500' : 'rounded-md px-2 py-1 text-red-500'}`}
                                                            >
                                                                {teacherName}
                                                            </span>
                                                        </SelectItem>
                                                    );
                                                })
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <Label className="mb-2">
                                        Academic Year
                                    </Label>
                                    <Select
                                        value={data.academic_year_id}
                                        onValueChange={(v) =>
                                            setData('academic_year_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose academic year" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {academicYears?.map((year) => (
                                                <SelectItem
                                                    key={year.id}
                                                    value={String(year.id)}
                                                >
                                                    {year.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <Label className="mb-2">Exam Date</Label>
                                    <Input
                                        type="date"
                                        value={data.exam_date}
                                        onChange={(e) =>
                                            setData('exam_date', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <Label className="mb-2">Start Time</Label>
                                    <Input
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) =>
                                            setData(
                                                'start_time',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <Label className="mb-2">End Time</Label>
                                    <Input
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) =>
                                            setData('end_time', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <Label className="mb-2">Room</Label>
                                    <Input
                                        type="text"
                                        value={data.room}
                                        onChange={(e) =>
                                            setData('room', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        Saving...
                                    </>
                                ) : (
                                    'Create subject'
                                )}
                            </Button>
                        </section>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
