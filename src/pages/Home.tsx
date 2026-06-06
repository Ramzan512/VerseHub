import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  Bot,
  Shield,
  Sparkles,
  ArrowRight,
  Sparkle,
  Globe,
  Trophy,
  BarChart3,
  Brain,
  Megaphone,
} from "lucide-react";
import { motion } from "motion/react";
import { TopGainersLiveFeed } from "../components/home/TopGainersLiveFeed";
import { CryptoWidget } from "../components/home/CryptoWidget";
import { FearGreedWidget } from "../components/home/FearGreedWidget";
import { CryptoLiveNewsWidget } from "../components/home/CryptoLiveNewsWidget";
import { FootballWidget } from "../components/home/FootballWidget";
import { VerseEcosystem } from "../components/home/VerseEcosystem";
import { VerseMindset } from "../components/home/VerseMindset";
import { AboutVerse } from "../components/home/AboutVerse";
import { trackEvent } from "../lib/analytics";

export default function Home() {
  const [adminAlert, setAdminAlert] = useState("");

  useEffect(() => {
    const dataStr = localStorage.getItem('adminData');
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        if (data.homepageAlert) setAdminAlert(data.homepageAlert);
      } catch(e) {}
    }
  }, []);

  const tools = [
    {
      title: "AI Chat",
      desc: "Advanced reasoning for coding, writing, and analysis. Empowered by the latest LLMs to help you solve problems quickly.",
      icon: Bot,
      path: "/chat",
      color: "text-[#00E5FF]",
      bg: "bg-[#00E5FF]/20",
      gradient: "from-[#00E5FF]/40 to-[#8B5CF6]/20",
      glow: "shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7),0_0_40px_rgba(0,229,255,0.4)]",
      img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
      borderClass: "border-2 border-[#FFD700]/70 group-hover:border-[#FFC107]",
    },
    {
      title: "AI Detector",
      desc: "Deep analysis texts to determine AI origin probabilities with advanced transparency indicators.",
      icon: Shield,
      path: "/detector",
      color: "text-[#8B5CF6]",
      bg: "bg-[#8B5CF6]/20",
      gradient: "from-[#8B5CF6]/40 to-[#00E5FF]/20",
      glow: "shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7),0_0_40px_rgba(139,92,246,0.4)]",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      borderClass: "border-2 border-[#FFD700]/70 group-hover:border-[#FFC107]",
    },
    {
      title: "Humanizer",
      desc: "Rewrite mechanical AI output into natural prose, adjusting tone and emotion contextually.",
      icon: Sparkles,
      path: "/humanizer",
      color: "text-[#EC4899]",
      bg: "bg-[#EC4899]/20",
      gradient: "from-[#EC4899]/40 to-[#8B5CF6]/20",
      glow: "shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7),0_0_40px_rgba(236,72,153,0.4)]",
      img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800",
      borderClass: "border-2 border-[#FFD700]/70 group-hover:border-[#FFC107]",
    },
    {
      title: "Web Development Tools",
      desc: "Build, customize, and deploy websites using powerful AI platforms. Access Google AI Studio, Replit, Lovable, v0 and more.",
      icon: Globe,
      path: "/tools",
      color: "text-[#3B82F6]",
      bg: "bg-[#3B82F6]/20",
      gradient: "from-[#3B82F6]/40 to-[#00E5FF]/20",
      glow: "shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7),0_0_40px_rgba(59,130,246,0.4)]",
      img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800",
      borderClass: "border-2 border-[#FFD700]/70 group-hover:border-[#FFC107]",
    },
    {
      title: "App Analytics",
      desc: "Track app users, visitor behavior, engagement metrics, retention, traffic sources, conversions and performance analytics in real time.",
      icon: BarChart3,
      path: "https://analytics.vgdh.io/",
      isExternal: true,
      color: "text-[#00E5FF]",
      bg: "bg-[#00E5FF]/20",
      gradient: "from-[#00E5FF]/40 to-[#EC4899]/20",
      glow: "shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7),0_0_40px_rgba(0,229,255,0.4)]",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      borderClass: "border-2 border-[#FFD700]/70 group-hover:border-[#FFC107]",
    },
    {
      title: "Bitcoin AI",
      desc: "Powerful Bitcoin.com AI assistant for crypto research, market analysis, trading insights, content generation and intelligent conversations.",
      icon: Brain,
      path: "https://ai.bitcoin.com/conversation/new",
      isExternal: true,
      color: "text-[#8B5CF6]",
      bg: "bg-[#8B5CF6]/20",
      gradient: "from-[#8B5CF6]/40 to-[#3B82F6]/20",
      glow: "shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7),0_0_40px_rgba(139,92,246,0.4)]",
      img: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800",
      borderClass: "border-2 border-[#FFD700]/70 group-hover:border-[#FFC107]",
    },
    {
      title: "Football Center",
      desc: "FIFA World Cup 2026 Live Hub. Groups, Standings, Live Scores and Match Details.",
      icon: Trophy,
      path: "/football",
      color: "text-blue-400",
      bg: "bg-blue-500/20",
      gradient: "from-blue-600/30 to-blue-900/10",
      glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]",
      img: "https://images.unsplash.com/photo-1508344928928-7137b29de218?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="flex flex-col pb-24 mx-auto w-full overflow-x-hidden">
      {/* Top Gainers Live Ticker (Top priority) */}
      <section className="relative w-full z-10 px-4 pt-3 md:pt-4 max-w-[1400px] mx-auto">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1, duration: 0.5 }}
        >
          <TopGainersLiveFeed />
        </motion.div>
      </section>

      <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full mt-2">
        {/* Hero Section */}
        <section className="relative w-full pt-4 pb-12 flex flex-col items-center text-center z-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-3xl"
          >
            <div className="inline-flex items-center rounded-full border border-[#00BFFF]/30 bg-[#00BFFF]/10 px-5 py-2 text-sm font-bold text-[#00FFFF] shadow-[0_0_20px_rgba(0,191,255,0.3)] hover:shadow-[0_0_30px_rgba(0,191,255,0.5)] transition-all">
              <Sparkle className="w-4 h-4 mr-2 text-[#00FFFF]" />
              Premium Intelligence Hub
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white">
              The Ultimate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#00BFFF] to-[#8A2BE2] drop-shadow-[0_0_15px_rgba(0,191,255,0.3)]">
                Digital Crypto Hub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#00FFFF]/70 leading-relaxed font-light">
              AI Tools, Crypto Markets, and Analytics — All in One Place.
            </p>
          </motion.div>
        </section>

        {adminAlert && (
           <div className="px-4 z-10 mt-[-20px] mb-4 relative max-w-3xl mx-auto w-full">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                 <Megaphone className="w-8 h-8 text-cyan-400 shrink-0 animate-pulse" />
                 <p className="font-bold tracking-wide text-sm md:text-base leading-relaxed">
                   {adminAlert}
                 </p>
              </div>
           </div>
        )}

      {/* Tools Section */}
      <section className="relative z-10 w-full px-4 mt-6">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 rounded-2xl bg-[#00BFFF]/20 border border-[#00BFFF]/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,191,255,0.4)]">
             <Bot className="w-6 h-6 text-[#00FFFF]" />
           </div>
           <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#8A2BE2] drop-shadow-[0_0_10px_rgba(0,191,255,0.3)]">AI TOOLS</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {tools.filter(t => t.title !== "Football Center").map((tool, i) => {
            const CardWrap = tool.isExternal ? "a" : Link;
            const linkProps = tool.isExternal ? { href: tool.path, target: "_blank", rel: "noopener noreferrer", className: "block h-full" } : { to: tool.path, className: "block h-full" };

            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="h-full"
                onClick={() => trackEvent('Homepage Tool Clicked', { tool: tool.title })}
              >
                <CardWrap {...(linkProps as any)}>
                  <Card
                    className={`group relative overflow-hidden h-[380px] md:h-[440px] bg-black/20 backdrop-blur-sm transition-all duration-500 cursor-pointer shadow-lg ${tool.borderClass || ''} ${tool.glow}`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={tool.img}
                        alt={tool.title}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-80"
                      />
                      {/* Glassmorphism gradient (20-30% opacity overlay) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1035]/80 via-[#0A1035]/30 to-transparent" />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} mix-blend-overlay opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-pulse`}
                      />
                    </div>
  
                    <CardContent className="relative z-10 p-5 md:p-8 h-full flex flex-col pt-6 md:pt-8">
                      <div
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-auto shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md bg-black/40 ${tool.color} border border-white/20 group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500`}
                      >
                        <tool.icon className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
  
                      <div className="mt-auto transform group-hover:-translate-y-2 transition-transform duration-500">
                        <h3
                          className={`text-2xl md:text-4xl font-black mb-2 md:mb-3 text-white drop-shadow-md tracking-tight`}
                        >
                          {tool.title}
                        </h3>
                        <p className="text-[13px] md:text-[15px] text-white/90 leading-relaxed drop-shadow-sm font-medium">
                          {tool.desc}
                        </p>
  
                        <div
                          className={`mt-4 md:mt-6 flex items-center font-bold tracking-widest text-xs md:text-sm ${tool.color} opacity-90 group-hover:opacity-100 transition-opacity uppercase`}
                        >
                          LAUNCH TOOL <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardWrap>
              </motion.div>
            );
          })}
        </div>
      </section>

      <VerseMindset />

      <VerseEcosystem />

      {/* Crypto Market Section */}
      <section className="relative z-10 w-full px-4 mt-6">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 rounded-2xl bg-[#8A2BE2]/20 border border-[#8A2BE2]/50 flex items-center justify-center shadow-[0_0_20px_rgba(138,43,226,0.4)]">
             <Globe className="w-6 h-6 text-[#00FFFF]" />
           </div>
           <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8A2BE2] via-[#00BFFF] to-[#00FFFF] drop-shadow-[0_0_10px_rgba(138,43,226,0.3)]">CRYPTO MARKET</h2>
        </div>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.15, duration: 0.5 }}
           className="flex flex-col gap-6"
        >
          <CryptoWidget />
          <FearGreedWidget />
          <CryptoLiveNewsWidget />
        </motion.div>
      </section>

      {/* Verse Football Section */}
      <section className="relative z-10 w-full px-4 mt-16">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/20 border border-[#00FF88]/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.4)]">
             <Trophy className="w-6 h-6 text-[#00FF88]" />
           </div>
           <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00FFFF] drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">VERSE FOOTBALL</h2>
        </div>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.5 }}
        >
           <FootballWidget />
        </motion.div>
      </section>

      {/* About Verse Section */}
      <AboutVerse />
      </div>
    </div>
  );
}
