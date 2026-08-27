import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const items = {
  employee: [
    ['/employee/dashboard', '⌂', 'Dashboard'],
    ['/tickets', '🎫', 'Tickets'],
    ['/tickets/new', '+', 'Create'],
    ['/notifications', '🔔', 'Notifications'],
    ['/profile', '●', 'Profile'],
  ],
  agent: [
    ['/agent/dashboard', '⌂', 'Dashboard'],
    ['/agent/tickets', '🎫', 'Queue'],
    ['/agent/tickets?assigned=me', '✓', 'Assigned'],
    ['/notifications', '🔔', 'Notifications'],
    ['/profile', '●', 'Profile'],
  ],
};

const BottomNav = () => {
  const { user } = useAuth();
  if (!user) return null;
  return <nav className="bottom-nav">{items[user.role].map(([to, icon, label], i) => (
    <NavLink key={`${to}-${label}`} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${i === 2 && user.role === 'employee' ? 'nav-create' : ''}`}>
      <span className="nav-icon">{icon}</span><small>{label}</small>
    </NavLink>
  ))}</nav>;
};
export default BottomNav;
