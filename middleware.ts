import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { roleConfig } from './app/config/rbac';
import { UserRole } from './app/context/AuthContext';

interface UserData {
  role: UserRole;
}

// Define route permissions for each role
const rolePermissions = {
  admin: ['/dashboard', '/dashboard/patients', '/dashboard/doctors', '/dashboard/pharmacy', '/dashboard/appointments', '/dashboard/billing'],
  doctor: ['/dashboard', '/dashboard/patients'],
  nurse: ['/dashboard', '/dashboard/patients', '/dashboard/doctors'],
  pharmacist: ['/dashboard', '/dashboard/pharmacy'],
  receptionist: ['/dashboard', '/dashboard/appointments', '/dashboard/patients'],
  patient: ['/dashboard', '/dashboard/appointments']
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for non-dashboard routes and api routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Get user from cookies
  const user = request.cookies.get('user')?.value;
  
  if (!user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const userData = JSON.parse(user) as UserData;
    const allowedRoutes = roleConfig[userData.role].routes;

    // Check if the current path is allowed for the user's role
    const isAllowed = allowedRoutes.some((route: string) => pathname.startsWith(route));

    if (!isAllowed) {
      // Redirect to dashboard if the route is not allowed
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If there's any error parsing the user data, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  }
} 