import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Upload, Search, CheckCircle, AlertTriangle, FileText, Globe } from 'lucide-react';

const API_BASE = 'https://mediaguard-backend-754243926127.us-central1.run.app';

function App() {
  const [regFile, setRegFile] = useState(null);
  const [verifyFile, setVerifyFile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regFile || !name) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', regFile);
    formData.append('name', name);

    try {
      const res = await fetch(`${API_BASE}/register`, { method: 'POST', body: formData });
      const data = await res.json();
      setMessage(data.message);
      setResult(null);
    } catch (err) {
      setMessage('Registration failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', verifyFile);

    try {
      const res = await fetch(`${API_BASE}/verify`, { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
      setMessage('');
    } catch (err) {
      setMessage('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
          <Globe size={14} /> Global Asset Protection
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400" style={{ fontFamily: 'Outfit' }}>
          Media<span className="text-indigo-500">Guard</span> AI
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-lg">
          Enterprise-grade digital asset fingerprinting powered by <span className="text-white font-semibold">CLIP Neural Networks</span>.
        </p>
      </motion.header>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10">
        {/* Registration Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield size={120} className="text-indigo-500" />
          </div>
          
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/40 flex items-center justify-center text-lg">
              <Upload size={20} />
            </div>
            Register Asset
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">Asset Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Official Logo V1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
              <input 
                type="file" 
                id="reg-file" 
                className="hidden" 
                onChange={(e) => setRegFile(e.target.files[0])}
              />
              <label htmlFor="reg-file" className="cursor-pointer">
                {regFile ? <span className="text-indigo-400 font-medium">{regFile.name}</span> : 'Click to upload original image'}
              </label>
            </div>
            <button type="submit" className="btn-primary w-full h-14 text-lg" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Securing...
                </div>
              ) : 'Secure Original Asset'}
            </button>
          </form>
        </motion.div>

        {/* Verification Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Search size={120} className="text-sky-500" />
          </div>

          <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500 shadow-lg shadow-sky-500/40 flex items-center justify-center text-lg">
              <Search size={20} />
            </div>
            Verify Content
          </h2>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-700 rounded-3xl p-10 text-center hover:border-sky-500 transition-all duration-300 group cursor-pointer bg-slate-900/30">
               <input 
                 type="file" 
                 id="verify-file" 
                 className="hidden" 
                 onChange={(e) => setVerifyFile(e.target.files[0])}
               />
               <label htmlFor="verify-file" className="cursor-pointer block">
                 <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-500/20 transition-colors">
                    <FileText size={24} className="text-slate-400 group-hover:text-sky-400" />
                 </div>
                 {verifyFile ? (
                   <span className="text-sky-400 font-bold text-lg block mb-2">{verifyFile.name}</span>
                 ) : (
                   <div className="space-y-1">
                     <p className="text-slate-200 font-medium">Drop suspicious media here</p>
                     <p className="text-slate-500 text-sm">AI will analyze visual consistency</p>
                   </div>
                 )}
               </label>
            </div>

            <button onClick={handleVerify} className="btn-primary w-full h-14 bg-slate-800 text-lg border border-slate-700 hover:border-sky-500" disabled={loading || !verifyFile}>
              {loading ? 'Neural Analysis in Progress...' : 'Run Neural Check'}
            </button>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-8 rounded-3xl bg-slate-950/50 border border-white/5 shadow-inner"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <CheckCircle size={14} /> Match Confidence
                    </span>
                    <span className={`status-badge ${
                      result.status.includes('Original') ? 'status-original' : 
                      result.status.includes('Modified') ? 'status-modified' : 'status-unauthorized'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-slate-500 text-xs uppercase mb-1">Similarity</p>
                      <p className="text-2xl font-mono text-indigo-400 font-bold">{(result.score * 100).toFixed(2)}%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-slate-500 text-xs uppercase mb-1">Matched Asset</p>
                      <p className="text-white font-bold truncate">{result.matched_with}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-2xl z-50 flex items-center gap-3"
          >
            <AlertTriangle size={20} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
