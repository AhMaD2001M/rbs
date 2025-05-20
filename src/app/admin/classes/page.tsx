'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  BookOpen, 
  PlusCircle, 
  Users, 
  ChevronRight 
} from 'lucide-react';

interface Class {
  _id: string;
  name: string;
  grade: string;
  section: string;
  academicYear: string;
  classTeacher: {
    username: string;
    email: string;
  };
  students: Array<{
    _id: string;
    username: string;
    email: string;
  }>;
  capacity: number;
  active: boolean;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/admin/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
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
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
        <Link 
          href="/admin/classes/create"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <PlusCircle className="h-5 w-5" />
          Add New Class
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 gap-4 p-6">
          {classes.map((cls) => (
            <Link 
              key={cls._id} 
              href={`/admin/classes/${cls._id}`}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition border border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{cls.name}</h3>
                  <p className="text-sm text-gray-500">
                    Grade {cls.grade}-{cls.section} • {cls.academicYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Users className="h-5 w-5" />
                  <span>{cls.students.length}/{cls.capacity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    cls.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {cls.active ? 'Active' : 'Inactive'}
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 