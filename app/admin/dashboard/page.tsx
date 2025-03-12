'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Icon from '@/app/components/ui/Icon';
import RoomForm from '@/app/components/forms/RoomForm';
import StaffForm from '@/app/components/forms/StaffForm';
import PatientForm from '@/app/components/forms/PatientForm';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  totalStaff: number;
  totalPatients: number;
}

interface Room {
  id: string;
  number: string;
  type: 'General' | 'Private' | 'ICU';
  status: 'Available' | 'Occupied' | 'Maintenance';
  occupiedBy?: string;
}

interface Staff {
  id: string;
  name: string;
  role: 'Doctor' | 'Nurse' | 'Receptionist' | 'Pharmacist';
  specialization?: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  admissionDate: string;
  diagnosis: string;
  status: 'Admitted' | 'Discharged' | 'Critical';
  assignedDoctor: string;
  roomNumber?: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rooms' | 'staff' | 'patients' | 'reports'>('rooms');
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    availableRooms: 0,
    totalStaff: 0,
    totalPatients: 0,
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'room' | 'staff' | 'patient'; id: string } | null>(null);

  // Mock data loading
  useEffect(() => {
    // Simulating API calls
    const loadMockData = () => {
      // Mock rooms data
      const mockRooms: Room[] = [
        { id: '1', number: '101', type: 'General', status: 'Available' },
        { id: '2', number: '102', type: 'Private', status: 'Occupied', occupiedBy: 'John Doe' },
        { id: '3', number: '103', type: 'ICU', status: 'Maintenance' },
      ];

      // Mock staff data
      const mockStaff: Staff[] = [
        { id: '1', name: 'Dr. Smith', role: 'Doctor', specialization: 'Cardiology', email: 'smith@hospital.com', phone: '123-456-7890', status: 'Active' },
        { id: '2', name: 'Nurse Johnson', role: 'Nurse', email: 'johnson@hospital.com', phone: '123-456-7891', status: 'Active' },
      ];

      // Mock patients data
      const mockPatients: Patient[] = [
        { id: '1', name: 'John Doe', age: 45, gender: 'Male', admissionDate: '2024-01-15', diagnosis: 'Pneumonia', status: 'Admitted', assignedDoctor: 'Dr. Smith', roomNumber: '102' },
        { id: '2', name: 'Jane Smith', age: 32, gender: 'Female', admissionDate: '2024-01-16', diagnosis: 'Fracture', status: 'Critical', assignedDoctor: 'Dr. Smith', roomNumber: '103' },
      ];

      setRooms(mockRooms);
      setStaff(mockStaff);
      setPatients(mockPatients);
      setStats({
        totalRooms: mockRooms.length,
        availableRooms: mockRooms.filter(room => room.status === 'Available').length,
        totalStaff: mockStaff.length,
        totalPatients: mockPatients.length,
      });
      setIsLoading(false);
    };

    loadMockData();
  }, []);

  // Add handleLogout function
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Form submission handlers
  const handleAddRoom = async (data: any) => {
    try {
      // In a real app, this would be an API call
      const newRoom: Room = {
        id: (rooms.length + 1).toString(),
        ...data
      };
      setRooms([...rooms, newRoom]);
      setShowRoomForm(false);
      setStats({
        ...stats,
        totalRooms: stats.totalRooms + 1,
        availableRooms: data.status === 'Available' ? stats.availableRooms + 1 : stats.availableRooms
      });
    } catch (error) {
      console.error('Failed to add room:', error);
    }
  };

  const handleAddStaff = async (data: any) => {
    try {
      // In a real app, this would be an API call
      const newStaff: Staff = {
        id: (staff.length + 1).toString(),
        ...data
      };
      setStaff([...staff, newStaff]);
      setShowStaffForm(false);
      setStats({
        ...stats,
        totalStaff: stats.totalStaff + 1
      });
    } catch (error) {
      console.error('Failed to add staff:', error);
    }
  };

  const handleAddPatient = async (data: any) => {
    try {
      // In a real app, this would be an API call
      const newPatient: Patient = {
        id: (patients.length + 1).toString(),
        ...data
      };
      setPatients([...patients, newPatient]);
      setShowPatientForm(false);
      setStats({
        ...stats,
        totalPatients: stats.totalPatients + 1
      });
    } catch (error) {
      console.error('Failed to add patient:', error);
    }
  };

  // Delete handlers
  const handleDeleteRoom = async (id: string) => {
    try {
      // In a real app, this would be an API call
      const updatedRooms = rooms.filter(room => room.id !== id);
      const deletedRoom = rooms.find(room => room.id === id);
      
      setRooms(updatedRooms);
      setStats({
        ...stats,
        totalRooms: stats.totalRooms - 1,
        availableRooms: deletedRoom?.status === 'Available' ? stats.availableRooms - 1 : stats.availableRooms
      });
      
      toast.success('Room deleted successfully');
    } catch (error) {
      toast.error('Failed to delete room');
      console.error('Failed to delete room:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      // In a real app, this would be an API call
      const updatedStaff = staff.filter(member => member.id !== id);
      
      setStaff(updatedStaff);
      setStats({
        ...stats,
        totalStaff: stats.totalStaff - 1
      });
      
      toast.success('Staff member deleted successfully');
    } catch (error) {
      toast.error('Failed to delete staff member');
      console.error('Failed to delete staff:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      // In a real app, this would be an API call
      const updatedPatients = patients.filter(patient => patient.id !== id);
      
      setPatients(updatedPatients);
      setStats({
        ...stats,
        totalPatients: stats.totalPatients - 1
      });
      
      toast.success('Patient deleted successfully');
    } catch (error) {
      toast.error('Failed to delete patient');
      console.error('Failed to delete patient:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Delete confirmation modal
  const renderDeleteConfirmation = () => {
    if (!deleteConfirm) return null;

    const getDeleteDetails = () => {
      switch (deleteConfirm.type) {
        case 'room':
          const room = rooms.find(r => r.id === deleteConfirm.id);
          return { title: 'Room', name: `Room ${room?.number}` };
        case 'staff':
          const member = staff.find(s => s.id === deleteConfirm.id);
          return { title: 'Staff Member', name: member?.name };
        case 'patient':
          const patient = patients.find(p => p.id === deleteConfirm.id);
          return { title: 'Patient', name: patient?.name };
        default:
          return { title: '', name: '' };
      }
    };

    const { title, name } = getDeleteDetails();

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete {title}</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete {name}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                switch (deleteConfirm.type) {
                  case 'room':
                    handleDeleteRoom(deleteConfirm.id);
                    break;
                  case 'staff':
                    handleDeleteStaff(deleteConfirm.id);
                    break;
                  case 'patient':
                    handleDeletePatient(deleteConfirm.id);
                    break;
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
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
            <p className="text-gray-500 text-sm">Total Rooms</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.totalRooms}</h3>
          </div>
          <Icon name="room" className="text-blue-500 w-8 h-8" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Available Rooms</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.availableRooms}</h3>
          </div>
          <Icon name="room" className="text-green-500 w-8 h-8" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Staff</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.totalStaff}</h3>
          </div>
          <Icon name="user" className="text-purple-500 w-8 h-8" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Patients</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.totalPatients}</h3>
          </div>
          <Icon name="stethoscope" className="text-red-500 w-8 h-8" />
        </div>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-4">
      {showRoomForm ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Add New Room</h2>
            <button
              onClick={() => setShowRoomForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <RoomForm
            onSubmit={handleAddRoom}
            onCancel={() => setShowRoomForm(false)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Rooms Management</h2>
            <button
              onClick={() => setShowRoomForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Room
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupied By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        room.status === 'Available' ? 'bg-green-100 text-green-800' :
                        room.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.occupiedBy || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'room', id: room.id })}
                        className="text-red-500 hover:text-red-700"
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
      )}
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-4">
      {showStaffForm ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Add New Staff Member</h2>
            <button
              onClick={() => setShowStaffForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <StaffForm
            onSubmit={handleAddStaff}
            onCancel={() => setShowStaffForm(false)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Staff Management</h2>
            <button
              onClick={() => setShowStaffForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Staff
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.specialization || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.status === 'Active' ? 'bg-green-100 text-green-800' :
                        member.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'staff', id: member.id })}
                        className="text-red-500 hover:text-red-700"
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
      )}
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-4">
      {showPatientForm ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Add New Patient</h2>
            <button
              onClick={() => setShowPatientForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <PatientForm
            doctors={staff.filter(s => s.role === 'Doctor').map(d => ({ id: d.id, name: d.name }))}
            availableRooms={rooms.filter(r => r.status === 'Available').map(r => ({ id: r.id, number: r.number }))}
            onSubmit={handleAddPatient}
            onCancel={() => setShowPatientForm(false)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Patients Management</h2>
            <button
              onClick={() => setShowPatientForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Patient
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.admissionDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        patient.status === 'Admitted' ? 'bg-green-100 text-green-800' :
                        patient.status === 'Critical' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.roomNumber || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'patient', id: patient.id })}
                        className="text-red-500 hover:text-red-700"
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
      )}
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Occupancy Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Room Occupancy Rate</h3>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round((rooms.filter(r => r.status === 'Occupied').length / rooms.length) * 100)}%
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Available Rooms</h3>
            <p className="text-2xl font-bold text-green-600">
              {rooms.filter(r => r.status === 'Available').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800">Maintenance Rooms</h3>
            <p className="text-2xl font-bold text-red-600">
              {rooms.filter(r => r.status === 'Maintenance').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Staff Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">Active Staff</h3>
            <p className="text-2xl font-bold text-purple-600">
              {staff.filter(s => s.status === 'Active').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800">Staff on Leave</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {staff.filter(s => s.status === 'On Leave').length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-800">Inactive Staff</h3>
            <p className="text-2xl font-bold text-gray-600">
              {staff.filter(s => s.status === 'Inactive').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Admitted Patients</h3>
            <p className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.status === 'Admitted').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800">Critical Patients</h3>
            <p className="text-2xl font-bold text-red-600">
              {patients.filter(p => p.status === 'Critical').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Discharged Patients</h3>
            <p className="text-2xl font-bold text-blue-600">
              {patients.filter(p => p.status === 'Discharged').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
                activeTab === 'rooms'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('rooms')}
            >
              Rooms
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'staff'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('staff')}
            >
              Staff
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
              Reports
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          {activeTab === 'rooms' && renderRooms()}
          {activeTab === 'staff' && renderStaff()}
          {activeTab === 'patients' && renderPatients()}
          {activeTab === 'reports' && renderReports()}
        </div>
      </div>
      {renderDeleteConfirmation()}
    </div>
  );
} 