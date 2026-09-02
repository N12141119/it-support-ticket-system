import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('itsUser');

  if (storedUser) {
    const user = JSON.parse(storedUser);

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem('itsUser')
    ) {
      localStorage.removeItem('itsUser');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;