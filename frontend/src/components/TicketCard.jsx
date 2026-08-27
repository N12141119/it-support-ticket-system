import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const fmt = (d) => new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

const TicketCard = ({ ticket, agentMode = false }) => (
  <Link className="ticket-card" to={agentMode ? `/agent/tickets/${ticket._id}` : `/tickets/${ticket._id}`}>
    <div className="ticket-top"><span className="ticket-number">{ticket.ticketNumber}</span><StatusBadge status={ticket.status} /></div>
    <h3>{ticket.title}</h3>
    {agentMode && ticket.createdBy && <p className="ticket-requester">{ticket.createdBy.name} • {ticket.category}</p>}
    {!agentMode && <p className="ticket-requester">{ticket.category}</p>}
    <div className="ticket-bottom"><PriorityBadge priority={ticket.priority} /><span>{fmt(ticket.createdAt)}</span></div>
  </Link>
);
export default TicketCard;
