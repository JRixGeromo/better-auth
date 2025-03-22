'use client';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}
