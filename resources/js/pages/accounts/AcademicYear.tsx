import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function AcademicYear({ academicYears }) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [processing, setProcessing] = useState(false);
    const { data, setData, reset } = useForm({
        yearDigits: Array(8).fill(''),
        name: '',
    });

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const digits = [...data.yearDigits];
        digits[index] = value;
        setData('yearDigits', digits);

        if (value && index < 7) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Backspace' && !data.yearDigits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setProcessing(true);

        if (data.yearDigits.includes('')) {
            toast.error('Please enter all 8 digits');
            setProcessing(false);
            return;
        }
        const name =
            data.yearDigits.slice(0, 4).join('') +
            '-' +
            data.yearDigits.slice(4).join('');
        router.post(
            '/accountants/store-academic-year',
            {
                name: name,
            },
            {
                onSuccess: (data) => {
                    toast.success('Academic year created');
                    reset();
                    setProcessing(false);
                },
                onError: (err) => {
                    setProcessing(false);
                    toast.error(err.name);
                },
            },
        );
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Academic Year', href: '/accountants/academic-year' },
            ]}
        >
            <div className="grid grid-cols-2 gap-6">
                {/* FORM */}
                <form onSubmit={submit} className="max-w-xl space-y-6 p-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Academic Year</h2>
                        <Link href="/accountants">
                            <Button className="cursor-pointer">
                                <ArrowLeft /> Back
                            </Button>
                        </Link>
                    </div>

                    <div>
                        <Label className="mb-3 block">Academic Year</Label>

                        <div className="flex items-center gap-2">
                            {data.yearDigits.map((digit, index) => (
                                <div key={index} className="flex items-center">
                                    {index === 4 && (
                                        <span className="mx-2 text-xl font-semibold">
                                            -
                                        </span>
                                    )}

                                    <input
                                        ref={(el) =>
                                            (inputsRef.current[index] = el)
                                        }
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) =>
                                            handleChange(index, e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(index, e)
                                        }
                                        className="h-12 w-10 rounded border text-center text-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <Spinner />
                                Saving...
                            </div>
                        ) : (
                            'Save Academic Year'
                        )}
                    </Button>
                </form>

                {/* LIST */}
                <div className="max-w-xl space-y-6 p-8">
                    <h2 className="text-2xl font-bold">All Academic Years</h2>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="py-2">Academic Year</th>
                                <th>Description</th>
                                <th className="text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {academicYears.map((academicYear) => (
                                <TableRow
                                    key={academicYear.id}
                                    name={academicYear.name}
                                    description={
                                        academicYear.description ?? 'N/A'
                                    }
                                    date={academicYear.created_at}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

function TableRow({
    name,
    description,
    date,
}: {
    name: string;
    description: string;
    date: string;
}) {
    return (
        <tr className="border-b last:border-0">
            <td className="py-2">{name}</td>
            <td>{description}</td>
            <td className="text-right text-slate-500">{date.split('T')[0]}</td>
        </tr>
    );
}
