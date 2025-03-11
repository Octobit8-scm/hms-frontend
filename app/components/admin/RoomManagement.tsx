'use client';

import { useState } from 'react';
import { Room, RoomStatus } from '../../types/room';
import toast from 'react-hot-toast';

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    number: '',
    floor: '',
    type: 'standard',
    capacity: 1,
    currentOccupancy: 0,
    status: 'available',
    price: 0,
    facilities: []
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.number || !newRoom.floor || !newRoom.type || !newRoom.capacity || !newRoom.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const room: Room = {
      number: newRoom.number,
      floor: newRoom.floor,
      type: newRoom.type,
      capacity: newRoom.capacity,
      currentOccupancy: 0,
      status: 'available',
      price: newRoom.price,
      facilities: newRoom.facilities || [],
      id: Date.now().toString()
    };

    setRooms([...rooms, room]);
    setNewRoom({
      number: '',
      floor: '',
      type: 'standard',
      capacity: 1,
      currentOccupancy: 0,
      status: 'available',
      price: 0,
      facilities: []
    });
    toast.success('Room added successfully');
  };

  const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, status } : room
    ));
    toast.success('Room status updated');
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId));
    toast.success('Room deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
        <form onSubmit={handleAddRoom} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Room Number</label>
              <input
                type="text"
                id="roomNumber"
                value={newRoom.number}
                onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">Floor</label>
              <input
                type="text"
                id="floor"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Room Type</label>
              <select
                id="type"
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as Room['type'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="icu">ICU</option>
              </select>
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                id="capacity"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
                min="1"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price per Day</label>
              <input
                type="number"
                id="price"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
            <div className="grid grid-cols-2 gap-2">
              {['AC', 'TV', 'WiFi', 'Private Bathroom', 'Mini Fridge', 'Nurse Call'].map(facility => (
                <label key={facility} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    checked={newRoom.facilities?.includes(facility)}
                    onChange={(e) => {
                      const facilities = newRoom.facilities || [];
                      setNewRoom({
                        ...newRoom,
                        facilities: e.target.checked
                          ? [...facilities, facility]
                          : facilities.filter((f: string) => f !== facility)
                      });
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Add Room
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Room List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
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
                    <div className="text-sm text-gray-900">{room.currentOccupancy}/{room.capacity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={room.status}
                      onChange={(e) => handleUpdateRoomStatus(room.id, e.target.value as RoomStatus)}
                      className="text-sm rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${room.price}/day</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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