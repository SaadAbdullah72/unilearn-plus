import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaShieldAlt, FaMoneyBillWave, FaBook, FaTrashAlt } from 'react-icons/fa';

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
    Promise.all([fetchCourses(), fetchPayments()])
      .finally(() => setLoading(false));
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses/admin/all');
      setCourses(res.data.data);
    } catch (err) {
      console.error("Course Fetch Error:", err);
    }
  };

  const fetchPayments = async () => {
    try {
        const res = await axios.get('/api/payment');
        setPayments(res.data.data);
    } catch (err) {
        console.error("Payment Fetch Error:", err);
    }
  };

  // --- COURSE ACTIONS ---

  // Approve Course
  const approveCourse = async (id) => {
    if(!window.confirm("Confirm approval for this course?")) return;
    try {
        await axios.put(`/api/courses/${id}/approve`);
        alert("✅ Course Approved and Live!");
        fetchCourses();
    } catch (err) {
        alert("❌ Error approving course");
    }
  };

  // Reject Course (Status ko 'rejected' set karega)
  const rejectCourse = async (id) => {
    if(!window.confirm("Disapprove this course? It will be moved to rejected status.")) return;
    try {
        // Backend mein hum status update call bhej rahe hain
        await axios.put(`/api/courses/${id}/status`, { status: 'rejected' });
        alert("❌ Course Disapproved");
        fetchCourses();
    } catch (err) {
        alert("Error rejecting course. Make sure backend route /api/courses/:id/status exists.");
    }
  };

  // Delete Course (Permanent Remove)
  const deleteCourse = async (id) => {
    if(!window.confirm("⚠️ DANGER: Are you sure? This course will be PERMANENTLY deleted from database.")) return;
    try {
        await axios.delete(`/api/courses/${id}`);
        alert("🗑️ Course Permanently Deleted");
        fetchCourses();
    } catch (err) {
        alert("Error deleting course");
    }
  };

  // --- PAYMENT ACTIONS ---
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
  const pendingCourses = courses.filter(c => c.status === 'pending');
  const approvedCourses = courses.filter(c => c.status === 'approved');
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
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/40 transition-all uppercase tracking-widest text-sm">
                Authenticate System
            </button>
        </div>
      </div>
    );
  }

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

        {/* --- 1. PENDING COURSES (APPROVAL/REJECTION) --- */}
        <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-orange-400">
                <FaBook /> Pending Approvals
                <span className="text-xs bg-orange-900/30 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">{pendingCourses.length}</span>
            </h2>
            
            {pendingCourses.length === 0 ? (
                <div className="p-8 bg-white/5 border border-dashed border-white/10 rounded-xl text-center text-slate-500">No pending courses.</div>
            ) : (
                <div className="grid gap-4">
                    {pendingCourses.map(course => (
                        <div key={course._id} className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-orange-500/50 transition">
                            <div className="flex items-center gap-6 flex-1">
                                <img src={course.image} alt="thumb" className="w-24 h-16 object-cover rounded-lg bg-slate-800" />
                                <div>
                                    <h3 className="font-bold text-lg text-white">{course.title}</h3>
                                    <p className="text-slate-400 text-sm">Instructor: <span className="text-cyan-400">{course.instructor}</span></p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => approveCourse(course._id)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2">
                                    <FaCheck /> Approve
                                </button>
                                <button onClick={() => rejectCourse(course._id)} className="bg-amber-600/20 text-amber-500 border border-amber-600 hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition">
                                    <FaTimes /> Disapprove
                                </button>
                                <button onClick={() => deleteCourse(course._id)} className="bg-red-900/30 text-red-400 border border-red-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 hover:text-white transition">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* --- 2. LIVE COURSES MANAGEMENT (DELETE ANY COURSE) --- */}
        <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-cyan-400">
                <FaShieldAlt /> Live Inventory Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedCourses.map(course => (
                    <div key={course._id} className="bg-black border border-white/5 p-4 rounded-xl flex justify-between items-center group hover:border-red-500/50 transition">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium truncate max-w-[150px]">{course.title}</span>
                        </div>
                        <button onClick={() => deleteCourse(course._id)} className="text-slate-600 hover:text-red-500 p-2 transition">
                            <FaTrashAlt />
                        </button>
                    </div>
                ))}
            </div>
        </section>

        {/* --- 3. PAYMENT REQUESTS --- */}
        <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-400">
                <FaMoneyBillWave /> Payment Verification
                <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full border border-green-500/30">{pendingPayments.length} Pending</span>
            </h2>

            <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="p-4">Student</th>
                            <th className="p-4">Item</th>
                            <th className="p-4">TID</th>
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
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                        pay.status === 'Approved' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 
                                        'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
                                    }`}>
                                        {pay.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {pay.status === 'Pending' && (
                                        <button onClick={() => approvePayment(pay._id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded text-xs font-bold transition">Verify</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;