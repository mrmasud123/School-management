import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Button } from '../ui/button';
export default function StudentDetails({ student }: { student: any }) {
    const baseUrl = import.meta.env.VITE_APP_URL;
    const [feeHistories, setFeeHistories] = useState<any>([]);
    const downloadIdCard = (id: number) => {
        window.open(`/students/idcard/${id}`, '_blank');
    };
    useEffect(() => {
        if (student?.student_fee) {
            setFeeHistories(student.student_fee);
        }
    }, [student]);

    console.log(feeHistories);
    const feeColumns: TableColumn<feeHistories>[] = [
        {
            name: 'Fee Category',
            cell: (row) => (
                <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize bg-green-100 text-gree-700}`}
                >
                    {row.category_name ?? 'N/A'}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Amount',
            selector: (row) => row.fee_payment.amount_paid,
            sortable: true,
            cell: (row) => `৳ ${row.fee_payment.amount_paid}`,
        },
        {
            name: 'Paid Month',
            cell: (row) => (
                <span className="rounded-md bg-purple-500 px-2 py-1 text-xs font-semibold text-white">
                    {row.month}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Status',
            cell: () => (
                <span
                    className={`inline-block rounded-md px-2 py-1 text-xs font-semibold text-white bg-green-600`}
                >
                    Paid
                </span>
            ),
        },
    ];

    const generatePDF=(id: number)=>{
        window.open(`/students/generate-payment-history/${id}`, "_blank");
    }
    return (
        <div className="p-8">
            <section className="rounded-lg border bg-card p-6">
                <h1 className="mb-4 text-2xl font-bold">Student Details</h1>
                <img
                    src={student.photo_url}
                    alt={`${student.first_name} ${student.last_name}`}
                    className="mb-4 h-32 w-32 rounded-full object-cover"
                />
                Name : {student.first_name} {student.last_name} <br />
                Class : {student.student_class.name} <br />
                Section : {student.section.name} <br />
                Date of Birth : {student.dob} <br />
                <Button
                    className="mt-4 cursor-pointer rounded-md bg-blue-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
                    onClick={() => downloadIdCard(student.id)}
                >
                    Download ID Card
                </Button>
                <Link
                    className="ms-2 mt-4 cursor-pointer rounded-md bg-yellow-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-yellow-600"
                    href={'/parent-accounts/create/'}
                >
                    Create parent account?
                </Link>
                <div className="mt-4">
                    <DataTable
                        title="Student fee payment history"
                        columns={feeColumns}
                        data={feeHistories}
                        pagination
                        highlightOnHover
                        striped
                        actions={
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={()=> generatePDF(student.id)}
                                >
                                    Export PDF
                                </Button>

                                <Button
                                    size="sm"
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    // onClick={exportExcel}
                                >
                                    Export Excel
                                </Button>
                            </div>
                        }
                        customStyles={{
                            header: {
                                style: {
                                    borderTopLeftRadius: '10px',
                                    borderTopRightRadius: '10px',
                                },
                            },
                            pagination: {
                                style: {
                                    borderBottomLeftRadius: '10px',
                                    borderBottomRightRadius: '10px',
                                    overflow: 'hidden',
                                },
                            },
                        }}
                    />
                </div>
            </section>
        </div>
    );
}
