'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

interface Class {
  _id: string;
  name: string;
  grade: string;
  section: string;
  teacher: {
    username: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function StudentClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/student/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <Link href={`/student/classes/${cls._id}`} key={cls._id}>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{cls.name}</h3>
              <div className="text-sm text-gray-500 space-y-2">
                <div>Grade {cls.grade}-{cls.section}</div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Teacher: {cls.teacher.profile.firstName} {cls.teacher.profile.lastName}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No classes found</h3>
          <p className="text-gray-500">You are not enrolled in any classes yet.</p>
        </div>
      )}
    </div>
  );
} 