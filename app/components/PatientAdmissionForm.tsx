'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import type { AdmissionFormData } from '@/app/types/admission';

interface PatientAdmissionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PatientAdmissionForm({ onSuccess, onCancel }: PatientAdmissionFormProps) {
  const [formData, setFormData] = useState<AdmissionFormData>({
    patientId: '',
    roomId: '',
    admissionType: 'planned',
    expectedDuration: 1,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          admissionDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create admission');
      }

      toast.success('Admission created successfully');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create admission');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expectedDuration' ? parseInt(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
      {/* Patient ID */}
      <div>
        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
          Patient ID
        </label>
        <input
          type="text"
          id="patientId"
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      {/* Room ID */}
      <div>
        <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
          Room ID
        </label>
        <input
          type="text"
          id="roomId"
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      {/* Admission Type */}
      <div>
        <label htmlFor="admissionType" className="block text-sm font-medium text-gray-700">
          Admission Type
        </label>
        <select
          id="admissionType"
          name="admissionType"
          value={formData.admissionType}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="planned">Planned</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      {/* Expected Duration */}
      <div>
        <label htmlFor="expectedDuration" className="block text-sm font-medium text-gray-700">
          Expected Duration (days)
        </label>
        <input
          type="number"
          id="expectedDuration"
          name="expectedDuration"
          value={formData.expectedDuration}
          onChange={handleChange}
          min="1"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Create Admission
        </button>
      </div>
    </form>
  );
} 