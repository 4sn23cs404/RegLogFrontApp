import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, saveToken } from '../api/auth';

// Key icon SVG
const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(form.email, form.password);
      if (data.success) {
        saveToken(data.token);
        navigate('/profile');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Server error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <div className="card-logo">
            <KeyIcon />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            id="btn-login"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <><span className="spinner"></span> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="card-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
