'use client';

import { useState } from 'react';
import styles from './LogoutButton.module.css';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Redirect to home page after successful logout
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      className={styles.button}
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
