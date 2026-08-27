import { useEffect,useState } from 'react';
import { Link,useLocation,useNavigate,useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Alert from '../components/Alert';
import BottomNav from '../components/BottomNav';
import Loading from '../components/Loading';

const fmt=(d)=>d?new Date(d).toLocaleString(): '—';
const TicketDetails=({agentMode=false})=>{const {id}=useParams();const {user}=useAuth();const nav=useNavigate();const location=useLocation();const [ticket,setTicket]=useState(null);const [error,setError]=useState('');const [success,setSuccess]=useState(location.state?.success||'');const [resolution,setResolution]=useState('');
 const load=()=>axiosInstance.get(`/api/tickets/${id}`).then(r=>setTicket(r.data)).catch(err=>setError(err.response?.data?.message||'Could not load ticket.')); useEffect(load,[id]);
 const act=async(url,body,msg)=>{setError('');setSuccess('');try{const {data}=await axiosInstance.patch(url,body);setTicket(data);setSuccess(msg);}catch(err){setError(err.response?.data?.message||'Action failed.');}};
 if(!ticket&&!error)return <Loading text="Loading ticket..."/>; if(!ticket)return <main className="app-page"><section className="page-content"><Alert>{error}</Alert></section></main>;
 const isEmployee=user.role==='employee';
 return <main className="app-page with-nav"><div className="simple-header"><button onClick={()=>nav(-1)}>←</button><h1>Ticket Details</h1></div><section className="page-content"><Alert type="success">{success}</Alert><Alert>{error}</Alert>
  <div className="detail-title"><span>{ticket.ticketNumber}</span><StatusBadge status={ticket.status}/><h1>{ticket.title}</h1></div>
  <div className="detail-card two-col"><div><small>Category</small><strong>{ticket.category}</strong></div><div><small>Priority</small><PriorityBadge priority={ticket.priority}/></div><div><small>Created</small><strong>{fmt(ticket.createdAt)}</strong></div><div><small>Assigned to</small><strong>{ticket.assignedAgent?.name||'Unassigned'}</strong></div></div>
  {agentMode&&ticket.createdBy&&<div className="detail-card"><small>Requester</small><h3>{ticket.createdBy.name}</h3><p>{ticket.createdBy.email}</p></div>}
  <div className="detail-card"><h2>Description</h2><p className="long-text">{ticket.description}</p></div>
  <div className="detail-card"><h2>Progress</h2><div className="progress-list">{['Open','Assigned','In Progress','Resolved','Closed'].map(s=><div key={s} className={ticket.status===s?'current':(['Open','Assigned','In Progress','Resolved','Closed'].indexOf(s)<['Open','Assigned','In Progress','Resolved','Closed'].indexOf(ticket.status)?'done':'')}><span>●</span>{s}</div>)}</div></div>
  {ticket.resolutionNotes&&<div className="detail-card resolution"><h2>Resolution</h2><p>{ticket.resolutionNotes}</p><small>Resolved {fmt(ticket.resolvedAt)} by {ticket.assignedAgent?.name||'IT Support'}</small></div>}
  {isEmployee&&ticket.status==='Open'&&<Link className="btn btn-secondary" to={`/tickets/${ticket._id}/edit`}>Edit Ticket</Link>}
  {isEmployee&&ticket.status==='Resolved'&&<button className="btn btn-primary" onClick={()=>act(`/api/tickets/${id}/close`,{},'Ticket closed successfully.')}>Close Ticket</button>}
  {agentMode&&<div className="manage-panel"><h2>Manage Ticket</h2>{!ticket.assignedAgent&&<button className="btn btn-primary" onClick={()=>act(`/api/tickets/${id}/assign`,{},'Ticket assigned successfully. Employee notified.')}>Assign to Me</button>}
   <label>Priority<select value={ticket.priority} onChange={e=>act(`/api/tickets/${id}/priority`,{priority:e.target.value},'Priority updated successfully.')}>{['Low','Medium','High','Critical'].map(p=><option key={p}>{p}</option>)}</select></label>
   {['Open','Assigned','In Progress'].includes(ticket.status)&&<label>Status<select value={ticket.status} onChange={e=>act(`/api/tickets/${id}/status`,{status:e.target.value},'Ticket status updated. Employee notified.')}><option value={ticket.status}>{ticket.status}</option>{ticket.status==='Open'&&<option>Assigned</option>}{ticket.status==='Assigned'&&<option>In Progress</option>}{ticket.status==='In Progress'&&<option>Assigned</option>}</select></label>}
   {ticket.status==='In Progress'&&<><label>Resolution Notes<textarea value={resolution} onChange={e=>setResolution(e.target.value)} placeholder="Describe how the issue was resolved."/></label><button className="btn btn-primary" onClick={()=>act(`/api/tickets/${id}/resolve`,{resolutionNotes:resolution},'Ticket resolved. Employee notified.')}>Resolve Ticket</button></>}
  </div>}
 </section><BottomNav/></main>};
export default TicketDetails;
