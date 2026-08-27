import { useEffect,useMemo,useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import TicketCard from '../components/TicketCard';
import BottomNav from '../components/BottomNav';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const AgentQueue=()=>{const {user}=useAuth();const [tickets,setTickets]=useState(null);const [params]=useSearchParams();const [filters,setFilters]=useState({q:'',status:'',priority:'',category:''});const assignedOnly=params.get('assigned')==='me';
 const query=useMemo(()=>{const p=new URLSearchParams();Object.entries(filters).forEach(([k,v])=>v&&p.set(k,v));return p.toString();},[filters]);
 useEffect(()=>{setTickets(null);axiosInstance.get(`/api/tickets/agent/queue${query?'?'+query:''}`).then(r=>setTickets(r.data));},[query]);
 if(!tickets)return <Loading/>;const visible=assignedOnly?tickets.filter(t=>t.assignedAgent?._id===user.id):tickets;return <main className="app-page with-nav"><div className="list-hero"><h1>{assignedOnly?'Assigned Tickets':'Ticket Queue'}</h1><p>Review and manage Employee support requests</p></div><section className="page-content"><div className="filter-panel"><input value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})} placeholder="Search ticket title or number"/><div className="filter-grid"><select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">All statuses</option>{['Open','Assigned','In Progress','Resolved','Closed'].map(x=><option key={x}>{x}</option>)}</select><select value={filters.priority} onChange={e=>setFilters({...filters,priority:e.target.value})}><option value="">All priorities</option>{['Low','Medium','High','Critical'].map(x=><option key={x}>{x}</option>)}</select><select value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})}><option value="">All categories</option>{['Hardware','Software','Network','Account / Access','Email','Other'].map(x=><option key={x}>{x}</option>)}</select><button className="btn btn-small" onClick={()=>setFilters({q:'',status:'',priority:'',category:''})}>Clear</button></div></div>{visible.length?<div className="ticket-list">{visible.map(t=><TicketCard key={t._id} ticket={t} agentMode/>)}</div>:<EmptyState title="No tickets match your filters" message="Adjust or clear the current search filters."/>}</section><BottomNav/></main>};
export default AgentQueue;
