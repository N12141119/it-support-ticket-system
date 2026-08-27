const Alert = ({ type = 'error', children }) => children ? <div className={`alert alert-${type}`}>{children}</div> : null;
export default Alert;
