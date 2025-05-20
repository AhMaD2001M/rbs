'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft,
  Clock,
  Users,
  Award,
  CheckCircle,
  XCircle,
  BarChart
} from 'lucide-react';

interface Grade {
  student: {
    _id: string;
    username: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  marks: number;
  remarks?: string;
}

interface Assessment {
  _id: string;
  title: string;
  type: string;
  subject: string;
  class: {
    _id: string;
    name: string;
    grade: string;
    section: string;
  };
  teacher: {
    _id: string;
    username: string;
    email: string;
  };
  totalMarks: number;
  passingMarks: number;
  date: string;
  description: string;
  grades: Grade[];
  status: string;
  classAverage: number;
  passPercentage: number;
}

export default function AssessmentDetailPage() {
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingGrade, setEditingGrade] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState({ marks: 0, remarks: '' });

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await axios.get(`/api/admin/assessments/${params.id}`);
        setAssessment(response.data);
      } catch (error) {
        console.error('Error fetching assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAssessment();
    }
  }, [params.id]);

  const handleUpdateGrade = async (studentId: string) => {
    try {
      await axios.put(`/api/admin/assessments/${params.id}/grades/${studentId}`, gradeForm);
      const response = await axios.get(`/api/admin/assessments/${params.id}`);
      setAssessment(response.data);
      setEditingGrade(null);
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  };

  if (loading || !assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/assessments"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Assessments</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{assessment.title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/assessments/${params.id}/edit`}
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Edit Assessment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Assessment Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">{assessment.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{assessment.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">
                  {assessment.class.name} ({assessment.class.grade}-{assessment.class.section})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teacher</p>
                <p className="font-medium">{assessment.teacher.username}</p>
                <p className="text-sm text-gray-500">{assessment.teacher.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(assessment.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Marks</p>
                <p className="font-medium">{assessment.totalMarks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passing Marks</p>
                <p className="font-medium">{assessment.passingMarks}</p>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{assessment.description}</p>
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-blue-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {assessment.grades.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <BarChart className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-green-600">Class Average</p>
                  <p className="text-2xl font-bold text-green-700">
                    {assessment.classAverage.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Award className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-purple-600">Pass Percentage</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {assessment.passPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grades List */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Student Grades</h2>
          <div className="space-y-4">
            {assessment.grades.map((grade) => (
              <div
                key={grade.student._id}
                className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {grade.student.profile.firstName} {grade.student.profile.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">{grade.student.email}</p>
                  </div>
                  {editingGrade === grade.student._id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={gradeForm.marks}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                        className="w-20 px-2 py-1 border rounded"
                        max={assessment.totalMarks}
                      />
                      <button
                        onClick={() => handleUpdateGrade(grade.student._id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingGrade(null)}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-800">
                          {grade.marks}/{assessment.totalMarks}
                        </span>
                        <button
                          onClick={() => {
                            setEditingGrade(grade.student._id);
                            setGradeForm({ marks: grade.marks, remarks: grade.remarks || '' });
                          }}
                          className="p-1 text-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </button>
                      </div>
                      {grade.marks >= assessment.passingMarks ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Pass
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Fail
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {editingGrade === grade.student._id ? (
                  <textarea
                    value={gradeForm.remarks}
                    onChange={(e) => setGradeForm(prev => ({ ...prev, remarks: e.target.value }))}
                    placeholder="Add remarks..."
                    className="w-full mt-2 px-3 py-2 border rounded"
                    rows={2}
                  />
                ) : grade.remarks && (
                  <p className="text-sm text-gray-600 mt-2">{grade.remarks}</p>
                )}
              </div>
            ))}

            {assessment.grades.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No grades recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 