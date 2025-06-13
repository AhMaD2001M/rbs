'use client'
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Teacher {
  _id: string;
  username: string;
  email: string;
}

interface ClassFormData {
  name: string;
  grade: string;
  section: string;
  academicYear: string;
  classTeacher: string;
  capacity: number;
  subjects: Array<{
    name: string;
    teacher: string;
  }>;
}

interface ApiError {
  message: string;
}

export default function CreateClassPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    grade: '',
    section: '',
    academicYear: new Date().getFullYear().toString(),
    classTeacher: '',
    capacity: 30,
    subjects: [{ name: '', teacher: '' }]
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/api/admin/teachers');
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        const axiosError = error as AxiosError<ApiError>;
        toast.error(axiosError.response?.data?.message || 'Failed to load teachers');
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/admin/classes', formData);
      toast.success('Class created successfully');
      router.push('/admin/classes');
    } catch (error) {
      console.error('Error creating class:', error);
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (index: number, field: 'name' | 'teacher', value: string) => {
    setFormData(prev => {
      const newSubjects = [...prev.subjects];
      newSubjects[index] = {
        ...newSubjects[index],
        [field]: value
      };
      return {
        ...prev,
        subjects: newSubjects
      };
    });
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { name: '', teacher: '' }]
    }));
  };

  const removeSubject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center space-x-4">
        <Link 
          href="/admin/classes"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Classes</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Create New Class</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Class Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                Grade
              </label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                Section
              </label>
              <input
                type="text"
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="classTeacher" className="block text-sm font-medium text-gray-700">
                Class Teacher
              </label>
              <select
                id="classTeacher"
                name="classTeacher"
                value={formData.classTeacher}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.username} ({teacher.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                Class Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">Subjects</h3>
              <button
                type="button"
                onClick={addSubject}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Add Subject
              </button>
            </div>

            {formData.subjects.map((subject, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-100 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subject Teacher
                  </label>
                  <select
                    value={subject.teacher}
                    onChange={(e) => handleSubjectChange(index, 'teacher', e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.username} ({teacher.email})
                      </option>
                    ))}
                  </select>
                </div>

                {index > 0 && (
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove Subject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Class'}
          </button>
        </div>
      </form>
    </div>
  );
} 