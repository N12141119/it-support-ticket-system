import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import BottomNav from '../components/BottomNav';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const Notifications=()=>{const [data,setData]=useState(null);const {user}=useAuth();const nav=useNavigate();const load=()=>axiosInstance.get('/api/notifications').then(r=>setData(r.data));useEffect(()=>{load();},[]);if(!data)return <Loading/>;const open=async(n)=>{if(!n.isRead)await axiosInstance.patch(`/api/notifications/${n._id}/read`);if(n.ticketId?._id)nav(user.role==='agent'?`/agent/tickets/${n.ticketId._id}`:`/tickets/${n.ticketId._id}`);else load();};return <main className="app-page with-nav"><div className="simple-header"><h1>Notifications</h1><span className="unread-summary">{data.unreadCount} unread</span></div><section className="page-content">{data.notifications.length?<div className="notification-list">{data.notifications.map(n=><button className={`notification-item ${n.isRead?'read':'unread'}`} onClick={()=>open(n)} key={n._id}><span className="unread-dot">{n.isRead?'':'●'}</span><span><strong>{n.type.replaceAll('_',' ')}</strong><p>{n.message}</p><small>{new Date(n.createdAt).toLocaleString()}</small></span></button>)}</div>:<EmptyState icon="🔔" title="You're all caught up" message="Ticket updates and support notifications will appear here."/>}</section><BottomNav/></main>};
export default Notifications;
