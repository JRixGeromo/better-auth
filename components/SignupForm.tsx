'use client';

import { useState } from 'react';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Log the request data
      console.log('Signup request:', { email, name });

      // Make the signup request
      const response = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          name,
          callbackURL: '/dashboard'
        })
      });

      // Log the response status
      console.log('Signup response status:', response.status);

      // Parse the response
      const data = await response.json();
      console.log('Signup response data:', data);

      if (data.error) {
        setError(data.error.message || 'An error occurred during signup');
        return;
      }

      // If successful, redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
