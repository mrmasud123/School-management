import { Link } from "@inertiajs/react";
import { Button } from "../ui/button";

export default function StudentDetails({student}: {student: any}) {
    const baseUrl = import.meta.env.VITE_APP_URL;
    console.log("Base : " + baseUrl);
    const downloadIdCard = (id :number) => {
        window.open(`/students/idcard/${id}`, "_blank");
    };
    return (
            <div className="p-8">
                <section className="border rounded-lg p-6 bg-card space-y-6">
                <h1 className="text-2xl font-bold mb-4">Student Details</h1>
                <img
                    src={baseUrl + '/storage/' + student.photo}
                    alt={`${student.first_name} ${student.last_name}`}
                    className="w-32 h-32 object-cover rounded-full mb-4"
                />  
                    Name : {student.first_name} {student.last_name} <br />
                    Class : {student.student_class.name} <br />
                    Section : {student.section.name} <br />
                Date of Birth : {student.dob} <br />
                 <Button
                                        className="px-3 mt-4 cursor-pointer py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                                        onClick={() => downloadIdCard(student.id)}
                                    >
                                        Download ID Card
                                    </Button>
                 <Link
                                        className="px-3 ms-2 mt-4 cursor-pointer py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                                        href={'#'}
                                    >
                                        Create parent account?
                                    </Link>
                </section>
            </div>
    )
}
