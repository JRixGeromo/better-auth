"use client";

import { redirect } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import AuthButtons from '@/components/AuthButtons';

interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    async function checkSession() {
      const { data } = await authClient.getSession();
      setSession(data?.session || null);
      
      if (data?.session) {
        // Get user data from the session's userId
        const response = await fetch('/api/auth/user');
        const userData = await response.json();
        setUserData(userData.user || null);
      }
      
      setLoading(false);
    }
    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <p>Welcome {userData?.name || userData?.email}</p>
      <AuthButtons />
    </div>
  );
}
