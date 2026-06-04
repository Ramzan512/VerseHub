import { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Settings, ShieldCheck, AlertCircle, RefreshCw, Key, Zap, CheckCircle2, Activity, LogOut, Edit3, Plus, Trash2, Pin, EyeOff, CheckSquare, Save } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [announcement, setAnnouncement] = useState('');
  const [eventNotice, setEventNotice] = useState('');
  const [homepageAlert, setHomepageAlert] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      
      const adminDataStr = localStorage.getItem('adminData');
      if (adminDataStr) {
        try {
          const data = JSON.parse(adminDataStr);
          setAnnouncement(data.announcement || '');
          setEventNotice(data.eventNotice || '');
          setHomepageAlert(data.homepageAlert || '');
        } catch(e) {}
      }
    }
  }, []);

  const saveAdminData = () => {
    const data = {
      announcement,
      eventNotice,
      homepageAlert
    };
    localStorage.setItem('adminData', JSON.stringify(data));
    alert('Settings saved successfully!');
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === '2580') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setError(null);
      const adminDataStr = localStorage.getItem('adminData');
      if (adminDataStr) {
        try {
          const data = JSON.parse(adminDataStr);
          setAnnouncement(data.announcement || '');
          setEventNotice(data.eventNotice || '');
          setHomepageAlert(data.homepageAlert || '');
        } catch(e) {}
      }
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-[#0B1221] to-[#160E2A] border-[#00BFFF]/30 shadow-[0_0_30px_rgba(0,191,255,0.15)]">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-[#00BFFF]/20 rounded-full flex items-center justify-center mb-4 border border-[#00BFFF]/50">
                <ShieldCheck className="w-8 h-8 text-[#00FFFF]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-white/60 text-sm">Enter password to access admin controls</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00BFFF] focus:ring-1 focus:ring-[#00BFFF] transition-all text-center tracking-widest text-lg"
                  placeholder="••••"
                  autoFocus
                />
              </div>
              {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
              <Button type="submit" className="w-full bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-black font-bold h-12 rounded-xl text-lg transition-all shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:shadow-[0_0_25px_rgba(0,191,255,0.5)]">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-6 pb-20 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <Settings className="w-8 h-8 text-[#00FFFF]" /> Admin Dashboard
          </h1>
          <p className="text-white/60 mt-2 text-lg">Manage platform content and settings.</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Announcement Manager */}
        <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
               <AlertCircle className="w-5 h-5 text-yellow-400" /> Announcements
            </h3>
            <div className="space-y-4">
               <textarea
                 value={announcement}
                 onChange={(e) => setAnnouncement(e.target.value)}
                 className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500/50 focus:outline-none min-h-[100px]"
                 placeholder="Enter announcement text..."
               />
            </div>
          </CardContent>
        </Card>

        {/* 2. Events Manager */}
        <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
               <Activity className="w-5 h-5 text-purple-400" /> Events & Notices
            </h3>
            <div className="space-y-4">
               <textarea
                 value={eventNotice}
                 onChange={(e) => setEventNotice(e.target.value)}
                 className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 focus:outline-none min-h-[100px]"
                 placeholder="Enter event details or notices..."
               />
            </div>
          </CardContent>
        </Card>

        {/* 3. Homepage Alerts */}
        <Card className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
               <Edit3 className="w-5 h-5 text-cyan-400" /> Homepage Alert Box
            </h3>
            <div className="space-y-4">
               <textarea
                 value={homepageAlert}
                 onChange={(e) => setHomepageAlert(e.target.value)}
                 className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500/50 focus:outline-none min-h-[100px]"
                 placeholder="Important alert banner for homepage..."
               />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-12">
         <Button onClick={saveAdminData} className="px-8 py-6 text-lg font-bold bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
           <Save className="w-6 h-6" /> Save All Changes
         </Button>
      </div>
    </div>
  );
}
