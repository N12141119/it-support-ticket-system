import { Link } from 'react-router-dom';
const NotFound=()=> <main className="center-page"><div><h1>404</h1><p>The page you requested does not exist.</p><Link className="btn btn-primary" to="/">Return Home</Link></div></main>;
export default NotFound;
