import {
  UserGroupIcon,
  UserIcon,
  BeakerIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total Patients', value: '2,300', icon: UserGroupIcon },
  { name: 'Active Doctors', value: '45', icon: UserIcon },
  { name: 'Pharmacy Items', value: '1,200', icon: BeakerIcon },
  { name: 'Monthly Revenue', value: '$52,000', icon: CreditCardIcon },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-base font-semibold text-gray-900">Recent Appointments</h2>
            <div className="mt-6">
              <p className="text-center text-gray-500">No recent appointments</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-base font-semibold text-gray-900">Recent Billings</h2>
            <div className="mt-6">
              <p className="text-center text-gray-500">No recent billings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 