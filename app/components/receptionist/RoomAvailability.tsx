'use client';

import { useState, useEffect } from 'react';
import { Room } from '../../types/room';
import toast from 'react-hot-toast';

interface RoomAvailabilityProps {
  onAdmitPatient: (roomId: string) => void;
}

export default function RoomAvailability({ onAdmitPatient }: RoomAvailabilityProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filterType, setFilterType] = useState<Room['type'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available'>('available');

  useEffect(() => {
    // Here you would typically fetch rooms from your API
    // For now, we'll use mock data
    const fetchRooms = async () => {
      try {
        // Replace this with actual API call
        const response = await fetch('/api/rooms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        toast.error('Failed to fetch rooms');
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
    if (filterType !== 'all' && room.type !== filterType) return false;
    if (filterStatus === 'available' && room.status !== 'available') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Room Availability</h2>
        
        <div className="flex gap-4 mb-6">
          <div>
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">Room Type</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as Room['type'] | 'all')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="icu">ICU</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'available')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Beds</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facilities</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{room.number}</div>
                    <div className="text-sm text-gray-500">Floor {room.floor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{room.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.capacity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.capacity - room.currentOccupancy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${room.price}/day</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {room.facilities.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {room.status === 'available' && (
                      <button
                        onClick={() => onAdmitPatient(room.id)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Admit Patient
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 