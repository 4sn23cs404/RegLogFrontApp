import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getToken, removeToken } from '../api/auth';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const data = await getProfile(token);
        setProfile(data);
      } catch (err) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          removeToken();
          navigate('/login');
        } else {
          setError('Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="loading-page">
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="card">
          <div className="alert alert-error">{error}</div>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Top bar */}
      <div className="profile-topbar">
        <span className="brand">RegLog App</span>
        <button
          id="btn-logout"
          className="btn btn-danger"
          style={{ width: 'auto', padding: '8px 18px', margin: 0 }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Profile card */}
      <div className="profile-card">
        <div className="profile-avatar">
          {getInitials(profile?.name)}
        </div>

        <div className="profile-name">{profile?.name}</div>
        <div className="profile-role-badge">{profile?.role}</div>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <div className="label">Email Address</div>
            <div className="value">{profile?.email}</div>
          </div>
          <div className="profile-info-item">
            <div className="label">User ID</div>
            <div className="value">#{profile?.id}</div>
          </div>
          <div className="profile-info-item">
            <div className="label">Account Role</div>
            <div className="value">{profile?.role}</div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="profile-actions">
          <button
            id="btn-profile-logout"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
