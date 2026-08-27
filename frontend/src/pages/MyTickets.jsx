import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import TicketCard from '../components/TicketCard';
import BottomNav from '../components/BottomNav';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const MyTickets=()=>{const [tickets,setTickets]=useState(null);const [filter,setFilter]=useState('All');useEffect(()=>{axiosInstance.get('/api/tickets/mine').then(r=>setTickets(r.data));},[]);if(!tickets)return <Loading/>;const shown=filter==='All'?tickets:tickets.filter(t=>t.status===filter);return <main className="app-page with-nav"><div className="list-hero"><h1>My Tickets</h1><p>Track your support requests</p></div><section className="page-content"><div className="chips">{['All','Open','In Progress','Resolved','Closed'].map(f=><button key={f} className={filter===f?'chip active':'chip'} onClick={()=>setFilter(f)}>{f}</button>)}</div>{shown.length?<div className="ticket-list">{shown.map(t=><TicketCard key={t._id} ticket={t}/>)}</div>:<EmptyState title="No tickets found" message="There are no support tickets in this view." action={<Link className="btn btn-secondary" to="/tickets/new">Create Ticket</Link>}/>}</section><BottomNav/></main>};
export default MyTickets;
