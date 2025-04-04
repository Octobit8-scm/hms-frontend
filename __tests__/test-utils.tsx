import { ReactNode, createContext } from 'react';
import { render } from '@testing-library/react';
import type { UserRole } from '@/app/context/AuthContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the actual AuthContext module
jest.mock('@/app/context/AuthContext', () => ({
  __esModule: true,
  useAuth: () => mockAuthValue,
  AuthContext: MockAuthContext,
  UserRole: {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    PHARMACIST: 'pharmacist',
    RECEPTIONIST: 'receptionist',
    PATIENT: 'patient',
  },
}));

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  licenseNumber?: string;
  education?: string;
  phoneNumber?: string;
  yearsOfExperience?: string;
  specialization?: string;
  department?: string;
  consultationFee?: string;
  confirmPassword?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Create mock auth value
export const mockAuthValue: AuthContextType = {
  user: null,
  login: jest.fn().mockResolvedValue(true),
  register: jest.fn().mockResolvedValue(true),
  logout: jest.fn(),
  isLoading: false,
};

// Create mock auth context
export const MockAuthContext = createContext<AuthContextType>(mockAuthValue);

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// TestWrapper component that includes all providers
export function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <MockAuthContext.Provider value={mockAuthValue}>
      {children}
    </MockAuthContext.Provider>
  );
}

// Export mock objects for test usage
export { mockLocalStorage };