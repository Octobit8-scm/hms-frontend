import { UserRole } from '../context/AuthContext';

type IconName = 'patient' | 'room' | 'admission' | 'users' | 'calendar' | 'clipboard' | 'user' | 'medicine' | 'alert' | 'truck' | 'prescription' | 'bill' | 'inventory' | 'supplier' | 'appointment' | 'stethoscope' | 'chart' | 'treatment';

interface NavigationItem {
  name: string;
  href: string;
  icon: IconName;
}

interface RoleConfig {
  routes: string[];
  navigation: NavigationItem[];
}

export const roleConfig: Record<string, RoleConfig> = {
  admin: {
    routes: [
      '/admin/dashboard',
      '/admin/rooms',
      '/admin/patients',
      '/admin/admissions',
      '/admin/admissions/new',
      '/admin/admissions/history',
      '/admin/staff'
    ],
    navigation: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: 'room' },
      { name: 'Rooms', href: '/admin/rooms', icon: 'room' },
      { name: 'Patients', href: '/admin/patients', icon: 'patient' },
      { name: 'Admissions', href: '/admin/admissions', icon: 'admission' },
      { name: 'Staff', href: '/admin/staff', icon: 'users' }
    ]
  },
  doctor: {
    routes: ['/dashboard', '/dashboard/patients'],
    navigation: [
      { name: 'Dashboard', href: '/dashboard', icon: 'room' },
      { name: 'My Patients', href: '/dashboard/patients', icon: 'patient' },
    ]
  },
  nurse: {
    routes: ['/dashboard', '/dashboard/patients', '/dashboard/doctors'],
    navigation: [
      { name: 'Dashboard', href: '/dashboard', icon: 'room' },
      { name: 'Patients', href: '/dashboard/patients', icon: 'patient' },
      { name: 'Doctors', href: '/dashboard/doctors', icon: 'stethoscope' },
    ]
  },
  pharmacist: {
    routes: ['/dashboard', '/dashboard/pharmacy'],
    navigation: [
      { name: 'Dashboard', href: '/dashboard', icon: 'room' },
      { name: 'Pharmacy', href: '/dashboard/pharmacy', icon: 'medicine' },
    ]
  },
  receptionist: {
    routes: [
      '/receptionist/dashboard',
      '/receptionist/rooms',
      '/receptionist/admissions/new',
      '/receptionist/admissions/history'
    ],
    navigation: [
      { name: 'Dashboard', href: '/receptionist/dashboard', icon: 'room' },
      { name: 'Rooms', href: '/receptionist/rooms', icon: 'room' },
      { name: 'New Admission', href: '/receptionist/admissions/new', icon: 'admission' },
      { name: 'Admission History', href: '/receptionist/admissions/history', icon: 'admission' }
    ]
  },
  patient: {
    routes: ['/dashboard', '/dashboard/appointments'],
    navigation: [
      { name: 'Dashboard', href: '/dashboard', icon: 'room' },
      { name: 'My Appointments', href: '/dashboard/appointments', icon: 'appointment' },
    ]
  }
} as const; 