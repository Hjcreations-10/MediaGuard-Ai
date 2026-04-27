import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Upload, Search, CheckCircle, AlertTriangle, 
  FileText, Globe, LayoutDashboard, ShieldCheck, 
  Skull, FileCheck, Settings, Bell, Plus, User, Info, 
  ArrowRight, Activity
} from 'lucide-react';

const API_BASE = 'https://mediaguard-backend-754243926127.us-central1.run.app';

function App() {
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  
  // Registration State
  const [regFile, setRegFile] = useState(null);
  const [assetName, setAssetName] = useState('');
  
  // Verification State
  const [verifyFile, setVerifyFile] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await fetch(`${API_BASE}/assets`);
      const data = await res.json();
      if (data.assets) setAssets(data.assets.map((name, i) => ({ 
        id: i, 
        name, 
        status: 'Protected', 
        time: 'Just now',
        color: 'badge-authentic'
      })));
    } catch (err) {
      console.error('Failed to fetch assets');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regFile || !assetName) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', regFile);
    formData.append('name', assetName);

    try {
      const res = await fetch(`${API_BASE}/register`, { method: 'POST', body: formData });
      const data = await res.json();
      setMessage(data.message || 'Asset Secured!');
      setRegFile(null);
      setAssetName('');
      fetchAssets();
    } catch (err) {
      setMessage('Registration failed.');
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
      setVerifyFile(null);
    } catch (err) {
      setMessage('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Sidebar - Sleeker */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center shadow-lg">
             <Shield className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Media<span className="text-emerald-500">Guard</span></span>
        </div>

        <nav className="space-y-1">
          <button className="nav-link w-full active"><LayoutDashboard size={20} /> Dashboard</button>
          <button className="nav-link w-full"><ShieldCheck size={20} /> Vault</button>
          <button className="nav-link w-full"><Skull size={20} /> Forensics</button>
          <button className="nav-link w-full mt-auto"><Settings size={20} /> Settings</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="flex items-center justify-between mb-10 gap-10">
          {/* MASSIVE SEARCH BAR */}
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
            <input 
              type="text" 
              placeholder="Search global asset database..." 
              className="w-full h-16 bg-slate-900/50 border border-white/5 rounded-2xl pl-14 pr-6 text-lg focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center relative cursor-pointer hover:bg-white/5">
              <Bell size={24} className="text-slate-400" />
              <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950" />
            </div>
            <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
              <img src="https://ui-avatars.com/api/?name=Alex+R&background=10b981&color=fff" alt="Profile" className="w-10 h-10 rounded-lg" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8 mb-12">
           <div className="col-span-12">
              <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Security Command Center</h1>
              <p className="text-slate-400 text-lg">Manage, protect, and verify your digital assets with neural-sync technology.</p>
           </div>
        </div>

        {/* SIDE-BY-SIDE CORE ACTIONS */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          
          {/* LEFT: REGISTER ASSET */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 opacity-5">
              <Shield size={200} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center"><Plus size={18} /></div>
               Register New Asset
            </h2>
            <p className="text-slate-500 mb-8 text-sm">Secure an original file by creating a permanent neural fingerprint.</p>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  required
                  className="w-full h-14 bg-slate-950/50 border border-white/5 rounded-xl pl-12 pr-4 focus:border-emerald-500/50 outline-none transition-all"
                  placeholder="Asset Name (e.g. Logo V2 Final)"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </div>

              <label className="block p-8 border-2 border-dashed border-white/5 rounded-2xl text-center cursor-pointer hover:border-emerald-500/30 transition-all bg-slate-950/20 group">
                <input type="file" className="hidden" onChange={(e) => setRegFile(e.target.files[0])} />
                {regFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="text-emerald-500 mb-2" />
                    <span className="text-emerald-400 font-bold">{regFile.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload size={24} className="mx-auto mb-3 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                    <p className="text-slate-500 font-medium text-sm">Drop original media</p>
                  </>
                )}
              </label>

              <button type="submit" className="btn-premium btn-emerald w-full h-14 text-lg" disabled={loading || !regFile}>
                {loading ? 'Neural Syncing...' : 'Secure Asset Now'}
              </button>
            </form>
          </motion.div>

          {/* RIGHT: VERIFY CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 opacity-5">
              <Search size={200} className="text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center"><Search size={18} /></div>
               Verify Content
            </h2>
            <p className="text-slate-500 mb-8 text-sm">Check a suspicious file for unauthorized modifications.</p>

            <div className="space-y-6">
              <label className="block p-14 border-2 border-dashed border-white/5 rounded-2xl text-center cursor-pointer hover:border-sky-500/30 transition-all bg-slate-950/20 group">
                <input type="file" className="hidden" onChange={(e) => setVerifyFile(e.target.files[0])} />
                {verifyFile ? (
                   <div className="flex flex-col items-center">
                    <FileText className="text-sky-400 mb-2" />
                    <span className="text-sky-400 font-bold">{verifyFile.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="mx-auto mb-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
                    <p className="text-slate-500 font-bold">Drag suspicious media here</p>
                    <p className="text-xs text-slate-600 mt-1">AI will analyze visual consistency</p>
                  </>
                )}
              </label>

              <button onClick={handleVerify} className="btn-premium btn-primary w-full h-14 text-lg bg-sky-600 shadow-sky-500/20" disabled={loading || !verifyFile}>
                {loading ? 'Neural Analysis...' : 'Run Neural Check'}
              </button>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM: ASSET DATABASE & TRENDS */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* DATABASE LIST */}
          <div className="col-span-4">
            <div className="glass-card p-6 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Protected Assets</h3>
                <span className="text-xs bg-white/5 px-2 py-1 rounded text-slate-500">{filteredAssets.length} Total</span>
              </div>
              <div className="space-y-3">
                {filteredAssets.length > 0 ? filteredAssets.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/0 hover:border-white/5 transition-all">
                    <div className="flex items-center gap-3 truncate">
                      <FileText size={16} className="text-slate-500 shrink-0" />
                      <span className="text-sm font-medium truncate">{a.name}</span>
                    </div>
                    <span className="badge badge-authentic text-[10px]">Safe</span>
                  </div>
                )) : (
                  <div className="text-center py-20 text-slate-600">
                    <Info size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">No Matches</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STATS & TRENDS */}
          <div className="col-span-8 grid grid-cols-2 gap-8">
            <div className="glass-card p-8 flex flex-col justify-between">
               <div>
                  <Activity className="text-emerald-400 mb-4" />
                  <h3 className="text-xl font-bold">System Health</h3>
                  <p className="text-slate-500 text-sm">Neural network status: Optimal</p>
               </div>
               <div className="mt-6 flex items-end gap-1 h-12">
                  {[40, 70, 45, 90, 65, 80, 50, 75, 40, 60].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm relative group">
                       <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }} />
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-card p-8 flex flex-col justify-between bg-gradient-to-br from-indigo-500/10 to-transparent">
               <div>
                  <Globe className="text-sky-400 mb-4" />
                  <h3 className="text-xl font-bold">Global Reach</h3>
                  <p className="text-slate-500 text-sm">CDN Edge Nodes active in 14 regions.</p>
               </div>
               <div className="flex items-center justify-between mt-6">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Uptime</div>
               </div>
            </div>
          </div>

        </div>
      </main>

      {/* RESULT MODAL */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
            onClick={() => setResult(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="glass-card p-12 max-w-xl w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 ${
                result.score > 0.9 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {result.score > 0.9 ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
              </div>
              
              <h2 className="text-4xl font-extrabold mb-2">Neural Scan Result</h2>
              <p className="text-slate-500 mb-10">Comparison against global asset fingerprints.</p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Confidence</p>
                   <p className={`text-4xl font-black ${result.score > 0.9 ? 'text-emerald-400' : 'text-rose-400'}`}>{(result.score * 100).toFixed(1)}%</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</p>
                   <span className={`badge h-10 px-6 text-base ${
                      result.status.includes('Original') ? 'badge-authentic' : 
                      result.status.includes('Modified') ? 'badge-tampered' : 'badge-suspicious'
                    }`}>{result.status}</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 flex items-center justify-between mb-10">
                <div className="text-left">
                   <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Matched With</p>
                   <p className="font-bold text-lg">{result.matched_with}</p>
                </div>
                <ArrowRight className="text-slate-700" />
              </div>

              <button onClick={() => setResult(null)} className="btn-premium btn-primary w-full h-16 text-xl">
                Return to Command Center
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-10 right-10 px-10 py-5 bg-emerald-600 text-white font-bold rounded-2xl shadow-2xl z-[400] flex items-center gap-4"
          >
            <Shield size={24} /> {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
