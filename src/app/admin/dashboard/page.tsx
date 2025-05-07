'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  PlusCircle,
  GraduationCap,
  Calendar,
  Activity,
  Bell
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  totalAssessments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalAssessments: 0
  });

  const [recentActivities] = useState([
    { type: 'New Teacher', message: 'Sarah Johnson joined as Mathematics teacher', time: '2 hours ago' },
    { type: 'New Class', message: 'Class 10-A was created', time: '3 hours ago' },
    { type: 'Assessment', message: 'Mid-term results published for Class 8', time: '5 hours ago' },
    { type: 'Student', message: 'New student enrollment in Class 7-B', time: '1 day ago' },
  ]);

  const [upcomingEvents] = useState([
    { title: 'Parent-Teacher Meeting', date: '2024-03-25', type: 'meeting' },
    { title: 'Annual Sports Day', date: '2024-03-28', type: 'event' },
    { title: 'Science Exhibition', date: '2024-04-02', type: 'exhibition' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Teachers', value: stats.totalTeachers, icon: Users, color: 'bg-blue-500', link: '/admin/teachers' },
    { title: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: 'bg-green-500', link: '/admin/students' },
    { title: 'Active Classes', value: stats.totalClasses, icon: BookOpen, color: 'bg-purple-500', link: '/admin/classes' },
    { title: 'Assessments', value: stats.totalAssessments, icon: ClipboardList, color: 'bg-pink-500', link: '/admin/assessments' }
  ];

  return (
    <div className="space-y-8 p-8 bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="opacity-90">Here's what's happening in your school today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.link} key={stat.title}>
              <div className="bg-white rounded-xl shadow-sm p-6 transition duration-300 hover:shadow-md cursor-pointer border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                </div>
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
            <Activity className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <Bell className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center bg-blue-50 rounded-lg">
                  <span className="text-sm font-bold text-blue-600">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-xs text-blue-600">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div>
                  <h4 className="text-gray-800 font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-500 capitalize">{event.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition duration-300">
            View All Events
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          <PlusCircle className="h-5 w-5 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Add New Teacher', icon: Users, color: 'text-blue-500', href: '/admin/teachers/add' },
            { title: 'Create Class', icon: BookOpen, color: 'text-purple-500', href: '/admin/classes/create' },
            { title: 'Add Student', icon: GraduationCap, color: 'text-green-500', href: '/admin/students/add' },
            { title: 'Schedule Assessment', icon: ClipboardList, color: 'text-pink-500', href: '/admin/assessments/create' }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="flex items-center space-x-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition duration-300"
              >
                <Icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-gray-700 font-medium">{action.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 