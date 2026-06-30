import { customSelectStyles } from '@/components/custom/style';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactSelect from 'react-select';
interface Option {
    id: number;
    name: string;
    code: string;
}

interface Teacher {
    id: number;
    name: string;
}

interface Props {
    examType: Option;
    classes: Option[];
    subjects: Option[];
    sections: Option[];
    rooms: Option[];
    teachers: Teacher[];
    schedule?: any;
}

export default function AssignExamSchedule({
    examType,
    classes,
    subjects,
    sections,
    rooms,
    teachers,
    schedule,
}: Props) {
    const { data, setData, errors } = useForm({
        exam_id: schedule?.exam_id?.toString() ?? examType.id.toString(),
        class_id: '',
        subject_id: '',
        section_id: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        duration_minutes: schedule?.duration_minutes?.toString() ?? '',
        room_id: schedule?.room_id?.toString() ?? '',
        invigilator_id: schedule?.invigilator_id?.toString() ?? '',
        total_marks: schedule?.total_marks ?? '',
        passing_marks: schedule?.passing_marks ?? '',
        instructions: schedule?.instructions ?? '',
        status: schedule?.status ?? 'scheduled',
        mark_entry_deadline: schedule?.mark_entry_deadline ?? '',
        is_mark_entry_locked: schedule?.is_mark_entry_locked ? '1' : '0',
    });

    const [loading, setLoading] = useState(false);
    const [allSections, setAllSections] = useState<any>([]);
    const [sectionSubjects, setSectionSubjects] = useState<any>([]);
    useEffect(() => {
        if (data.start_time && data.end_time) {
            const start = new Date(`1970-01-01T${data.start_time}`);
            const end = new Date(`1970-01-01T${data.end_time}`);
            const diff = (end.getTime() - start.getTime()) / 60000;

            if (diff > 0) {
                setData('duration_minutes', diff.toString());
            }
        }
    }, [data.start_time, data.end_time]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (Number(data.passing_marks) > Number(data.total_marks)) {
            toast.error('Passing marks cannot be greater than total marks');
            return;
        }

        setLoading(true);
        router.post('/assign-exam-schedule', data, {
            onSuccess: (data) => {
                console.log(data);
                toast.success('Exam Schedule assigned successfully');
                router.visit('/exam-types');
            },
            onError: (error) => toast.error(Object.values(error)[0] as string),
            onFinish: () => setLoading(false),
        });
    };
    const handleClassChange = async (value: string) => {
        setData('class_id', value);
        // setLoadSection(true);

        try {
            const response = await axios.get(
                `/fetch-sections-student-admission/${value}`,
            );

            setAllSections(response.data.sections);
            setData('section_id', '');
            toast.success('Sections loaded successfully');
        } catch (error) {
            toast.error('Failed to load sections');
        } finally {
            // setLoadSection(false);
        }
    };

    const handleSectionChange = async (value: string) => {
        setData('section_id', value);

        try {
            const response = await axios.get(
                `/sections-wise-subjects/${value}`,
            );
            setSectionSubjects(response.data?.subjects);
            toast.success('Subjects loaded successfully');
            console.log(response.data);
        } catch (error) {
            toast.error('Failed to load assigned subjects');
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Exam Schedules', href: '/exam-types' },
                { title: 'Create', href: '#' },
            ]}
        >
            <Head title={`Create Exam Schedule`} />

            <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-lg">
                        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white md:text-4xl">
                                    📝 Create Exam Schedule
                                </h1>

                                <p className="mt-2 text-sm text-white/80">
                                    Manage examination schedule information and
                                    configuration
                                </p>
                                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                    {examType.name} — {examType.code}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Link
                        href="/exam-types"
                        className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        Back
                    </Link> */}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">
                            Academic Information
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                                <Select onValueChange={handleSectionChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allSections.length > 0 ? (
                                            allSections.map((sec) => (
                                                <SelectItem
                                                    key={sec.id}
                                                    value={`${sec.id}`}
                                                >
                                                    {sec.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="0" disabled>
                                                No Section Found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Select Subject
                                </label>
                                <Select
                                    onValueChange={(value) =>
                                        setData('subject_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sectionSubjects.length > 0 ? (
                                            sectionSubjects.map((sub) => {
                                                const assigned =
                                                    sub?.teacher_assignments
                                                        ? true
                                                        : false;

                                                return (
                                                    <SelectItem
                                                        key={sub.id}
                                                        value={`${sub.id}`}
                                                        disabled={!assigned}
                                                        className={`${!assigned ? 'text-red-500' : 'text-black'}`}
                                                    >
                                                        {sub.name}
                                                    </SelectItem>
                                                );
                                            })
                                        ) : (
                                            <SelectItem value="0" disabled>
                                                No Subject Found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">
                            Date & Time
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <InputField
                                label="Exam Date"
                                type="date"
                                value={data.exam_date}
                                field="exam_date"
                                setData={setData}
                                errors={errors}
                            />

                            <InputField
                                label="Start Time"
                                type="time"
                                value={data.start_time}
                                field="start_time"
                                setData={setData}
                                errors={errors}
                            />

                            <InputField
                                label="End Time"
                                type="time"
                                value={data.end_time}
                                field="end_time"
                                setData={setData}
                                errors={errors}
                            />

                            <InputField
                                label="Duration (Minutes)"
                                type="number"
                                value={data.duration_minutes}
                                field="duration_minutes"
                                setData={setData}
                                errors={errors}
                            />
                        </div>
                    </div>

                    {/* Marks */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">
                            Marks Configuration
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <InputField
                                label="Total Marks"
                                type="number"
                                value={data.total_marks}
                                field="total_marks"
                                setData={setData}
                                errors={errors}
                            />

                            <InputField
                                label="Passing Marks"
                                type="number"
                                value={data.passing_marks}
                                field="passing_marks"
                                setData={setData}
                                errors={errors}
                            />

                            <InputField
                                label="Mark Entry Deadline"
                                type="datetime-local"
                                value={data.mark_entry_deadline}
                                field="mark_entry_deadline"
                                setData={setData}
                                errors={errors}
                            />
                        </div>
                    </div>

                    {/* Room & Invigilator */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">
                            Room & Invigilator
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label className="mb-2">Invigilator</Label>
                                <ReactSelect
                                    options={teachers.map((t) => ({
                                        value: t.id.toString(),
                                        label: t.first_name + ' ' + t.last_name,
                                    }))}
                                    styles={customSelectStyles}
                                    value={
                                        teachers
                                            .map((t) => ({
                                                value: t.id.toString(),
                                                label:
                                                    t.first_name +
                                                    ' ' +
                                                    t.last_name,
                                            }))
                                            .find(
                                                (option) =>
                                                    option.value ===
                                                    data.invigilator_id,
                                            ) || null
                                    }
                                    onChange={(selected: any) =>
                                        setData(
                                            'invigilator_id',
                                            selected?.value || '',
                                        )
                                    }
                                    placeholder="Select Teacher"
                                    isClearable
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status & Instructions */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">
                            Status & Instructions
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label className="mb-2">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) => setData('status', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="scheduled">
                                            Scheduled
                                        </SelectItem>
                                        <SelectItem value="ongoing">
                                            Ongoing
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2">
                                    Mark Entry Locked
                                </Label>
                                <Select
                                    value={data.is_mark_entry_locked}
                                    onValueChange={(v) =>
                                        setData('is_mark_entry_locked', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No</SelectItem>
                                        <SelectItem value="1">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2">
                                <Label className="mb-2">Instructions</Label>
                                <Textarea
                                    value={data.instructions}
                                    onChange={(e) =>
                                        setData('instructions', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                Saving...
                            </>
                        ) : (
                            'Create Schedule'
                        )}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

/* ---------- Reusable Components ---------- */

function InputField({ label, type, value, field, setData, errors }: any) {
    return (
        <div>
            <Label className="mb-2">{label}</Label>
            <Input
                type={type}
                value={value}
                onChange={(e) => setData(field, e.target.value)}
            />
            {errors[field] && (
                <p className="text-sm text-red-500">{errors[field]}</p>
            )}
        </div>
    );
}

// function SelectField({ label, value, options, setData, field, errors }: any) {
//     return (
//         <div>
//             <Label className="mb-2">{label}</Label>
//             <Select value={value} onValueChange={(v) => setData(field, v)}>
//                 <SelectTrigger>
//                     <SelectValue placeholder={`Select ${label}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {options?.map((item: any) => (
//                         <SelectItem key={item.id} value={item.id.toString()}>
//                             {item.name} ({item.code})
//                         </SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//             {errors[field] && (
//                 <p className="text-sm text-red-500">{errors[field]}</p>
//             )}
//         </div>
//     );
// }
