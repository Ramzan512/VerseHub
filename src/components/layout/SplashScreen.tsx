import React from 'react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#050816] via-[#081530] to-black">
      {/* Background Animated Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
         <div className="absolute top-[40%] right-[10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }} />
         <div className="absolute bottom-[10%] left-[30%] w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s', animationDuration: '6s' }} />
      </div>

      {/* Top spacer for alignment */}
      <div className="flex-1" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-8">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-700"></div>
          <img 
            src="https://i.postimg.cc/mg6FZkJH/IMG-20260531-120027.png" 
            alt="Verse Hub Logo" 
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-full shadow-[0_0_40px_rgba(34,211,238,0.4)] animate-pulse"
            style={{ animationDuration: '2s' }}
          />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-4 [text-shadow:0_0_20px_rgba(34,211,238,0.5)]">
          VERSE HUB
        </h1>
        
        <p className="text-cyan-100 text-sm sm:text-base md:text-lg font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-80 text-center px-4">
          Digital Intelligence Platform
        </p>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end w-full px-8 pb-12 animate-in fade-in duration-1000 slide-in-from-bottom-4 delay-300">
        <div className="w-full max-w-[240px] sm:max-w-xs mb-8 relative">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full w-full animate-[loading_2s_ease-in-out_infinite]" style={{ transformOrigin: 'left' }} />
          </div>
          {/* Custom style for loading animation */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes loading {
              0% { transform: scaleX(0); opacity: 1; }
              50% { transform: scaleX(1); opacity: 1; }
              100% { transform: scaleX(1); opacity: 0; }
            }
          `}} />
        </div>

        <p className="text-gray-400 text-xs sm:text-sm font-medium tracking-widest text-center mb-12 uppercase flex flex-wrap justify-center gap-2 sm:gap-3 px-4 leading-loose">
           <span>AI Tools</span>
           <span className="text-text-muted">•</span>
           <span>Crypto Markets</span>
           <span className="text-text-muted">•</span>
           <span>News</span>
           <span className="text-text-muted">•</span>
           <span>Football</span>
           <span className="text-text-muted">•</span>
           <span>Analytics</span>
        </p>

        <p className="text-text-muted text-[10px] sm:text-xs font-mono tracking-widest uppercase">
          Powered by Verse Ecosystem
        </p>
      </div>
    </div>
  );
}
