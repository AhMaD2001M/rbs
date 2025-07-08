"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface StudentProfile {
  username: string;
  email: string;
  role: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    phoneNumber?: string;
    grade?: string;
    section?: string;
    [key: string]: unknown;
  };
}

export default function StudentProfilePage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/student/profile");
        setStudent(res.data);
      } catch {
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return <div className="p-8">Failed to load profile.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="mb-2"><span className="font-semibold">Username:</span> {student.username}</div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {student.email}</div>
      <div className="mb-2"><span className="font-semibold">Role:</span> {student.role}</div>
      {student.profile && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
          {Object.entries(student.profile).map(([key, value]) => (
            value ? (
              <div key={key} className="mb-1">
                <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}:</span> {value as string}
              </div>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
} 