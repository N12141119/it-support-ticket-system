import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    axiosInstance.get('/api/notifications').then((res) => setCount(res.data.unreadCount)).catch(() => setCount(0));
  }, [location.pathname]);

  return (
    <Link className="notification-bell" to="/notifications" aria-label={`${count} unread notifications`}>
      <span>🔔</span>{count > 0 && <span className="notification-count">{count > 9 ? '9+' : count}</span>}
    </Link>
  );
};
export default NotificationBell;
