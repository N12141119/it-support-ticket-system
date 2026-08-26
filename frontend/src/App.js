import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Onboarding from './pages/Onboarding';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CreateTicket from './pages/CreateTicket';
import MyTickets from './pages/MyTickets';
import TicketDetails from './pages/TicketDetails';
import EditTicket from './pages/EditTicket';
import Notifications from './pages/Notifications';
import AgentDashboard from './pages/AgentDashboard';
import AgentQueue from './pages/AgentQueue';
import NotFound from './pages/NotFound';

const HomeRedirect=()=>{const {user}=useAuth();if(!user)return <Onboarding/>;return <Navigate to={user.role==='agent'?'/agent/dashboard':'/employee/dashboard'} replace/>};

function App(){return <Router><Routes>
 <Route path="/" element={<HomeRedirect/>}/><Route path="/register" element={<Register/>}/><Route path="/login" element={<Login/>}/>
 <Route element={<ProtectedRoute roles={['employee']}/>}><Route path="/employee/dashboard" element={<EmployeeDashboard/>}/><Route path="/tickets" element={<MyTickets/>}/><Route path="/tickets/new" element={<CreateTicket/>}/><Route path="/tickets/:id" element={<TicketDetails/>}/><Route path="/tickets/:id/edit" element={<EditTicket/>}/></Route>
 <Route element={<ProtectedRoute roles={['agent']}/>}><Route path="/agent/dashboard" element={<AgentDashboard/>}/><Route path="/agent/tickets" element={<AgentQueue/>}/><Route path="/agent/tickets/:id" element={<TicketDetails agentMode/>}/></Route>
 <Route element={<ProtectedRoute roles={['employee','agent']}/>}><Route path="/notifications" element={<Notifications/>}/><Route path="/profile" element={<Profile/>}/></Route>
 <Route path="*" element={<NotFound/>}/>
 </Routes></Router>}
export default App;
