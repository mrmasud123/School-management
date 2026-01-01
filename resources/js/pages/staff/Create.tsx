import { Head, Link, router, useForm } from '@inertiajs/react';
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

export default function CreateStaff() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    staff_code: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    joining_date: '',
    employment_status: 'permanent',
    phone: '',
    email: '',
    address: '',
    photo: null as File | null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/staff-management', {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Staff added successfully');
        reset();
      },
      onError: (errors) => {
        toast.error(Object.values(errors)[0] as string);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Create Staff', href: '/staff/create' }]}>
      <Head title="Create Staff" />

      <form onSubmit={submit} className="p-6 space-y-8" encType="multipart/form-data">
        <fieldset disabled={processing} className="space-y-8">

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Create Staff</h1>
            <Link
              href="/staff-management"
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              All Staff
            </Link>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <Label className="mb-2">First Name</Label>
              <Input
                placeholder="First name"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2">Last Name</Label>
              <Input
                placeholder="Last name"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2">Gender</Label>
              <Select onValueChange={(value) => setData('gender', value)}>
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
              <Label className="mb-2">Date of Birth</Label>
              <Input
                type="date"
                value={data.date_of_birth}
                onChange={(e) => setData('date_of_birth', e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2">Joining Date</Label>
              <Input
                type="date"
                value={data.joining_date}
                onChange={(e) => setData('joining_date', e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2">Employment Status</Label>
              <Select
                value={data.employment_status}
                onValueChange={(value) => setData('employment_status', value)}
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

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-2">Phone</Label>
              <Input
                placeholder="Phone number"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2">Email</Label>
              <Input
                type="email"
                placeholder="Email address"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
            </div>
            <section>
              <Label className="mb-2">Address</Label>
              <Textarea
                placeholder="Full address"
                className='resize-none'
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}>
              </Textarea>

            </section>

          </section>



          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setData('photo', file);

                  if (file) {
                    setPhotoPreview(URL.createObjectURL(file));
                  } else {
                    setPhotoPreview(null);
                  }
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
            </div>
          </section>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <>
                  <Spinner className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Create Staff'
              )}
            </Button>
          </div>

        </fieldset>
      </form>
    </AppLayout>
  );
}
