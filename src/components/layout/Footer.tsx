import { ArrowUp, Twitter, Globe, Info, Activity, LineChart, Search, Wallet, Send } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-auto border-t border-yellow-500/30 bg-gradient-to-b from-[#0B1221]/90 to-black/95 backdrop-blur-xl pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-12 w-full">
      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_15px_rgba(250,204,21,0.5)]" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-8 mb-16">
          
          {/* LEGAL */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              LEGAL
            </h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer', 'Sitemap'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm font-medium transition-colors hover:translate-x-1 inline-block transform duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* VERSE ECOSYSTEM */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
              VERSE ECOSYSTEM
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4">
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm font-medium transition-colors group">
                <Info className="w-4 h-4 group-hover:scale-110 transition-transform" /> What is VERSE
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm font-medium transition-colors group">
                <Activity className="w-4 h-4 group-hover:scale-110 transition-transform" /> VERSE Utility
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm font-medium transition-colors group">
                <LineChart className="w-4 h-4 group-hover:scale-110 transition-transform" /> Buyback & Burn
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm font-medium transition-colors group">
                <Send className="w-4 h-4 group-hover:scale-110 transition-transform" /> Verse DEX
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm font-medium transition-colors group">
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" /> Verse Explorer
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm font-medium transition-colors group">
                <Wallet className="w-4 h-4 group-hover:scale-110 transition-transform" /> Bitcoin.com Wallet
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="relative pt-16 pb-8 flex flex-col items-center justify-center gap-8 mt-12">
          {/* Glowing Divider */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)]" />

          <div className="text-center w-full flex flex-col items-center gap-2">
            <p className="text-white text-lg sm:text-xl font-bold tracking-wide [text-shadow:0_0_15px_rgba(34,211,238,0.6)]">
              © 2026 Verse Hub
            </p>
            <p className="text-gray-300 text-sm sm:text-base font-medium">
              All Rights Reserved • Powered by Verse Ecosystem
            </p>
          </div>

          {/* Scroll To Top */}
          <button 
            onClick={scrollToTop}
            className="absolute left-1/2 -top-6 -translate-x-1/2 w-12 h-12 rounded-full bg-[#050816] border border-cyan-500/50 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300 group z-10 shadow-lg backdrop-blur-md"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
