'use client';

import { authClient } from '@/lib/auth-client';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const handleSignOut = async () => {
    try {
      console.log('🔄 Attempting sign out...');
      
      const { error } = await authClient.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        return;
      }

      console.log('✅ Successfully signed out');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
      <div className={styles.content}>
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
  );
}
