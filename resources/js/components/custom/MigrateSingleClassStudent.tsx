
import {  useForm } from '@inertiajs/react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';

// Spinner Component
const Spinner = ({ size = "8", color = "black" }) => (
    <div className={`w-${size} h-${size} border-4 border-${color} border-double rounded-full animate-spin`}></div>
);

interface schoolClass{
    id: number;
    name: string;
    code: string;
    order: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface allClasses{
    classes: schoolClass[]
}

export default function MigrateSingleClassStudent({ classes }:allClasses) {

    const form = useForm({
        student_id:"",
        student_admission_id: "",
        from_class_id: "",
        from_section_id: "",
        to_class_id: "",
        to_section_id: "",
    });

    const [studentDetails, setStudentDetails] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingSections, setIsFetchingSections] = useState(false);
    const [sections, setSections] = useState([]);
    const [error, setError] = useState('');

    const handleClassChange = async (value: string) => {
        form.setData("to_class_id", value);
        setIsFetchingSections(true);

        try {
            const response = await axios.get(`/fetch-sections-student-admission/${value}`);
            setSections(response.data.sections);
            form.setData("to_section_id", "");
        } catch {
            toast.error("Failed to load sections");
        } finally {
            setIsFetchingSections(false);
        }
    };
    useEffect(() => {
        if (!form.data.student_admission_id) {
            setStudentDetails(null);
            return;
        }

        const fetchStudent = async () => {
            setIsSearching(true);
            setError("");

            try {
                const response = await axios.get(`/students/${form.data.student_admission_id}`);
                const student = response.data;

                setStudentDetails(student);

                form.setData({
                    ...form.data,
                    from_class_id: student.class_id?.toString() || "",
                    from_section_id: student.section?.id?.toString() || "",
                    student_id : student?.id.toString() || ""
                });

            } catch (err: any) {
                setStudentDetails(null);
                setError(err.response?.data?.message || "Failed to fetch student");
            } finally {
                setIsSearching(false);
            }
        };

        fetchStudent();
    }, [form.data.student_admission_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('/migrate', form.data);
            console.log(response);
            toast.success("Student migrated successfully!");
        } catch (error) {
            console.log(error);
            toast.error(Object.values(error?.response?.data?.errors)[0] as  string);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
                <Accordion
                    type="single"
                    collapsible
                    className="w-full border rounded-lg shadow-sm mt-5 cursor-pointer"
                    defaultValue="section-wise"
                >
                    <AccordionItem value="section-wise">
                        <AccordionTrigger className="px-6 py-4 cursor-pointer">Class Wise Migrate</AccordionTrigger>

                        {/*<AccordionContent className="px-6 py-4">*/}
                        {/*    <form onSubmit={handleSubmit}>*/}

                        {/*        <section className="border rounded-lg p-6 bg-card space-y-4">*/}
                        {/*            <h2 className="text-xl font-semibold">Find student by admission id</h2>*/}

                        {/*            <div>*/}
                        {/*                <label className="text-sm font-medium text-muted-foreground">Admission Id</label>*/}
                        {/*                <InputGroup>*/}
                        {/*                    <InputGroupAddon>*/}
                        {/*                        <InputGroupText>ADM</InputGroupText>*/}
                        {/*                    </InputGroupAddon>*/}

                        {/*                    <InputGroupInput*/}
                        {/*                        type="number"*/}
                        {/*                        placeholder="1"*/}
                        {/*                        value={form.data.student_admission_id}*/}
                        {/*                        onChange={(e) =>*/}
                        {/*                            form.setData("student_admission_id", e.target.value)*/}
                        {/*                        }*/}
                        {/*                    />*/}
                        {/*                </InputGroup>*/}
                        {/*            </div>*/}

                        {/*            {isSearching && (*/}
                        {/*                <div className="flex items-center">*/}
                        {/*                    <Spinner size="8" />*/}
                        {/*                    <span className="ml-2">Searching...</span>*/}
                        {/*                </div>*/}
                        {/*            )}*/}

                        {/*            {error && <p className="text-red-500">{error}</p>}*/}

                        {/*            {studentDetails && (*/}
                        {/*                <div className="p-4 border rounded bg-gray-50 space-y-1">*/}
                        {/*                    <p><strong>Name:</strong> {studentDetails.first_name} {studentDetails.last_name}</p>*/}
                        {/*                    <p><strong>Class:</strong> {studentDetails.student_class?.name}</p>*/}
                        {/*                    <p><strong>Section:</strong> {studentDetails.section?.name}</p>*/}
                        {/*                </div>*/}
                        {/*            )}*/}

                        {/*            <h2 className="text-xl font-semibold">From :</h2>*/}

                        {/*            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}
                        {/*                <div>*/}
                        {/*                    <label className="text-sm mb-1">Current Section ID</label>*/}
                        {/*                    <Input readOnly value={form.data.from_section_id} placeholder="Present Section"/>*/}
                        {/*                </div>*/}

                        {/*                <div>*/}
                        {/*                    <label className="text-sm mb-1">Current Class ID</label>*/}
                        {/*                    <Input readOnly value={form.data.from_class_id} placeholder="Present Class"/>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}

                        {/*            <h2 className="text-xl font-semibold">To :</h2>*/}

                        {/*            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}
                        {/*                <div>*/}
                        {/*                    <label className="text-sm ">Select Class</label>*/}
                        {/*                    <Select*/}
                        {/*                        value={form.data.to_class_id}*/}
                        {/*                        onValueChange={handleClassChange}*/}
                        {/*                        disabled={isFetchingSections}*/}
                        {/*                    >*/}
                        {/*                        <SelectTrigger>*/}
                        {/*                            <SelectValue placeholder="Select Class" />*/}
                        {/*                        </SelectTrigger>*/}

                        {/*                        <SelectContent>*/}
                        {/*                            {classes?.length ? (*/}
                        {/*                                classes.map(cls => (*/}
                        {/*                                    <SelectItem key={cls.id} value={`${cls.id}`}>*/}
                        {/*                                        Class {cls.name}*/}
                        {/*                                    </SelectItem>*/}
                        {/*                                ))*/}
                        {/*                            ) : (*/}
                        {/*                                <SelectItem value="0" disabled>No Class Found</SelectItem>*/}
                        {/*                            )}*/}
                        {/*                        </SelectContent>*/}
                        {/*                    </Select>*/}
                        {/*                </div>*/}

                        {/*                <div>*/}
                        {/*                    <label className="text-sm flex items-center">*/}
                        {/*                        Section*/}
                        {/*                        {isFetchingSections && <Spinner size="4" color="gray-600" />}*/}
                        {/*                    </label>*/}

                        {/*                    <Select*/}
                        {/*                        value={form.data.to_section_id}*/}
                        {/*                        onValueChange={(v) => form.setData("to_section_id", v)}*/}
                        {/*                        disabled={isFetchingSections || sections.length === 0}*/}
                        {/*                    >*/}
                        {/*                        <SelectTrigger>*/}
                        {/*                            <SelectValue placeholder="Select Section" />*/}
                        {/*                        </SelectTrigger>*/}

                        {/*                        <SelectContent>*/}
                        {/*                            {sections.length ? (*/}
                        {/*                                sections.map(sec => {*/}
                        {/*                                    const remaining = Number(sec.capacity) - Number(sec.students_count);*/}
                        {/*                                    return (*/}
                        {/*                                        <SelectItem*/}
                        {/*                                            key={sec.id}*/}
                        {/*                                            value={`${sec.id}`}*/}
                        {/*                                            disabled={remaining <= 0}*/}
                        {/*                                            className={remaining <= 0 ? "text-red-500" : ""}*/}
                        {/*                                        >*/}
                        {/*                                            {sec.name} - Remaining ({remaining})*/}
                        {/*                                        </SelectItem>*/}
                        {/*                                    );*/}
                        {/*                                })*/}
                        {/*                            ) : (*/}
                        {/*                                <SelectItem value="0" disabled>No Section Found</SelectItem>*/}
                        {/*                            )}*/}
                        {/*                        </SelectContent>*/}
                        {/*                    </Select>*/}
                        {/*                </div>*/}

                        {/*            </div>*/}

                        {/*            <Button*/}
                        {/*                type="submit"*/}
                        {/*                disabled={isSubmitting}*/}
                        {/*                className="flex items-center gap-2 cursor-pointer"*/}
                        {/*            >*/}
                        {/*                {isSubmitting ? (*/}
                        {/*                    <>*/}
                        {/*                        <Spinner size="5" color="white" />*/}
                        {/*                        Processing...*/}
                        {/*                    </>*/}
                        {/*                ) : (*/}
                        {/*                    "Migrate Student"*/}
                        {/*                )}*/}
                        {/*            </Button>*/}

                        {/*        </section>*/}

                        {/*    </form>*/}
                        {/*</AccordionContent>*/}
                    </AccordionItem>
                </Accordion>
    );
}
