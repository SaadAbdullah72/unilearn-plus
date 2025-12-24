import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      // ✅ FIX: Localhost hata kar relative path use kiya (Jo App.js ke baseURL se connect hoga)
      const response = await axios.post(
        '/api/users/register', 
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: role
        }
      );

      console.log('✅ Signup successful:', response.data);
      alert('🎉 Account Created Successfully!');
      navigate('/login');

    } catch (err) {
      console.error('❌ Signup error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 text-white p-4">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      
      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10">
        
        {/* Left Side: Text (Mobile par hide ya chota) */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-slate-900 to-indigo-900/50 p-10 flex-col justify-between">
            <div>
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/40 font-bold">U+</div>
                <h1 className="text-4xl font-black mb-4 leading-tight">Join the <br/> <span className="text-indigo-400">Revolution.</span></h1>
                <p className="text-slate-400 text-sm">Unlock premium content and join 10k+ developers.</p>
            </div>
            <div className="text-xs text-slate-500">© 2025 UniLearn+.</div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold">Create Account</h2>
                <Link to="/login" className="text-[10px] font-bold text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full">Login</Link>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-xs">⚠️ {error}</div>
            )}

            <form onSubmit={handleSignup} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-indigo-500" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-indigo-500" placeholder="john@example.com" required />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-indigo-500" placeholder="••••••••" required minLength="6" />
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3">
                    <div onClick={() => setRole('student')} className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${role === 'student' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
                        <p className="text-center text-xs font-bold">🎓 Student</p>
                    </div>
                    <div onClick={() => setRole('instructor')} className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${role === 'instructor' ? 'border-purple-500 bg-purple-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
                        <p className="text-center text-xs font-bold">🚀 Instructor</p>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-4 rounded-xl font-bold text-sm shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50">
                    {loading ? "Creating Account..." : "Get Started Now →"}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;