'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface StaffFormProps {
  staff?: {
    id: string;
    name: string;
    role: 'Doctor' | 'Nurse' | 'Receptionist' | 'Pharmacist';
    specialization?: string;
    email: string;
    phone: string;
    status: 'Active' | 'On Leave' | 'Inactive';
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function StaffForm({ staff, onSubmit, onCancel }: StaffFormProps) {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    role: staff?.role || 'Doctor',
    specialization: staff?.specialization || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
    status: staff?.status || 'Active'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.email.trim()) throw new Error('Email is required');
      if (!formData.phone.trim()) throw new Error('Phone number is required');
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Phone validation (basic)
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      // If it's a doctor, specialization is required
      if (formData.role === 'Doctor' && !formData.specialization) {
        throw new Error('Specialization is required for doctors');
      }

      await onSubmit({
        ...formData,
        id: staff?.id
      });

      toast.success(staff ? 'Staff member updated successfully' : 'Staff member added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save staff member');
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

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role*
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="Doctor">Doctor</option>
          <option value="Nurse">Nurse</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Pharmacist">Pharmacist</option>
        </select>
      </div>

      {formData.role === 'Doctor' && (
        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
            Specialization*
          </label>
          <input
            type="text"
            id="specialization"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter specialization"
            required
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email*
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter email address"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number*
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter phone number"
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
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

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
          {isLoading ? 'Saving...' : staff ? 'Update Staff' : 'Add Staff'}
        </button>
      </div>
    </form>
  );
} 