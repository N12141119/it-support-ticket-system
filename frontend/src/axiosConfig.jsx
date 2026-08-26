import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('itsUser'));
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch (_) {
    // Ignore corrupted local storage. AuthContext will clear it on next logout.
  }
  return config;
});

export default axiosInstance;
