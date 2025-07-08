"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Student {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    [key: string]: unknown;
  };
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admin/students");
        setStudents(res.data);
      } catch {
        console.error("Error fetching students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`/api/admin/students?id=${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete student.");
    }
  };

  const handleImpersonate = async (studentId: string) => {
    try {
      // Save current token for return
      const currentToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (currentToken) sessionStorage.setItem('admin_token', currentToken);
      const res = await axios.post('/api/admin/impersonate', { userId: studentId, role: 'student' });
      const { token } = res.data;
      document.cookie = `token=${token}; path=/;`;
      window.location.href = '/student/dashboard';
    } catch {
      alert('Failed to impersonate student.');
    }
  };

  const filteredStudents = students.filter((student) => {
    const q = search.toLowerCase();
    return (
      (student.profile?.firstName || "").toLowerCase().includes(q) ||
      (student.profile?.lastName || "").toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      student.username.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Students</h1>
      <input
        type="text"
        placeholder="Search by name, email, or username..."
        className="mb-4 p-2 border rounded w-full max-w-md"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-sm">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id} className="border-b">
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.profile?.firstName || ""} {student.profile?.lastName || ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.isVerified ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <Link href={`/admin/students/${student._id}`} className="text-blue-500 hover:underline">View</Link>
                  <Link href={`/admin/students/${student._id}/edit`} className="text-yellow-500 hover:underline">Edit</Link>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleImpersonate(student._id)}
                    className="text-purple-500 hover:underline"
                  >
                    View as Student
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 