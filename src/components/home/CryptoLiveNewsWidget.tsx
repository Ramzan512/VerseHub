import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { ExternalLink, RefreshCw, RadioReceiver, Globe, X, Share2, Bookmark, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface NewsItem {
  id?: string;
  headline: string;
  link: string;
  time: number;
  source: string;
  sourceLogo: string;
  tag: { label: string; color: string; text: string } | null;
  summary?: string;
  image?: string;
}

export function CryptoLiveNewsWidget() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/crypto-live-news');
      if (res.data && res.data.news && Array.isArray(res.data.news) && res.data.news.length > 0) {
        setNews(res.data.news);
        setLastUpdated(new Date());
      } else {
        throw new Error("Empty news data");
      }
    } catch (error) {
      console.warn("Using fallback news due to fetch error");
      // Fallback
      setNews([
        {
          id: 'mock-1',
          headline: 'Bitcoin Surges Past Key Resistance Level on Institutional Buying',
          source: 'Crypto Daily',
          sourceLogo: 'https://ui-avatars.com/api/?name=Crypto+Daily&background=0D8ABC&color=fff',
          link: '#',
          time: Date.now() - 1200000,
          tag: { text: "BULLISH", color: "text-green-400", label: "BULLISH" },
          summary: 'Institutional buying continues to drive Bitcoin past major resistance levels as global adoption increases.',
          image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'mock-2',
          headline: 'Ethereum Spot ETF Flows See Record Inflows in Final Hour of Trading',
          source: 'Blockchain Weekly',
          sourceLogo: 'https://ui-avatars.com/api/?name=Blockchain+Weekly&background=1E1B4B&color=00ffff',
          link: '#',
          time: Date.now() - 3600000,
          tag: { text: "MARKETS", color: "text-blue-400", label: "MARKETS" },
          summary: 'A dramatic late surge in Ethereum ETF inflows breaks all previous daily records, shocking analysts.',
          image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'mock-3',
          headline: 'Major Exchange Announces Support for New Solana DeFi Protocol',
          source: 'DeFi Pulse',
          sourceLogo: 'https://ui-avatars.com/api/?name=DeFi+Pulse&background=8b5cf6&color=fff',
          link: '#',
          time: Date.now() - 7200000,
          tag: { text: "ADOPTION", color: "text-purple-400", label: "ADOPTION" },
          summary: 'A top-tier exchange validates the explosive growth of the Solana ecosystem with new listings.',
          image: 'https://images.unsplash.com/photo-1621504450181-5d156f065317?auto=format&fit=crop&w=800&q=80'
        }
      ]);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  return (
    <Card className="h-full border-none bg-transparent shadow-none w-full mb-8">
      <CardContent className="p-0 flex flex-col h-full bg-gradient-to-br from-[#0F172A]/80 to-[#1E1B4B]/80 rounded-[2rem] border border-[#00BFFF]/40 shadow-[0_0_30px_rgba(0,191,255,0.15)] hover:border-[#00BFFF]/60 hover:shadow-[0_0_50px_rgba(0,191,255,0.3)] transition-all relative overflow-hidden backdrop-blur-xl group">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 border-b border-[#00BFFF]/20 bg-gradient-to-r from-[#00BFFF]/10 to-[#8A2BE2]/10 z-10 sticky top-0 backdrop-blur-xl">
           <div className="flex items-center gap-4 mb-4 sm:mb-0">
             <div className="relative">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#00BFFF]/20 border border-[#00BFFF]/40 shadow-[0_0_15px_rgba(0,191,255,0.3)]">
                 <RadioReceiver className="w-6 h-6 text-[#00FFFF]" />
               </div>
               <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00FFFF] shadow-[0_0_10px_rgba(0,255,255,0.8)] border-2 border-[#0A1035] animate-pulse" />
             </div>
             <div>
               <h3 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(0,255,255,0.6)] flex items-center gap-2 mb-1">
                 CRYPTO LIVE NEWS <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm shadow-red-500/50">Live Feed</span>
               </h3>
               <p className="text-xs text-cyan-400 tracking-wider font-medium">AGGREGATING TOP INTELLIGENCE SOURCES</p>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="text-xs font-semibold text-white/80 bg-black/30 border border-[#00BFFF]/30 px-3 py-1.5 rounded-lg shadow-inner">
                <span className="text-[#00FFFF] font-bold tracking-wide">{news.length}</span> Breaking Updates
             </div>
             {lastUpdated && (
               <div className="text-[10px] text-white/50 hidden md:flex items-center gap-1 font-mono uppercase tracking-wider">
                 <RefreshCw className="w-3 h-3 text-[#00FFFF]/50" /> updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </div>
             )}
             <button onClick={fetchNews} disabled={loading} className="p-2 bg-black/30 hover:bg-white/10 border border-[#00BFFF]/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50 text-white/70 hover:text-white">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin cursor-not-allowed text-[#00FFFF]' : 'text-[#00FFFF]'}`} />
             </button>
           </div>
        </div>

        {/* List Content */}
        <div className="p-4 sm:p-6 flex-1 relative z-0 flex flex-col">
          {loading && news.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-white/50 space-y-4">
              <div className="relative">
                <Globe className="w-12 h-12 animate-pulse text-[#00BFFF]" />
                <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-xl animate-pulse" />
              </div>
              <span className="text-sm font-medium tracking-widest uppercase relative z-10 text-[#00FFFF]">Intercepting News Comms...</span>
            </div>
          ) : news.length === 0 ? (
            <div className="flex-1 flex items-center justify-center min-h-[300px] text-[#00FFFF]/50 text-sm font-medium border border-dashed border-[#00BFFF]/20 rounded-2xl bg-black/20 text-center px-4">
               Monitoring sources for breaking news...
            </div>
          ) : (
            <div className="flex flex-col h-full w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 w-full">
                {news.filter(item => item && (item.headline || (item as unknown as any).title || item.link || item.source)).slice(0, 3).map((item, idx) => {
                  const sourceColors = (() => {
                    const s = item.source.toLowerCase();
                    if (s.includes('coindesk')) return { badgeBg: 'bg-[#00D4FF]/20', badgeText: 'text-[#00D4FF]', accent: 'bg-[#00D4FF]' };
                    if (s.includes('cointelegraph')) return { badgeBg: 'bg-[#FFD700]/20', badgeText: 'text-[#FFD700]', accent: 'bg-[#FFD700]' };
                    if (s.includes('binance')) return { badgeBg: 'bg-[#F3BA2F]/20', badgeText: 'text-[#F3BA2F]', accent: 'bg-[#F3BA2F]' };
                    return { badgeBg: 'bg-[#8B5CF6]/20', badgeText: 'text-[#8B5CF6]', accent: 'bg-[#8B5CF6]' };
                  })();
                  
                  const fallbackImages = [
                    "https://images.unsplash.com/photo-1621504450181-5d156f065317?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=800"
                  ];
                  
                  const imageUrl = item.image && item.image.trim() !== '' ? item.image : fallbackImages[idx % fallbackImages.length];

                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.1, 0.5) }}
                      key={item.id || idx}
                      className="group flex flex-col min-h-[460px] bg-gradient-to-br from-[#0B1221] to-[#160E2A] hover:to-[#1A103C] border border-[#FFD700]/30 hover:border-[#FFD700] rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] backdrop-blur-md w-full"
                      onClick={() => navigate(`/news/${encodeURIComponent(item.id || item.headline)}`, { state: { article: item, newsList: news } })}
                    >
                      {/* Image Banner */}
                      <div className="w-full h-[200px] relative overflow-hidden bg-[#0A1020] border-b border-white/10 shrink-0">
                         <img 
                           src={imageUrl} 
                           alt={item.headline} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                           onError={(e) => {
                             (e.target as HTMLImageElement).src = fallbackImages[(idx + 1) % fallbackImages.length];
                           }}
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/20 to-transparent opacity-90"></div>
                         
                         {/* Top left badge */}
                         <div className="absolute top-4 left-4">
                            <div className={`flex items-center gap-2 ${sourceColors.badgeBg} backdrop-blur-md border border-current rounded-lg px-2.5 py-1 ${sourceColors.badgeText} shadow-lg`}>
                               <img src={item.sourceLogo} alt={item.source} className="w-4 h-4 rounded-full bg-white object-contain" />
                               <span className="text-[11px] font-black uppercase tracking-wider">{item.source}</span>
                            </div>
                         </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex flex-col flex-1 p-5 relative">
                         {/* Headline */}
                         <div className="mb-3 flex-1 flex flex-col">
                            <h4 className="text-[18px] lg:text-[20px] font-bold text-white tracking-normal leading-snug transition-colors line-clamp-2 mb-3">
                               {item.headline || (item as any).title || (item as any).name || "News title unavailable"}
                            </h4>
                            {/* Summary */}
                            <p className="text-xs sm:text-sm text-white/60 line-clamp-3 leading-relaxed mt-auto">
                               {item.summary || "Click to read the full details of this cryptocurrency news article. Stay updated with the latest trends and market movements."}
                            </p>
                         </div>

                         {/* Bottom Meta & Button */}
                         <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
                            <span className="text-[12px] font-mono text-gray-400 flex items-center gap-1">
                               <Clock className="w-3.5 h-3.5 text-gray-500" /> {timeAgo(item.time)}
                            </span>
                            
                            <button className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] group-hover:from-[#2563EB] group-hover:to-[#7C3AED] px-4 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]">
                               📖 Read News
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Open News Hub Button */}
              <div className="mt-8 relative z-20">
                <Link to="/news" className="flex items-center justify-center w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-black text-[15px] tracking-widest uppercase py-4 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all transform hover:-translate-y-0.5 relative overflow-hidden group border border-white/20">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                  <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
                    📰 OPEN NEWS HUB
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </CardContent>

    </Card>
  );
}
