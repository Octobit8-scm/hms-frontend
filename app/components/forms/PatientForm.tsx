'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface PatientFormProps {
  patient?: {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    admissionDate: string;
    diagnosis: string;
    status: 'Admitted' | 'Discharged' | 'Critical';
    assignedDoctor: string;
    roomNumber?: string;
  };
  doctors: Array<{ id: string; name: string }>;
  availableRooms: Array<{ id: string; number: string }>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function PatientForm({ patient, doctors, availableRooms, onSubmit, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    age: patient?.age || '',
    gender: patient?.gender || 'Male',
    admissionDate: patient?.admissionDate || new Date().toISOString().split('T')[0],
    diagnosis: patient?.diagnosis || '',
    status: patient?.status || 'Admitted',
    assignedDoctor: patient?.assignedDoctor || '',
    roomNumber: patient?.roomNumber || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.age) throw new Error('Age is required');
      if (!formData.diagnosis.trim()) throw new Error('Diagnosis is required');
      if (!formData.assignedDoctor) throw new Error('Please assign a doctor');
      
      // Age validation
      const age = Number(formData.age);
      if (isNaN(age) || age <= 0 || age > 150) {
        throw new Error('Please enter a valid age');
      }

      // If admitted or critical, room is required
      if (['Admitted', 'Critical'].includes(formData.status) && !formData.roomNumber) {
        throw new Error('Room number is required for admitted patients');
      }

      await onSubmit({
        ...formData,
        age: Number(formData.age),
        id: patient?.id
      });

      toast.success(patient ? 'Patient updated successfully' : 'Patient added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name*
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter full name"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age*
          </label>
          <input
            type="number"
            id="age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter age"
            min="0"
            max="150"
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender*
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">
          Admission Date*
        </label>
        <input
          type="date"
          id="admissionDate"
          value={formData.admissionDate}
          onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
          Diagnosis*
        </label>
        <textarea
          id="diagnosis"
          value={formData.diagnosis}
          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter diagnosis"
          rows={3}
          required
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status*
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="Admitted">Admitted</option>
          <option value="Critical">Critical</option>
          <option value="Discharged">Discharged</option>
        </select>
      </div>

      <div>
        <label htmlFor="assignedDoctor" className="block text-sm font-medium text-gray-700">
          Assigned Doctor*
        </label>
        <select
          id="assignedDoctor"
          value={formData.assignedDoctor}
          onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      {['Admitted', 'Critical'].includes(formData.status) && (
        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
            Room Number*
          </label>
          <select
            id="roomNumber"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select a room</option>
            {availableRooms.map((room) => (
              <option key={room.id} value={room.number}>
                {room.number}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : patient ? 'Update Patient' : 'Add Patient'}
        </button>
      </div>
    </form>
  );
} 