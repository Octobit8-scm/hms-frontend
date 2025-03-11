'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  diagnosis: string;
  assignedDoctor: string;
  lastVisit: string;
  nextAppointment: string;
  status: 'Stable' | 'Critical' | 'Recovering';
  medicalHistory: string[];
  medications: string[];
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    contact: '+1 234-567-8901',
    diagnosis: 'Hypertension',
    assignedDoctor: 'Dr. Smith',
    lastVisit: '2024-03-10',
    nextAppointment: '2024-03-24',
    status: 'Stable',
    medicalHistory: ['Diabetes Type 2', 'High Blood Pressure'],
    medications: ['Metformin', 'Lisinopril']
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    contact: '+1 234-567-8902',
    diagnosis: 'Diabetes Type 2',
    assignedDoctor: 'Dr. Smith',
    lastVisit: '2024-03-12',
    nextAppointment: '2024-03-26',
    status: 'Recovering',
    medicalHistory: ['Gestational Diabetes'],
    medications: ['Insulin', 'Metformin']
  },
  {
    id: '3',
    name: 'Robert Brown',
    age: 58,
    gender: 'Male',
    contact: '+1 234-567-8903',
    diagnosis: 'Heart Disease',
    assignedDoctor: 'Dr. Johnson',
    lastVisit: '2024-03-14',
    nextAppointment: '2024-03-21',
    status: 'Critical',
    medicalHistory: ['Heart Attack', 'High Cholesterol'],
    medications: ['Statins', 'Beta Blockers']
  }
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Stable':
        return 'bg-green-100 text-green-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Recovering':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter patients based on the logged-in doctor
  const filteredPatients = user?.role === 'doctor' 
    ? patients.filter(patient => patient.assignedDoctor === user.name)
    : patients;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {user?.role === 'doctor' ? 'My Patients' : 'All Patients'}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {user?.role === 'doctor' 
              ? 'A list of all your assigned patients including their personal details and medical status.'
              : 'A list of all patients in the hospital including their personal details and medical status.'
            }
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'receptionist') && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Patient
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Age</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Diagnosis</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Visit</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Next Appointment</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {patient.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.age}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.diagnosis}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.lastVisit}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.nextAppointment}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button 
                          onClick={() => setSelectedPatient(patient)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="View Medical History"
                        >
                          <DocumentTextIcon className="h-5 w-5" />
                        </button>
                        {user?.role === 'doctor' && (
                          <button className="text-blue-600 hover:text-blue-900 mr-4">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        )}
                        {user?.role === 'admin' && (
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-5 w-5" />
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
      </div>

      {/* Medical History Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Medical History - {selectedPatient.name}</h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Previous Conditions</h4>
                <ul className="mt-2 list-disc list-inside">
                  {selectedPatient.medicalHistory.map((condition, index) => (
                    <li key={index} className="text-gray-600">{condition}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Current Medications</h4>
                <ul className="mt-2 list-disc list-inside">
                  {selectedPatient.medications.map((medication, index) => (
                    <li key={index} className="text-gray-600">{medication}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 