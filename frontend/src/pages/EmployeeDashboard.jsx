import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import TicketCard from '../components/TicketCard';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const EmployeeDashboard = () => {
  const [data,setData]=useState(null);
  useEffect(()=>{axiosInstance.get('/api/dashboard/employee').then(r=>setData(r.data));},[]);
  if(!data) return <Loading text="Loading dashboard..."/>;
  return <main className="app-page with-nav"><AppHeader title="Your support overview" subtitle={`${data.total} total support ticket${data.total===1?'':'s'}`} metrics={[{label:'Open',value:data.open},{label:'In Progress',value:data.inProgress}]}/>
    <section className="page-content"><Link className="btn btn-primary" to="/tickets/new">+ Create Support Ticket</Link><div className="section-heading"><h2>Recent Tickets</h2><Link to="/tickets">View all</Link></div>
      {data.recent.length ? <div className="ticket-list">{data.recent.map(t=><TicketCard key={t._id} ticket={t}/>)}</div> : <EmptyState title="No support tickets yet" message="When something goes wrong, create your first IT support ticket here." action={<Link className="btn btn-secondary" to="/tickets/new">Create Ticket</Link>}/>} 
    </section><BottomNav/></main>;
};
export default EmployeeDashboard;
