'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Class {
  _id: string;
  name: string;
  grade: string;
  section: string;
  studentsCount: number;
}

export default function TeacherClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/teacher/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error('Session expired. Please login again.');
            router.push('/auth/login');
          } else if (error.response?.status === 404) {
            setError('Teacher profile not found. Please contact administrator.');
            toast.error('Teacher profile not found');
          } else {
            setError(error.response?.data?.message || 'Failed to load classes');
            toast.error('Failed to load classes');
          }
        } else {
          setError('An unexpected error occurred');
          toast.error('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-center mb-4">
          <p className="text-xl font-semibold">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-blue-100 p-3 rounded-lg">
          <BookOpen className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">My Classes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Link href={`/teacher/classes/${cls._id}`} key={cls._id}>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{cls.name}</h3>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Grade {cls.grade}-{cls.section}</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{cls.studentsCount} students</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {classes.length === 0 && !error && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No classes found</h3>
          <p className="text-gray-500">You haven&apos;t been assigned to any classes yet.</p>
        </div>
      )}
    </div>
  );
} 