import React, { useState } from 'react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <header className="mb-12 text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'Outfit' }}>
          Media<span className="text-indigo-500">Guard</span> AI
        </h1>
        <p className="text-slate-400 max-w-md">
          Next-gen digital asset protection using CLIP-based neural fingerprinting.
        </p>
      </header>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Registration Section */}
        <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm">01</span>
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
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Secure Original Asset'}
            </button>
          </form>
        </div>

        {/* Verification Section */}
        <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-sm">02</span>
            Verify Content
          </h2>
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-sky-500 transition-colors cursor-pointer bg-slate-900/50">
               <input 
                 type="file" 
                 id="verify-file" 
                 className="hidden" 
                 onChange={(e) => setVerifyFile(e.target.files[0])}
               />
               <label htmlFor="verify-file" className="cursor-pointer block mb-4">
                 {verifyFile ? (
                   <span className="text-sky-400 font-medium">{verifyFile.name}</span>
                 ) : (
                   <span className="text-slate-400 text-sm">Upload suspicious media to check authenticity</span>
                 )}
               </label>
               <button onClick={handleVerify} className="btn-primary w-full bg-slate-800" disabled={loading || !verifyFile}>
                 {loading ? 'Analyzing...' : 'Run Neural Check'}
               </button>
            </div>

            {result && (
              <div className="mt-4 p-6 rounded-2xl bg-slate-800/50 border border-indigo-500/30 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Match Results</span>
                  <span className={`status-badge ${
                    result.status.includes('Original') ? 'status-original' : 
                    result.status.includes('Modified') ? 'status-modified' : 'status-unauthorized'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Similarity Score</span>
                    <span className="font-mono text-indigo-400">{(result.score * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Matched With</span>
                    <span className="text-white font-medium">{result.matched_with}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-2xl animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
