import { Head, Link, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
export default function TeacherMapping({ classes }) {
    console.log(classes)
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [sectionSubjects, setSectionSubjects] = useState(null);

    const form = useForm({
        class_id: "",
        section_id: "",
        teacher_id: "",
        subject_id: "",
    });

    const handleClassChange = async (classId) => {
        form.setData("class_id", classId);
        form.setData("section_id", "");
        form.setData("subject_id", "");
        form.setData("teacher_id", "");

        setSubjects([]);
        setTeachers([]);

        const res = await axios.get(`/classes/${classId}/sections`);
        setSections(res.data);
    };


    const handleSectionChange = async (sectionId) => {
        form.setData("section_id", sectionId);
        form.setData("subject_id", "");
        form.setData("teacher_id", "");

        setTeachers([]);

        const res = await axios.get(`/sections/${sectionId}/subjects`);
        setSubjects(res.data[1]);
        setSectionSubjects(res.data[0]);
        console.log(res.data)
    };


    const handleSubjectChange = async (subjectId) => {

        form.setData("teacher_id", "");
        console.log("Subject id : " + subjectId);
        const res = await axios.get(
            `/sections/${form.data.section_id}/subjects/${subjectId}/teachers`
        );
        console.log("Data")
        console.log(res)
        setTeachers(res.data);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post('/subject-section-teacher/mappping', form.data, {
            onStart: () => setSubmitting(true),
            onFinish: () => setSubmitting(false),
            onSuccess: (data) => {
                toast.success("Subject assigned successfully!");
                form.reset();
                setSections([]);
                setSubjects([]);
                setTeachers([]);
                setSubmitting(false);
            },
            onError: (errors) => {
                console.log(errors);
                setSubmitting(false);
                toast.error(Object.values(errors)[0] as string);
            },
        });
    };


    return (
        <AppLayout breadcrumbs={[{ title: "Assign Teacher", href: "/sections/teacher-mapping" }]}>
            <Head title="Assign Teacher to Subject" />

            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Assign Teacher to Subject</h1>

                <form onSubmit={handleSubmit}>
                    <section className="border rounded-lg p-6 bg-card space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label className="mb-2">Select Class level</Label>
                                <Select onValueChange={handleClassChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class" />
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

                            <div>
                                <Label className="mb-2">Select Section</Label>
                                <Select
                                    disabled={!sections.length}
                                    onValueChange={handleSectionChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Section" />
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

                            <div>
                                <Label className="mb-2">Select Subject</Label>
                                <Select
                                    disabled={!subjects.length}
                                    onValueChange={(value) => {
                                        form.setData("subject_id", value);
                                        handleSubjectChange(value);
                                    }
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Subject" />
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

                            <div>
                                <Label className="mb-2">Select Teacher</Label>
                                <Select
                                    disabled={!teachers.length}
                                    onValueChange={(value) => form.setData('teacher_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map(t => (
                                            <SelectItem key={t.id} value={`${t.id}`}>
                                                {t.first_name} {t.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                        {sectionSubjects && (
                            <>
                                <h2 className="text-xl font-bold mb-4">
                                    Assigned Subjects
                                </h2>

                                {sectionSubjects.length === 0 ? (
                                    <p className="text-gray-500">
                                        No subjects assigned to this section.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {sectionSubjects?.map(mapping => (
                                            <div
                                                key={mapping.id}
                                                className="border rounded-lg p-4 bg-white shadow-sm flex items-start justify-between"
                                            >
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {mapping.subject.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Teacher: {mapping.teacher.first_name} {mapping.teacher.last_name}
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Assigned on{" "}
                                                        {new Date(mapping.created_at).toLocaleDateString()}
                                                    </p>

                                                    <Button
                                                        type="button"
                                                        className="text-xs mt-3"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>

                                                <img className="w-25 h-25 rounded-full object-cover" src={mapping?.teacher?.photo_url} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}




                        <Button
                            type="submit"
                            disabled={submitting}
                            className="flex cursor-pointer items-center gap-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Spinner />
                                    Assigning...
                                </>
                            ) : (
                                "Assign teacher"
                            )}
                        </Button>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
}
