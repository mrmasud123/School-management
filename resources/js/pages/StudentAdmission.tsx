import { Head,useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
// import { useForm } from 'react-hook-form';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@/components/ui/input-group";


import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function StudentAdmission() {
 
    const form = useForm({
        first_name: "",
        last_name: "",
        dob: "",
        gender: "",
        blood_group: "",
        nationality: "",
        religion: "",
        photo: null,
        email: "",
        phone: "",
        guardian_phone: "",
        current_address: "",
        permanent_address: "",
        class_id: "",
        section_id: "",
        previous_school: "",
        admission_date: "",
        academic_year: "",
        roll_no: "",
        father_name: "",
        father_occupation: "",
        mother_name: "",
        mother_occupation: "",
        guardian_relation: "",
        guardian_contact: "",
        status: "pending",
        admission_no: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted");
        console.log(form); 
    };
    
    return (
        <AppLayout breadcrumbs={[{ title: 'Student Admission', href: '/student-admission' }]}>
            <Head title="Student Admission" />

            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-3xl font-bold">Student Admission</h1>
                <p className="text-muted-foreground">Fill out the form below to register a new student.</p>

                <form onSubmit={handleSubmit}>
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
                    <Input
                        placeholder="Hindu, Christian, etc."
                        value={form.data.religion}
                        onChange={e => form.setData('religion', e.target.value)}
                    />
                </div>

                <div className="flex flex-col col-span-1 md:col-span-2">
                    <label className="mb-1 font-medium text-sm text-muted-foreground">Photo Upload</label>
                    <Input
                        type="file"
                        accept="image/*"
                        // onChange={e => form.setData('photo', e.target.files?.[0] || null)}
                    />
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

                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-sm text-muted-foreground">Student Phone</label>
                    <Input
                        placeholder="+880123456789"
                        value={form.data.phone}
                        onChange={e => form.setData('phone', e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-sm text-muted-foreground">Parent / Guardian Phone</label>
                    <Input
                        placeholder="+880987654321"
                        value={form.data.guardian_phone}
                        onChange={e => form.setData('guardian_phone', e.target.value)}
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

                <div className="flex flex-col col-span-1 md:col-span-2">
                    <label className="mb-1 font-medium text-sm text-muted-foreground">Permanent Address</label>
                    <Textarea
                        placeholder="Full address..."
                        value={form.data.permanent_address}
                        onChange={e => form.setData('permanent_address', e.target.value)}
                    />
                </div>

            </div>
        </section>

        {/* Academic Information */}
        <section className="border rounded-lg p-6 space-y-4 bg-card">
            <h2 className="text-xl font-semibold">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-sm text-muted-foreground">Class / Grade</label>
                    <Input
                        placeholder="10, 11, 12..."
                        value={form.data.class_id}
                        onChange={e => form.setData('class_id', e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 font-medium text-sm text-muted-foreground">Section</label>
                    <Input
                        placeholder="A, B, C..."
                        value={form.data.section_id}
                        onChange={e => form.setData('section_id', e.target.value)}
                    />
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
                        value={form.data.guardian_contact}
                        onChange={e => form.setData('guardian_contact', e.target.value)}
                    />
                </div>

            </div>
        </section>

        {/* System Details */}
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
            <Button type="submit" className="w-full md:w-auto cursor-pointer">Submit Admission</Button>
        </div>

    </div>
</form>

            </div>
        </AppLayout>
    );
}
