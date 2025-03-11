'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Icon from '../../components/ui/Icon';

interface DashboardStats {
  totalPatients: number;
  appointmentsToday: number;
  pendingReports: number;
}

export default function DoctorDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    appointmentsToday: 0,
    pendingReports: 0,
  });

  useEffect(() => {
    if (!isLoading && user) {
      // Mock data fetching
      setStats({
        totalPatients: 150,
        appointmentsToday: 8,
        pendingReports: 3,
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
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
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
                <Icon name="users" className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Patients</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalPatients}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Icon name="calendar" className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.appointmentsToday}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Icon name="clipboard" className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Reports</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.pendingReports}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => router.push('/doctor/appointments')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="calendar" className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">View Appointments</h3>
            <p className="text-sm text-gray-600">Manage your daily schedule</p>
          </button>

          <button
            onClick={() => router.push('/doctor/patients')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="users" className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Patient List</h3>
            <p className="text-sm text-gray-600">View and manage patients</p>
          </button>

          <button
            onClick={() => router.push('/doctor/reports')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="clipboard" className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Medical Reports</h3>
            <p className="text-sm text-gray-600">Create and view reports</p>
          </button>

          <button
            onClick={() => router.push('/doctor/profile')}
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