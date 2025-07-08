"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

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

export default function TeacherDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/admin/teachers?id=${id}`);
        setTeacher(Array.isArray(res.data) ? res.data[0] : res.data);
      } catch {
        alert("Error fetching teacher details");
        router.push("/admin/teachers");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTeacher();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!teacher) return <div className="p-8">Teacher not found.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Teacher Details</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-xl">
        <div className="mb-4">
          <span className="font-semibold">Name: </span>
          {teacher.profile?.firstName} {teacher.profile?.lastName}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Email: </span>
          {teacher.email}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Username: </span>
          {teacher.username}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Subject: </span>
          {teacher.profile?.subject || "-"}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Phone: </span>
          {teacher.profile?.phone || "-"}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Verified: </span>
          {teacher.isVerified ? "Yes" : "No"}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Role: </span>
          {teacher.role}
        </div>
      </div>
    </div>
  );
} 