import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';

export default function Mapping({ parent }: any) {

    const { data, setData, processing } = useForm({
        student_admission_no: "",
        student_id: "",
        from_class_id: "",
        from_section_id: "",
        parent_id: parent?.id,
        relation: ""
    });
    const [loading, setLoading] = useState(false);
    const [studentDetails, setStudentDetails] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!data.student_admission_no) {
            setStudentDetails(null);
            return;
        }

        const fetchStudent = async () => {
            setIsSearching(true);
            setError("");

            try {
                const response = await axios.get(`/students/${data.student_admission_no}`);
                const student = response.data;

                setStudentDetails(student);

                setData({
                    ...data,
                    from_class_id: student.class_id?.toString() || "",
                    from_section_id: student.section?.id?.toString() || "",
                    student_id: student?.id.toString() || ""
                });

            } catch (err: any) {
                setStudentDetails(null);
                setError(err.response?.data?.message || "Failed to fetch student");
            } finally {
                setIsSearching(false);
            }
        };

        fetchStudent();
    }, [data.student_admission_no]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log(data);
        try {
            const response = await axios.post('/parent-student-mapping', data);
            console.log(response);
            toast.success("Student mapped successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Parents Student Mapping', href: '/student-parent-mapping' }]}>
            <div className="p-8 space-y-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Parents Student Mapping</h1>
                    <Link
                        href={`/parent-accounts`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        View Parent Accounts
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">Selected Parent:</span>
                    <span className="text-lg font-semibold text-blue-600">
                        {parent?.first_name} {parent?.last_name}
                    </span>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Assigned Students</h2>
                    {parent?.students?.length === 0 ? (
                        <p className="text-gray-500 italic">No students assigned to this parent.</p>
                    ) : (
                        <div className="flex flex-wrap gap-3 max-h-64 overflow-y-auto">
                            {parent.students.map((student: any) => (
                                <div
                                    key={student.id}
                                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition w-56"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                        {student.first_name.charAt(0)}
                                        {student.last_name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 text-sm">{student.first_name} {student.last_name}</p>
                                        <div className="flex gap-1 mt-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Class {student.student_class?.name}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">{student.section?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    <fieldset disabled={processing} className="space-y-8">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Find Student by Admission ID</h2>

                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Admission ID</label>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText>ADM</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        type="number"
                                        placeholder="Enter admission id"
                                        value={data.student_admission_no}
                                        onChange={(e) => setData("student_admission_no", String(e.target.value))}
                                    />
                                </InputGroup>
                            </div>

                            {isSearching && (
                                <div className="flex items-center gap-2 mb-2">
                                    <Spinner />
                                    <span className="text-blue-600 font-medium">Searching...</span>
                                </div>
                            )}

                            {error && <p className="text-red-500 mb-2">{error}</p>}

                            {studentDetails && (
                                <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                                    <p><strong>Name:</strong> {studentDetails.first_name} {studentDetails.last_name}</p>
                                    <p><strong>Class:</strong> {studentDetails.student_class?.name}</p>
                                    <p><strong>Section:</strong> {studentDetails.section?.name}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm mb-1 block">Current Class ID</label>
                                    <Input readOnly value={data.from_class_id} className="bg-gray-100" />
                                    <Input hidden readOnly value={data.parent_id} className="bg-gray-100" />
                                </div>
                                <div>
                                    <label className="text-sm mb-1 block">Current Section ID</label>
                                    <Input readOnly value={data.from_section_id} className="bg-gray-100" />
                                </div>
                                <div>
                                    <label className="text-sm mb-1 block">Relation with student</label>
                                    <Select
                                        value={String(data.relation)}
                                        onValueChange={(value) => setData('relation', String(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select relation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="father">Father</SelectItem>
                                            <SelectItem value="mother">Mother</SelectItem>
                                            <SelectItem value="sister">Sister</SelectItem>
                                            <SelectItem value="brother">Brother</SelectItem>
                                            <SelectItem value="other">Others</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex mt-3 cursor-pointer items-center gap-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        Saving...
                                    </>
                                ) : (
                                    'Assign Parent Account'
                                )}
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </AppLayout>
    );
}
