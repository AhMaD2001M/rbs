'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Users, UserPlus, ClipboardList, Mail } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Student {
  _id: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
  };
}

interface Assessment {
  _id: string;
  title: string;
  maxMarks: number;
  dueDate: string;
  marks: Array<{
    student: Student;
    score: number;
    remarks?: string;
  }>;
}

interface Class {
  _id: string;
  name: string;
  grade: string;
  section: string;
  students: Student[];
}

export default function ClassDetailPage() {
  const params = useParams();
  const [classData, setClassData] = useState<Class | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const [classResponse, assessmentsResponse] = await Promise.all([
          axios.get(`/api/teacher/classes/${params.id}`),
          axios.get(`/api/teacher/assessments?classId=${params.id}`)
        ]);
        setClassData(classResponse.data);
        setAssessments(assessmentsResponse.data);
      } catch (error) {
        console.error('Error fetching class data:', error);
        toast.error('Failed to load class data');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClassData();
    }
  }, [params.id]);

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollEmail.trim()) return;

    try {
      setEnrolling(true);
      await axios.post(`/api/teacher/students/add`, {
        classId: params.id,
        studentEmails: [enrollEmail]
      });
      toast.success('Student enrolled successfully');
      setEnrollEmail('');
      // Refresh class data
      const response = await axios.get(`/api/teacher/classes/${params.id}`);
      setClassData(response.data);
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast.error('Failed to enroll student');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Class not found</h1>
        <p className="text-gray-600">The class you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {classData.name}
        </h1>
        <p className="text-gray-600">
          Grade {classData.grade}-{classData.section}
        </p>
      </div>

      {/* Enroll Student Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          Enroll Student
        </h2>
        <form onSubmit={handleEnrollStudent} className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                value={enrollEmail}
                onChange={(e) => setEnrollEmail(e.target.value)}
                placeholder="Enter student email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={enrolling}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {enrolling ? 'Enrolling...' : 'Enroll'}
          </button>
        </form>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Enrolled Students ({classData.students.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classData.students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.profile.firstName} {student.profile.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.username}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <ClipboardList className="h-5 w-5 mr-2" />
          Class Assessments ({assessments.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assessments.map((assessment) => (
                <tr key={assessment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assessment.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(assessment.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assessment.maxMarks}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {assessment.marks.length} / {classData.students.length}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 