'use client';

import { useState } from 'react';
import styles from './SignupForm.module.css';
import { authClient } from '@/lib/auth-client';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log(' Submitting signup form:', { email, name });
      
      const { data, error: signUpError } = await authClient.signUp.email({
        email: email.trim(),
        password: password.trim(),
        name: name.trim()
      });

      if (signUpError) {
        throw new Error(signUpError.message || 'Failed to sign up');
      }

      console.log(' Signup successful:', { userId: data?.user?.id });

      // Redirect to dashboard on success
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(' Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Create your account</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className={styles.footer}>
          Already have an account?{' '}
          <a href="/login" className={styles.link}>Sign in</a>
        </p>
      </form>
    </div>
  );
}
