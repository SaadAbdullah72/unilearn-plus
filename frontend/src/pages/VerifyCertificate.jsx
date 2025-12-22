import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyCertificate = () => {
  const { id } = useParams(); // URL se ID lega agar link se aya
  const [certId, setCertId] = useState(id || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto verify agar URL mein ID hai
  useEffect(() => {
    if(id) handleVerify();
  }, [id]);

  const handleVerify = async () => {
    if(!certId) return;
    setLoading(true);
    try {
        const res = await axios.get(`/api/enrollments/verify/${certId}`);
        setResult(res.data);
    } catch (err) {
        setResult({ valid: false });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-2xl">
            <h2 className="font-tech text-3xl font-bold text-center mb-8">CERTIFICATE VERIFICATION</h2>
            
            <div className="flex gap-2 mb-8">
                <input 
                    type="text" 
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="Enter Certificate ID (e.g. UNI-AF32...)"
                    className="w-full bg-black border border-white/20 p-3 rounded-lg text-center font-mono tracking-widest uppercase focus:border-cyan-500 outline-none"
                />
                <button onClick={handleVerify} className="bg-cyan-600 px-6 rounded-lg font-bold hover:bg-cyan-500">CHECK</button>
            </div>

            {loading && <p className="text-center animate-pulse">Verifying Blockchain Record...</p>}

            {result && (
                <div className={`text-center p-6 rounded-xl border ${result.valid ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                    {result.valid ? (
                        <>
                            <div className="text-5xl mb-4">✅</div>
                            <h3 className="text-xl font-bold text-green-400 mb-2">VERIFIED AUTHENTIC</h3>
                            <div className="text-sm text-slate-300 space-y-2 font-mono">
                                <p>Student: {result.data.studentName}</p>
                                <p>Course: {result.data.courseName}</p>
                                <p>Issued: {new Date(result.data.issueDate).toLocaleDateString()}</p>
                                <p>ID: {result.data.certificateId}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-5xl mb-4">❌</div>
                            <h3 className="text-xl font-bold text-red-400">INVALID CERTIFICATE</h3>
                            <p className="text-slate-400 text-sm mt-2">This ID does not exist in our registry.</p>
                        </>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default VerifyCertificate;