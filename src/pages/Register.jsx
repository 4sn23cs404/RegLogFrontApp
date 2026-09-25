import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, saveToken } from '../api/auth';

// Lock icon SVG
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(form.name, form.email, form.password);
      if (data.success) {
        setSuccess('Registration successful! Redirecting...');
        saveToken(data.token);
        setTimeout(() => navigate('/profile'), 1200);
      } else {
        setError(data.message || 'Registration failed.');
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
            <LockIcon />
          </div>
          <h1>Create Account</h1>
          <p>Join us today. It's free.</p>
        </div>

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="alert">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button
            id="btn-register"
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <><span className="spinner"></span> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <div className="card-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
