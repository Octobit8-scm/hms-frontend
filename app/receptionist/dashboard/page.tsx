'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Icon from '../../components/ui/Icon';

interface DashboardStats {
  todayAppointments: number;
  availableRooms: number;
  pendingAdmissions: number;
}

export default function ReceptionistDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    availableRooms: 0,
    pendingAdmissions: 0,
  });

  useEffect(() => {
    if (!isLoading && user) {
      // Mock data fetching
      setStats({
        todayAppointments: 12,
        availableRooms: 5,
        pendingAdmissions: 3,
      });
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Receptionist Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Icon name="calendar" className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Icon name="room" className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Rooms</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.availableRooms}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Icon name="admission" className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Admissions</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.pendingAdmissions}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => router.push('/receptionist/appointments')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="calendar" className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
            <p className="text-sm text-gray-600">Manage appointments</p>
          </button>

          <button
            onClick={() => router.push('/receptionist/rooms')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="room" className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Rooms</h3>
            <p className="text-sm text-gray-600">View room status</p>
          </button>

          <button
            onClick={() => router.push('/receptionist/admissions')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="admission" className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Admissions</h3>
            <p className="text-sm text-gray-600">Process admissions</p>
          </button>

          <button
            onClick={() => router.push('/receptionist/profile')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="user" className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
            <p className="text-sm text-gray-600">Update your information</p>
          </button>
        </div>
      </div>
    </div>
  );
} 