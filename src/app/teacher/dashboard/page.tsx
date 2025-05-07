'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  Users, 
  ClipboardList,
  PlusCircle,
  Calendar,
  Activity,
  Bell,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  totalAssessments: number;
  upcomingAssessments: number;
}

interface Class {
  _id: string;
  className: string;
  section: string;
  totalStudents: number;
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherStats>({
    totalClasses: 0,
    totalStudents: 0,
    totalAssessments: 0,
    upcomingAssessments: 0
  });

  const [classes, setClasses] = useState<Class[]>([]);

  const [recentActivities] = useState([
    { type: 'Assessment', message: 'Math Quiz submitted by Class 8-A', time: '1 hour ago' },
    { type: 'Attendance', message: 'Attendance marked for Class 9-B', time: '2 hours ago' },
    { type: 'Assignment', message: 'New assignment posted for Class 7-A', time: '3 hours ago' },
    { type: 'Result', message: 'Quiz results published for Class 10-C', time: 'Yesterday' },
  ]);

  const [upcomingClasses] = useState([
    { className: 'Mathematics', section: '8-A', time: '09:00 AM', topic: 'Algebra Basics' },
    { className: 'Mathematics', section: '9-B', time: '11:00 AM', topic: 'Trigonometry' },
    { className: 'Mathematics', section: '7-A', time: '02:00 PM', topic: 'Geometry' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, classesResponse] = await Promise.all([
          axios.get('/api/teacher/stats'),
          axios.get('/api/teacher/classes')
        ]);

        setStats(statsResponse.data);
        setClasses(classesResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'My Classes', value: stats.totalClasses, icon: BookOpen, color: 'bg-blue-500', link: '/teacher/classes' },
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-green-500', link: '/teacher/students' },
    { title: 'Assessments', value: stats.totalAssessments, icon: ClipboardList, color: 'bg-purple-500', link: '/teacher/assessments' },
    { title: 'Upcoming Tests', value: stats.upcomingAssessments, icon: Calendar, color: 'bg-pink-500', link: '/teacher/assessments/upcoming' }
  ];

  return (
    <div className="space-y-8 p-8 bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Teacher!</h1>
        <p className="opacity-90">Here&apos;s your teaching schedule and updates.</p>
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
        {/* Today's Classes */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Today&apos;s Classes</h2>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {upcomingClasses.map((cls, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-medium">{cls.className} ({cls.section})</h4>
                    <p className="text-sm text-gray-500">{cls.topic}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-600">{cls.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
          <button className="mt-4 w-full py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition duration-300">
            View All Activities
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
            { title: 'Take Attendance', icon: Users, color: 'text-blue-500', href: '/teacher/attendance' },
            { title: 'Create Assignment', icon: ClipboardList, color: 'text-purple-500', href: '/teacher/assignments/create' },
            { title: 'Schedule Test', icon: Calendar, color: 'text-green-500', href: '/teacher/tests/schedule' },
            { title: 'Upload Results', icon: Award, color: 'text-pink-500', href: '/teacher/results/upload' }
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