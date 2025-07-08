"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Teacher {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    subject?: string;
    phone?: string;
  };
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admin/teachers");
        setTeachers(res.data);
      } catch {
        console.error("Error fetching teachers");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`/api/admin/teachers?id=${id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      alert("Failed to delete teacher.");
    }
  };

  const handleImpersonate = async (teacherId: string) => {
    try {
      // Save current token for return
      const currentToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (currentToken) sessionStorage.setItem('admin_token', currentToken);
      const res = await axios.post('/api/admin/impersonate', { userId: teacherId, role: 'teacher' });
      const { token } = res.data;
      document.cookie = `token=${token}; path=/;`;
      window.location.href = '/teacher/dashboard';
    } catch {
      alert('Failed to impersonate teacher.');
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const q = search.toLowerCase();
    return (
      (teacher.profile?.firstName || "").toLowerCase().includes(q) ||
      (teacher.profile?.lastName || "").toLowerCase().includes(q) ||
      teacher.email.toLowerCase().includes(q) ||
      (teacher.profile?.subject || "").toLowerCase().includes(q)
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
      <h1 className="text-2xl font-bold mb-6">All Teachers</h1>
      <input
        type="text"
        placeholder="Search by name, email, or subject..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher._id} className="border-b">
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.profile?.firstName || ""} {teacher.profile?.lastName || ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{teacher.profile?.subject || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.isVerified ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <Link href={`/admin/teachers/${teacher._id}`} className="text-blue-500 hover:underline">View</Link>
                  <Link href={`/admin/teachers/${teacher._id}/edit`} className="text-yellow-500 hover:underline">Edit</Link>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleImpersonate(teacher._id)}
                    className="text-purple-500 hover:underline"
                  >
                    View as Teacher
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