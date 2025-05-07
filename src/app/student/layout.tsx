'use client'
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  User,
  LogOut
} from 'lucide-react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: Home },
    { name: 'My Classes', href: '/student/classes', icon: BookOpen },
    { name: 'My Results', href: '/student/results', icon: ClipboardList },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <div className="text-gray-800 text-xl font-bold px-4">
          Student Dashboard
        </div>
        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full px-4">
          <button
            onClick={() => {
              // Handle logout
              window.location.href = '/auth/login';
            }}
            className="flex items-center space-x-2 py-2 px-4 text-gray-600 hover:bg-gray-200 rounded transition duration-200 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 