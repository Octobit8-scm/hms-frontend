'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Icon from '../../components/ui/Icon';

interface DashboardStats {
  upcomingAppointments: number;
  prescriptions: number;
  pendingBills: number;
}

export default function PatientDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingAppointments: 0,
    prescriptions: 0,
    pendingBills: 0,
  });

  useEffect(() => {
    if (!isLoading && user) {
      // Mock data fetching
      setStats({
        upcomingAppointments: 2,
        prescriptions: 3,
        pendingBills: 1,
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
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
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
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Icon name="clipboard" className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Prescriptions</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.prescriptions}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Icon name="admission" className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Bills</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.pendingBills}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => router.push('/patient/appointments')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="calendar" className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
            <p className="text-sm text-gray-600">Book and view appointments</p>
          </button>

          <button
            onClick={() => router.push('/patient/prescriptions')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="clipboard" className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
            <p className="text-sm text-gray-600">View your prescriptions</p>
          </button>

          <button
            onClick={() => router.push('/patient/bills')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Icon name="admission" className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Bills</h3>
            <p className="text-sm text-gray-600">View and pay bills</p>
          </button>

          <button
            onClick={() => router.push('/patient/profile')}
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