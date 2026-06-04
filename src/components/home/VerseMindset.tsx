import { motion } from 'framer-motion';
import { Target, Brain, Zap, TrendingUp, Crown } from 'lucide-react';

export function VerseMindset() {
  const mindsets = [
    {
      title: "FOCUS",
      desc: "Stay focused. Every click builds your future.",
      icon: Target,
      color: "from-cyan-400 to-blue-500",
      glow: "rgba(34,211,238,0.5)"
    },
    {
      title: "STRATEGY",
      desc: "Think long term. Winners play the smart game.",
      icon: Brain,
      color: "from-purple-400 to-pink-500",
      glow: "rgba(192,132,252,0.5)"
    },
    {
      title: "DISCIPLINE",
      desc: "Consistency beats motivation.",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      glow: "rgba(250,204,21,0.5)"
    },
    {
      title: "GROWTH",
      desc: "Learn, Build, Earn, Repeat.",
      icon: TrendingUp,
      color: "from-green-400 to-emerald-500",
      glow: "rgba(74,222,128,0.5)"
    },
    {
      title: "SUCCESS",
      desc: "Small actions today create massive results tomorrow.",
      icon: Crown,
      color: "from-blue-400 to-indigo-500",
      glow: "rgba(96,165,250,0.5)"
    }
  ];

  return (
    <section className="relative z-10 w-full px-4 mt-20 mb-8 overflow-hidden">
      {/* Background Particles/Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent blur-[100px] rounded-full" />
      </div>

      <div className="flex flex-col items-center text-center justify-center gap-4 mb-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] tracking-wide flex items-center justify-center gap-3">
          <img src="https://i.postimg.cc/mg6FZkJH/IMG-20260531-120027.png" alt="Verse Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          VERSE MINDSET
        </h2>
        <p className="text-white/80 font-medium max-w-2xl text-lg tracking-widest uppercase">
          Build. Learn. Earn. Repeat.
        </p>
      </div>

      {/* Auto-sliding Cards Wrapper */}
      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[50px] sm:before:w-[150px] before:bg-gradient-to-r before:from-[#050816] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[50px] sm:after:w-[150px] after:bg-gradient-to-l after:from-[#050816] after:to-transparent">
        <div className="flex w-max animate-[slide_30s_linear_infinite] hover:[animation-play-state:paused] gap-6 px-4">
          {/* Double the items for seamless loop */}
          {[...mindsets, ...mindsets].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="w-[280px] sm:w-[320px] shrink-0 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative group overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:bg-white/10"
                style={{ boxShadow: `0 0 20px ${item.glow.replace('0.5', '0.1')}` }}
              >
                {/* Hover Glow Edge */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl border-2 pointer-events-none"
                  style={{ borderColor: item.glow.replace('0.5', '0.8') }}
                />
                
                <div 
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${item.color} shadow-lg`}
                  style={{ boxShadow: `0 0 20px ${item.glow}` }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{item.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); } /* 50% is half of duplicated items + half gap */
          }
        `}} />
      </div>
    </section>
  );
}
