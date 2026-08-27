const StatusBadge = ({ status }) => {
  const key = String(status || '').toLowerCase().replace(/\s+/g, '-');
  return <span className={`badge status-${key}`}>{status}</span>;
};
export default StatusBadge;
