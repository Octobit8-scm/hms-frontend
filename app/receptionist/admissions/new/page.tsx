'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import PatientAdmissionForm from '@/app/components/PatientAdmissionForm';

export default function NewAdmission() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/receptionist/admissions/history');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">New Patient Admission</h1>
        <PatientAdmissionForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </DashboardLayout>
  );
} 