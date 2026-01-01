import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

interface EditStaffProps {
    staff: any;
}

export default function Edit({ staff }: EditStaffProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        staff.photo_url ?? null
    );

    const { data, setData, post, put, processing } = useForm({
        first_name: staff.first_name || '',
        last_name: staff.last_name || '',
        gender: staff.gender || '',
        date_of_birth: staff.date_of_birth || '',
        joining_date: staff.joining_date || '',
        employment_status: staff.employment_status || 'permanent',
        phone: staff.phone || '',
        email: staff.email || '',
        address: staff.address || '',
        photo: null as File | null,
        is_active: staff.is_active || false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const staff_management = staff.id;
        post(`/staff-management/${staff_management}`, {
            forceFormData: true,
            data: {
                ...data,
                _method: 'PUT',
            },
            onSuccess: () => {
                toast.success('Staff updated successfully');
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Edit Staff', href: `/staff/${staff.id}/edit` }]}>
            <Head title="Edit Staff" />

            <form onSubmit={submit} className="p-6 space-y-8" encType="multipart/form-data">
                <fieldset disabled={processing} className="space-y-8">

                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Edit Staff</h1>
                        <Link
                            href="/staff-management"
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            All Staff
                        </Link>
                    </div>

                    {/* BASIC INFO */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label>First Name</Label>
                            <Input
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Last Name</Label>
                            <Input
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Gender</Label>
                            <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
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

                        <div>
                            <Label>Date of Birth</Label>
                            <Input
                                type="date"
                                value={data.date_of_birth}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Joining Date</Label>
                            <Input
                                type="date"
                                value={data.joining_date}
                                onChange={(e) => setData('joining_date', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Employment Status</Label>
                            <Select
                                value={data.employment_status}
                                onValueChange={(v) => setData('employment_status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="probation">Probation</SelectItem>
                                    <SelectItem value="permanent">Permanent</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="resigned">Resigned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </section>

                    {/* CONTACT */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label>Phone</Label>
                            <Input
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Address</Label>
                            <Textarea
                                className="resize-none"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </div>
                    </section>

                    {/* PHOTO */}
                    <section>
                        <Label>Photo</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setData('photo', file);
                                setPhotoPreview(file ? URL.createObjectURL(file) : null);
                            }}
                        />

                        {photoPreview && (
                            <div className="relative mt-3 w-40 h-40">
                                <img
                                    src={photoPreview}
                                    className="h-full w-full object-cover rounded-md border"
                                />
                                <X
                                    onClick={() => {
                                        setData('photo', null);
                                        setPhotoPreview(null);
                                    }}
                                    className="absolute top-0 right-0 w-7 h-7 cursor-pointer bg-red-500 text-white rounded-full p-1"
                                />
                            </div>
                        )}
                    </section>
                    <label className="mb-1 font-medium text-sm text-muted-foreground">
                        Account Status
                    </label>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm text-gray-600">Inactive</span>

                        <button
                            type="button"
                            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none ${data.is_active == true ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            onClick={() => setData('is_active', data.is_active ? false : true)}
                        >
                            <span
                                className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md ring-0 transition-transform duration-300 ${data.is_active == true ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            ></span>
                        </button>

                        <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        {processing ? (
                            <>
                                <Spinner className="w-5 h-5 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Staff'
                        )}
                    </Button>

                </fieldset>
            </form>
        </AppLayout>
    );
}
