'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  BeakerIcon,
  CreditCardIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Patients', href: '/dashboard/patients', icon: UserGroupIcon },
  { name: 'Doctors', href: '/dashboard/doctors', icon: UserIcon },
  { name: 'Pharmacy', href: '/dashboard/pharmacy', icon: BeakerIcon },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCardIcon },
  { name: 'Appointments', href: '/dashboard/appointments', icon: ClipboardIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col bg-gray-900 w-64 px-4 py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-white text-2xl font-bold">HMS</h1>
      </div>
      <nav className="flex-1">
        <ul role="list" className="flex flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`
                  flex items-center gap-x-3 px-3 py-2 text-sm rounded-lg
                  ${pathname === item.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 