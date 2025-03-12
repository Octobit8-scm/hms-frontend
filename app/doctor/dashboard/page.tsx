'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Icon from '@/app/components/ui/Icon';

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingReports: number;
  completedReports: number;
}

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Regular' | 'Emergency' | 'Follow-up';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string;
  diagnosis: string;
  status: 'Active' | 'Recovered' | 'Under Treatment';
  contactNumber: string;
}

interface MedicalReport {
  id: string;
  patientName: string;
  date: string;
  diagnosis: string;
  prescription: string;
  status: 'Draft' | 'Completed';
  followUpDate?: string;
}

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'reports'>('appointments');
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingReports: 0,
    completedReports: 0,
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API calls
    const loadMockData = () => {
      // Mock appointments data
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientName: 'John Doe',
          date: '2024-01-20',
          time: '10:00 AM',
          type: 'Regular',
          status: 'Scheduled',
          notes: 'Follow-up checkup'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          date: '2024-01-20',
          time: '11:30 AM',
          type: 'Emergency',
          status: 'Completed',
          notes: 'Severe pain in chest'
        }
      ];

      // Mock patients data
      const mockPatients: Patient[] = [
        {
          id: '1',
          name: 'John Doe',
          age: 45,
          gender: 'Male',
          lastVisit: '2024-01-15',
          diagnosis: 'Hypertension',
          status: 'Under Treatment',
          contactNumber: '123-456-7890'
        },
        {
          id: '2',
          name: 'Jane Smith',
          age: 32,
          gender: 'Female',
          lastVisit: '2024-01-16',
          diagnosis: 'Diabetes Type 2',
          status: 'Active',
          contactNumber: '123-456-7891'
        }
      ];

      // Mock reports data
      const mockReports: MedicalReport[] = [
        {
          id: '1',
          patientName: 'John Doe',
          date: '2024-01-15',
          diagnosis: 'Hypertension',
          prescription: 'Amlodipine 5mg daily',
          status: 'Completed',
          followUpDate: '2024-02-15'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          date: '2024-01-16',
          diagnosis: 'Diabetes Type 2',
          prescription: 'Metformin 500mg twice daily',
          status: 'Draft'
        }
      ];

      setAppointments(mockAppointments);
      setPatients(mockPatients);
      setReports(mockReports);
      setStats({
        totalPatients: mockPatients.length,
        todayAppointments: mockAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
        pendingReports: mockReports.filter(r => r.status === 'Draft').length,
        completedReports: mockReports.filter(r => r.status === 'Completed').length,
      });
      setIsLoading(false);
    };

    loadMockData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Patients</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.totalPatients}</h3>
          </div>
          <Icon name="user" className="text-blue-500 w-8 h-8" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Today's Appointments</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.todayAppointments}</h3>
          </div>
          <Icon name="calendar" className="text-green-500 w-8 h-8" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pending Reports</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.pendingReports}</h3>
          </div>
          <Icon name="chart" className="text-yellow-500 w-8 h-8" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Completed Reports</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.completedReports}</h3>
          </div>
          <Icon name="chart" className="text-purple-500 w-8 h-8" />
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Appointments</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.type === 'Emergency' ? 'bg-red-100 text-red-800' :
                    appointment.type === 'Follow-up' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {appointment.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.notes || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">View</button>
                  <button className="text-green-500 hover:text-green-700">Complete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">My Patients</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.lastVisit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.diagnosis}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    patient.status === 'Active' ? 'bg-green-100 text-green-800' :
                    patient.status === 'Recovered' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">View History</button>
                  <button className="text-green-500 hover:text-green-700">Add Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Medical Reports</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Follow-up Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.diagnosis}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.followUpDate || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">View</button>
                  {report.status === 'Draft' && (
                    <button className="text-green-500 hover:text-green-700">Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back, Dr. {user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      
      {renderStats()}
      
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'appointments'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'patients'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('patients')}
            >
              Patients
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'reports'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              Medical Reports
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'patients' && renderPatients()}
          {activeTab === 'reports' && renderReports()}
        </div>
      </div>
    </div>
  );
} 