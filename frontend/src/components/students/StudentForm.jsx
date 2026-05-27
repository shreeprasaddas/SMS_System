import React from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button, Card } from '@/components/common';
import { useGetClassesQuery } from '@/store/api/classApi.js';
import toast from 'react-hot-toast';

function StudentForm({ initialData = null, onSubmit, isLoading = false }) {
  // Fetch available classes from the database
  const { data: classesResponse, isLoading: classesLoading } = useGetClassesQuery({ limit: 100 });
  const classes = classesResponse?.data || [];

  // Helper to map nested student fields from backend to flat form values
  const mapStudentToForm = React.useMemo(() => {
    if (!initialData) return null;
    return {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
      gender: initialData.gender || '',
      bloodGroup: initialData.bloodGroup || '',
      address: initialData.address?.street || (typeof initialData.address === 'string' ? initialData.address : ''),
      city: initialData.address?.city || initialData.city || '',
      state: initialData.address?.state || initialData.state || '',
      postalCode: initialData.address?.postalCode || initialData.postalCode || '',
      parentName: initialData.guardians?.[0]?.name || initialData.parentName || '',
      parentPhone: initialData.guardians?.[0]?.phone || initialData.parentPhone || '',
      parentEmail: initialData.guardians?.[0]?.email || initialData.parentEmail || '',
      rollNumber: initialData.rollNumber !== undefined ? String(initialData.rollNumber) : '',
      classId: initialData.class?._id || initialData.class || initialData.classId || '',
      admissionDate: initialData.admissionDate ? new Date(initialData.admissionDate).toISOString().split('T')[0] : '',
    };
  }, [initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: mapStudentToForm || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      rollNumber: '',
      classId: '',
      admissionDate: '',
      bloodGroup: '',
    },
  });

  React.useEffect(() => {
    if (mapStudentToForm) {
      reset(mapStudentToForm);
    }
  }, [mapStudentToForm, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        reset();
        toast.success(initialData ? 'Student updated successfully' : 'Student created successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save student');
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              {...register('firstName', { required: 'First name is required' })}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              {...register('lastName', { required: 'Last name is required' })}
              error={errors.lastName?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
              error={errors.email?.message}
            />
            <Input
              label="Phone"
              placeholder="+1234567890"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <Input
              label="Date of Birth"
              type="date"
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                {...register('gender')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <Input
              label="Blood Group"
              placeholder="O+"
              {...register('bloodGroup')}
              error={errors.bloodGroup?.message}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Address"
              placeholder="123 Main Street"
              {...register('address')}
              error={errors.address?.message}
            />
            <Input
              label="City"
              placeholder="New York"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="State/Province"
              placeholder="NY"
              {...register('state')}
              error={errors.state?.message}
            />
            <Input
              label="Postal Code"
              placeholder="10001"
              {...register('postalCode')}
              error={errors.postalCode?.message}
            />
          </div>
        </div>

        {/* Parent/Guardian Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Parent/Guardian Name"
              placeholder="Jane Doe"
              {...register('parentName', { required: 'Parent name is required' })}
              error={errors.parentName?.message}
            />
            <Input
              label="Parent Phone"
              placeholder="+1234567890"
              {...register('parentPhone', { required: 'Parent phone is required' })}
              error={errors.parentPhone?.message}
            />
            <Input
              label="Parent Email"
              type="email"
              placeholder="jane@example.com"
              {...register('parentEmail')}
              error={errors.parentEmail?.message}
            />
          </div>
        </div>

        {/* Academic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Roll Number"
              placeholder="001"
              {...register('rollNumber', { required: 'Roll number is required' })}
              error={errors.rollNumber?.message}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Class <span className="text-red-500">*</span></label>
              <select
                {...register('classId', { required: 'Class is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a Class</option>
                {classesLoading && <option disabled>Loading classes...</option>}
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} {cls.code ? `(${cls.code})` : ''}
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="mt-1 text-sm text-red-500">{errors.classId.message}</p>
              )}
            </div>
            <Input
              label="Admission Date"
              type="date"
              {...register('admissionDate', { required: 'Admission date is required' })}
              error={errors.admissionDate?.message}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? 'Update Student' : 'Create Student'}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default StudentForm;
