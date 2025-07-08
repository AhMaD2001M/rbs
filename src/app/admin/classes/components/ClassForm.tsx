import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
}

interface ClassFormProps {
    initialData?: ClassFormData;
    isEditing?: boolean;
    classId?: string;
}

export default function ClassForm({ initialData, isEditing, classId }: ClassFormProps) {
    const router = useRouter();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<ClassFormData>({
        name: '',
        grade: '',
        section: '',
        academicYear: new Date().getFullYear().toString(),
        classTeacher: '',
        capacity: 30,
        ...initialData
    });

    useEffect(() => {
        // Fetch available teachers
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('/api/admin/teachers');
                setTeachers(response.data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
                setError('Failed to load teachers');
            }
        };

        fetchTeachers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditing && classId) {
                // Update existing class
                await axios.put('/api/admin/classes', {
                    id: classId,
                    ...formData
                });
                
                // If classTeacher changed, enroll the new teacher
                if (formData.classTeacher) {
                    await axios.patch('/api/admin/classes', {
                        classId: classId,
                        teacherId: formData.classTeacher
                    });
                }
            } else {
                // Create new class
                const response = await axios.post('/api/admin/classes', formData);
                const newClassId = response.data._id;
                
                // Enroll the teacher in the new class
                if (formData.classTeacher) {
                    await axios.patch('/api/admin/classes', {
                        classId: newClassId,
                        teacherId: formData.classTeacher
                    });
                }
            }

            router.push('/admin/classes');
            router.refresh();
        } catch (error) {
            console.error('Error saving class:', error);
            setError('Failed to save class');
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                    {error}
                </div>
            )}

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
                        Capacity
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

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : isEditing ? 'Update Class' : 'Create Class'}
                </button>
            </div>
        </form>
    );
} 