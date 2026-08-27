import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import TicketCard from '../components/TicketCard';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const AgentDashboard=()=>{const [data,setData]=useState(null);useEffect(()=>{axiosInstance.get('/api/dashboard/agent').then(r=>setData(r.data));},[]);if(!data)return <Loading/>;const metrics=[{label:'Open',value:data.open},{label:'Assigned',value:data.assigned},{label:'In Progress',value:data.inProgress},{label:'Critical',value:data.critical}];return <main className="app-page with-nav"><AppHeader title="Support Overview" subtitle={`${data.active} active support tickets`} metrics={metrics}/><section className="page-content"><Link className="btn btn-primary" to="/agent/tickets">View Ticket Queue</Link><div className="section-heading"><h2>Needs Attention</h2><Link to="/agent/tickets">View all</Link></div>{data.recent.length?<div className="ticket-list">{data.recent.map(t=><TicketCard key={t._id} ticket={t} agentMode/>)}</div>:<EmptyState title="No tickets require attention" message="New Employee support requests will appear here."/>}</section><BottomNav/></main>};
export default AgentDashboard;
