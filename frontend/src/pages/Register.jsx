import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import Alert from '../components/Alert';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) return setError('Complete all required fields.');
    if (form.password.length < 8) return setError('Password must contain at least 8 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    try {
      setLoading(true);
      await axiosInstance.post('/api/auth/register', form);
      navigate('/login', { state: { success: 'Account created successfully. Please sign in.' } });
    } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return <main className="auth-page">
    <div className="auth-switch"><Link to="/login">Sign In</Link><span className="selected">Register</span></div>
    <h1>Create Account</h1><p className="subtitle">Create your Employee account</p>
    <Alert>{error}</Alert>
    <form className="form-card flat" onSubmit={handleSubmit}>
      <label>Full Name<input value={form.name} onChange={set('name')} placeholder="Full name" /></label>
      <label>Email<input type="email" value={form.email} onChange={set('email')} placeholder="employee@example.com" /></label>
      <label>Password<input type="password" value={form.password} onChange={set('password')} placeholder="Minimum 8 characters" /></label>
      <label>Confirm Password<input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat your password" /></label>
      <p className="helper">Public registration creates an Employee account.</p>
      <button className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
    </form>
    <p className="auth-footer">Already have an account? <Link to="/login">Sign In →</Link></p>
  </main>;
};
export default Register;
