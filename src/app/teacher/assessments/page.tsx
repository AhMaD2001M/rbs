'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ClipboardList, Plus, Search } from 'lucide-react';

interface Assessment {
    _id: string;
    title: string;
    description: string;
    maxMarks: number;
    dueDate: string;
    class: {
        _id: string;
        name: string;
        grade: string;
        section: string;
    };
    marks: Array<{
        student: {
            _id: string;
            username: string;
            email: string;
            profile: {
                firstName: string;
                lastName: string;
            };
        };
        score: number;
        remarks?: string;
    }>;
}

export default function AssessmentsPage() {
    const router = useRouter();
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/teacher/assessments');
            setAssessments(response.data);
        } catch (error) {
            console.error('Error fetching assessments:', error);
            toast.error('Failed to load assessments');
        } finally {
            setLoading(false);
        }
    };

    const filteredAssessments = assessments.filter(assessment =>
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.class.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Assessments</h1>
                <button
                    onClick={() => router.push('/teacher/assessments/create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
                >
                    <Plus className="h-5 w-5" />
                    <span>Create Assessment</span>
                </button>
            </div>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search assessments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAssessments.map((assessment) => (
                    <div
                        key={assessment._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer"
                        onClick={() => router.push(`/teacher/assessments/${assessment._id}`)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <ClipboardList className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                Due: {new Date(assessment.dueDate).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">{assessment.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                                {assessment.class.name} ({assessment.class.grade}-{assessment.class.section})
                            </span>
                            <span className="font-medium text-blue-600">
                                {assessment.marks.length} submissions
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAssessments.length === 0 && (
                <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No assessments found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'Try a different search term' : 'Create your first assessment to get started'}
                    </p>
                </div>
            )}
        </div>
    );
} 