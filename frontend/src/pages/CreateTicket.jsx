import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import Alert from '../components/Alert';
import BottomNav from '../components/BottomNav';

const categories=['Hardware','Software','Network','Account / Access','Email','Other'];
const priorities=['Low','Medium','High','Critical'];

const CreateTicket=()=>{
 const [form,setForm]=useState({title:'',description:'',category:'',priority:'Medium'}); const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const navigate=useNavigate();
 const submit=async(e)=>{e.preventDefault();setError(''); if(form.title.trim().length<5)return setError('Title must contain at least 5 characters.'); if(form.description.trim().length<10)return setError('Description must contain at least 10 characters.'); if(!form.category)return setError('Please select a category.'); try{setLoading(true);const {data}=await axiosInstance.post('/api/tickets',form);navigate(`/tickets/${data._id}`,{state:{success:`${data.ticketNumber} created successfully. IT Support has been notified.`}});}catch(err){setError(err.response?.data?.message||'Ticket could not be created.');}finally{setLoading(false);}};
 return <main className="app-page with-nav"><div className="simple-header"><button onClick={()=>navigate(-1)}>←</button><h1>Create Ticket</h1></div><section className="page-content"><Alert>{error}</Alert><form className="form-card" onSubmit={submit}>
  <label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Laptop cannot connect to Wi-Fi" maxLength="100"/></label>
  <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="">Select category</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
  <label>Priority<select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{priorities.map(p=><option key={p}>{p}</option>)}</select></label>
  <label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the issue, what you were doing and any error messages you saw." maxLength="1000"/></label>
  <p className="helper">Please provide enough detail for the support team to understand the problem.</p><button className="btn btn-primary" disabled={loading}>{loading?'Submitting...':'Submit Ticket'}</button>
 </form></section><BottomNav/></main>;
};
export default CreateTicket;
