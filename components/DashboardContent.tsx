'use client';

import { useEffect, useState } from 'react';
import { LogoutButton } from './LogoutButton';
import styles from './DashboardContent.module.css';

interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <div>Error: {error || 'User not found'}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <LogoutButton />
      </div>
      <div className={styles.content}>
        <p>Welcome, {user.email}!</p>
        {!user.emailVerified && (
          <p className={styles.warning}>
            Please verify your email address to access all features.
          </p>
        )}
      </div>
    </div>
  );
}
