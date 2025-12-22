import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EasyPaisaModal from '../components/EasyPaisaModal';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserTie, FaUsers, FaFire, FaVideo, FaCertificate } from 'react-icons/fa';
import { MdOnlinePrediction } from 'react-icons/md';

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const user = JSON.parse(localStorage.getItem('user'));

  // Enhanced workshop images
  const workshopImages = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=2080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2068&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=2076&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop"
  ];

  const filters = [
    { id: 'all', label: 'All Workshops' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'live', label: 'Live Now' },
    { id: 'free', label: 'Free Events' },
    { id: 'paid', label: 'Paid Workshops' }
  ];

  useEffect(() => {
    axios.get('/api/workshops')
      .then(res => {
        const data = res.data.data || res.data;
        setWorkshops(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err));
  }, []);

  // 👇 YEH FUNCTION UPDATE KIYA HAI (DATABASE SAVE LOGIC)
  const handleRegister = async (workshop) => {
    if (!user) { 
      alert("🔐 Please login to register for workshops");
      return; 
    }
    
    // CASE 1: FREE WORKSHOP (Direct Database Entry)
    if (workshop.price === 0) {
      if(window.confirm(`Confirm registration for free workshop: "${workshop.title}"?`)) {
        try {
            // Backend call to save enrollment
            await axios.post('/api/enrollments/free-workshop', {
                studentId: user._id,
                workshopId: workshop._id, // Workshop ID
                title: workshop.title,
                image: workshop.image, // Pass original image logic if available in DB
                date: workshop.date,
                time: workshop.time,
                venue: workshop.venue
            });
            alert("🎉 Registration Successful! Check 'My Dashboard' for your ticket.");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Registration Failed");
        }
      }
      return;
    }

    // CASE 2: PAID WORKSHOP (Open Modal)
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  };

  // Filter workshops
  const filteredWorkshops = workshops.filter(workshop => {
    if (filter === 'free' && workshop.price > 0) return false;
    if (filter === 'paid' && workshop.price === 0) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-black pt-24 px-4 pb-20">
      
      {/* Payment Modal */}
      {selectedWorkshop && (
        <EasyPaisaModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          item={selectedWorkshop}
          user={user}
          type="workshop"
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
            <span className="text-pink-400 text-sm font-bold uppercase tracking-widest">Live Interactive Sessions</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-red-500">Workshops</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join expert-led live sessions, hackathons, and hands-on labs. Learn directly from industry practitioners.
          </p>

          {/* View Toggle */}
          <div className="flex justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full p-1">
              {filters.map(filterItem => (
                <button
                  key={filterItem.id}
                  onClick={() => setFilter(filterItem.id)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    filter === filterItem.id 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filterItem.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: <FaFire />, value: "Live Now", label: "Active Workshops", color: "red" },
            { icon: <FaCalendarAlt />, value: "12", label: "This Month", color: "pink" },
            { icon: <FaUsers />, value: "5K+", label: "Participants", color: "purple" },
            { icon: <MdOnlinePrediction />, value: "100%", label: "Online", color: "cyan" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-br from-black/50 to-transparent border border-white/10 rounded-2xl p-6 text-center hover:border-pink-500/30 transition">
              <div className={`text-3xl text-${stat.color}-400 mb-2`}>{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Workshops Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredWorkshops.map((workshop, index) => (
              <div key={workshop._id} className="group relative overflow-hidden bg-gradient-to-br from-black/60 to-black/30 border border-white/10 rounded-2xl hover:border-pink-500/50 transition-all duration-500">
                
                {/* Live Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">LIVE</span>
                  </div>
                </div>

                {/* Workshop Image */}
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={workshopImages[index % workshopImages.length]} 
                    alt={workshop.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  
                  {/* Free/Paid Badge */}
                  <div className="absolute top-4 right-4">
                    {workshop.price === 0 ? (
                      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                        FREE
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-black text-sm font-bold px-4 py-1 rounded-full">
                        Rs. {workshop.price}
                      </div>
                    )}
                  </div>
                </div>

                {/* Workshop Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
                    {workshop.title}
                  </h3>
                  
                  <p className="text-slate-300 text-sm mb-6 line-clamp-2">
                    {workshop.description || 'Interactive session with hands-on exercises and Q&A with industry experts.'}
                  </p>

                  {/* Workshop Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                        <FaCalendarAlt className="text-pink-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Date</div>
                        <div className="text-sm font-semibold text-white">{workshop.date || 'TBD'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <FaClock className="text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Time</div>
                        <div className="text-sm font-semibold text-white">{workshop.time || '6:00 PM'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <FaUserTie className="text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Instructor</div>
                        <div className="text-sm font-semibold text-white">{workshop.instructor || 'Industry Expert'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FaMapMarkerAlt className="text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Venue</div>
                        <div className="text-sm font-semibold text-white">{workshop.venue || 'Online'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                      <FaVideo className="text-cyan-400" />
                      <span>Live Streaming</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCertificate className="text-amber-400" />
                      <span>Certificate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUsers className="text-green-400" />
                      <span>{Math.floor(Math.random() * 100) + 50} attending</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => handleRegister(workshop)}
                    className={`w-full py-3 font-bold rounded-xl transition-all transform hover:-translate-y-1 ${
                      workshop.price === 0
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:shadow-green-500/30'
                        : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-xl hover:shadow-pink-500/30'
                    }`}
                  >
                    {workshop.price === 0 ? 'Register Free Now →' : 'Pay & Register →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View (Alternative)
          <div className="space-y-6">
            {filteredWorkshops.map(workshop => (
              <div key={workshop._id} className="bg-gradient-to-r from-black/50 to-transparent border border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition">
                {/* List view content */}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredWorkshops.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Workshops Available</h3>
            <p className="text-slate-400 mb-6">Check back soon for upcoming live sessions</p>
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-full hover:shadow-xl hover:shadow-pink-500/30 transition">
              Notify Me About Upcoming
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-pink-900/20 via-black/50 to-rose-900/20 border border-white/10 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Want to Host a Workshop?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Share your expertise with our community of 50,000+ tech professionals
            </p>
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-slate-300 text-black font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-white/20 transition-all">
              <span>Become an Instructor</span>
              <span className="text-2xl">→</span>
            </button>
          </div>
        </div>

        {/* Upcoming Calendar Preview */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-white mb-6">📅 Upcoming Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { date: 'Dec 25', title: 'AI Agents Workshop', time: '2:00 PM', status: 'Upcoming' },
              { date: 'Dec 28', title: 'Web3 Security', time: '6:00 PM', status: 'Open' },
              { date: 'Jan 2', title: 'DevOps Masterclass', time: '4:00 PM', status: 'Early Bird' }
            ].map((event, idx) => (
              <div key={idx} className="bg-black/40 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition">
                <div className="text-2xl font-bold text-cyan-400 mb-2">{event.date}</div>
                <h4 className="text-lg font-bold text-white mb-2">{event.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{event.time}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    event.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' :
                    event.status === 'Open' ? 'bg-green-500/20 text-green-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopList;