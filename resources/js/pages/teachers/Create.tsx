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

export default function Create({ designations, employmentTypes, qualifications, specializations }: any) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const { data, setData, post, processing, reset, errors } = useForm({
    employee_id: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    joining_date: '',
    experience_years: '',
    designation_id: '',
    employment_type_id: '',
    qualification_id: '',
    specialization_ids: [] as number[],
    email: '',
    phone: '',
    address: '',
    photo: null as File | null,
    document_pdf: null as File | null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(processing);
    post('/teachers',{
      forceFormData: true,
      onSuccess: (masud) => {
        toast.success('Teacher added successfully!');
        console.log(masud)
        reset();
        router.visit('/teachers');
      },
      onError: (errors) => {
        toast.error(Object.values(errors)[0]);
      }
    });
  };

  const toggleSpecialization = (id: number) => {
    setData(
      'specialization_ids',
      data.specialization_ids.includes(id)
        ? data.specialization_ids.filter(item => item !== id)
        : [...data.specialization_ids, id]
    );
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Create Teacher', href: '/teachers/create' }]}>
      <Head title="Create Teacher" />

      <form onSubmit={submit} className="p-6 space-y-8" encType={"multipart/form-data"}>
      <fieldset disabled={processing} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Teacher</h1>
          <Link href="/teachers" className="cursor-pointer px-3 py-1  bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ">All Teachers</Link>
        </div>

        {/* Basic Information */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <div>
                        <Label className='mb-2'>Employee ID</Label>
                        <Input value={data.employee_id} onChange={e => setData('employee_id', e.target.value)} />
                    </div> */}

          <div>
            <Label className='mb-2'>First Name</Label>
            <Input placeholder='Enter first name' value={data.first_name} onChange={e => setData('first_name', e.target.value)} />
          </div>

          <div>
            <Label className='mb-2'>Last Name</Label>
            <Input placeholder='Enter last name' value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
          </div>

          <div>
            <Label className='mb-2'>Gender</Label>
            <Select onValueChange={value => setData('gender', value)}>
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
            <Label className='mb-2'>Date of Birth</Label>
            <Input placeholder='DOB' type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} />
          </div>

          <div>
            <Label className='mb-2'>Joining Date</Label>
            <Input type="date" value={data.joining_date} onChange={e => setData('joining_date', e.target.value)} />
          </div>
        </section>

        {/* Employment Details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className='mb-2'>Designation</Label>
            <Select onValueChange={value => setData('designation_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                {designations.map((d: any) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className='mb-2'>Employment Type</Label>
            <Select onValueChange={value => setData('employment_type_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map((t: any) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className='mb-2'>Experience (Years)</Label>
            <Input type="number" value={data.experience_years} onChange={e => setData('experience_years', e.target.value)} />
          </div>
        </section>

        {/* Academic */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className='mb-2'>Highest Qualification</Label>
            <Select onValueChange={value => setData('qualification_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select qualification" />
              </SelectTrigger>
              <SelectContent>
                {qualifications.map((q: any) => (
                  <SelectItem key={q.id} value={String(q.id)}>
                    {q.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className='mb-2'>Specializations</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
              {specializations.map((s: any) => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={data.specialization_ids.includes(s.id)}
                    onChange={() => toggleSpecialization(s.id)}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className='mb-2'>Email</Label>
            <Input placeholder='Enter email' type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
          </div>

          <div>
            <Label className='mb-2'>Phone</Label>
            <Input placeholder='Enter phone number' value={data.phone} onChange={e => setData('phone', e.target.value)} />
          </div>

          <div>
            <Label className='mb-2'>Address</Label>
            <Input placeholder='Enter address' value={data.address} onChange={e => setData('address', e.target.value)} />
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className='mb-2'>Upload Photo</Label>
            <Input
              placeholder='Upload photo'
              accept="image/jpeg,image/png,image/webp,image/jpg"
              type="file"
              onChange={e => {
                const file = e.target.files?.[0] || null;
                setData('photo', file);
                if (file) {
                  const previewUrl = URL.createObjectURL(file as File);
                  setPhotoPreview(previewUrl);
                } else {
                  setData('photo', null);
                  setPhotoPreview(null);
                }
              }} />

            {photoPreview && (
              <div className="relative mt-3 w-40 h-40">
                <img
                  className="object-cover rounded-md border h-full w-full"
                  src={photoPreview}
                  alt="Preview"
                />

                <X
                  onClick={() => {
                    setData('photo', null);
                    setPhotoPreview(null);

                  }}
                  className="w-7 h-7 absolute top-0 right-0 rounded-full cursor-pointer bg-red-500 text-white p-1"
                />
              </div>
            )}
          </div>

          <div>
            <Label className="mb-2">Upload PDF</Label>

            <Input
              type="file"
              accept="application/pdf"
              onChange={e => {
                const file = e.target.files?.[0] || null;

                if (file && file.type === 'application/pdf') {
                  setData('document_pdf', file);
                  const previewUrl = URL.createObjectURL(file);
                  setPdfPreview(previewUrl);
                } else {
                  setData('document_pdf', null);
                  setPdfPreview(null);
                }
              }}
            />

            {pdfPreview && (
              <div className="relative mt-3 w-full h-80 border rounded-md overflow-hidden">
                <iframe
                  src={pdfPreview}
                  className="w-full h-full"
                  title="PDF Preview"
                />

                <X
                  onClick={() => {
                    setData('document_pdf', null);
                    setPdfPreview(null);
                  }}
                  className="w-7 h-7 absolute top-2 right-2 rounded-full cursor-pointer bg-red-500 text-white p-1"
                />
              </div>
            )}
          </div>

        </section>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={processing}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? (
              <>
                <Spinner className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
          
          </div>
          </fieldset>
      </form>
    </AppLayout>
  );
}
