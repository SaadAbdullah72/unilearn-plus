import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaDollarSign, FaImage, FaSave } from 'react-icons/fa';

const AddWorkshop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: 'Online (Zoom/Meet)',
    price: 0
  });
  const [image, setImage] = useState(null);

  // Handle Text Change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('time', formData.time);
    data.append('venue', formData.venue);
    data.append('price', formData.price);
    data.append('instructorName', user.name);
    data.append('instructorId', user._id);
    if (image) data.append('image', image);

    try {
      await axios.post('/api/workshops', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("🎉 Workshop Created Successfully!");
      navigate('/workshops'); // List page par wapis bhejo
    } catch (err) {
      console.error(err);
      alert("Failed to create workshop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-4 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-black mb-8 border-b border-white/10 pb-4">
            Host a <span className="text-pink-500">Workshop</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#111] p-8 rounded-2xl border border-white/10 shadow-2xl">
            
            {/* Title */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Workshop Title</label>
                <input required type="text" name="title" onChange={handleChange} placeholder="e.g. Master AI Agents in 2 Hours" className="w-full bg-black border border-white/20 p-4 rounded-xl focus:border-pink-500 outline-none transition text-white" />
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <textarea required name="description" onChange={handleChange} rows="3" placeholder="What will students learn?" className="w-full bg-black border border-white/20 p-4 rounded-xl focus:border-pink-500 outline-none transition text-white"></textarea>
            </div>

            {/* Grid for Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2"><FaCalendarAlt className="inline mr-1"/> Date</label>
                    <input required type="date" name="date" onChange={handleChange} className="w-full bg-black border border-white/20 p-4 rounded-xl focus:border-pink-500 outline-none text-white" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2"><FaClock className="inline mr-1"/> Time</label>
                    <input required type="time" name="time" onChange={handleChange} className="w-full bg-black border border-white/20 p-4 rounded-xl focus:border-pink-500 outline-none text-white" />
                </div>
            </div>

            {/* Grid for Venue/Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2"><FaMapMarkerAlt className="inline mr-1"/> Venue</label>
                    <input required type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-black border border-white/20 p-4 rounded-xl focus:border-pink-500 outline-none text-white" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2"><FaDollarSign className="inline mr-1"/> Price (Rs. 0 for Free)</label>
                    <input required type="number" name="price" onChange={handleChange} placeholder="0" className="w-full bg-black border border-white/20 p-4 rounded-xl focus:border-pink-500 outline-none text-white" />
                </div>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2"><FaImage className="inline mr-1"/> Cover Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full bg-black/50 border border-white/20 p-3 rounded-xl text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-900/30 file:text-pink-400 hover:file:bg-pink-900/50" />
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-4 rounded-xl text-lg uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg">
                {loading ? 'Creating...' : <><FaSave /> Publish Workshop</>}
            </button>

        </form>
      </div>
    </div>
  );
};

export default AddWorkshop;