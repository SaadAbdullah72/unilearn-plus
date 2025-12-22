import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getThumbnail } from '../utils/getImage'; // Fallback image generator
import { useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaCalendarCheck, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        // Fetch User Enrollments (Courses + Workshops)
        axios.get(`/api/enrollments?studentId=${user._id}`)
             .then(res => {
                 console.log("📥 Dashboard Data:", res.data.data);
                 setEnrollments(res.data.data);
             })
             .catch(err => console.error("Error fetching data:", err));
    }
  }, [user]);

  // 👇 SMART IMAGE LOADER (Fixes the Cloudinary vs Localhost issue)
  const getCourseImage = (item) => {
      // Logic for Courses
      if (item.itemType === 'course') {
          // Check deep inside populated courseId, or direct image field
          let img = item.courseId?.image || item.image;
          
          if (img) {
              if (img.startsWith('http')) return img; // Cloudinary Link
              return `http://localhost:5000/${img}`; // Localhost Link
          }
          return getThumbnail(item.title); // Fallback Text Image
      }
      
      // Logic for Workshops (Default Unsplash Image if none provided)
      return item.image || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop";
  };

  if (!user) return <div className="text-center mt-20 text-white font-mono">🔒 Please Login to access dashboard.</div>;

  // Separate Lists
  const courses = enrollments.filter(e => e.itemType === 'course');
  const workshops = enrollments.filter(e => e.itemType === 'workshop');

  return (
    <div className="mt-8 px-4 pb-20 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black text-white mb-8 border-b border-white/10 pb-4">My <span className="text-cyan-500">Learning</span></h1>

      {/* --- SECTION 1: WORKSHOP PASSES (TICKETS) --- */}
      {workshops.length > 0 && (
        <div className="mb-16">
            <h2 className="text-2xl font-bold text-pink-400 mb-6 flex items-center gap-3">
                <FaTicketAlt /> Live Workshop Passes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workshops.map(pass => (
                    <div key={pass._id} className="bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 rounded-2xl flex flex-col sm:flex-row overflow-hidden relative shadow-lg hover:border-pink-500/30 transition-all duration-300 transform hover:scale-[1.01]">
                        
                        {/* Ticket Visual Cutouts */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#030303] rounded-full z-10"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#030303] rounded-full z-10"></div>
                        <div className="hidden sm:block absolute top-0 bottom-0 right-32 border-l-2 border-dashed border-white/10"></div>

                        {/* Content Area */}
                        <div className="p-6 flex-1 relative z-0">
                            <div className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                                Confirmed Entry
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 leading-tight">{pass.title}</h3>
                            
                            <div className="space-y-2 text-sm text-slate-300">
                                <p className="flex items-center gap-2"><FaCalendarCheck className="text-pink-400"/> {pass.eventDate || "Date TBA"}</p>
                                <p className="flex items-center gap-2"><FaClock className="text-pink-400"/> {pass.eventTime || "Time TBA"}</p>
                                <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-pink-400"/> {pass.eventVenue || "Online Event"}</p>
                            </div>
                        </div>

                        {/* QR Code Area */}
                        <div className="sm:w-32 bg-black/40 flex flex-col items-center justify-center p-4 text-center border-t sm:border-t-0 sm:border-l border-white/10">
                            <div className="bg-white p-1 rounded-lg mb-2 shadow-inner">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${pass._id}`} 
                                    alt="QR Ticket" 
                                    className="w-20 h-20"
                                />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono tracking-widest">SCAN ENTRY</span>
                            <span className="text-xs text-green-400 font-bold mt-1">ID: {pass._id.slice(-4).toUpperCase()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* --- SECTION 2: COURSES --- */}
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
          📚 Enrolled Courses
      </h2>
      
      {courses.length === 0 ? (
          <div className="text-center py-16 bg-[#0a0a0a] border border-dashed border-white/10 rounded-2xl">
              <p className="text-slate-500 mb-4">You haven't enrolled in any courses yet.</p>
              <button onClick={() => navigate('/courses')} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm transition">Browse Catalog</button>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
                <div key={course._id} className="group bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:shadow-cyan-900/20 flex flex-col h-full">
                    
                    {/* Thumbnail Image */}
                    <div className="h-48 overflow-hidden relative bg-black">
                        <img 
                            src={getCourseImage(course)} 
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100" 
                            alt={course.title}
                            onError={(e) => { e.target.src = getThumbnail(course.title); }} // Safety Fallback
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                            <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 transform scale-0 group-hover:scale-100 transition duration-300">
                                <span className="text-black font-bold text-xl ml-1">▶</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-white text-lg mb-2 line-clamp-1 group-hover:text-cyan-400 transition">
                            {course.title}
                        </h3>
                        
                        <div className="mt-auto pt-4 border-t border-white/5">
                            <button 
                                onClick={() => {
                                    // Use courseId if populated, otherwise fallback to itemId
                                    const realId = course.courseId?._id || course.itemId;
                                    navigate(`/course/${realId}/learn`);
                                }}
                                className="w-full py-3 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl text-cyan-400 font-bold text-sm hover:bg-cyan-500 hover:text-black transition-all shadow-lg"
                            >
                                Continue Learning
                            </button>
                        </div>
                    </div>
                </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default MyLearning;