import React, { useState } from 'react';
import axios from 'axios';

const EasyPaisaModal = ({ isOpen, onClose, item, user, type }) => {
  const [tid, setTid] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText('03001234567');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!tid) return alert('Please enter Transaction ID');

    // Safety Check
    if (!type) {
      alert('System Error: Refresh Page and Try Again.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/payment/easypaisa', {
        studentId: user._id,
        studentName: user.name,
        itemId: item._id,
        itemTitle: item.title,
        itemType: type, // Course hai ya Workshop
        amount: item.price,
        transactionId: tid,
      });
      alert('✅ Payment Request Sent! Admin will approve shortly.');
      onClose();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Server Error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-[100] p-4 font-sans">
      {/* --- Increased Width (max-w-md) and Rounded Edges (rounded-[30px]) --- */}
      <div className="bg-white w-full max-w-md rounded-[30px] overflow-hidden shadow-2xl relative animate-fade-in-up border border-white/20">
        {/* --- OFFICIAL GREEN HEADER --- */}
        <div className="bg-[#37B34A] px-6 pt-8 pb-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/90 hover:text-white bg-black/10 hover:bg-black/20 rounded-full w-8 h-8 flex items-center justify-center font-bold transition z-20"
          >
            ✕
          </button>

          {/* LOGO CONTAINER */}
          <div className="bg-white w-20 h-20 rounded-2xl mx-auto mb-3 shadow-xl flex items-center justify-center p-3 relative z-10">
            {/* Yahan hum Public folder se image utha rahe hain */}
            <img
              src="/easypaisa.png"
              alt="EasyPaisa"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                // Agar image na mile to fallback text dikhaye
                e.target.style.display = 'none';
                e.target.parentNode.innerText = 'EasyPaisa';
                e.target.parentNode.style.color = '#37B34A';
                e.target.parentNode.style.fontWeight = 'bold';
              }}
            />
          </div>

          <h3 className="text-white font-black text-lg tracking-wide uppercase drop-shadow-md">
            Merchant Pay
          </h3>
          <div className="flex justify-center items-center gap-2 mt-1 opacity-90">
            <span className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></span>
            <p className="text-green-50 text-xs font-medium tracking-wider">
              Telenor Microfinance Bank
            </p>
          </div>
        </div>

        {/* --- RECEIPT BODY --- */}
        {/* --- Reduced Top Padding (pt-4) --- */}
        <div className="p-6 pt-4 bg-[#F8F9FA] relative">
          {/* Amount Section */}
          {/* --- Reduced Bottom Margin (mb-6) --- */}
          <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">
              Total Payable
            </p>
            <h2 className="text-5xl font-black text-slate-800 tracking-tighter">
              <span className="text-xl font-medium text-slate-400 mr-1 align-top mt-2 inline-block">
                Rs.
              </span>
              {item.price.toLocaleString()}
            </h2>
            <div className="mt-2 inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-1 rounded-md text-xs font-semibold text-slate-500 shadow-sm">
              <span>
                {type === 'workshop' ? '🎫 Workshop Pass' : '📚 Course Access'}
              </span>
            </div>
          </div>

          {/* Merchant Details */}
          {/* --- Reduced Margin (mb-4) and Padding (p-3) --- */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4 shadow-sm relative group">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Send Money To
              </span>
              <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                VERIFIED
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="block font-mono font-bold text-lg text-slate-800 tracking-wider">
                  0300-1234567
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Saad Abdullah (UniLearn+)
                </span>
              </div>
              <button
                onClick={handleCopy}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all border shadow-sm ${
                  copied
                    ? 'bg-[#37B34A] border-[#37B34A] text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>

          {/* TID Input */}
          {/* --- Reduced Margin (mb-4) and Padding (p-3) --- */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1 tracking-wider">
              Enter 11-Digit Transaction ID
            </label>
            <input
              type="text"
              maxLength="20"
              placeholder="e.g. 8271928811"
              className="w-full bg-white border-2 border-slate-200 text-slate-800 rounded-xl p-3 focus:border-[#37B34A] focus:ring-4 focus:ring-[#37B34A]/10 outline-none font-mono text-center tracking-[0.2em] font-bold placeholder-slate-300 transition-all text-base"
              value={tid}
              onChange={(e) => setTid(e.target.value)}
            />
          </div>

          {/* Confirm Button */}
          {/* --- Reduced Padding (py-3) --- */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#37B34A] hover:bg-[#2E963D] text-white font-bold py-3 rounded-xl shadow-lg shadow-green-600/30 transition-all active:scale-[0.98] flex justify-center items-center gap-2 text-sm uppercase tracking-wider"
          >
            {loading ? (
              <span className="animate-spin text-xl">◌</span>
            ) : (
              'Confirm Payment'
            )}
          </button>

          <div className="mt-4 flex justify-center items-center gap-2 opacity-50">
            <span className="text-[10px] text-slate-400">
              Secured by SSL Encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EasyPaisaModal;