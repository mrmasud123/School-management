import CustomError from '@/components/custom/CustomError';
import CustomLoader from '@/components/custom/CustomLoader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';

type FeeStructure = {
    id: number;
    amount: number;
    is_paid: boolean;
    paid_month: string;
    fee_category?: {
        name: string;
    };
};

export default function CollectFee() {
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
    const [selectedFeeStructures, setSelectedFeeStructures] = useState<
        number[]
    >([]);
    const [studentDetails, setStudentDetails] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, reset } = useForm({
        student_admission_id: '',
        student_id: '',
        class_id: '',
        fee_structure_ids: [] as number[],
        amount_paid: '',
        payment_method_id: '',
        payment_date: new Date().toISOString().slice(0, 10),
        remarks: '',
    });

    useEffect(() => {
        setData('fee_structure_ids', selectedFeeStructures);
    }, [selectedFeeStructures]);

    useEffect(() => {
        if (!data.student_admission_id) {
            setStudentDetails(null);
            setFeeStructures([]);
            setSelectedFeeStructures([]);
            return;
        }

        const fetchStudent = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(
                    `/accountants/fetch-student-fee-details/${data.student_admission_id}`,
                );

                const student = res.data.student;

                setStudentDetails(student);
                setData('student_id', student.id.toString());
                setData('class_id', student.class_id.toString());
                setFeeStructures(res?.data?.feeStructures);
                console.log(res.data);
            } catch (err: any) {
                setStudentDetails(null);
                setFeeStructures([]);
                setSelectedFeeStructures([]);
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudent();
    }, [data.student_admission_id]);

    const calculateTotalAmount = (selectedIds: number[]) => {
        return feeStructures
            .filter((fs) => selectedIds.includes(fs.id))
            .reduce((sum, fs) => sum + Number(fs.amount), 0);
    };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        router.post(
            '/accountants/store-collect-fee',
            {
                ...data,
            },
            {
                onSuccess: (data) => {
                    toast.success('Fee collected successfully');
                    reset();
                    setIsProcessing(false);
                },
                onError: (err) => {
                    setIsProcessing(false);
                    toast.error(Object.values(err)[0] as string);
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            },
        );
    };

    const generatePDF = () => {
        // const url = route('students.export.pdf', {
        //     student_id: data.student_id,
        //     class_id: data.class_id,
        //     fee_structure_ids: data.fee_structure_ids,
        // });
        // window.open(url, '_blank');
    };

    const exportExcel = () => {
        console.log('Export Excel', feeStructures);
    };

    const feeColumns: TableColumn<FeeStructure>[] = [
        {
            name: 'Fee Category',
            cell: (row) => (
                <span
                    className={`inline-block rounded-md px-2 py-1 text-xs font-semibold`}
                >
                    {row.fee_category?.name ?? 'N/A'}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Amount',
            selector: (row) => row.amount,
            sortable: true,
            cell: (row) => `৳ ${row.amount}`,
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Collect Fee', href: '/accountants/collect-fee' },
            ]}
        >
            <div className="grid grid-cols-10 gap-6 p-8">
                <form
                    onSubmit={submit}
                    className="col-span-4 space-y-6 rounded-lg border p-6"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Collect Fee</h2>
                        <Link href="/accountants">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                    </div>

                    <div>
                        <Label className="mb-2">Admission ID</Label>
                        <InputGroup>
                            <InputGroupAddon>
                                <InputGroupText>ADM</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                type="number"
                                value={data.student_admission_id}
                                onChange={(e) =>
                                    setData(
                                        'student_admission_id',
                                        e.target.value,
                                    )
                                }
                            />
                        </InputGroup>
                    </div>

                    <div>
                        <Label className="mb-2">Fee Structures</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                    disabled={!feeStructures.length}
                                >
                                    {selectedFeeStructures.length
                                        ? `${selectedFeeStructures.length} selected`
                                        : 'Select Fee Structures'}
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-64">
                                {feeStructures.map((fs) => (
                                    <div
                                        key={fs.id}
                                        className="flex items-center gap-2 px-2 py-1"
                                    >
                                        <Checkbox
                                            className="cursor-pointer"
                                            checked={selectedFeeStructures.includes(
                                                fs.id,
                                            )}
                                            onCheckedChange={() => {
                                                setSelectedFeeStructures(
                                                    (prev) => {
                                                        const updated =
                                                            prev.includes(fs.id)
                                                                ? prev.filter(
                                                                      (id) =>
                                                                          id !==
                                                                          fs.id,
                                                                  )
                                                                : [
                                                                      ...prev,
                                                                      fs.id,
                                                                  ];

                                                        const total =
                                                            calculateTotalAmount(
                                                                updated,
                                                            );
                                                        setData(
                                                            'amount_paid',
                                                            total.toString(),
                                                        );

                                                        return updated;
                                                    },
                                                );
                                            }}
                                        />

                                        <span>{fs.fee_category?.name}</span>
                                    </div>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div>
                        <Label className="mb-2">Amount Paid</Label>
                        <Input
                            readOnly
                            type="number"
                            value={data.amount_paid}
                            onChange={(e) =>
                                setData('amount_paid', e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label className="mb-2">Payment Date</Label>
                        <Input
                            type="date"
                            value={data.payment_date}
                            onChange={(e) =>
                                setData('payment_date', e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Remarks</Label>
                        <Textarea
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                        />
                    </div>

                    <Button type="submit" disabled={isProcessing}>
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <Spinner />
                                Saving...
                            </div>
                        ) : (
                            'Save Payment'
                        )}
                    </Button>
                </form>

                <div className="col-span-6 rounded-lg border p-6">
                    <div className="space-y-6">
                        <p className="text-muted-foreground">
                            Enter Admission ID to view student details
                        </p>
                        {isLoading ? (
                            <CustomLoader />
                        ) : !studentDetails ? (
                            <CustomError
                                title="Student Not Found"
                                description="We couldn’t locate any student record with this Admission ID. Please verify the number or try again."
                                icon="🎓"
                            />
                        ) : (
                            <>
                                <div className="flex flex-col items-start gap-6 md:flex-row">
                                    <img
                                        src={studentDetails.photo_url}
                                        alt="Student"
                                        className="h-32 w-32 rounded-lg border object-cover"
                                    />

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold">
                                            {studentDetails.first_name}{' '}
                                            {studentDetails.last_name}
                                        </h3>

                                        <p>
                                            <strong>Admission No:</strong>{' '}
                                            {studentDetails.admission_no}
                                        </p>

                                        <p>
                                            <strong>Class:</strong>{' '}
                                            {studentDetails.student_class?.name}
                                        </p>

                                        <p>
                                            <strong>Section:</strong>{' '}
                                            {studentDetails.section?.name}
                                        </p>

                                        <p>
                                            <strong>Academic Year:</strong>{' '}
                                            {studentDetails.academic_year}
                                        </p>

                                        <p>
                                            <strong>Status:</strong>{' '}
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                    studentDetails.status ===
                                                    'approved'
                                                        ? 'bg-green-100 text-green-700'
                                                        : studentDetails.status ===
                                                            'pending'
                                                          ? 'bg-yellow-100 text-yellow-700'
                                                          : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {studentDetails.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {feeStructures?.length > 0 && (
                                    <div className="">
                                        <DataTable
                                            title="Assigned Fee Structures"
                                            columns={feeColumns}
                                            data={feeStructures}
                                            pagination
                                            highlightOnHover
                                            striped
                                            actions={
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                        onClick={generatePDF}
                                                    >
                                                        Export PDF
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 text-white hover:bg-green-700"
                                                        onClick={exportExcel}
                                                    >
                                                        Export Excel
                                                    </Button>
                                                </div>
                                            }
                                            customStyles={{
                                                header: {
                                                    style: {
                                                        borderTopLeftRadius:
                                                            '10px',
                                                        borderTopRightRadius:
                                                            '10px',
                                                    },
                                                },
                                                pagination: {
                                                    style: {
                                                        borderBottomLeftRadius:
                                                            '10px',
                                                        borderBottomRightRadius:
                                                            '10px',
                                                        overflow: 'hidden',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
