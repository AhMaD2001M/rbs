'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  BookOpen, 
  Users, 
  ClipboardList,
  Calendar,
  UserCircle,
  ChevronLeft,
  PlusCircle,
  X
} from 'lucide-react';

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
  type: string;
  date: string;
  totalMarks: number;
  status: string;
}

interface Class {
  _id: string;
  name: string;
  grade: string;
  section: string;
  academicYear: string;
  classTeacher: {
    _id: string;
    username: string;
    email: string;
  };
  students: Student[];
  subjects: Array<{
    name: string;
    teacher: {
      _id: string;
      username: string;
      email: string;
    };
  }>;
  capacity: number;
  active: boolean;
}

interface AvailableStudent {
  _id: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
  };
}

export default function ClassDetailPage() {
  const params = useParams();
  const [classData, setClassData] = useState<Class | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const [classResponse, assessmentsResponse] = await Promise.all([
          axios.get(`/api/admin/classes/${params.id}`),
          axios.get(`/api/admin/assessments?classId=${params.id}`)
        ]);
        
        setClassData(classResponse.data);
        setAssessments(assessmentsResponse.data);
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClassData();
    }
  }, [params.id]);

  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get('/api/admin/students');
      // Filter out students already enrolled in this class
      const enrolledStudentIds = classData?.students.map(s => s._id) || [];
      const available = response.data.filter((student: AvailableStudent) => 
        !enrolledStudentIds.includes(student._id)
      );
      setAvailableStudents(available);
    } catch (error) {
      console.error('Error fetching available students:', error);
    }
  };

  const handleEnrollStudent = async () => {
    if (!selectedStudentId) return;
    
    setEnrolling(true);
    try {
      await axios.patch('/api/admin/classes', {
        classId: params.id,
        studentId: selectedStudentId
      });
      
      // Refresh class data
      const classResponse = await axios.get(`/api/admin/classes/${params.id}`);
      setClassData(classResponse.data);
      
      // Close modal and reset
      setShowEnrollModal(false);
      setSelectedStudentId('');
      setAvailableStudents([]);
    } catch (error) {
      console.error('Error enrolling student:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || !classData) {
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
            href="/admin/classes"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Classes</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {classData.name} ({classData.grade}-{classData.section})
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/classes/${params.id}/edit`}
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Edit Class
          </Link>
          <Link
            href={`/admin/assessments/create?classId=${params.id}`}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <PlusCircle className="h-5 w-5" />
            Add Assessment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Class Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Academic Year</p>
                <p className="font-medium">{classData.academicYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  classData.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {classData.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class Teacher</p>
                <p className="font-medium">{classData.classTeacher.username}</p>
                <p className="text-sm text-gray-500">{classData.classTeacher.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="font-medium">{classData.students.length}/{classData.capacity}</p>
              </div>
            </div>
          </div>

          {/* Subjects Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Subjects</h2>
            <div className="space-y-4">
              {classData.subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-800">{subject.name}</h3>
                    <p className="text-sm text-gray-500">
                      {subject.teacher.username} • {subject.teacher.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assessments Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Assessments</h2>
              <Link href={`/admin/classes/${params.id}/assessments`} className="text-blue-500 hover:text-blue-600 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {assessments.slice(0, 5).map((assessment) => (
                <Link 
                  key={assessment._id}
                  href={`/admin/assessments/${assessment._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <ClipboardList className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{assessment.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(assessment.date).toLocaleDateString()} • {assessment.type}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    assessment.status === 'completed' ? 'bg-green-100 text-green-600' :
                    assessment.status === 'ongoing' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {assessment.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Students</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowEnrollModal(true);
                  fetchAvailableStudents();
                }}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Enroll Student
              </button>
              <Link
                href={`/admin/students/add?classId=${params.id}`}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Add New
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {classData?.students.map((student) => (
              <Link
                key={student._id}
                href={`/admin/students/${student._id}`}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <UserCircle className="h-10 w-10 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    {student.profile.firstName} {student.profile.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Enroll Student</h3>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Choose a student...</option>
                  {availableStudents.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.profile.firstName} {student.profile.lastName} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnrollStudent}
                  disabled={!selectedStudentId || enrolling}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 