import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Footer } from './Footer';

export default function AppLayout() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'AI Tools', path: '/chat' },
    { name: 'News Hub', path: '/news' },
    { name: 'Football Center', path: '/football' },
    { name: 'Verse Community', path: 'https://verse.bitcoin.com/', isExternal: true },
    { name: 'Events Hub', path: 'https://t.me/GetVerse/379189', isExternal: true },
    { name: 'Admin Panel', path: '/admin' },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative w-full overflow-x-hidden">
      {/* Premium Header */}
      <header className="h-20 lg:h-24 sticky top-0 z-50 flex items-center justify-between px-4 lg:px-8 bg-[#050816]/80 backdrop-blur-xl border-b border-[#00BFFF]/20 shadow-[0_4px_30px_rgba(0,191,255,0.15)]">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00BFFF]/50 to-transparent shadow-[0_0_15px_rgba(0,191,255,0.8)]" />
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#00BFFF] rounded-full blur-md opacity-40 animate-pulse" />
            <img 
              src="https://i.postimg.cc/mg6FZkJH/IMG-20260531-120027.png" 
              alt="Verse Logo" 
              className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] rounded-full object-contain relative z-10 shadow-[0_0_15px_rgba(0,191,255,0.6)]" 
            />
          </div>
          <span className="text-[#00BFFF] font-[800] text-[22px] tracking-tight flex items-center leading-none drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]">
            VERSE HUB
          </span>
        </Link>
        
        {/* Right Side: Hamburger Menu */}
        <div className="relative" ref={menuRef}>
          <button 
            className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#00BFFF]/20 to-[#8A2BE2]/20 backdrop-blur-md border border-[#00BFFF]/30 flex items-center justify-center text-[#00FFFF] hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5 text-[#00FFFF]" />
          </button>

          {/* Glassmorphism Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-64 lg:w-72 bg-gradient-to-b from-[#081530]/95 to-[#0A1035]/95 backdrop-blur-2xl border border-[#00BFFF]/20 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-4 duration-200">
               <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
                 {navItems.map((item, idx) => {
                   if (item.isExternal) {
                     return (
                       <a 
                         key={`${item.name}-${idx}`} 
                         href={item.path}
                         target="_blank"
                         rel="noopener noreferrer"
                         onClick={() => setIsMenuOpen(false)}
                         className="block w-full text-left px-4 py-3 rounded-xl text-sm lg:text-base font-semibold text-white/80 hover:text-[#00FFFF] hover:bg-white/5 hover:shadow-[inset_0_0_15px_rgba(0,191,255,0.2)] transition-all"
                       >
                         {item.name}
                       </a>
                     );
                   }
                   return (
                     <Link 
                       key={`${item.name}-${idx}`} 
                       to={item.path}
                       onClick={() => setIsMenuOpen(false)}
                       className="block w-full text-left px-4 py-3 rounded-xl text-sm lg:text-base font-semibold text-white/80 hover:text-[#00FFFF] hover:bg-white/5 hover:shadow-[inset_0_0_15px_rgba(0,191,255,0.2)] transition-all"
                     >
                       {item.name}
                     </Link>
                   );
                 })}
               </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full h-full p-4 lg:p-8">
        <div className="max-w-7xl mx-auto h-full flex flex-col w-full">
          {location.pathname !== '/' && (
            <div className="mb-6 lg:mb-8 z-20 flex-shrink-0">
              <Link to="/">
                <Button 
                  variant="ghost" 
                  className="group bg-[#050b14]/50 border border-purple-500/20 text-purple-200 hover:text-white hover:bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] rounded-2xl backdrop-blur-xl h-11 px-5 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-bold tracking-wide">Back to Home</span>
                </Button>
              </Link>
            </div>
          )}
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
