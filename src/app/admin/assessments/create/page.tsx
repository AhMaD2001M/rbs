'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Class {
  _id: string;
  name: string;
  grade: string;
  section: string;
  subjects: Array<{
    name: string;
    teacher: {
      _id: string;
      username: string;
    };
  }>;
}

interface AssessmentFormData {
  title: string;
  type: string;
  subject: string;
  class: string;
  teacher: string;
  totalMarks: number;
  passingMarks: number;
  date: string;
  description: string;
}

export default function CreateAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<AssessmentFormData>({
    title: '',
    type: 'exam',
    subject: '',
    class: searchParams?.get('classId') || '',
    teacher: '',
    totalMarks: 100,
    passingMarks: 40,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/admin/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('Failed to load classes');
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/admin/assessments', formData);
      router.push('/admin/assessments');
    } catch (error) {
      console.error('Error creating assessment:', error);
      setError('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-select teacher when subject is selected
    if (name === 'subject' && formData.class) {
      const selectedClass = classes.find(c => c._id === formData.class);
      const selectedSubject = selectedClass?.subjects.find(s => s.name === value);
      if (selectedSubject) {
        setFormData(prev => ({
          ...prev,
          teacher: selectedSubject.teacher._id
        }));
      }
    }
  };

  const selectedClass = classes.find(c => c._id === formData.class);
  const assessmentTypes = ['exam', 'quiz', 'assignment', 'project', 'mid-term', 'final'];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center space-x-4">
        <Link 
          href="/admin/assessments"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Assessments</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Create New Assessment</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Assessment Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Assessment Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {assessmentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <select
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} ({cls.grade}-{cls.section})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={!formData.class}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select a subject</option>
                {selectedClass?.subjects.map(subject => (
                  <option key={subject.name} value={subject.name}>
                    {subject.name} ({subject.teacher.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700">
                Total Marks
              </label>
              <input
                type="number"
                id="totalMarks"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="passingMarks" className="block text-sm font-medium text-gray-700">
                Passing Marks
              </label>
              <input
                type="number"
                id="passingMarks"
                name="passingMarks"
                value={formData.passingMarks}
                onChange={handleChange}
                required
                min="1"
                max={formData.totalMarks}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Assessment Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter assessment details, topics covered, and any special instructions..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/assessments"
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
} 