'use client';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        // Get user data directly from API
        const response = await fetch('/api/auth/user');
        const data = await response.json();
        console.log('User API response:', data);

        if (data.error) {
          if (data.error === 'Not authenticated' || data.error === 'Invalid session') {
            redirect('/');
            return;
          }
          setError(data.error);
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while loading user data');
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    redirect('/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="text-lg mb-6">
        Welcome, <span className="font-medium text-blue-600">{user.email}</span>!
      </div>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify({ user }, null, 2)}
      </pre>
      <div className="text-sm text-gray-600 mt-4">
        {!user.emailVerified && 'Please verify your email address to access all features.'}
      </div>
    </div>
  );
}
