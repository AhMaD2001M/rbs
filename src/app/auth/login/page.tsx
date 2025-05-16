'use client'
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", user);
      console.log("Login successful", response.data);
      
      // Show success message
      toast.success("Login successful!");
      
      // Redirect based on role
      const userRole = response.data.user.role;
      switch (userRole) {
        case 'admin':
          router.push("/admin/dashboard");
          break;
        case 'teacher':
          router.push("/teacher/dashboard");
          break;
        case 'student':
          router.push("/student/dashboard");
          break;
        default:
          router.push("/");
      }
    } catch (error: unknown) {
      console.log("Login failed", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account
            </p>
          </div>

          <div className="mt-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={onLogin}
                  disabled={buttonDisabled || loading}
                  className={`flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    (buttonDisabled || loading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Don&apos;t have an account? Sign up
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative w-0 flex-1">
     
        <Image
          className="object-cover"
          src="/images/hero1.jpg"
          alt="School background"
          fill
          priority
        />
      </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}