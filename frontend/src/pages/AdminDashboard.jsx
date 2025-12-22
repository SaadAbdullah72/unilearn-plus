import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaShieldAlt, FaMoneyBillWave, FaBook } from 'react-icons/fa';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Data States
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- LOGIN LOGIC ---
  const handleLogin = () => {
    if (password === 'saad489254') {
      setIsAuthenticated(true);
      fetchAllData();
    } else {
      alert("🚫 Access Denied: Incorrect Security Code");
    }
  };

  // --- FETCH ALL DATA ---
  const fetchAllData = () => {
    setLoading(true);
    // Promise.all use karte hain taake dono requests ek sath chalein
    Promise.all([fetchCourses(), fetchPayments()])
      .finally(() => setLoading(false));
  };

  // 1. Fetch Courses (Pending & Approved)
  const fetchCourses = async () => {
    try {
      // ✅ FIX: Correct Route used
      const res = await axios.get('/api/courses/admin/all');
      setCourses(res.data.data);
    } catch (err) {
      console.error("Course Fetch Error:", err);
    }
  };

  // 2. Fetch Payments (EasyPaisa)
  const fetchPayments = async () => {
    try {
        const res = await axios.get('/api/payment');
        setPayments(res.data.data);
    } catch (err) {
        console.error("Payment Fetch Error:", err);
    }
  };

  // --- APPROVAL ACTIONS ---

  // Approve Course
  const approveCourse = async (id) => {
    if(!window.confirm("Confirm approval for this course?")) return;
    
    try {
       await axios.put(`/api/courses/${id}/approve`);
       alert("✅ Course Approved and Live!");
       fetchCourses(); // Refresh List
    } catch (err) {
       alert("❌ Error approving course");
    }
  };

  // Delete Course
  const deleteCourse = async (id) => {
    if(!window.confirm("⚠️ Are you sure? This cannot be undone.")) return;

    try {
        await axios.delete(`/api/courses/${id}`);
        alert("🗑️ Course Deleted");
        fetchCourses();
    } catch (err) {
        alert("Error deleting course");
    }
  };
  

  // Approve Payment
  const approvePayment = async (id) => {
    try {
        await axios.put(`/api/payment/approve/${id}`);
        alert("✅ Payment Verified! Student Enrolled.");
        fetchPayments();
    } catch (err) {
        alert("Error approving payment");
    }
  };

  // --- FILTERED LISTS ---
  // ✅ FIX: 'isApproved' ki jagah 'status' check kiya
  const pendingCourses = courses.filter(c => c.status === 'pending');
  const pendingPayments = payments.filter(p => p.status === 'Pending');

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden font-sans text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black"></div>
        
        <div className="z-10 w-full max-w-md p-10 bg-black/80 backdrop-blur-xl border border-cyan-900/50 rounded-3xl shadow-[0_0_60px_-15px_rgba(8,145,178,0.3)] text-center">
            <div className="w-24 h-24 bg-cyan-900/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/30 animate-pulse">
                <FaShieldAlt className="text-5xl text-cyan-400" />
            </div>

            <h2 className="text-4xl font-black mb-2 tracking-tighter text-white">ADMIN GATEWAY</h2>
            <p className="text-cyan-500 text-xs uppercase tracking-[0.3em] font-bold mb-10">Restricted Access // Level 5</p>

            <input 
                type="password" 
                placeholder="ENTER SECURITY KEY" 
                className="w-full bg-[#0a0a0a] border border-cyan-900/50 text-cyan-400 text-center text-xl font-mono p-4 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none tracking-[0.5em] transition-all placeholder-slate-700 mb-6 shadow-inner"
                onChange={(e) => setPassword(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />

            <button 
                onClick={handleLogin} 
                className="w-full bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/40 transition-all uppercase tracking-widest text-sm"
            >
                Authenticate System
            </button>
        </div>
        <p className="mt-8 text-slate-600 text-[10px] font-mono tracking-widest">SECURE CONNECTION ESTABLISHED</p>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-10 px-6 pb-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
            <h1 className="text-4xl font-black tracking-tight">Admin <span className="text-cyan-500">Console</span></h1>
            <div className="flex gap-4">
                <button onClick={fetchAllData} className="text-sm text-cyan-400 hover:text-white underline">Refresh Data</button>
                <button onClick={() => setIsAuthenticated(false)} className="bg-red-900/30 text-red-400 px-4 py-2 rounded-lg text-xs font-bold border border-red-900/50 hover:bg-red-900/50 transition">LOGOUT</button>
            </div>
        </header>

        {/* --- PENDING COURSES --- */}
        <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-orange-400">
                <FaBook /> Pending Course Approvals
                <span className="text-xs bg-orange-900/30 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">{pendingCourses.length}</span>
            </h2>
            
            {pendingCourses.length === 0 ? (
                <div className="p-8 bg-white/5 border border-dashed border-white/10 rounded-xl text-center text-slate-500">No pending courses found.</div>
            ) : (
                <div className="grid gap-4">
                    {pendingCourses.map(course => (
                        <div key={course._id} className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-orange-500/50 transition">
                            <div className="flex items-center gap-6 flex-1">
                                <img 
                                    src={course.image.startsWith('http') ? course.image : `http://localhost:5000/${course.image}`} 
                                    alt="thumb" 
                                    className="w-24 h-16 object-cover rounded-lg bg-slate-800"
                                />
                                <div>
                                    <h3 className="font-bold text-lg text-white">{course.title}</h3>
                                    <p className="text-slate-400 text-sm">Instructor: <span className="text-cyan-400">{course.instructor}</span></p>
                                    <p className="text-slate-500 text-xs mt-1">Price: Rs. {course.price} | Category: {course.category}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => approveCourse(course._id)} 
                                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-green-900/20 transition flex items-center gap-2"
                                >
                                    <FaCheck /> Approve
                                </button>
                                <button 
                                    onClick={() => deleteCourse(course._id)} 
                                    className="bg-red-900/30 text-red-400 border border-red-900 hover:bg-red-900/50 px-4 py-2 rounded-lg font-bold text-sm transition"
                                >
                                    <FaTimes /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* --- PAYMENT REQUESTS --- */}
        <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-400">
                <FaMoneyBillWave /> Payment Verification
                <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full border border-green-500/30">{pendingPayments.length} Pending</span>
            </h2>

            <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="p-4">Student Name</th>
                            <th className="p-4">Item Purchased</th>
                            <th className="p-4">Transaction ID (TID)</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                        {payments.map(pay => (
                            <tr key={pay._id} className="hover:bg-white/5 transition">
                                <td className="p-4 font-bold text-white">{pay.studentName || "Unknown"}</td>
                                <td className="p-4">{pay.itemTitle}</td>
                                <td className="p-4 font-mono text-cyan-400">{pay.transactionId}</td>
                                <td className="p-4 font-bold text-green-400">Rs. {pay.amount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                        pay.status === 'Approved' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 
                                        pay.status === 'Rejected' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
                                        'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
                                    }`}>
                                        {pay.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {pay.status === 'Pending' && (
                                        <button 
                                            onClick={() => approvePayment(pay._id)} 
                                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded text-xs font-bold transition shadow-lg shadow-green-900/20"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {payments.length === 0 && (
                    <div className="p-12 text-center text-slate-600 italic">No transaction records found.</div>
                )}
            </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;