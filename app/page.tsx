'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import toast from 'react-hot-toast';
import PatientRegistrationForm from './components/PatientRegistrationForm';
import DoctorRegistrationForm from './components/DoctorRegistrationForm';
import PharmacistRegistrationForm from './components/PharmacistRegistrationForm';

type Role = 'admin' | 'doctor' | 'nurse' | 'pharmacist' | 'receptionist' | 'patient';
type View = 'role_selection' | 'login' | 'patient_registration' | 'doctor_registration' | 'pharmacist_registration';

const defaultCredentials: Record<Role, { email: string; password: string }> = {
  admin: { email: 'admin@hospital.com', password: 'admin123' },
  doctor: { email: 'doctor@hospital.com', password: 'doctor123' },
  nurse: { email: 'nurse@hospital.com', password: 'nurse123' },
  pharmacist: { email: 'pharmacist@hospital.com', password: 'pharmacist123' },
  receptionist: { email: 'receptionist@hospital.com', password: 'receptionist123' },
  patient: { email: 'patient@hospital.com', password: 'patient123' },
};

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentView, setCurrentView] = useState<View>('role_selection');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, authLoading, router]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCredentials(defaultCredentials[role]);
    setCurrentView('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(credentials.email, credentials.password);
      if (success) {
        toast.success('Login successful!');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    setCurrentView('role_selection');
    toast.success('Registration successful! Please login.');
  };

  const handleCancel = () => {
    setCurrentView('role_selection');
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const renderRoleSelection = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Select your role</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(defaultCredentials).map((role) => (
          <button
            key={role}
            onClick={() => handleRoleSelect(role as Role)}
            className="p-4 border rounded hover:bg-gray-100 text-left"
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-sm text-gray-600">New user? Register as:</p>
        <div className="space-x-4">
          <button
            onClick={() => setCurrentView('patient_registration')}
            className="text-blue-600 hover:underline"
          >
            Patient
          </button>
          <button
            onClick={() => setCurrentView('doctor_registration')}
            className="text-blue-600 hover:underline"
          >
            Doctor
          </button>
          <button
            onClick={() => setCurrentView('pharmacist_registration')}
            className="text-blue-600 hover:underline"
          >
            Pharmacist
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <div>
      <button
        onClick={() => setCurrentView('role_selection')}
        className="text-blue-600 hover:underline mb-4"
      >
        Back to role selection
      </button>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          MediHub
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Your Complete Healthcare Management Solution
        </p>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {currentView === 'role_selection' && renderRoleSelection()}
          {currentView === 'login' && renderLoginForm()}
          {currentView === 'patient_registration' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Patient Registration</h2>
              <PatientRegistrationForm onSuccess={handleRegistrationSuccess} onCancel={handleCancel} />
            </div>
          )}
          {currentView === 'doctor_registration' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Doctor Registration</h2>
              <DoctorRegistrationForm onSuccess={handleRegistrationSuccess} onCancel={handleCancel} />
            </div>
          )}
          {currentView === 'pharmacist_registration' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Pharmacist Registration</h2>
              <PharmacistRegistrationForm onSuccess={handleRegistrationSuccess} onCancel={handleCancel} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
