import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/admin/login`, {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h1 className="title">Raksha Ireland</h1>
        <p className="subtitle">Admin Panel</p>
        
        <form onSubmit={handleLogin} className="form">
          {error && <div className="error">{error}</div>}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

