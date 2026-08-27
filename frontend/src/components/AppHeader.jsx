import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';

const AppHeader = ({ title, subtitle, metrics = [] }) => {
  const { user } = useAuth();
  return (
    <header className="gradient-header">
      <div className="header-top">
        <div className="user-pill"><span className="avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</span><span>{user?.name}</span></div>
        <NotificationBell />
      </div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {metrics.length > 0 && <div className={`metric-grid metric-${metrics.length}`}>
        {metrics.map((m) => <div className="metric-card" key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}
      </div>}
    </header>
  );
};
export default AppHeader;
