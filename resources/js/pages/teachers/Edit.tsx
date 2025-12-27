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

export default function Edit({ teacher, designations, employmentTypes, qualifications, specializations }: any) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(teacher?.photo_url || null);
  const [existingDocument, setExistingDocument] = useState<string | null>(teacher?.document_url || null);
  console.log(existingImage)
  const { data, setData, post, processing, reset } = useForm({
    employee_id: teacher?.id || '',
    first_name: teacher?.first_name || '',
    last_name: teacher?.last_name || '',
    gender: teacher?.gender || '',
    date_of_birth: teacher?.date_of_birth || '',
    joining_date: teacher?.joining_date || '',
    experience_years: teacher?.experience_years || '',
    designation_id: String(teacher?.designation?.id) || '',
    employment_type_id: String(teacher?.employment_type?.id) || '',
    qualification_id: String(teacher?.qualification?.id) || '',
    specialization_ids: [
      ...(teacher?.specializations || []).map((s: any) => s.id),
    ] as number[],
    email: teacher?.contact?.email || '',
    phone: teacher?.contact?.phone || '',
    address: teacher?.contact?.address || '',
    photo: null as File | null,
    document_pdf: null as File | null,
  });

  console.log(data);
  console.log(employmentTypes)
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(processing);
    post(`/teachers/${teacher.id}`, {
      forceFormData: true,
      data: {
        ...data,
        _method: 'PUT', 
      },
      onSuccess: (masud) => {
        toast.success('Teacher updaeted successfully!');
        console.log("data " +masud)
        // reset();
        // router.visit('/teachers');
      },
      onError: (errors) => {
        toast.error(Object.values(errors)[0]);
      }
    });
  };

  const toggleSpecialization = (id: number) => {
    const updatedIds = data.specialization_ids.includes(id)
      ? data.specialization_ids.filter(item => item !== id)
      : [...data.specialization_ids, id] ;
   
    setData('specialization_ids', updatedIds);
  
    console.log("Updated specializations:", updatedIds); 
  };
  

  return (
    <AppLayout breadcrumbs={[{ title: 'Edit Teacher', href: `/teachers/${teacher?.id}/edit` }]}>
      <Head title="Edit Teacher" />

      <form onSubmit={submit} className="p-6 space-y-8" encType={"multipart/form-data"}>
        <fieldset disabled={processing} className="space-y-8">

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Teacher - <span className='px-2 py-1 bg-green-500 text-white rounded-md'>{teacher.first_name } {teacher.last_name}</span></h1>
            <Link href="/teachers" className="cursor-pointer px-3 py-1  bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ">All Teachers</Link>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

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
              <Select value={data.gender} onValueChange={value => setData('gender', value)}>
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
 
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className='mb-2'>Designation</Label>
              <Select value={data.designation_id} onValueChange={value => setData('designation_id', value)}>
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
              <Select value={data.employment_type_id} onValueChange={value => setData('employment_type_id', value)}>
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
              <Select value={data.qualification_id} onValueChange={value => setData('qualification_id', value)}>
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
              {teacher?.photo_url && existingImage && (
                <div className="relative mt-3 w-40 h-40">
                  <img
                    className="object-cover rounded-md border h-full w-full"
                    src={teacher.photo_url}
                    alt=""
                  />

                  <X
                    onClick={() => setExistingImage(null)}
                    className="w-7 h-7 absolute top-0 right-0 rounded-full cursor-pointer bg-red-500 text-white p-1"
                  />
                </div>
              )}
              {
                existingImage === null && !photoPreview && teacher?.photo_url === null && (
                  <div className="mt-3 text-white rounded-md px-3 py-1 bg-red-500">No photo uploaded.</div>
                ) 
              }
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
              {teacher?.document_url && existingDocument && (
                <div className="relative mt-3 w-full h-80 border rounded-md overflow-hidden">
                  <iframe
                    src={existingDocument}
                    className="w-full h-full"
                    title="PDF Preview"
                  />

                  <X
                    onClick={() => setExistingDocument(null)}
                    className="w-7 h-7 absolute top-0 right-0 rounded-full cursor-pointer bg-red-500 text-white p-1"
                  />
                </div>
              )}
              {
                existingDocument === null && !pdfPreview && teacher?.document_url === null && (
                  <div className="mt-3 text-white rounded-md px-3 py-1 bg-red-500">No document uploaded.</div>
                ) 
              }
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
