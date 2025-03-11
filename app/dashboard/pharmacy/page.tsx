'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Medication {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  manufacturer: string;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    stock: 500,
    price: 12.99,
    manufacturer: 'PharmaCorp',
    expiryDate: '2025-06-30',
    status: 'In Stock'
  },
  {
    id: '2',
    name: 'Lisinopril 10mg',
    category: 'Blood Pressure',
    stock: 50,
    price: 15.99,
    manufacturer: 'MediPharm',
    expiryDate: '2024-12-31',
    status: 'Low Stock'
  },
  {
    id: '3',
    name: 'Metformin 850mg',
    category: 'Diabetes',
    stock: 0,
    price: 8.99,
    manufacturer: 'HealthCare Labs',
    expiryDate: '2025-03-15',
    status: 'Out of Stock'
  },
];

export default function PharmacyPage() {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Pharmacy Inventory</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all medications including their details, stock levels, and pricing.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Medication
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Manufacturer</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {medications.map((medication) => (
                    <tr key={medication.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {medication.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{medication.category}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{medication.stock}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${medication.price.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{medication.manufacturer}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{medication.expiryDate}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(medication.status)}`}>
                          {medication.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 