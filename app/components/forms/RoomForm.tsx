'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface RoomFormProps {
  room?: {
    id: string;
    number: string;
    type: 'General' | 'Private' | 'ICU';
    status: 'Available' | 'Occupied' | 'Maintenance';
    occupiedBy?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function RoomForm({ room, onSubmit, onCancel }: RoomFormProps) {
  const [formData, setFormData] = useState({
    number: room?.number || '',
    type: room?.type || 'General',
    status: room?.status || 'Available',
    occupiedBy: room?.occupiedBy || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate room number
      if (!formData.number.trim()) {
        throw new Error('Room number is required');
      }

      // If room is occupied, occupiedBy should be provided
      if (formData.status === 'Occupied' && !formData.occupiedBy.trim()) {
        throw new Error('Please specify who is occupying the room');
      }

      await onSubmit({
        ...formData,
        id: room?.id
      });

      toast.success(room ? 'Room updated successfully' : 'Room added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700">
          Room Number*
        </label>
        <input
          type="text"
          id="number"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter room number"
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Room Type*
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="General">General</option>
          <option value="Private">Private</option>
          <option value="ICU">ICU</option>
        </select>
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
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      {formData.status === 'Occupied' && (
        <div>
          <label htmlFor="occupiedBy" className="block text-sm font-medium text-gray-700">
            Occupied By*
          </label>
          <input
            type="text"
            id="occupiedBy"
            value={formData.occupiedBy}
            onChange={(e) => setFormData({ ...formData, occupiedBy: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter patient name"
            required
          />
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
          {isLoading ? 'Saving...' : room ? 'Update Room' : 'Add Room'}
        </button>
      </div>
    </form>
  );
} 