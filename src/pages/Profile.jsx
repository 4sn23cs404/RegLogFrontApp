import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getToken, removeToken } from '../api/auth';

// Icons
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IdIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
  </svg>
);

const RoleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) { navigate('/login'); return; }
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

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="card">
          <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* ===== Top Navigation Bar ===== */}
      <nav className="profile-topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-icon"><BoltIcon /></div>
            <span className="brand-name">RegLog App</span>
          </div>
          <button className="btn btn-danger" style={{ width: 'auto', padding: '9px 20px', margin: 0, fontSize: '0.85rem' }} onClick={handleLogout}>
            <LogoutIcon style={{ width: 16, height: 16 }} />
            Logout
          </button>
        </div>
      </nav>

      {/* ===== Main Content ===== */}
      <div className="profile-content">

        {/* Hero Card */}
        <div className="profile-hero">
          <div className="profile-avatar">
            {getInitials(profile?.name)}
          </div>
          <div className="profile-hero-info">
            <div className="profile-name">{profile?.name}</div>
            <div className="profile-email">{profile?.email}</div>
            <div className="role-badge">
              <span className="role-badge-dot"></span>
              {profile?.role}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="profile-grid">
          <div className="profile-info-card">
            <div className="info-card-icon"><MailIcon /></div>
            <div className="info-card-label">Email Address</div>
            <div className="info-card-value">{profile?.email}</div>
          </div>

          <div className="profile-info-card">
            <div className="info-card-icon"><IdIcon /></div>
            <div className="info-card-label">User ID</div>
            <div className="info-card-value">#{profile?.id}</div>
          </div>

          <div className="profile-info-card">
            <div className="info-card-icon"><RoleIcon /></div>
            <div className="info-card-label">Account Role</div>
            <div className="info-card-value">{profile?.role}</div>
          </div>

          <div className="profile-info-card">
            <div className="info-card-icon"><ShieldIcon /></div>
            <div className="info-card-label">Account Status</div>
            <div className="info-card-value" style={{ color: '#34d399' }}>● Active</div>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button className="btn btn-danger" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={17} height={17}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign Out
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={17} height={17}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Go Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
