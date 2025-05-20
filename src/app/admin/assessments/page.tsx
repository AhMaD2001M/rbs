'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  ClipboardList, 
  PlusCircle, 
  Search,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Assessment {
  _id: string;
  title: string;
  type: string;
  class: {
    name: string;
    grade: string;
    section: string;
  };
  teacher: {
    username: string;
  };
  date: string;
  totalMarks: number;
  status: string;
  grades: Array<{
    student: {
      _id: string;
    };
    marks: number;
  }>;
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get('/api/admin/assessments');
        setAssessments(response.data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.class.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || assessment.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const assessmentTypes = ['exam', 'quiz', 'assignment', 'project', 'mid-term', 'final'];
  const statusTypes = ['scheduled', 'ongoing', 'completed', 'cancelled'];

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
        <h1 className="text-2xl font-bold text-gray-800">Assessments</h1>
        <Link 
          href="/admin/assessments/create"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <PlusCircle className="h-5 w-5" />
          Create Assessment
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {assessmentTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {statusTypes.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assessments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 gap-4 p-6">
          {filteredAssessments.map((assessment) => (
            <Link 
              key={assessment._id} 
              href={`/admin/assessments/${assessment._id}`}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition border border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{assessment.title}</h3>
                  <p className="text-sm text-gray-500">
                    {assessment.class.name} ({assessment.class.grade}-{assessment.class.section}) • 
                    {assessment.teacher.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(assessment.date).toLocaleDateString()} • {assessment.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      {assessment.grades.length} grades
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm font-medium text-gray-600">
                      {assessment.totalMarks} marks
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    assessment.status === 'completed' ? 'bg-green-100 text-green-600' :
                    assessment.status === 'ongoing' ? 'bg-yellow-100 text-yellow-600' :
                    assessment.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {assessment.status}
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}

          {filteredAssessments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No assessments found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 