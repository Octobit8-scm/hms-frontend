'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  BeakerIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { roleConfig } from '../config/rbac';

const icons = {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  BeakerIcon,
  CalendarIcon,
  CurrencyDollarIcon,
};

const medicalQuotes = [
  {
    quote: "The good physician treats the disease; the great physician treats the patient who has the disease.",
    author: "William Osler"
  },
  {
    quote: "Wherever the art of medicine is loved, there is also a love of humanity.",
    author: "Hippocrates"
  },
  {
    quote: "The greatest mistake in the treatment of diseases is that there are physicians for the body and physicians for the soul, although the two cannot be separated.",
    author: "Plato"
  },
  {
    quote: "Let food be thy medicine and medicine be thy food.",
    author: "Hippocrates"
  },
  {
    quote: "The art of medicine consists of amusing the patient while nature cures the disease.",
    author: "Voltaire"
  },
  {
    quote: "The doctor of the future will give no medicine, but will interest his patients in the care of the human frame, in diet, and in the cause and prevention of disease.",
    author: "Thomas Edison"
  },
  {
    quote: "Medicine is not only a science; it is also an art. It does not consist of compounding pills and plasters; it deals with the very processes of life.",
    author: "Paracelsus"
  },
  {
    quote: "The physician's highest calling, his only calling, is to make sick people healthy - to heal, as it is termed.",
    author: "Samuel Hahnemann"
  },
  {
    quote: "The best medicine for humans is love. Someone asked me 'What if it doesn't work?' I smiled and said 'Increase the dose.'",
    author: "Unknown"
  },
  {
    quote: "The practice of medicine is an art, not a trade; a calling, not a business; a calling in which your heart will be exercised equally with your head.",
    author: "William Osler"
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % medicalQuotes.length);
    }, 10000); // Rotate quotes every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const userNavigation = roleConfig[user.role].navigation;

  return (
    <div className="flex min-h-0 flex-1 flex-col border-r border-indigo-100 bg-gradient-to-b from-teal-50 to-white relative w-52">
      {/* Top Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-20 opacity-5 pointer-events-none">
        <Image
          src="https://www.transparentpng.com/thumb/medical-symbol/medical-symbol-clipart-transparent-background-10.png"
          alt="Medical pattern"
          width={1024}
          height={1024}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Bottom Background Pattern */}
      <div className="absolute bottom-0 left-0 w-full h-20 opacity-5 pointer-events-none transform rotate-180">
        <Image
          src="https://www.transparentpng.com/thumb/medical-symbol/medical-symbol-clipart-transparent-background-10.png"
          alt="Medical pattern"
          width={1024}
          height={1024}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto pt-2 pb-2 relative">
        {/* Logo Section */}
        <div className="flex flex-shrink-0 items-center px-2 pb-2 border-b border-indigo-100">
          <div className="flex items-center space-x-2">
            <div className="relative w-7 h-7 bg-white rounded-full p-1 shadow-md">
              <Image
                src="https://www.transparentpng.com/thumb/medical-logo/z9MlG1-medical-logo-clipart-hd.png"
                alt="Medical logo"
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-900">MediCare</h1>
              <p className="text-xs text-teal-600">Healthcare Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1 space-y-0.5 px-1.5">
          {userNavigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = icons[item.icon as keyof typeof icons];
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-teal-50 text-teal-700 border-l-2 border-teal-500 shadow-sm'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700 border-l-2 border-transparent'
                } group flex items-center px-2 py-1.5 text-base font-medium rounded-md transition-all duration-200`}
              >
                <Icon
                  className={`${
                    isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-600'
                  } mr-1.5 flex-shrink-0 h-5 w-5 transition-colors duration-200`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Medical Quote - Now with rotation and enhanced styling */}
        <div className="px-2 py-1.5 mt-2">
          <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-white p-2 border border-indigo-100 shadow-sm min-h-[90px] transition-all duration-500 hover:shadow-md">
            <div className="flex items-start space-x-1.5">
              <HeartIcon className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-sm text-indigo-700 italic leading-relaxed transition-opacity duration-500">
                  {medicalQuotes[currentQuote].quote}
                </p>
                <p className="text-sm text-indigo-600 mt-1 font-medium">
                  - {medicalQuotes[currentQuote].author}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats with enhanced styling */}
        <div className="px-2 py-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-teal-50 rounded-lg p-2 border border-teal-100 hover:shadow-sm transition-all duration-300">
              <div className="flex items-center space-x-1.5">
                <UserGroupIcon className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600 font-medium">Active Patients</p>
                  <p className="text-base text-teal-700 font-bold">24</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100 hover:shadow-sm transition-all duration-300">
              <div className="flex items-center space-x-1.5">
                <CalendarIcon className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Appointments</p>
                  <p className="text-base text-indigo-700 font-bold">8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className="flex flex-shrink-0 border-t border-indigo-100 p-2 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-teal-100 to-indigo-100 flex items-center justify-center shadow-inner">
              <span className="text-base font-medium text-indigo-700">
                {user.name[0]}
              </span>
            </div>
          </div>
          <div className="ml-1.5 flex-1">
            <p className="text-base font-medium text-gray-900">{user.name}</p>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-1 animate-pulse" />
              <p className="text-sm font-medium text-indigo-600 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="ml-1.5 flex items-center justify-center text-gray-400 hover:text-teal-600 transition-colors duration-200"
            title="Sign out"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 