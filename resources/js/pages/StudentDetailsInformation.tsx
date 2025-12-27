import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import React from "react"
import axios from "axios"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "@inertiajs/react"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import StudentDetails from "@/components/custom/StudentDetails"

export default function StudentDetailsInformation({
    classes,
}: {
    classes: any
}) {
    const form = useForm({
        student_id: 0,
        class_id: 0,
        section_id: 0,
    })
    


    const [sections, setSections] = React.useState<any[]>([])
    const [students, setStudents] = React.useState<any[]>([])
    const [studentDetails, setStudentDetails] = React.useState<any[]>([])
    const [loadSection, setLoadSection] = React.useState(false)
    const [loadStudent, setLoadStudent] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const [studentOpen, setStudentOpen] = React.useState(false)
    const [studentValue, setStudentValue] = React.useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.get('/student-all-details/' + form.data.student_id);
            setStudentDetails(response.data.student);
            console.log(response);
        } catch (error) {
            toast.error("Failed to fetch student details")
        } finally {
            setLoading(false)
        }
    }

    const handleClassChange = async (value: string) => {
        form.setData("class_id", Number(value))
        setLoadSection(true)
        setSections([])
        setStudents([])
        setStudentValue("")

        try {
            const response = await axios.get(
                `/fetch-sections-student-admission/${value}`
            )
            setSections(response.data.sections)
        } catch {
            toast.error("Failed to load sections")
        } finally {
            setLoadSection(false)
        }
    }

    const handleSectionChange = async (value: string) => {
        form.setData("section_id", Number(value))
        setLoadStudent(true)
        setStudents([])
        setStudentValue("")

        try {
            const response = await axios.get(`/fetch-students/${value}`)
            setStudents(response.data.students)
        } catch {
            toast.error("Failed to load students")
        } finally {
            setLoadStudent(false)
        }
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: "Student Details", href: "/student-details" },
            ]}
        >
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Student Details</h1>

                <form onSubmit={handleSubmit}>
                    <section className="border rounded-lg p-6 bg-card space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div>
                                <label className="text-sm font-medium">Select Class</label>
                                <Select onValueChange={handleClassChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls: any) => (
                                            <SelectItem key={cls.id} value={`${cls.id}`}>
                                                Class {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

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
                                        {sections.map((sec: any) => (
                                            <SelectItem key={sec.id} value={`${sec.id}`}>
                                                {sec.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Select Student</label>

                                <Popover
                                    open={studentOpen}
                                    onOpenChange={setStudentOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                            disabled={loadStudent || students.length === 0}
                                        >
                                            {studentValue
                                                ? (() => {
                                                    const student = students.find(
                                                        s => s.id.toString() === studentValue
                                                    );
                                                    return student
                                                        ? `${student.admission_no} - ${student.first_name} ${student.last_name}`
                                                        : "Choose student"
                                                })()
                                                : "Choose student"}

                                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search student..." />
                                            <CommandEmpty>No student found.</CommandEmpty>

                                            <CommandGroup>
                                                {students.map((sub: any) => (
                                                    <CommandItem
                                                        key={sub.id}
                                                        value={`${sub.id} ${sub.first_name} ${sub.last_name}`}
                                                        onSelect={() => {
                                                            setStudentValue(sub.id.toString())
                                                            form.setData("student_id", sub.id)
                                                            setStudentOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                studentValue === sub.id.toString()
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {sub.admission_no} - {sub.first_name}{" "}
                                                        {sub.last_name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        >
                            {loading ? "Loading..." : "Fetch Student Details"}
                        </Button>
                    </section>
                </form>
                
                {
                    studentDetails && studentDetails.id ? (
                        <div className="mt-8">
                            <StudentDetails student={studentDetails} />
                        </div>
                    ) : null
                }
            </div>
        </AppLayout>
    )
}
