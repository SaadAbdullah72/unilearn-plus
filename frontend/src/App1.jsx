import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

// Import Pages
import Login from './pages/login.jsx';
import Signup from './pages/Signup';
import CourseList from './pages/CourseList';
import AddEditCourse from './pages/AddEditCourse';
import AdminDashboard from './pages/AdminDashboard';
import WorkshopList from './pages/WorkshopList';
import MyLearning from './pages/MyLearning';
import ChatBot from './components/ChatBot';
import CourseClassroom from './pages/CourseClassroom';
import AddWorkshop from './pages/AddWorkshop';
const App = () => {
  axios.defaults.baseURL = 'http://127.0.0.1:5000';
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) setUser(JSON.parse(loggedInUser));
    } catch (e) {
      localStorage.removeItem('user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="bg-[#030303] min-h-screen p-4 flex justify-center">
      
      {/* SNAKE BORDER CONTAINER */}
      <div className="snake-border-wrapper w-full max-w-[1800px] min-h-[95vh]">
        <div className="snake-inner overflow-hidden flex flex-col">
            
            <Router>
                <ChatBot />

                {/* ENHANCED NAVBAR */}
                <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center">
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 flex items-center gap-12 shadow-2xl shadow-cyan-900/30">
                        <Link to="/" className="font-tech text-2xl font-bold tracking-wider text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            UNILEARN
                            <span className="text-xs text-cyan-400 font-normal ml-2">v4.2</span>
                        </Link>
                        
                        <div className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-widest text-slate-400">
                            <Link to="/" className="hover:text-white transition hover:scale-105">Home</Link>
                            <Link to="/courses" className="hover:text-white transition hover:scale-105">Catalog</Link>
                            <Link to="/workshops" className="hover:text-white transition hover:scale-105">Live Ops</Link>
                            <Link to="/mylearning" className="hover:text-white transition hover:scale-105">Dashboard</Link>
                            <Link to="/admin" className="text-amber-500 hover:text-amber-300 transition hover:scale-105">Admin</Link>

                            {/* ✅ FIX 3: Upload Button Wapis Laga Diya */}
                        {user?.role === 'instructor' && (
                            <Link to="/add-course" className="text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded hover:bg-cyan-500 hover:text-black transition font-bold">
                                + Upload
                            </Link>
                        )}

                        {/* Navbar ke andar instructor check ke paas */}
{user?.role === 'instructor' && (
    <div className="flex gap-2">
        <Link to="/add-course" className="text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded hover:bg-cyan-500 hover:text-black transition font-bold text-xs">
            + Course
        </Link>
        <Link to="/add-workshop" className="text-pink-400 border border-pink-500/30 px-3 py-1 rounded hover:bg-pink-500 hover:text-black transition font-bold text-xs">
            + Workshop
        </Link>
    </div>
)}
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-400">{user.name || 'User'}</span>
                                    <button onClick={handleLogout} className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1 border border-red-500/30 rounded-full transition">DISCONNECT</button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Link to="/login" className="text-xs font-bold bg-white text-black px-5 py-2 rounded-full hover:bg-cyan-400 transition hover:scale-105">LOGIN</Link>
                                    <Link to="/signup" className="text-xs font-bold border border-cyan-500 text-cyan-400 px-5 py-2 rounded-full hover:bg-cyan-500 hover:text-black transition hover:scale-105">SIGN UP</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ROUTES */}
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/courses" element={<CourseList />} />
                        <Route path="/workshops" element={<WorkshopList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/mylearning" element={user ? <MyLearning /> : <Navigate to="/login" />} />
                        <Route path="/add-course" element={user ? <AddEditCourse /> : <Navigate to="/login" />} />
                        <Route path="/edit-course/:id" element={user ? <AddEditCourse /> : <Navigate to="/login" />} />
                        <Route path="/course/:id/learn" element={<CourseClassroom />} />
                        {/* Instructor Routes mein add karo */}
<Route path="/add-workshop" element={user ? <AddWorkshop /> : <Navigate to="/login" />} />
                    </Routes>
                </div>

                {/* ENHANCED FOOTER */}
                <footer className="bg-black/50 border-t border-white/5 py-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
                    <div className="relative z-10">
                        <p className="text-xs text-slate-600 font-mono mb-4">SECURE CONNECTION ESTABLISHED // UNILEARN SYSTEMS © 2025</p>
                        <div className="flex justify-center gap-8 mt-6">
                            <a href="#" className="text-slate-500 hover:text-white text-xs transition">Privacy Protocol</a>
                            <a href="#" className="text-slate-500 hover:text-white text-xs transition">Security Audit</a>
                            <a href="#" className="text-slate-500 hover:text-white text-xs transition">API Documentation</a>
                            <a href="#" className="text-slate-500 hover:text-white text-xs transition">System Status</a>
                        </div>
                    </div>
                </footer>

            </Router>
        </div>
      </div>
    </div>
  );
};

// IMPROVED HOME PAGE WITH BETTER VISIBILITY AND BACKGROUNDS
const Home = () => {
  const [activeTab, setActiveTab] = useState('trending');
  
  return (
    <div className="w-full text-slate-100">
        
        {/* 1. ENHANCED HERO SECTION - WITH CLEAR TEXT */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Enhanced Background with better visibility */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop
              " 
                     className="w-full h-full object-cover opacity-25" alt="AI Neural Network" />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 text-center px-4 mt-20 max-w-6xl mx-auto">
                <div className="inline-flex items-center gap-2 border border-white/20 bg-black/70 backdrop-blur-md px-6 py-2 rounded-full mb-8 shadow-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-cyan-300 text-xs font-bold uppercase tracking-[0.3em] font-sans">System Online • 50,321 Active Users</span>
                </div>
                
                <h1 className="font-sans text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tight mb-8 drop-shadow-2xl">
                    Build  <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 animate-gradient">
                        The Future
                    </span>
                </h1>
                
                <p className="text-2xl text-slate-200 mb-12 max-w-2xl mx-auto font-normal leading-relaxed font-sans">
                    Master cutting-edge technologies with industry-grade curriculum. From <span className="text-cyan-300 font-semibold">Quantum Computing</span> to <span className="text-purple-300 font-semibold">Blockchain Architecture</span> and <span className="text-red-300 font-semibold">Cybersecurity Operations</span>.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link to="/signup" className="px-12 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 font-sans">
                        Start Learning Free
                    </Link>
                    <Link to="/courses" className="px-12 py-5 border-2 border-white/40 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/20 hover:border-white/70 transition-all duration-300 group font-sans">
                        <span className="flex items-center justify-center gap-2">
                            Explore 120+ Courses
                            <span className="group-hover:translate-x-2 transition">→</span>
                        </span>
                    </Link>
                </div>
                
                {/* Stats Bar with better visibility */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-white/20">
                    {[
                        { value: "98.7%", label: "Completion Rate" },
                        { value: "24/7", label: "Live Support" },
                        { value: "500+", label: "Industry Experts" },
                        { value: "1000+", label: "Projects Built" }
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl font-black text-white mb-2 font-sans drop-shadow-lg">{stat.value}</div>
                            <div className="text-sm text-cyan-100 uppercase tracking-widest font-sans">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 2. TECH ECOSYSTEM MARQUEE - WITH BACKGROUND */}
        <div className="py-16 border-y border-white/10 bg-gradient-to-r from-black via-cyan-900/20 to-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop" 
                     className="w-full h-full object-cover" alt="Tech Pattern" />
                <div className="absolute inset-0 bg-black/70"></div>
            </div>
            <div className="container mx-auto px-6 relative z-10">
                <p className="text-sm text-cyan-300 uppercase tracking-widest mb-8 text-center font-sans font-semibold">TRUSTED BY ENGINEERS AT</p>
                <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <div className="flex gap-16 animate-marquee whitespace-nowrap py-4">
                        {["GOOGLE", "OPENAI", "MICROSOFT", "SPACEX", "NVIDIA", "COINBASE", "META", "TESLA", "AMAZON AWS", "IBM", "INTEL", "NETFLIX"].map((tech, i) => (
                            <span key={i} className="font-sans text-3xl font-black text-white/40 hover:text-white/70 transition duration-300">
                                {tech}
                            </span>
                        ))}
                        {["GOOGLE", "OPENAI", "MICROSOFT", "SPACEX", "NVIDIA", "COINBASE", "META", "TESLA", "AMAZON AWS", "IBM", "INTEL", "NETFLIX"].map((tech, i) => (
                            <span key={i+12} className="font-sans text-3xl font-black text-white/40 hover:text-white/70 transition duration-300">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* 3. FEATURED LEARNING TRACKS - WITH BACKGROUND IMAGES */}
        <div className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-900/10 to-black opacity-50"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20">
                    <div className="max-w-2xl">
                        <h2 className="font-sans text-6xl font-black text-white mb-6 drop-shadow-lg">SPECIALIZATION TRACKS</h2>
                        <p className="text-xl text-slate-200 leading-relaxed font-sans">
                            Dive deep into specialized fields with structured learning paths designed by industry leaders. 
                            Each track includes real-world projects, certifications, and portfolio development.
                        </p>
                    </div>
                    <div className="mt-8 lg:mt-0">
                        <div className="flex gap-2 bg-black/70 backdrop-blur-sm rounded-full p-1 border border-white/20">
                            {['trending', 'ai', 'web3', 'security'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition font-sans ${activeTab === tab ? 'bg-cyan-400 text-black' : 'text-slate-300 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enhanced Tracks Grid with better text visibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            category: "AI & MACHINE LEARNING",
                            title: "Autonomous AI Agents",
                            description: "Build self-improving AI systems with reinforcement learning and neural architectures",
                            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
                            color: "cyan",
                            modules: 24,
                            duration: "6 months"
                        },
                        {
                            category: "BLOCKCHAIN & WEB3",
                            title: "DeFi Protocol Development",
                            description: "Master smart contracts, tokenomics, and decentralized finance systems",
                            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop",
                            color: "purple",
                            modules: 18,
                            duration: "4 months"
                        },
                        {
                            category: "CYBERSECURITY",
                            title: "Ethical Hacking & Defense",
                            description: "Advanced penetration testing, cryptography, and network security",
                            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2074&auto=format&fit=crop",
                            color: "red",
                            modules: 22,
                            duration: "5 months"
                        },
                        {
                            category: "QUANTUM COMPUTING",
                            title: "Quantum Algorithms",
                            description: "Explore quantum supremacy and next-generation computing paradigms",
                            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
                            color: "blue",
                            modules: 16,
                            duration: "3 months"
                        }
                    ].map((track, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-black/70 to-black/90 hover:border-cyan-500 transition-all duration-500 hover:scale-[1.02] shadow-2xl shadow-black/50">
                            <div className="absolute inset-0">
                                <img 
                                    src={track.image} 
                                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition duration-700"
                                    alt={track.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                            </div>
                            <div className="relative p-8 h-[400px] flex flex-col justify-between">
                                <div>
                                    <div className={`text-${track.color === 'cyan' ? 'cyan-300' : track.color === 'purple' ? 'purple-300' : track.color === 'red' ? 'red-300' : 'blue-300'} text-sm font-bold mb-4 tracking-widest font-sans`}>
                                        {track.category}
                                    </div>
                                    <h3 className="font-sans text-3xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                                        {track.title}
                                    </h3>
                                    <p className="text-slate-100 text-base leading-relaxed mb-6 font-sans">
                                        {track.description}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4 text-sm text-slate-300 font-sans">
                                        <span className="font-semibold">{track.modules} modules</span>
                                        <span>•</span>
                                        <span className="font-semibold">{track.duration}</span>
                                    </div>
                                    <button className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full hover:bg-cyan-400 hover:text-black transition font-sans">
                                        EXPLORE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 4. LEARNING METHODOLOGY - WITH BETTER BACKGROUND */}
        <div className="py-24 relative overflow-hidden">
            <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" 
                     className="w-full h-full object-cover opacity-20" alt="Code Background" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>
            </div>
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="font-sans text-5xl font-black text-white mb-4 text-center drop-shadow-lg">HOW WE TRAIN ELITE ENGINEERS</h2>
                <p className="text-xl text-slate-200 text-center mb-16 max-w-3xl mx-auto font-sans">
                    Our methodology combines theoretical depth with practical implementation, ensuring you're job-ready from day one.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: "⚡",
                            title: "Project-Based Learning",
                            description: "Build 5+ production-ready projects per specialization. Each project is reviewed by industry experts.",
                            features: ["Real-world scenarios", "Code reviews", "Deployment pipelines"]
                        },
                        {
                            icon: "🎯",
                            title: "1:1 Mentorship",
                            description: "Weekly sessions with senior engineers from top tech companies. Get personalized guidance and career advice.",
                            features: ["Industry insights", "Career planning", "Technical guidance"]
                        },
                        {
                            icon: "🚀",
                            title: "Live Deployment",
                            description: "Deploy your projects on actual infrastructure. Learn DevOps, monitoring, and scaling in real environments.",
                            features: ["Cloud platforms", "CI/CD pipelines", "Performance optimization"]
                        }
                    ].map((method, index) => (
                        <div key={index} className="bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-500 group backdrop-blur-sm">
                            <div className="text-5xl mb-6">{method.icon}</div>
                            <h3 className="text-2xl font-black text-white mb-4 font-sans">{method.title}</h3>
                            <p className="text-slate-200 mb-6 text-lg font-sans">{method.description}</p>
                            <ul className="space-y-3">
                                {method.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-base text-white font-sans">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 5. STUDENT SUCCESS STORIES - WITH BACKGROUND */}
        <div className="py-32 relative overflow-hidden">
            <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=2076&auto=format&fit=crop" 
                     className="w-full h-full object-cover opacity-30" alt="Office Background" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
            </div>
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="font-sans text-5xl font-black text-white mb-16 text-center drop-shadow-lg">FROM ZERO TO HERO</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            name: "Sarah Chen",
                            role: "AI Engineer @ Google",
                            story: "Started with zero ML knowledge. Built 3 production AI systems during the course.",
                            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2069&auto=format&fit=crop",
                            salary: "$280K"
                        },
                        {
                            name: "Marcus Rodriguez",
                            role: "Security Lead @ SpaceX",
                            story: "Transitioned from network admin to leading cybersecurity initiatives.",
                            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
                            salary: "$320K"
                        },
                        {
                            name: "Alex Morgan",
                            role: "Blockchain Architect @ Coinbase",
                            story: "Built a DeFi protocol that now handles $50M+ in transactions.",
                            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
                            salary: "$350K"
                        }
                    ].map((student, index) => (
                        <div key={index} className="bg-gradient-to-br from-black/60 to-transparent border border-white/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-500 backdrop-blur-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <img 
                                    src={student.avatar} 
                                    className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400/70"
                                    alt={student.name}
                                />
                                <div>
                                    <h4 className="text-2xl font-black text-white font-sans">{student.name}</h4>
                                    <p className="text-cyan-300 text-base font-sans font-semibold">{student.role}</p>
                                </div>
                            </div>
                            <p className="text-slate-100 text-lg mb-6 italic font-sans">"{student.story}"</p>
                            <div className="flex justify-between items-center pt-6 border-t border-white/20">
                                <span className="text-sm text-cyan-100 font-sans">Annual Compensation</span>
                                <span className="text-3xl font-black text-green-400 font-sans drop-shadow-lg">{student.salary}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 6. UPCOMING WORKSHOPS - WITH BACKGROUND */}
        <div className="py-24 relative overflow-hidden">
            <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=2080&auto=format&fit=crop" 
                     className="w-full h-full object-cover opacity-25" alt="Workshop Background" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-black/80 to-black/90"></div>
            </div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="font-sans text-5xl font-black text-white mb-4 drop-shadow-lg">LIVE WORKSHOPS</h2>
                        <p className="text-xl text-slate-200 font-sans">Real-time training sessions with industry experts</p>
                    </div>
                    <Link to="/workshops" className="text-cyan-300 hover:text-white text-base font-bold border-b-2 border-cyan-400 pb-1 transition font-sans">
                        VIEW ALL SESSIONS →
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Building AI Agents with GPT-4",
                            date: "Tomorrow • 2:00 PM EST",
                            instructor: "Dr. Elena Rodriguez",
                            seats: "24/100 seats left",
                            level: "Advanced"
                        },
                        {
                            title: "Smart Contract Security Audit",
                            date: "Dec 15 • 6:00 PM EST",
                            instructor: "Michael Chen",
                            seats: "15/50 seats left",
                            level: "Intermediate"
                        },
                        {
                            title: "Zero-Trust Network Architecture",
                            date: "Dec 18 • 4:00 PM EST",
                            instructor: "Security Team @ Cloudflare",
                            seats: "8/30 seats left",
                            level: "Expert"
                        }
                    ].map((workshop, index) => (
                        <div key={index} className="border border-white/20 rounded-2xl p-8 hover:border-cyan-400/70 transition duration-300 group bg-black/40 backdrop-blur-sm">
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-4 py-2 bg-cyan-500/30 text-cyan-300 text-sm font-bold rounded-full font-sans">{workshop.level}</span>
                                <span className="text-sm text-slate-300 font-sans">{workshop.seats}</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-cyan-300 transition font-sans">{workshop.title}</h3>
                            <p className="text-slate-200 text-lg mb-6 font-sans">{workshop.date}</p>
                            <div className="flex justify-between items-center pt-6 border-t border-white/20">
                                <span className="text-base text-slate-100 font-sans font-semibold">{workshop.instructor}</span>
                                <button className="px-5 py-2 bg-white/20 text-white text-sm font-bold rounded-full hover:bg-cyan-400 hover:text-black transition font-sans">
                                    RESERVE SEAT
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 7. ENTERPRISE SOLUTIONS - WITH BACKGROUND */}
        <div className="py-32 relative overflow-hidden">
            <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                     className="w-full h-full object-cover opacity-25" alt="Enterprise Background" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-black/80 to-purple-900/30"></div>
            </div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-sans text-6xl font-black text-white mb-8 drop-shadow-lg">ENTERPRISE READY</h2>
                    <p className="text-2xl text-slate-200 mb-12 leading-relaxed font-sans">
                        Train entire engineering teams with customized learning paths, dedicated support, 
                        and enterprise-grade security. Trusted by Fortune 500 companies.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        {["SSO Integration", "Custom Content", "Analytics Dashboard", "Dedicated Support"].map((feature, i) => (
                            <div key={i} className="text-center p-8 border border-white/20 rounded-2xl hover:border-cyan-400/50 transition bg-black/40 backdrop-blur-sm">
                                <div className="text-cyan-300 text-4xl mb-4">✓</div>
                                <div className="text-white font-bold text-xl font-sans">{feature}</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="inline-block p-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full">
                        <button className="px-16 py-6 bg-black text-white font-bold text-xl uppercase tracking-widest rounded-full hover:bg-white/20 transition duration-300 font-sans">
                            Schedule Enterprise Demo
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* 8. FINAL CTA - WITH IMPRESSIVE BACKGROUND */}
        <div className="py-32 relative overflow-hidden">
            <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                     className="w-full h-full object-cover opacity-30" alt="Future Background" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black"></div>
            </div>
            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="font-sans text-7xl font-black text-white mb-8 drop-shadow-2xl">
                    READY TO <span className="text-cyan-300">LEVEL UP</span>?
                </h2>
                <p className="text-2xl text-slate-200 mb-12 max-w-2xl mx-auto font-sans">
                    Join 50,000+ engineers who have transformed their careers with Unilearn. 
                    No prior experience required.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                    <Link to="/signup" className="px-20 py-8 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-2xl uppercase tracking-widest rounded-full hover:shadow-3xl hover:shadow-cyan-500/60 transition-all duration-300 transform hover:scale-105 font-sans">
                        Start Free Trial
                    </Link>
                    <Link to="/courses" className="px-20 py-8 border-2 border-white/40 text-white font-black text-2xl uppercase tracking-widest rounded-full hover:bg-white/20 transition-all duration-300 group font-sans">
                        <span className="flex items-center justify-center gap-4">
                            Browse All Courses
                            <span className="group-hover:translate-x-3 transition text-3xl">⟶</span>
                        </span>
                    </Link>
                </div>
                
                <p className="text-slate-300 text-lg mt-10 font-sans font-semibold">
                    7-day free trial • No credit card required • Cancel anytime
                </p>
            </div>
        </div>
    </div>
  );
};

export default App;