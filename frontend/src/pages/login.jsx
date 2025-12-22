import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaUser, FaRocket, FaGlobe, FaShieldAlt, FaServer, FaCode, FaTerminal } from 'react-icons/fa';
import { SiHiveBlockchain, SiTensorflow, SiReact, SiDocker } from 'react-icons/si';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [terminalText, setTerminalText] = useState('Initializing secure connection...');
  const navigate = useNavigate();

  // Floating particles animation
  useEffect(() => {
    const particlesArray = [];
    for (let i = 0; i < 30; i++) {
      particlesArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `hsl(${Math.random() * 60 + 200}, 100%, 70%)`,
      });
    }
    setParticles(particlesArray);

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: (p.x + p.speedX) % 100,
          y: (p.y + p.speedY) % 100,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Terminal typing effect
  useEffect(() => {
    const messages = [
      'Establishing secure connection...',
      'Authenticating credentials...',
      'Validating security protocols...',
      'Accessing neural network...',
      'System ready for login.',
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setTerminalText(messages[index]);
        index++;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Tech stack animation
  const techIcons = [
    { icon: <SiHiveBlockchain />, color: 'text-purple-400', delay: 0 },
    { icon: <SiTensorflow />, color: 'text-orange-400', delay: 200 },
    { icon: <SiReact />, color: 'text-cyan-400', delay: 400 },
    { icon: <SiDocker />, color: 'text-blue-400', delay: 600 },
    { icon: <FaTerminal />, color: 'text-green-400', delay: 800 },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Loading animation
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.classList.add('animate-pulse');
    }

    try {
      const res = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data.data));
      
      // Success animation sound (Browser policy may block auto-play)
      try {
          const successSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3');
          successSound.volume = 0.3;
          successSound.play().catch(() => {});
      } catch (e) {}
      
      // Redirect with animation
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    } catch (err) { 
      setIsLoading(false);
      if (loginBtn) {
        loginBtn.classList.remove('animate-pulse');
      }
      
      // Error animation
      try {
          const errorSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-1551.mp3');
          errorSound.volume = 0.3;
          errorSound.play().catch(() => {});
      } catch (e) {}
      
      const form = e.target;
      form.classList.add('shake-animation');
      setTimeout(() => form.classList.remove('shake-animation'), 500);
      alert('⚠️ Access Denied: Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-[#030303] overflow-hidden relative">
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full animate-float"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: 0.6,
              animationDelay: `${p.id * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Matrix-like Falling Code Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 text-xs font-mono opacity-20 animate-matrix"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          >
            {Math.random() > 0.5 ? '101010' : '001001'}
          </div>
        ))}
      </div>

      {/* Floating Tech Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {techIcons.map((tech, idx) => (
          <div
            key={idx}
            className={`absolute text-4xl ${tech.color} opacity-10 animate-float-slow`}
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
              animationDelay: `${tech.delay}ms`,
            }}
          >
            {tech.icon}
          </div>
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* Terminal Status Bar */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 font-mono text-xs text-green-400 animate-terminal-glow hidden md:block">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white">$</span>
          <span className="terminal-text animate-typing">{terminalText}</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-blink"></div>
        </div>
      </div>

      {/* Main Login Container - Added mt-24 to push it down */}
      <div className="relative z-10 w-full max-w-md mx-4 mt-24">
        
        {/* Animated Border Container */}
        <div className="relative group">
          {/* Rotating Border Animation */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-1000 animate-gradient-rotate"></div>
          
          {/* Glowing Inner Container */}
          <div className="relative bg-black/80 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-2xl">
            
            {/* Top Animated Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-shift"></div>

            {/* Logo and Header */}
            <div className="text-center mb-10 relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg animate-glow"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400 rounded-tr-lg animate-glow" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl-lg animate-glow" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-pink-400 rounded-br-lg animate-glow" style={{animationDelay: '0.6s'}}></div>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="relative">
                  <FaRocket className="text-5xl text-cyan-400 animate-rocket" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent animate-gradient">
                    UNILEARN
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 tracking-widest">v4.2 SECURE PORTAL</p>
                </div>
              </div>
              
              <p className="text-lg text-slate-300 font-light">
                Access Neural Network Intelligence
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-8">
              
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-r from-black/50 to-slate-900/50 rounded-xl p-0.5">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <FaEnvelope className="text-cyan-400 animate-pulse" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="neural.access@unilearn.ai" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white pl-12 pr-4 py-5 border-none outline-none placeholder-slate-500 text-lg"
                    required 
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-r from-black/50 to-slate-900/50 rounded-xl p-0.5">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <FaLock className="text-purple-400 animate-pulse" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-white pl-12 pr-4 py-5 border-none outline-none placeholder-slate-500 text-lg"
                    required 
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500"></div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-between px-4 py-3 bg-black/50 border border-green-500/30 rounded-xl animate-pulse">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-green-400" />
                  <span className="text-sm text-green-300 font-mono">256-bit SSL Encryption</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{animationDelay: `${i * 0.2}s`}}></div>
                  ))}
                </div>
              </div>

              {/* Login Button */}
              <button 
                id="login-btn"
                type="submit" 
                disabled={isLoading}
                className="relative group w-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 group-hover:animate-gradient-shift"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="relative flex items-center justify-center gap-3 bg-black/20 backdrop-blur-sm py-5 text-white font-bold text-lg tracking-widest rounded-xl border border-white/20 group-hover:border-cyan-400/50 transition-all duration-300">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <span>INITIATE LOGIN</span>
                      <FaServer className="group-hover:rotate-90 transition-transform duration-500" />
                    </>
                  )}
                </div>
                
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm">
                    New User? <Link to="/signup" className="text-cyan-400 font-bold hover:text-white transition">Request Clearance</Link>
                </p>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes matrix {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px currentColor; }
          50% { box-shadow: 0 0 20px currentColor; }
        }
        @keyframes rocket {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes terminal-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 0, 0.1); }
          50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.3); }
        }
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 30s ease-in-out infinite;
        }
        .animate-matrix {
          animation: matrix linear infinite;
        }
        .animate-gradient-rotate {
          animation: gradient-rotate 3s linear infinite;
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        .animate-typing {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 2s steps(40, end);
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-rocket {
          animation: rocket 2s ease-in-out infinite;
        }
        .animate-terminal-glow {
          animation: terminal-glow 2s ease-in-out infinite;
        }
        .terminal-text::after {
          content: '|';
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;