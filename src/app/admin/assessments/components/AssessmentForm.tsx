import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Teacher {
    _id: string;
    username: string;
    email: string;
}

interface Class {
    _id: string;
    name: string;
    grade: string;
    section: string;
}

interface AssessmentFormData {
    title: string;
    type: 'exam' | 'quiz' | 'assignment' | 'project' | 'mid-term' | 'final';
    subject: string;
    class: string;
    teacher: string;
    totalMarks: number;
    passingMarks: number;
    date: string;
    duration: number;
    instructions: string;
}

interface AssessmentFormProps {
    initialData?: AssessmentFormData;
    isEditing?: boolean;
    assessmentId?: string;
}

export default function AssessmentForm({ initialData, isEditing, assessmentId }: AssessmentFormProps) {
    const router = useRouter();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<AssessmentFormData>({
        title: '',
        type: 'exam',
        subject: '',
        class: '',
        teacher: '',
        totalMarks: 100,
        passingMarks: 40,
        date: new Date().toISOString().split('T')[0],
        duration: 60,
        instructions: '',
        ...initialData
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teachersRes, classesRes] = await Promise.all([
                    axios.get('/api/admin/teachers'),
                    axios.get('/api/admin/classes')
                ]);
                setTeachers(teachersRes.data);
                setClasses(classesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load required data');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditing && assessmentId) {
                // Update existing assessment
                await axios.put('/api/admin/assessments', {
                    id: assessmentId,
                    ...formData
                });
            } else {
                // Create new assessment
                await axios.post('/api/admin/assessments', formData);
            }

            router.push('/admin/assessments');
            router.refresh();
        } catch (error) {
            console.error('Error saving assessment:', error);
            setError('Failed to save assessment');
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
    };

    const assessmentTypes = [
        'exam',
        'quiz',
        'assignment',
        'project',
        'mid-term',
        'final'
    ] as const;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
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
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
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
                                {cls.grade}-{cls.section} ({cls.name})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">
                        Teacher
                    </label>
                    <select
                        id="teacher"
                        name="teacher"
                        value={formData.teacher}
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
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Duration (minutes)
                    </label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                        Instructions
                    </label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        rows={4}
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
                    {loading ? 'Saving...' : isEditing ? 'Update Assessment' : 'Create Assessment'}
                </button>
            </div>
        </form>
    );
} 