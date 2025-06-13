'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BookOpen, ClipboardList, Award, Users } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Teacher {
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
  description: string;
  maxMarks: number;
  dueDate: string;
  marks: Array<{
    student: string;
    score: number;
    remarks?: string;
    submittedAt: string;
  }>;
}

interface Class {
  _id: string;
  name: string;
  grade: string;
  section: string;
  teacher: Teacher;
  classTeacher: Teacher;
  subjects: Array<{
    name: string;
    teacher: Teacher;
  }>;
}

export default function StudentClassDetailPage() {
  const params = useParams();
  const [classData, setClassData] = useState<Class | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const [classResponse, assessmentsResponse] = await Promise.all([
          axios.get(`/api/student/classes/${params.id}`),
          axios.get(`/api/student/assessments?classId=${params.id}`)
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
        <p className="text-gray-600">The class you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const getMyScore = (assessment: Assessment) => {
    const myScore = assessment.marks.find(mark => mark.student === params.id);
    if (!myScore) return null;
    return {
      score: myScore.score,
      percentage: ((myScore.score / assessment.maxMarks) * 100).toFixed(1),
      remarks: myScore.remarks,
      submittedAt: new Date(myScore.submittedAt).toLocaleDateString()
    };
  };

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

      {/* Teachers Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Teachers
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-600">Class Teacher</p>
              <p className="text-gray-900">
                {classData.classTeacher.profile.firstName} {classData.classTeacher.profile.lastName}
              </p>
            </div>
            <div className="text-sm text-gray-500">{classData.classTeacher.email}</div>
          </div>
          {classData.subjects.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-600">{subject.name}</p>
                <p className="text-gray-900">
                  {subject.teacher.profile.firstName} {subject.teacher.profile.lastName}
                </p>
              </div>
              <div className="text-sm text-gray-500">{subject.teacher.email}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessments and Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <ClipboardList className="h-5 w-5 mr-2" />
          Assessments and Results
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
                  Your Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assessments.map((assessment) => {
                const myScore = getMyScore(assessment);
                return (
                  <tr key={assessment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assessment.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {assessment.description}
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
                      {myScore ? (
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">
                            {myScore.score}
                          </span>
                          <span className="text-gray-500 ml-1">
                            ({myScore.percentage}%)
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Submitted: {myScore.submittedAt}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {myScore?.remarks || '-'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {assessments.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No assessments yet</h3>
            <p className="text-gray-500">There are no assessments for this class yet.</p>
          </div>
        )}
      </div>
    </div>
  );
} 