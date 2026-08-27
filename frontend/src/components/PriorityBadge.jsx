const PriorityBadge = ({ priority }) => {
  const key = String(priority || '').toLowerCase();
  return <span className={`priority priority-${key}`}>● {priority}</span>;
};
export default PriorityBadge;
