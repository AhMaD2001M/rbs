'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  ClipboardList,
  Award,
  Calendar,
  Activity,
  Bell,
  BookOpenCheck,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';

interface StudentStats {
  totalClasses: number;
  totalAssessments: number;
  averageGrade: string;
  attendanceRate: string;
}

interface Class {
  _id: string;
  className: string;
  section: string;
  teacher: {
    firstName: string;
    lastName: string;
  };
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats>({
    totalClasses: 0,
    totalAssessments: 0,
    averageGrade: 'N/A',
    attendanceRate: '0%'
  });

  const [classes, setClasses] = useState<Class[]>([]);

  const [recentActivities] = useState([
    { type: 'Assignment', message: 'New Math homework due tomorrow', time: '1 hour ago' },
    { type: 'Grade', message: 'Science quiz grade posted', time: '2 hours ago' },
    { type: 'Class', message: 'English class materials updated', time: '3 hours ago' },
    { type: 'Attendance', message: 'Marked present in History class', time: 'Yesterday' },
  ]);

  const [todaySchedule] = useState([
    { subject: 'Mathematics', time: '09:00 AM', teacher: 'Mr. Johnson', room: 'Room 101' },
    { subject: 'Science', time: '11:00 AM', teacher: 'Mrs. Smith', room: 'Lab 2' },
    { subject: 'English', time: '02:00 PM', teacher: 'Ms. Davis', room: 'Room 205' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, classesResponse] = await Promise.all([
          axios.get('/api/student/stats'),
          axios.get('/api/student/classes'),
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
    { title: 'My Classes', value: stats.totalClasses, icon: BookOpen, color: 'bg-blue-500', link: '/student/classes' },
    { title: 'Attendance Rate', value: stats.attendanceRate, icon: BookOpenCheck, color: 'bg-green-500', link: '/student/attendance' },
    { title: 'Average Grade', value: stats.averageGrade, icon: Award, color: 'bg-purple-500', link: '/student/grades' },
    { title: 'Assessments', value: stats.totalAssessments, icon: ClipboardList, color: 'bg-pink-500', link: '/student/assessments' }
  ];

  const isImpersonating = typeof window !== 'undefined' && sessionStorage.getItem('admin_token');
  const handleReturnToAdmin = () => {
    const adminToken = sessionStorage.getItem('admin_token');
    if (adminToken) {
      document.cookie = `token=${adminToken}; path=/;`;
      sessionStorage.removeItem('admin_token');
      window.location.href = '/admin/dashboard';
    }
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    sessionStorage.removeItem('admin_token');
    window.location.href = '/login';
  };

  return (
    <div className="space-y-8 p-8 bg-gray-50">
      {isImpersonating && (
        <div className="bg-yellow-200 text-yellow-900 p-4 rounded mb-4 flex justify-between items-center">
          <span>You are impersonating a student. </span>
          <button onClick={handleReturnToAdmin} className="bg-yellow-400 px-3 py-1 rounded font-semibold hover:bg-yellow-300">Return to Admin</button>
        </div>
      )}
      <div className="flex justify-end mb-4">
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      </div>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Student!</h1>
        <p className="opacity-90">Here&apos;s your learning progress and schedule.</p>
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

      {/* Enrolled Classes Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Enrolled Classes</h2>
        {classes.length === 0 ? (
          <p className="text-gray-500">You are not enrolled in any classes.</p>
        ) : (
          <div className="space-y-4">
            {classes.map(cls => (
              <Link href={`/student/classes/${cls._id}`} key={cls._id}>
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition duration-150 cursor-pointer border border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-800">{cls.className} - Section {cls.section}</h3>
                    <p className="text-sm text-gray-500">Teacher: {cls.teacher.firstName} {cls.teacher.lastName}</p>
                  </div>
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Today&apos;s Schedule</h2>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {todaySchedule.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-medium">{schedule.subject}</h4>
                    <p className="text-sm text-gray-500">{schedule.teacher} • {schedule.room}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-600">{schedule.time}</div>
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
          <GraduationCap className="h-5 w-5 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'View Assignments', icon: ClipboardList, color: 'text-blue-500', href: '/student/assignments' },
            { title: 'Check Grades', icon: Award, color: 'text-purple-500', href: '/student/grades' },
            { title: 'View Schedule', icon: Calendar, color: 'text-green-500', href: '/student/schedule' },
            { title: 'Learning Materials', icon: BookOpen, color: 'text-pink-500', href: '/student/materials' }
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