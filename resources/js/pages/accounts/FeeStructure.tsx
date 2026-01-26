import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';

interface FeeStructureProps {
    feeCategories: FeeCategory[];
    classes: SchoolClass[];
    academicYears: AcademicYear[];
}

interface FeeCategory {
    id: number;
    name: string;
    description: string;
}

interface SchoolClass {
    id: number;
    name: string;
}

interface AcademicYear {
    id: number;
    name: string;
}

export default function FeeStructure({
    feeCategories,
    classes,
    academicYears,
    feeStructures,
}: FeeStructureProps) {
    console.log(feeStructures);
    const [processing, setProcessing] = useState(false);
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(10);

    const { data, setData, reset, errors } = useForm({
        fee_category_id: '',
        amount: '',
        fee_date: new Date().toISOString().slice(0, 10),
        description: '',
        class_id: '',
        academic_year_id: '',
    });

    const fetchFeeStructures = (
        page = 1,
        per_page = perPage,
        searchText = search,
    ) => {
        router.get(
            '/accountants/fee-structure',
            {
                page,
                per_page,
                search: searchText,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        router.post(
            '/accountants/store-fee-structure',
            {
                fee_category_id: data.fee_category_id,
                amount: data.amount,
                fee_date: data.fee_date,
                description: data.description,
                class_id: data.class_id,
                academic_year_id: data.academic_year_id,
            },
            {
                onSuccess: (data) => {
                    toast.success('Fee Structure Created Successfully');
                    reset();
                    setProcessing(false);
                },
                onError: (err) => {
                    setProcessing(false);
                    console.log(err);
                    toast.error(Object.values(err)[0] as string);
                },
            },
        );
    }

    const columns: TableColumn<FeeStructureProps>[] = [
        {
            name: 'Session',
            cell: (row) => `${row.academic_year?.name}`,
            sortable: true,
        },
        {
            name: 'Class',
            cell: (row) => `Class ${row.student_class?.name}`,
            sortable: true,
        },
        {
            name: 'Category',
            cell: (row) => `${row.fee_category?.name}`,
            sortable: true,
        },
        {
            name: 'Amount',
            cell: (row) => `${row.amount}`,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Action</Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Link
                                    // href={`/students/${row.id}/edit`}
                                    className="flex items-center gap-2"
                                >
                                    <Edit size={16} /> Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                // onClick={() => handleDelete(row.id)}
                                className="text-red-600"
                            >
                                <Trash size={16} /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Fee Structure', href: '/accountants/fee-structure' },
            ]}
        >
            <div className="grid grid-cols-[40%_60%] gap-6">
                <form onSubmit={submit} className="space-y-6 p-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Fee Structure</h2>
                        <Link href="/accountants">
                            <Button className="cursor-pointer">
                                <ArrowLeft /> Back
                            </Button>
                        </Link>
                    </div>

                    <div>
                        <Label className="mb-3">Fee Category</Label>
                        <Select
                            value={data.fee_category_id}
                            onValueChange={(v) => setData('fee_category_id', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select fee category" />
                            </SelectTrigger>

                            <SelectContent>
                                {feeCategories?.map((cat) => (
                                    <SelectItem
                                        key={cat.id}
                                        value={String(cat.id)}
                                    >
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-3">Student Class</Label>
                        <Select
                            value={data.class_id}
                            onValueChange={(v) => setData('class_id', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>

                            <SelectContent>
                                {classes?.map((cls) => (
                                    <SelectItem
                                        key={cls.id}
                                        value={String(cls.id)}
                                    >
                                        Class - {cls.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-3">Academic Year</Label>
                        <Select
                            value={data.academic_year_id}
                            onValueChange={(v) =>
                                setData('academic_year_id', v)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose academic year" />
                            </SelectTrigger>

                            <SelectContent>
                                {academicYears?.map((year) => (
                                    <SelectItem
                                        key={year.id}
                                        value={String(year.id)}
                                    >
                                        {year.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-3">Amount</Label>
                        <Input
                            type="number"
                            min={0}
                            value={data.amount}
                            placeholder="Enter amount"
                            onChange={(e) => setData('amount', e.target.value)}
                        />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <Spinner />
                                Saving...
                            </div>
                        ) : (
                            'Save Fee Structure'
                        )}
                    </Button>
                </form>

                <div className="max-w-xl p-8">
                    <DataTable
                        title="Fee Structures"
                        columns={columns}
                        data={feeStructures.data}
                        pagination
                        paginationServer
                        paginationTotalRows={feeStructures.total}
                        paginationPerPage={feeStructures.per_page}
                        paginationDefaultPage={feeStructures.current_page}
                        onChangePage={(page) => fetchFeeStructures(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setPerPage(newPerPage);
                            fetchFeeStructures(page, newPerPage);
                        }}
                        highlightOnHover
                        pointerOnHover
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
            </div>
        </AppLayout>
    );
}

function TableRow({
    session,
    name,
    category,
    amount,
    date,
}: {
    session: string;
    name: string;
    category: string;
    amount: string;
    date: string;
}) {
    return (
        <tr className="border-b last:border-0">
            <td>{session}</td>
            <td className="py-2">Class {name}</td>
            <td>{category}</td>
            <td>{amount}</td>
            <td className="text-right text-slate-500">{date.split('T')[0]}</td>
        </tr>
    );
}
