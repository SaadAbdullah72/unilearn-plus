import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import EasyPaisaModal from '../components/EasyPaisaModal';
import { FaStar, FaUsers, FaClock, FaTag, FaRocket, FaFilter, FaSearch } from 'react-icons/fa';
import { RiPriceTag3Fill } from 'react-icons/ri';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All'); // Default All
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // 👇 Categories match with Database
  const categories = [
    { id: 'All', label: 'All Courses', color: 'cyan' },
    { id: 'Development', label: 'Development', color: 'blue' },
    { id: 'Design', label: 'Design', color: 'purple' },
    { id: 'Business', label: 'Business', color: 'green' },
    { id: 'Marketing', label: 'Marketing', color: 'pink' },
    { id: 'AI', label: 'AI & Data', color: 'red' }
  ];

  // 👇 SMART IMAGE LOADER (Database vs Local)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath; // Cloudinary
    return `http://localhost:5000/${imagePath}`; // Localhost
  };

  useEffect(() => {
    axios.get('/api/courses')
      .then(res => {
        let data = res.data.data || res.data;
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleBuy = (e, course) => {
    e.stopPropagation(); // Card click hone se roko
    if(!user) { 
      alert("🔒 Please Login First to Enroll"); 
      navigate('/login');
      return; 
    }
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Filter courses logic
  const filteredCourses = courses.filter(course => {
    const matchesCategory = filter === 'All' || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-4 pb-20 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Payment Modal */}
      {selectedCourse && (
        <EasyPaisaModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          item={selectedCourse}
          user={user}
          type="course"
        />
      )}

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 rounded-full bg-cyan-900/20 border border-cyan-500/30">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Premium Learning Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Future Tech</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Industry-grade curriculum designed by experts. Build production-ready projects and get job-ready.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="sticky top-20 z-30 bg-black/80 backdrop-blur-xl border-y border-white/10 py-4 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full bg-[#111] border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all shadow-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${
                      filter === cat.id 
                        ? `bg-${cat.color}-600 border-${cat.color}-500 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)]` 
                        : 'bg-[#111] border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: <FaUsers />, value: "15K+", label: "Learners" },
            { icon: <FaStar />, value: "4.9", label: "Rating" },
            { icon: <FaClock />, value: "120h", label: "Content" },
            { icon: <FaRocket />, value: "95%", label: "Success" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition duration-300 group">
              <div className="text-2xl text-slate-500 mb-2 group-hover:text-cyan-400 transition">{stat.icon}</div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
            <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 animate-pulse">Fetching latest courses...</p>
            </div>
        )}

        {/* Courses Grid */}
        {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
                <div 
                    key={course._id} 
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                
                {/* Image Section */}
                <div className="h-52 relative overflow-hidden">
                    <img 
                        src={getImageUrl(course.image)} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={course.title}
                        onError={(e) => {e.target.src = "https://via.placeholder.com/400x300?text=Course"}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">
                        {course.category}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-1 text-amber-400 mb-3 text-xs font-bold">
                        <FaStar /> <span>4.8</span> <span className="text-slate-600 ml-1">(120 Reviews)</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors leading-snug">
                        {course.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                        {course.description || 'Master advanced concepts with hands-on projects.'}
                    </p>
                    
                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Price</span>
                            <span className="text-lg font-bold text-white">Rs. {course.price}</span>
                        </div>

                        {user?.role === 'instructor' && user?._id === course.instructorId ? (
                            <button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg border border-white/10">
                                Manage
                            </button>
                        ) : (
                            <button 
                                onClick={(e) => handleBuy(e, course)} 
                                className="px-5 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-cyan-400 transition-colors shadow-lg"
                            >
                                Enroll Now
                            </button>
                        )}
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-[#0a0a0a] border border-white/5 rounded-2xl">
            <div className="text-4xl mb-4 grayscale opacity-30">📂</div>
            <h3 className="text-xl font-bold text-white mb-2">No Courses Found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters or search query</p>
            <button onClick={() => {setFilter('All'); setSearch('')}} className="mt-4 text-cyan-400 text-sm font-bold hover:underline">
                Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
  
export default CourseList;