'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface Bill {
  id: string;
  patientName: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  insurance: string;
  coverageAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

const mockBills: Bill[] = [
  {
    id: '1',
    patientName: 'John Doe',
    invoiceNumber: 'INV-2024-001',
    date: '2024-03-15',
    amount: 1250.00,
    insurance: 'BlueCross',
    coverageAmount: 1000.00,
    status: 'Partially Paid',
    items: [
      {
        description: 'General Consultation',
        quantity: 1,
        unitPrice: 250.00,
        total: 250.00
      },
      {
        description: 'Blood Test',
        quantity: 1,
        unitPrice: 1000.00,
        total: 1000.00
      }
    ]
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    invoiceNumber: 'INV-2024-002',
    date: '2024-03-14',
    amount: 500.00,
    insurance: 'Aetna',
    coverageAmount: 500.00,
    status: 'Paid',
    items: [
      {
        description: 'Follow-up Consultation',
        quantity: 1,
        unitPrice: 150.00,
        total: 150.00
      },
      {
        description: 'Prescription Medications',
        quantity: 1,
        unitPrice: 350.00,
        total: 350.00
      }
    ]
  },
  {
    id: '3',
    patientName: 'Robert Brown',
    invoiceNumber: 'INV-2024-003',
    date: '2024-03-13',
    amount: 800.00,
    insurance: 'None',
    coverageAmount: 0,
    status: 'Overdue',
    items: [
      {
        description: 'Emergency Room Visit',
        quantity: 1,
        unitPrice: 800.00,
        total: 800.00
      }
    ]
  }
];

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Partially Paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all bills including patient details, insurance coverage, and payment status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Bill
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Invoice #</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Patient</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Insurance</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Coverage</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {bills.map((bill) => (
                    <tr key={bill.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {bill.invoiceNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{bill.patientName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{bill.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${bill.amount.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{bill.insurance}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${bill.coverageAmount.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
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