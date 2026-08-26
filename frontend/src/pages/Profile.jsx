import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import BottomNav from '../components/BottomNav';
import Loading from '../components/Loading';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/api/auth/profile').then(({data})=>setForm({name:data.name,email:data.email})).catch(()=>setError('Could not load profile.')).finally(()=>setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault(); setError(''); setMessage('');
    try { const {data}=await axiosInstance.put('/api/auth/profile',form); updateUser(data); setMessage('Profile updated successfully.'); }
    catch(err){ setError(err.response?.data?.message || 'Profile update failed.'); }
  };
  const signOut=()=>{ logout(); navigate('/login'); };
  if(loading) return <Loading text="Loading profile..."/>;

  return <main className="app-page with-nav">
    <section className="profile-hero"><div className="profile-avatar">{user.name?.[0]?.toUpperCase()}</div><h1>{user.name}</h1><span className="role-chip">{user.role === 'agent' ? 'IT Support Agent' : 'Employee'}</span></section>
    <section className="page-content"><Alert type="success">{message}</Alert><Alert>{error}</Alert>
      <form className="form-card" onSubmit={save}>
        <label>Full Name<input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/></label>
        <label>Email<input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/></label>
        <label>Role<input value={user.role === 'agent' ? 'IT Support Agent' : 'Employee'} disabled/></label>
        <button className="btn btn-primary">Save Changes</button>
        <button type="button" className="btn btn-danger-outline" onClick={signOut}>Log Out</button>
      </form>
    </section><BottomNav/>
  </main>;
};
export default Profile;
