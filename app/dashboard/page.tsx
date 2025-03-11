'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Icon from '../components/ui/Icon';
import type { Room } from '@/app/types/room';
import type { Admission } from '@/app/types/admission';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
}

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalPatients: number;
  admissionsToday: number;
  dischargesThisWeek: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalPatients: 0,
    admissionsToday: 0,
    dischargesThisWeek: 0
  });

  useEffect(() => {
    // Fetch dashboard stats
    Promise.all([
      fetch('/api/rooms').then(res => res.json()),
      fetch('/api/patients').then(res => res.json()),
      fetch('/api/admissions').then(res => res.json())
    ]).then(([rooms, patients, admissions]: [Room[], Patient[], Admission[]]) => {
      setStats({
        totalRooms: rooms.length,
        availableRooms: rooms.filter(r => r.status === 'available').length,
        occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
        totalPatients: patients.length,
        admissionsToday: admissions.filter(a => 
          new Date(a.admissionDate).toDateString() === new Date().toDateString()
        ).length,
        dischargesThisWeek: admissions.filter(a => 
          a.status === 'discharged' && 
          a.dischargedAt && 
          new Date(a.dischargedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length
      });
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Room Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <Icon name="room" size={32} />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Rooms</h2>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available</p>
                    <p className="text-2xl font-bold text-teal-600">{stats.availableRooms}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <Icon name="patient" size={32} />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Patients</h2>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Total Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admission Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <Icon name="admission" size={32} />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Admissions</h2>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Today</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.admissionsToday}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Discharged (Week)</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.dischargesThisWeek}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/admissions/new'}
              className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <Icon name="admission" size={24} />
              <span className="font-medium text-teal-900">New Admission</span>
            </button>
            <button
              onClick={() => window.location.href = '/rooms'}
              className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <Icon name="room" size={24} />
              <span className="font-medium text-teal-900">View Rooms</span>
            </button>
            <button
              onClick={() => window.location.href = '/patients'}
              className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <Icon name="patient" size={24} />
              <span className="font-medium text-teal-900">Manage Patients</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 