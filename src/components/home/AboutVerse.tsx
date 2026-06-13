import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Globe,
  BookOpen,
  Twitter,
  Send,
  Calendar,
  Code,
  Info,
  ShieldCheck,
  Wrench,
  Layers,
  Flame,
  TrendingDown,
  Wallet,
  Users,
  BookOpenCheck,
  Link as LinkIcon
} from "lucide-react";

export function AboutVerse() {
  const infoCards = [
    {
      title: "About VERSE",
      icon: Info,
      content: "Bitcoin.com's rewards and utility token designed to accelerate global crypto adoption through incentives, gamification and self-custody. Integrated across the Bitcoin.com ecosystem with millions of users worldwide."
    },
    {
      title: "Why VERSE Is Different",
      icon: ShieldCheck,
      content: "VERSE is directly integrated into Bitcoin.com products and services, making it accessible to millions of users. It helps onboard newcomers into DeFi, Web3 and decentralized finance."
    },
    {
      title: "VERSE Token Utility",
      icon: Wrench,
      bullets: [
        "Earn rewards",
        "Unlock ecosystem perks",
        "Access premium features",
        "Participate in dApps",
        "Support Web3 engagement",
        "Micro-rewards system powered by fxVERSE on Polygon"
      ]
    },
    {
      title: "Ecosystem Components",
      icon: Layers,
      bullets: [
        "Bitcoin.com Wallet",
        "Verse Explorer",
        "Verse DEX",
        "Verse Voyager NFT Platform",
        "Educational Web3 dApps",
        "Community Reward Systems"
      ]
    },
    {
      title: "Buyback & Burn Engine",
      icon: Flame,
      content: "Bitcoin.com periodically acquires VERSE from markets and routes it to the Verse Burn Engine. Tokens accumulate and are permanently removed from circulation through transparent burn events."
    },
    {
      title: "Sustainable Supply Reduction",
      icon: TrendingDown,
      content: "A portion of ecosystem activity contributes to long-term supply reduction through the Verse Burn Engine, helping maintain a sustainable token economy."
    }
  ];

  const statCards = [
    { title: "50M+", subtitle: "Wallets Created", icon: Wallet },
    { title: "2.5M+", subtitle: "Monthly Readers", icon: BookOpenCheck },
    { title: "Global", subtitle: "Community", icon: Users },
    { title: "Multi-Chain", subtitle: "Ecosystem", icon: LinkIcon }
  ];

  const links = [
    { name: "Official Website", url: "https://verse.bitcoin.com/", icon: Globe, color: "from-blue-600 to-blue-400" },
    { name: "X Profile", url: "https://x.com/VerseEcosystem", icon: Twitter, color: "from-sky-600 to-sky-400" },
    { name: "Telegram Community", url: "https://t.me/GetVerse", icon: Send, color: "from-indigo-600 to-indigo-400" }
  ];

  return (
    <section className="relative z-10 w-full px-4 mt-8 mb-24">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-[#00D4FF]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[20%] w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center text-center justify-center gap-4 mb-12 relative z-10">
         <h2 className="flex items-center justify-center gap-3 text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#FFD700] drop-shadow-[0_0_15px_rgba(0,212,255,0.4)] tracking-wide">
           <img src="https://i.postimg.cc/mg6FZkJH/IMG-20260531-120027.png" alt="Verse Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
           ABOUT VERSE ECOSYSTEM
         </h2>
         <p className="text-text-muted font-medium max-w-2xl text-sm md:text-base">
           Discover the engine powering Bitcoin.com's gamified Web3 ecosystem, uniting millions of users through utility, rewards, and decentralized finance.
         </p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-12">
        {infoCards.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <Card className="h-full bg-gradient-to-br from-[#0B1F45]/80 to-[#111827]/80 backdrop-blur-xl border border-[#FFD700]/30 hover:border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-300 rounded-[2rem] overflow-hidden group">
              <CardContent className="p-6 h-full flex flex-col relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-card border border-[#8B5CF6]/50 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.2)] group-hover:scale-110 transition-transform duration-300">
                     <item.icon className="w-6 h-6 text-[#00D4FF]" />
                  </div>
                  <h3 className="text-xl font-bold text-text leading-tight group-hover:text-[#FFD700] transition-colors">{item.title}</h3>
                </div>

                {item.content && (
                  <p className="text-text-muted text-sm leading-relaxed flex-1">{item.content}</p>
                )}

                {item.bullets && (
                  <ul className="space-y-2 flex-1 mt-2">
                    {item.bullets.map((bullet, i) => (
                      <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                        <span className="text-[#00FF88] mt-1 text-[10px]">●</span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 mb-12">
        {statCards.map((stat, idx) => (
          <motion.div
             key={idx}
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 + (idx * 0.1), duration: 0.4 }}
          >
             <Card className="bg-card-hover backdrop-blur-md border border-[#00D4FF]/30 hover:border-[#00D4FF]/70 shadow-[0_0_15px_rgba(0,212,255,0.1)] rounded-2xl overflow-hidden group">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
                   <div className="w-10 h-10 rounded-full bg-[#00D4FF]/10 flex items-center justify-center mb-1 group-hover:bg-[#00D4FF]/20 transition-colors">
                      <stat.icon className="w-5 h-5 text-[#00D4FF]" />
                   </div>
                   <h4 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-md">{stat.title}</h4>
                   <p className="text-[#00FF88] text-xs md:text-sm font-bold uppercase tracking-wider">{stat.subtitle}</p>
                </CardContent>
             </Card>
          </motion.div>
        ))}
      </div>

      {/* Official Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 max-w-4xl mx-auto">
        {links.map((link, idx) => (
          <motion.div
             key={idx}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 + (idx * 0.05), duration: 0.4 }}
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full">
               <Button className={`w-full h-auto py-4 px-3 flex flex-col items-center justify-center gap-3 bg-gradient-to-b ${link.color} hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-border rounded-xl transition-all duration-300 hover:-translate-y-1`}>
                  <link.icon className="w-6 h-6 text-text" />
                  <span className="text-text text-xs md:text-sm font-bold text-center whitespace-normal leading-tight">{link.name}</span>
               </Button>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
