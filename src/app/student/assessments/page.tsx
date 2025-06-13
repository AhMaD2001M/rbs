'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ClipboardList, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Assessment {
  _id: string;
  title: string;
  description: string;
  maxMarks: number;
  dueDate: string;
  class: {
    name: string;
    grade: string;
    section: string;
  };
  submitted: boolean;
}

export default function StudentAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/student/assessments');
        setAssessments(response.data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        toast.error('Failed to load assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  return (
    <div className="p-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-blue-100 p-3 rounded-lg">
          <ClipboardList className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">My Assessments</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <Link href={`/student/assessments/${assessment._id}`} key={assessment._id}>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>
                <div className={`text-sm font-medium ${
                  assessment.submitted 
                    ? 'text-green-600 bg-green-100' 
                    : isOverdue(assessment.dueDate)
                      ? 'text-red-600 bg-red-100'
                      : 'text-blue-600 bg-blue-100'
                } px-3 py-1 rounded-full`}>
                  {assessment.submitted 
                    ? 'Submitted' 
                    : isOverdue(assessment.dueDate)
                      ? 'Overdue'
                      : 'Pending'}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{assessment.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assessment.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {assessment.class.name} ({assessment.class.grade}-{assessment.class.section})
                </span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {assessments.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No assessments found</h3>
          <p className="text-gray-500">You don&apos;t have any assessments assigned yet.</p>
        </div>
      )}
    </div>
  );
} 