import axios from 'axios';

// Uses REACT_APP_API_URL env var in production (set in Vercel dashboard)
// Falls back to localhost:8080 when running locally
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// ===== Register =====
export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_BASE}/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

// ===== Login =====
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

// ===== Get Profile (protected) =====
export const getProfile = async (token) => {
  const response = await axios.get(`${API_BASE}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ===== Token Helpers =====
export const saveToken = (token) => localStorage.setItem('jwt_token', token);
export const getToken = () => localStorage.getItem('jwt_token');
export const removeToken = () => localStorage.removeItem('jwt_token');
export const isLoggedIn = () => !!getToken();
