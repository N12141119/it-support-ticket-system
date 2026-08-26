import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import Alert from '../components/Alert';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.email || !form.password) return setError('Email and password are required.');
    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/api/auth/login', form);
      login(data);
      navigate(data.role === 'agent' ? '/agent/dashboard' : '/employee/dashboard', { replace: true });
    } catch (err) { setError(err.response?.data?.message || 'Invalid email or password'); }
    finally { setLoading(false); }
  };

  return <main className="auth-page">
    <div className="auth-switch"><span className="selected">Sign In</span><Link to="/register">Register</Link></div>
    <h1>Welcome Back</h1><p className="subtitle">Sign in to continue to IT Support</p>
    <Alert type="success">{location.state?.success}</Alert><Alert>{error}</Alert>
    <form className="form-card flat" onSubmit={handleSubmit}>
      <label>Email<input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="employee@example.com" /></label>
      <label>Password<input type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="Password" /></label>
      <button className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
    </form>
    <p className="auth-footer">Don't have an account? <Link to="/register">Register →</Link></p>
  </main>;
};
export default Login;
