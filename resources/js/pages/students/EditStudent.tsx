import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import axios from 'axios';
import { X } from "lucide-react";

export default function EditStudent({ classes,all_section,student }) {
    const baseURL= import.meta.env.VITE_APP_URL;
    const form = useForm({
        first_name: student?.first_name || "",
        last_name: student?.last_name || "",
        dob: student?.dob ||"",
        gender: student?.gender,
        blood_group: student?.blood_group ||"",
        nationality: student?.nationality ||"",
        religion: student?.religion ||"",
        photo: null,
        email: student?.email ||"",
        current_address: student?.address ||"",
        class_id: student?.class_id || 0,
        section_id: student?.section_id || 0,
        previous_school: student?.previous_school ||"",
        admission_date: student?.admission_date ||"",
        academic_year: student?.academic_year ||"",
        roll_no: student?.roll_no ||"",
        father_name: student?.father_name ||"",
        father_occupation: student?.father_occupation ||"",
        mother_name: student?.mother_name ||"",
        mother_occupation: student?.mother_occupation ||"",
        guardian_relation: student?.guardian_relation ||"",
        guardian_phone: student?.guardian_phone ||"",
        status: student?.status || "pending",
        admission_no: student?.admission_no ||"",
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState(student?.photo || null);
    const [loading, setLoading]= useState(false);
    const [sections, setSections] = useState<Section[]>([]);
    const [loadSection, setLoadSection] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();

        Object.entries(form.data).forEach(([key, value]) => {
            if (value !== null) {
                formData.append(key, value);
            }
        });
        formData.append("_method", "PUT");

        try {
            const id= student?.id;
            const response = await axios.post(`/students/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(response.data);
            toast.success("Student updated successfully!");
            window.location.href="/students";

        } catch (err) {
            console.log(err);
            toast.error(Object.values(err?.response?.data?.errors)[0] as string);
        } finally {
            setLoading(false);
        }
    };


    const handleChange =async (value: string) => {
        form.setData('class_id', Number(value));

        setLoadSection(true);

        try {
            const response = await axios.get(`/fetch-sections-student-admission/${value}`);

            setSections(response.data.sections);
            form.setData('section_id', 0);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load sections");
        } finally {
            setLoadSection(false);
        }
    };

    useEffect(() => {
        console.log(all_section.filter(sec => sec.class_id === form.data.class_id));
        setSections(all_section.filter(sec => sec.class_id === form.data.class_id));
    }, []);

    return (
        <AppLayout breadcrumbs={[{ title: 'Student Admission', href: '/student-admission' }]}>
            <Head title="Student Admission" />

            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold mb-4">Edit <span className={`bg-green-500 text-white d rounded-md px-3 py-1`}>{student?.first_name} {student?.last_name}</span> record</h1>

                <form onSubmit={handleSubmit} encType={"multipart/form-data"}>
                    <div className="space-y-10">

                        <section className="border rounded-lg p-6 space-y-4 bg-card">
                            <h2 className="text-xl font-semibold">Student Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">First Name</label>
                                    <Input
                                        placeholder="John"
                                        value={form.data.first_name}
                                        onChange={e => form.setData('first_name', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Last Name</label>
                                    <Input
                                        placeholder="Doe"
                                        value={form.data.last_name}
                                        onChange={e => form.setData('last_name', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Date of Birth</label>
                                    <Input
                                        type="date"
                                        value={form.data.dob}
                                        onChange={e => form.setData('dob', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Gender</label>
                                    <Select
                                        value={form.data.gender}
                                        onValueChange={value => form.setData('gender', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Blood Group (Optional)</label>
                                    <Input
                                        placeholder="A+, O-, etc."
                                        value={form.data.blood_group}
                                        onChange={e => form.setData('blood_group', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Nationality</label>
                                    <Input
                                        placeholder="Indian, American, etc."
                                        value={form.data.nationality}
                                        onChange={e => form.setData('nationality', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Religion</label>
                                    <Select
                                        value={form.data.religion}
                                        onValueChange={value => form.setData('religion', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="islam">Islam</SelectItem>
                                            <SelectItem value="hindu">Hindu</SelectItem>
                                            <SelectItem value="christian">Christian</SelectItem>
                                            <SelectItem value="buddha">Buddha</SelectItem>
                                            <SelectItem value="other">Others</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col col-span-1 md:col-span-2">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Photo Upload</label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0] || {};
                                            form.setData('photo', file);
                                            if (file) {
                                                const previewUrl = URL.createObjectURL(file as File);
                                                setPhotoPreview(previewUrl);
                                            } else {
                                                form.setData('photo', null);
                                                setPhotoPreview(null);
                                            }
                                        }}
                                    />

                                    {photoPreview && (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="mt-3 w-40 h-40 object-cover rounded-md border"
                                        />
                                    )}

                                    {student?.photo && existingImage && (
                                        <div className="relative mt-3 w-40 h-40">
                                            <img
                                                className="object-cover rounded-md border h-full w-full"
                                                src={`${baseURL}/storage/${student.photo}`}
                                                alt=""
                                            />

                                            <X
                                                onClick={() => setExistingImage(null)}
                                                className="w-7 h-7 absolute top-0 right-0 rounded-full cursor-pointer bg-red-500 text-white p-1"
                                            />
                                        </div>
                                    )}


                                </div>
                            </div>
                        </section>

                        <section className="border rounded-lg p-6 space-y-4 bg-card">
                            <h2 className="text-xl font-semibold">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Email</label>
                                    <Input
                                        placeholder="student@example.com"
                                        value={form.data.email}
                                        onChange={e => form.setData('email', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col col-span-1 md:col-span-2">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Current Address</label>
                                    <Textarea
                                        placeholder="Full address..."
                                        value={form.data.current_address}
                                        onChange={e => form.setData('current_address', e.target.value)}
                                    />
                                </div>

                            </div>
                        </section>

                        <section className="border rounded-lg p-6 space-y-4 bg-card">
                            <h2 className="text-xl font-semibold">Academic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Class / Grade</label>
                                    <Select
                                        value={form.data.class_id ? form.data.class_id.toString() : undefined}
                                        onValueChange={handleChange}
                                        disabled={loadSection}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Admission Level(class)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes?.length > 0 ? (
                                                classes.map(cls => (
                                                    <SelectItem key={cls.id} value={`${cls.id}`}>
                                                        Class {cls.name ?? 'N/A'}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="0">No Class Found</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>


                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground flex items-center ">
                                        Section
                                        {
                                            loadSection && < span >
                                        <svg
                                            className="animate-spin ms-2 h-5 w-5 text-gray-600 dark:text-gray-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>

                                    </span>
                                        }
                                    </label>
                                    <Select
                                        value={form.data.section_id ? form.data.section_id.toString() : undefined}
                                        onValueChange={(v) => form.setData('section_id', Number(v))}
                                        // disabled={loadSection || sections.length === 0}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sections.length > 0 ? (
                                                sections.map((sec) => {
                                                    const remaining = Number(sec.capacity) - Number(sec.students_count);

                                                    return (
                                                        <SelectItem
                                                            key={sec.id}
                                                            value={`${sec.id}`}
                                                            disabled={remaining <= 0}
                                                            className={`${remaining <=0 && 'text-red-500'}`}
                                                        >
                                                            {sec.name} - Remaining({remaining})
                                                        </SelectItem>
                                                    );
                                                })
                                            ) : (
                                                <SelectItem value="0" disabled>No Section Found</SelectItem>
                                            )}
                                        </SelectContent>

                                    </Select>

                                </div>


                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Previous School (Optional)</label>
                                    <Input
                                        placeholder="ABC High School"
                                        value={form.data.previous_school}
                                        onChange={e => form.setData('previous_school', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Admission Date</label>
                                    <Input

                                        type="date"
                                        value={form.data.admission_date}
                                        onChange={e => form.setData('admission_date', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Academic Year</label>
                                    <Input
                                        placeholder="2024-2025"
                                        value={form.data.academic_year}
                                        onChange={e => form.setData('academic_year', e.target.value)}
                                    />
                                </div>

                            </div>
                        </section>

                        <section className="border rounded-lg p-6 space-y-4 bg-card">
                            <h2 className="text-xl font-semibold">Guardian Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Father's Name</label>
                                    <Input
                                        placeholder="Father's Name"
                                        value={form.data.father_name}
                                        onChange={e => form.setData('father_name', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Father's Occupation</label>
                                    <Input
                                        placeholder="Occupation"
                                        value={form.data.father_occupation}
                                        onChange={e => form.setData('father_occupation', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Mother's Name</label>
                                    <Input
                                        placeholder="Mother's Name"
                                        value={form.data.mother_name}
                                        onChange={e => form.setData('mother_name', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Mother's Occupation</label>
                                    <Input
                                        placeholder="Occupation"
                                        value={form.data.mother_occupation}
                                        onChange={e => form.setData('mother_occupation', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Guardian Relation</label>
                                    <Input
                                        placeholder="Father / Mother / Uncle etc."
                                        value={form.data.guardian_relation}
                                        onChange={e => form.setData('guardian_relation', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Guardian Contact</label>
                                    <Input
                                        placeholder="+880123456789"
                                        value={form.data.guardian_phone}
                                        onChange={e => form.setData('guardian_phone', e.target.value)}
                                    />
                                </div>

                            </div>
                        </section>


                        <section className="border rounded-lg p-6 space-y-4 bg-card">
                            <h2 className="text-xl font-semibold">System Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Status</label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={value => form.setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-1 font-medium text-sm text-muted-foreground">Admission Number</label>
                                    <Input
                                        placeholder="Auto-generated"
                                        value={form.data.admission_no}
                                        disabled
                                    />
                                </div>

                            </div>
                        </section>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </Button>
                        </div>

                    </div>
                </form>

            </div>
        </AppLayout>
    );
}
