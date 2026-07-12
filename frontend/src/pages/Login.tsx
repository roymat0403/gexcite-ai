import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('gexcite_token', response.data.token);
      localStorage.setItem('gexcite_user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 style={{ textAlign: 'center', color: '#1a1a1a', marginBottom: '0.5rem', fontSize: '2.5rem' }}>
        Gexcite
      </h1>
      <p style={{ textAlign: 'center', color: '#555555', marginBottom: '2rem', fontSize: '1.1rem' }}>
        AI-Powered Lead Generation
      </p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in...' : 'Sign In to Gexcite'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#1a1a1a' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#4CAF50', fontWeight: 'bold' }}>Sign up free</Link>
      </p>
      <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#1a1a1a' }}>
        <Link to="/pricing" style={{ color: '#2196F3' }}>View pricing plans</Link>
      </p>
    </div>
  );
};

export default Login;