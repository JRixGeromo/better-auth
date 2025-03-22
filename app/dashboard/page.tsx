"use client";

import { redirect } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkSession() {
      const { data: sessionData } = await authClient.getSession();
      
      if (!sessionData?.session) {
        redirect('/');
      }

      // Get user data
      const response = await fetch('/api/auth/user');
      const userData = await response.json();
      setUser(userData.user);
      setLoading(false);
    }
    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="text-lg mb-6">
        Welcome, <span className="font-medium">{user.email}</span>!
      </div>
      <div className="text-sm text-gray-600">
        {!user.emailVerified && 'Please verify your email address to access all features.'}
      </div>
    </div>
  );
}
