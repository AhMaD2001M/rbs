'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  BookOpen, 
  Users, 
  ClipboardList,
  PlusCircle,
  Calendar,
  Activity,
  Bell,
  Award,
  Clock,
  UserCircle,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface TeacherStats {
  totalStudents: number;
  totalClasses: number;
  totalAssessments: number;
}

interface Student {
  _id: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  lastLogin?: string;
}

interface Class {
  _id: string;
  name: string;
  subject: string;
  grade: string;
  section: string;
  studentsCount: number;
}

interface Activity {
  type: string;
  description: string;
  timestamp: string;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    totalClasses: 0,
    totalAssessments: 0,
  });
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch teacher's stats
        const statsResponse = await axios.get('/api/teacher/stats');
        setStats(statsResponse.data);

        // Fetch teacher's classes
        const classesResponse = await axios.get('/api/teacher/classes');
        setClasses(classesResponse.data);

        // Fetch recent students
        const studentsResponse = await axios.get('/api/teacher/students');
        setRecentStudents(studentsResponse.data.slice(0, 5));

        // Fetch recent activities
        const activitiesResponse = await axios.get('/api/teacher/activities');
        setActivities(activitiesResponse.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          <span>You are impersonating a teacher. </span>
          <button onClick={handleReturnToAdmin} className="bg-yellow-400 px-3 py-1 rounded font-semibold hover:bg-yellow-300">Return to Admin</button>
        </div>
      )}
      <div className="flex justify-end mb-4">
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      </div>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session?.user?.name || 'Teacher'}!
        </h1>
        <p className="opacity-90">Here's an overview of your classes and students.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalStudents}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Students</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-lg text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalClasses}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Active Classes</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pink-500 p-3 rounded-lg text-white">
              <ClipboardList className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalAssessments}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Assessments</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Classes</h2>
            <Link href="/teacher/classes" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {classes.map((cls) => (
              <Link href={`/teacher/classes/${cls._id}`} key={cls._id}>
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition duration-150 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{cls.name}</h3>
                      <p className="text-sm text-gray-500">
                        {cls.subject} • Grade {cls.grade}-{cls.section}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{cls.studentsCount} students</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Students</h2>
            <Link href="/teacher/students" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentStudents.map((student) => (
              <Link href={`/teacher/students/${student._id}`} key={student._id}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <UserCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-medium">
                      {student.profile.firstName} {student.profile.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  {student.lastLogin && (
                    <div className="ml-auto flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(student.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
          <Activity className="h-5 w-5 text-gray-500" />
        </div>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <div className="flex-shrink-0">
                {activity.type === 'assessment' ? (
                  <ClipboardList className="h-5 w-5 text-pink-500" />
                ) : activity.type === 'class' ? (
                  <BookOpen className="h-5 w-5 text-purple-500" />
                ) : (
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div>
                <p className="text-gray-800 font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 