import { Link } from 'react-router-dom';

const Onboarding = () => (
  <main className="onboarding">
    <div className="hero-icon">🎧</div>
    <h1>IT Support,<br/>Simplified</h1>
    <p>Report IT issues, track progress and stay informed from one place.</p>
    <div className="onboarding-actions">
      <Link className="btn btn-white" to="/register">Get Started</Link>
      <p>Already have an account? <Link to="/login">Sign In →</Link></p>
    </div>
  </main>
);
export default Onboarding;
