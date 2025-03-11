'use client';

import { useState } from 'react';
import { Room } from '../../types/room';
import toast from 'react-hot-toast';

interface PatientAdmissionData {
  patientId: string;
  roomId: string;
  admissionDate: string;
  expectedDuration: number;
  admissionType: 'emergency' | 'planned';
  admissionReason: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  primaryDoctor: string;
}

interface PatientAdmissionProps {
  selectedRoom?: Room;
  onSubmit: (data: PatientAdmissionData) => void;
  onCancel: () => void;
}

export default function PatientAdmission({ selectedRoom, onSubmit, onCancel }: PatientAdmissionProps) {
  const [formData, setFormData] = useState<PatientAdmissionData>({
    patientId: '',
    roomId: selectedRoom?.id || '',
    admissionDate: new Date().toISOString().split('T')[0],
    expectedDuration: 1,
    admissionType: 'planned',
    admissionReason: '',
    primaryDoctor: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.roomId || !formData.admissionReason || !formData.primaryDoctor) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await onSubmit(formData);
      toast.success('Patient admitted successfully');
    } catch (error) {
      toast.error('Failed to admit patient');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Patient Admission</h2>

      {selectedRoom && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-2">Selected Room</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Room Number:</span> {selectedRoom.number}
            </div>
            <div>
              <span className="font-medium">Floor:</span> {selectedRoom.floor}
            </div>
            <div>
              <span className="font-medium">Type:</span> {selectedRoom.type}
            </div>
            <div>
              <span className="font-medium">Price:</span> ${selectedRoom.price}/day
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient ID</label>
          <input
            type="text"
            name="patientId"
            id="patientId"
            required
            value={formData.patientId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">Admission Date</label>
          <input
            type="date"
            name="admissionDate"
            id="admissionDate"
            required
            value={formData.admissionDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="expectedDuration" className="block text-sm font-medium text-gray-700">Expected Duration (days)</label>
          <input
            type="number"
            name="expectedDuration"
            id="expectedDuration"
            required
            min="1"
            value={formData.expectedDuration}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="admissionType" className="block text-sm font-medium text-gray-700">Admission Type</label>
          <select
            name="admissionType"
            id="admissionType"
            required
            value={formData.admissionType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="planned">Planned</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div className="col-span-2">
          <label htmlFor="admissionReason" className="block text-sm font-medium text-gray-700">Reason for Admission</label>
          <textarea
            name="admissionReason"
            id="admissionReason"
            required
            value={formData.admissionReason}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="primaryDoctor" className="block text-sm font-medium text-gray-700">Primary Doctor</label>
          <input
            type="text"
            name="primaryDoctor"
            id="primaryDoctor"
            required
            value={formData.primaryDoctor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700">Insurance Provider</label>
          <input
            type="text"
            name="insuranceProvider"
            id="insuranceProvider"
            value={formData.insuranceProvider || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="insuranceNumber" className="block text-sm font-medium text-gray-700">Insurance Number</label>
          <input
            type="text"
            name="insuranceNumber"
            id="insuranceNumber"
            value={formData.insuranceNumber || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

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
          Admit Patient
        </button>
      </div>
    </form>
  );
} 