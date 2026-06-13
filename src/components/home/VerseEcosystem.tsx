import { Card, CardContent } from "../ui/card";
import { Send, Twitter, Calendar, Code, Globe, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../ui/button";

export function VerseEcosystem() {
  const cards = [
    {
      title: "Verse Community",
      desc: "Join the official Verse Telegram community and connect with builders, traders, developers and community members from around the world.",
      btn: "Join Community",
      link: "https://t.me/GetVerse",
      icon: Send,
      badge: "OFFICIAL",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/50",
      colors: "from-[#00E5FF]/20 to-[#8B5CF6]/20",
      iconColor: "text-[#00E5FF]",
      border: "border-[#FFD700]",
      pulse: true
    },
    {
      title: "Verse X Updates",
      desc: "Follow the official Verse Ecosystem X account for announcements, ecosystem updates, campaigns, partnerships and community news.",
      btn: "Follow X",
      link: "https://x.com/VerseEcosystem",
      icon: Twitter,
      badge: "OFFICIAL",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/50",
      colors: "from-[#8B5CF6]/20 to-[#FFD700]/20",
      iconColor: "text-[#8B5CF6]",
      border: "border-[#FFD700]"
    },
    {
      title: "Verse Events & Campaigns",
      desc: "Discover ongoing Verse campaigns, ecosystem events, community activities, rewards and special announcements.",
      btn: "View Event",
      link: "https://t.me/GetVerse/379189",
      icon: Calendar,
      badge: "LIVE EVENT",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/50",
      colors: "from-[#FFD700]/20 to-[#00E5FF]/20",
      iconColor: "text-[#FFD700]",
      border: "border-[#FFD700]",
      pulse: true
    },
    {
      title: "Vibe Coding Community",
      desc: "Join the Verse Vibe Coding community to learn website development, AI tools, vibe coding techniques and earn rewards while building real projects.",
      btn: "Start Learning",
      link: "https://t.me/GetVerse/486213",
      icon: Code,
      badge: "REWARDS AVAILABLE",
      badgeColor: "bg-green-500/20 text-green-400 border-green-500/50",
      colors: "from-[#00E5FF]/20 to-[#8B5CF6]/20",
      iconColor: "text-[#00FF88]",
      border: "border-[#FFD700]"
    },
    {
      title: "About Verse Ecosystem",
      desc: "VERSE is Bitcoin.com's reward and utility token powering a growing ecosystem of Web3 products, community rewards, DeFi tools and educational resources. Learn about the ecosystem, token utility and future roadmap.",
      btn: "Visit Website",
      link: "https://verse.bitcoin.com/",
      icon: Globe,
      badge: "OFFICIAL",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/50",
      colors: "from-[#8B5CF6]/20 to-[#00E5FF]/20",
      iconColor: "text-[#00E5FF]",
      border: "border-[#FFD700]"
    }
  ];

  return (
    <section className="relative z-10 w-full px-4 mt-8 mb-16">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-[50px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-40 h-40 bg-[#8B5CF6]/10 rounded-full blur-[60px] animate-pulse delay-700" />
        <div className="absolute top-[50%] left-[50%] w-24 h-24 bg-[#FFD700]/10 rounded-full blur-[40px] animate-pulse delay-1000" />
      </div>

      <div className="flex flex-col items-center text-center justify-center gap-4 mb-12 relative z-10">
        <h2 className="flex items-center justify-center gap-3 text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FFD700] drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] tracking-wide">
          <img src="https://i.postimg.cc/mg6FZkJH/IMG-20260531-120027.png" alt="Verse Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          VERSE ECOSYSTEM
        </h2>
        <p className="text-text-muted font-medium max-w-2xl text-sm md:text-base">
          Connect with the official Verse community, discover events, learn about the ecosystem and stay updated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className={idx === 4 ? "md:col-span-2 lg:col-span-1" : ""}
          >
            <a href={card.link} target="_blank" rel="noopener noreferrer" className="block h-full group">
              <Card className={`h-full bg-gradient-to-br ${card.colors} border-2 ${card.border} backdrop-blur-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] rounded-[2rem] overflow-hidden relative transition-all duration-500 hover:-translate-y-2`}>
                <div className="absolute inset-0 bg-card-hover backdrop-blur-sm z-0 pointer-events-none" />
                
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <CardContent className="p-6 relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-500 ${card.pulse ? 'animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.4)]' : ''}`}>
                        <card.icon className={`w-7 h-7 ${card.iconColor} drop-shadow-md`} />
                      </div>
                    </div>
                    {card.badge && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${card.badgeColor} uppercase shadow-sm`}>
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-text mb-3 group-hover:text-[#FFD700] transition-colors">{card.title}</h3>
                  <p className="text-text-muted text-sm font-medium leading-relaxed mb-6 flex-1">{card.desc}</p>

                  <div className="mt-auto pt-4 border-t border-border">
                    <Button className="w-full rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] text-text font-bold shadow-[0_0_15px_rgba(255,215,0,0.4)] border border-[#FFD700] transition-all group-hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]">
                      {card.btn}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
