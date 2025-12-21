import { Head, router, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select";
import toast from 'react-hot-toast';
import axios from 'axios';

interface Section {
    id: number;
    name: string;
    capacity: number;
    students_count: number;
}

interface AssignedSubject {
    id: number;
    name: string;
    pivot: {
        created_at: string;
    };
}

interface SectionSubjects {
    id: number;
    name: string;
    subjects: AssignedSubject[];
}

interface Props {
    subjects: { id: number; name: string }[];
    classes: { id: number; name: string }[];
}
export default function AssignSubject({ subjects, classes }: Props) {
    const [loadSection, setLoadSection] = useState(false);
    const [sections, setSections] = useState<Section[]>([]);
    const [sectionSubjects, setSectionSubjects] = useState<SectionSubjects | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        subject_id: 0,
        section_id: 0,
        class_id: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/subject-mapping', form.data, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => {
                toast.success("Subject assigned successfully!");
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
                `/fetch-sections-student-admission/${value}`
            );

            setSections(response.data.sections);
            form.setData('section_id', 0);
        } catch (error) {
            toast.error("Failed to load sections");
        } finally {
            setLoadSection(false);
        }
    };
    const handleSectionChange = async (value: string) => {
        form.setData('section_id', Number(value));

        try {
            const response = await axios.get(
                `/sections-wise-subjects/${value}`
            );
            setSectionSubjects(response.data);
        } catch (error) {
            toast.error("Failed to load assigned subjects");
        }
    };
    
    const handleRemoveSubject = (sectionId: number,subjectId: number) => {
        if (!sectionSubjects) return;
    
        router.delete(`/subject-mapping/${sectionId}/${subjectId}`, {
            onSuccess: (data) => {
                toast.success("Subject removed successfully!");
                console.log(data);
                setSectionSubjects(prevState => {
                    if (!prevState) return prevState;
    
                    return {
                        ...prevState,
                        subjects: prevState.subjects.filter(
                            sub => sub.id !== subjectId
                        ),
                    };
                });
            },
            onError: () => {
                toast.error("Failed to remove subject");
            },            
        });
    };
    

    return (
        <AppLayout breadcrumbs={[{ title: 'Assign Subject', href: `/subjects/assign-subject` }]}>
            <Head title="Assign Subject" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Assign Subject</h1>
                    <Link
                        href="/subjects"
                        className="px-2 py-1 text-sm bg-green-600 rounded-md text-white"
                    >
                        All subjects
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <section className="border rounded-lg p-6 bg-card space-y-6">

                        {/* SELECTS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* CLASS */}
                            <div>
                                <label className="text-sm font-medium">Select Class</label>
                                <Select onValueChange={handleClassChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(cls => (
                                            <SelectItem key={cls.id} value={`${cls.id}`}>
                                                Class {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* SECTION */}
                            <div>
                                <label className="text-sm font-medium">Select Section</label>
                                <Select
                                    disabled={loadSection || sections.length === 0}
                                    onValueChange={handleSectionChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sections.map(sec => (
                                            <SelectItem key={sec.id} value={`${sec.id}`}>
                                                {sec.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* SUBJECT */}
                            <div>
                                <label className="text-sm font-medium">Select Subject</label>
                                <Select
                                    onValueChange={value =>
                                        form.setData('subject_id', Number(value))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(sub => (
                                            <SelectItem key={sub.id} value={`${sub.id}`}>
                                                {sub.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* ASSIGNED SUBJECTS */}
                        {sectionSubjects && (
                            <div className="pt-8">
                                <h2 className="text-xl font-bold mb-4">
                                    Assigned Subjects —{" "}
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-md">
                                        {sectionSubjects.name}
                                    </span>
                                </h2>

                                {sectionSubjects.subjects.length === 0 ? (
                                    <p className="text-gray-500">
                                        No subjects assigned to this section.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {sectionSubjects.subjects.map(subject => (
                                            <div
                                                key={subject.id}
                                                className="border rounded-lg p-4 bg-white shadow-sm"
                                            >
                                                <h3 className="font-semibold">
                                                    {subject.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Assigned on{" "}
                                                    {new Date(
                                                        subject.pivot.created_at
                                                    ).toLocaleDateString()}
                                                </p>
                                                <Button type='button' onClick={() => handleRemoveSubject(form.data.section_id,subject.id)} className='text-xs mt-3 cursor-pointer'>Remove</Button>
                                            </div>
                                        
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? "Saving..." : "Create subject"}
                        </Button>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
}
