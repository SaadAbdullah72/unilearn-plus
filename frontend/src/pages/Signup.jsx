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
    setError(''); // Clear error on typing
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    // Log what we're sending
    console.log('📤 Sending signup data:', {
      name: formData.name,
      email: formData.email,
      password: '***'.repeat(formData.password.length),
      role: role
    });

    try {
      // ✅ OPTION 1: Use proxy (if package.json has "proxy": "http://localhost:5000")
      // const response = await axios.post('/api/users/register', {
      //   name: formData.name.trim(),
      //   email: formData.email.trim().toLowerCase(),
      //   password: formData.password,
      //   role: role
      // });

      // ✅ OPTION 2: Use full URL (GUARANTEED WORKING)
      const response = await axios.post(
        'http://localhost:5000/api/users/register',
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: role
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Signup successful:', response.data);

      // Show success
      alert('🎉 Account Created Successfully! Redirecting to login...');
      
      // Clear form
      setFormData({ name: '', email: '', password: '' });
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error('❌ Signup error:', err);
      
      // Detailed error handling
      let errorMessage = 'Something went wrong';
      
      if (err.response) {
        // Server responded with error
        console.error('Error response:', err.response.data);
        errorMessage = err.response.data.message || 
                       err.response.data.error || 
                       `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response
        console.error('No response received:', err.request);
        errorMessage = 'Cannot connect to server. Make sure backend is running on port 5000.';
      } else {
        // Other errors
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      alert(`Signup failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* --- ANIMATED BACKGROUND BLOBS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      {/* --- MAIN GLASS CARD --- */}
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 animate-fade-in-up transform transition-all hover:shadow-indigo-500/10">
        
        {/* LEFT SIDE: BRANDING & VISUALS */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900/50 p-10 flex flex-col justify-between relative overflow-hidden group">
            {/* Decoration Lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
            
            <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/40">
                    <span className="text-2xl font-bold">U+</span>
                </div>
                <h1 className="text-4xl font-black mb-4 leading-tight tracking-tight">
                    Join the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Revolution.</span>
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Unlock access to premium content, live workshops, and a community of 10,000+ developers.
                </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4 relative z-10 mt-8">
                {[
                    "Unlimited Course Access",
                    "Official Certifications",
                    "24/7 Mentor Support"
                ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</div>
                        <span className="text-sm font-medium text-slate-300">{text}</span>
                    </div>
                ))}
            </div>

            <div className="text-xs text-slate-500 mt-8">© 2025 UniLearn+. All rights reserved.</div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="md:w-7/12 p-10 bg-slate-950/50">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Create Account</h2>
                <Link to="/login" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition border border-indigo-500/30 px-4 py-2 rounded-full hover:bg-indigo-500/10">
                    Log In instead
                </Link>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
                
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1 group">
                        <label className="text-[10px] uppercase font-bold text-slate-500 group-focus-within:text-indigo-400 transition-colors">Full Name *</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600"
                            placeholder="John Doe"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1 group">
                        <label className="text-[10px] uppercase font-bold text-slate-500 group-focus-within:text-indigo-400 transition-colors">Email Address *</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600"
                            placeholder="john@example.com"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="space-y-1 group">
                    <label className="text-[10px] uppercase font-bold text-slate-500 group-focus-within:text-indigo-400 transition-colors">Password *</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600"
                        placeholder="••••••••••••"
                        required
                        disabled={loading}
                        minLength="6"
                    />
                    <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                </div>

                {/* --- ROLE SELECTION (ANIMATED CARDS) --- */}
                <div className="pt-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-3 block">I am joining as a:</label>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Student Card */}
                        <div 
                            onClick={() => !loading && setRole('student')}
                            className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${role === 'student' ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors ${role === 'student' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>🎓</div>
                                <div>
                                    <h4 className={`font-bold text-sm ${role === 'student' ? 'text-white' : 'text-slate-400'}`}>Student</h4>
                                    <p className="text-[10px] text-slate-500">I want to learn</p>
                                </div>
                            </div>
                            {role === 'student' && <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>}
                        </div>

                        {/* Instructor Card */}
                        <div 
                            onClick={() => !loading && setRole('instructor')}
                            className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${role === 'instructor' ? 'bg-purple-600/10 border-purple-500 shadow-lg shadow-purple-500/20' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors ${role === 'instructor' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>🚀</div>
                                <div>
                                    <h4 className={`font-bold text-sm ${role === 'instructor' ? 'text-white' : 'text-slate-400'}`}>Instructor</h4>
                                    <p className="text-[10px] text-slate-500">I want to teach</p>
                                </div>
                            </div>
                            {role === 'instructor' && <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.01] active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                        </span>
                    ) : "Get Started Now →"}
                </button>

                {/* Debug Info (remove in production) */}
                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400">
                    <strong>Debug Info:</strong> Using URL: <code className="text-cyan-400">http://localhost:5000/api/users/register</code>
                  </p>
                </div>

            </form>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Signup;