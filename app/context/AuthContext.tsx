'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'pharmacist' | 'receptionist' | 'patient';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Mock user credentials
interface MockUser {
  password: string;
  name: string;
  role: UserRole;
}

interface MockUsers {
  [email: string]: MockUser;
}

const mockUsers: MockUsers = {
  'admin@hospital.com': { password: 'admin123', name: 'Admin User', role: 'admin' },
  'doctor@hospital.com': { password: 'doctor123', name: 'Dr. Smith', role: 'doctor' },
  'nurse@hospital.com': { password: 'nurse123', name: 'Nurse Johnson', role: 'nurse' },
  'pharmacist@hospital.com': { password: 'pharmacist123', name: 'Pharmacist Brown', role: 'pharmacist' },
  'receptionist@hospital.com': { password: 'receptionist123', name: 'Receptionist Davis', role: 'receptionist' },
  'patient@hospital.com': { password: 'patient123', name: 'John Doe', role: 'patient' }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Check if the stored data has expired
          if (userData.expires && userData.expires > new Date().getTime()) {
            setUser(userData);
          } else {
            // Clear expired data
            localStorage.removeItem('user');
            document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle routing based on auth state
  useEffect(() => {
    if (isLoading) return;

    if (!user && pathname !== '/') {
      router.replace('/');
      return;
    }

    if (user) {
      const expectedPath = `/${user.role}/dashboard`;
      if (pathname === '/') {
        router.replace(expectedPath);
      } else if (!pathname.startsWith(`/${user.role}`)) {
        router.replace(expectedPath);
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const userCredentials = mockUsers[email];
      
      if (userCredentials && userCredentials.password === password) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: userCredentials.name,
          role: userCredentials.role,
          expires: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        document.cookie = `user=${JSON.stringify(userData)}; path=/; expires=${new Date(userData.expires).toUTCString()}`;
        
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        expires: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };

      mockUsers[email] = {
        password,
        name,
        role
      };

      localStorage.setItem('user', JSON.stringify(userData));
      document.cookie = `user=${JSON.stringify(userData)}; path=/; expires=${new Date(userData.expires).toUTCString()}`;
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 