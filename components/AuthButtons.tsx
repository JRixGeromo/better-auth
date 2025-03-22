'use client';

import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

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

export default function AuthButtons() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    async function checkSession() {
      const { data } = await authClient.getSession();
      setSession(data?.session || null);
      
      if (data?.session) {
        const response = await fetch('/api/auth/user');
        const userData = await response.json();
        setUserData(userData.user || null);
      }
      
      setLoading(false);
    }
    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return null;
  }

  if (!session) {
    return (
      <div className="flex space-x-4">
        <a href="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</a>
        <a href="/signin" className="text-blue-600 hover:text-blue-800">Sign In</a>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span>Welcome, {userData?.name || userData?.email}</span>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
