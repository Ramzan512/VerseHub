import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, RefreshCw, X, Share2, Bookmark, Clock, Search, Filter } from 'lucide-react';

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

const CATEGORIES = ["All", "Bitcoin", "Ethereum", "Altcoins", "DeFi", "NFTs", "Regulation"];

export function NewsHub() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/crypto-live-news');
      if (res.data && res.data.news) {
        setNews(res.data.news);
      }
    } catch (error) {
      // console.warn('Failed to fetch news:', error);
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

  const filteredNews = news.filter(item => {
    const matchesSearch = item.headline?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory !== "All") {
      const h = item.headline?.toLowerCase() || "";
      const s = item.summary?.toLowerCase() || "";
      const cat = activeCategory.toLowerCase();
      // Simple heuristic matching
      if (cat === "bitcoin" && !h.includes("bitcoin") && !h.includes("btc")) matchesCategory = false;
      if (cat === "ethereum" && !h.includes("ethereum") && !h.includes("eth")) matchesCategory = false;
      if (cat === "altcoins" && !h.includes("altcoin") && !h.includes("solana") && !h.includes("xrp") && !h.includes("cardano")) matchesCategory = false;
      if (cat === "defi" && !h.includes("defi") && !h.includes("decentralized")) matchesCategory = false;
      if (cat === "nfts" && !h.includes("nft") && !h.includes("non-fungible")) matchesCategory = false;
      if (cat === "regulation" && !h.includes("sec") && !h.includes("regulation") && !h.includes("law")) matchesCategory = false;
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050816] text-text">
      <div className="pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div>
             <h1 className="text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_20px_rgba(0,255,255,0.4)] mb-2">
               CRYPTO NEWS HUB
             </h1>
             <p className="text-cyan-400 font-medium tracking-wider">LATEST REAL-TIME INTELLIGENCE</p>
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-text-muted" />
                 </div>
                 <input 
                    type="text" 
                    placeholder="Search news..." 
                    className="w-full bg-[#0A1020] border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all text-text placeholder-white/40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <button onClick={fetchNews} className="p-2.5 rounded-full bg-[#0A1020] border border-border hover:border-cyan-400/50 text-text-muted hover:text-cyan-400 transition-all">
                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
           </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card-hover border border-border text-text-muted text-sm font-medium mr-2">
              <Filter className="w-3.5 h-3.5" />
              Filters
           </div>
           {CATEGORIES.map(cat => (
              <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold tracking-wide transition-all border ${activeCategory === cat ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.2)]' : 'bg-[#0A1020] border-border text-text-muted hover:text-text hover:border-border'}`}
              >
                 {cat}
              </button>
           ))}
        </div>

        {/* News Grid */}
        {loading && news.length === 0 ? (
           <div className="flex items-center justify-center min-h-[400px]">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
           </div>
        ) : filteredNews.length === 0 ? (
           <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#0A1020] rounded-3xl border border-border">
              <div className="text-text-muted mb-2">No news found for this category or search.</div>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="text-cyan-400 hover:text-cyan-300 text-sm font-bold">Clear Filters</button>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredNews.slice(0, 50).map((item, idx) => {
                 const imageUrl = item.image || "https://images.unsplash.com/photo-1621504450181-5d156f065317?auto=format&fit=crop&q=80&w=800";
                 
                 const sourceColors = (() => {
                  const s = item.source.toLowerCase();
                  if (s.includes('coindesk')) return { badgeBg: 'bg-[#00D4FF]/20', badgeText: 'text-[#00D4FF]', accent: 'bg-[#00D4FF]' };
                  if (s.includes('cointelegraph')) return { badgeBg: 'bg-[#FFD700]/20', badgeText: 'text-[#FFD700]', accent: 'bg-[#FFD700]' };
                  if (s.includes('binance')) return { badgeBg: 'bg-[#F3BA2F]/20', badgeText: 'text-[#F3BA2F]', accent: 'bg-[#F3BA2F]' };
                  return { badgeBg: 'bg-[#8B5CF6]/20', badgeText: 'text-[#8B5CF6]', accent: 'bg-[#8B5CF6]' };
                 })();

                 return (
                    <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                       key={item.id || idx}
                       className="group flex flex-col bg-gradient-to-br from-[#0B1221] to-[#160E2A] hover:to-[#1A103C] border border-yellow-500/30 hover:border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] rounded-[1.5rem] overflow-hidden transition-all duration-300 cursor-pointer h-full relative"
                       onClick={() => navigate(`/news/${encodeURIComponent(item.id || item.headline)}`, { state: { article: item, newsList: news } })}
                    >
                       {/* Image Banner */}
                       <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-card">
                          <img src={imageUrl} alt={item.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-transparent to-transparent"></div>
                          <div className="absolute top-4 left-4">
                             <div className={`flex items-center gap-2 ${sourceColors.badgeBg} backdrop-blur-md border border-current rounded-lg px-2.5 py-1 ${sourceColors.badgeText} shadow-lg`}>
                                <img src={item.sourceLogo} alt={item.source} className="w-4 h-4 rounded-full bg-white object-contain" />
                                <span className="text-[11px] font-black uppercase tracking-wider">{item.source}</span>
                             </div>
                          </div>
                       </div>

                       {/* Content */}
                       <div className="flex flex-col flex-1 p-6 relative">
                          <div className="flex-1">
                             <h4 className="text-xl font-bold text-text tracking-normal leading-snug line-clamp-2 mb-3">
                                {item.headline || (item as any).title || "News title unavailable"}
                             </h4>
                             <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                                {item.summary || "No summary available. Click to read the full details of this cryptocurrency news article."}
                             </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                             <span className="text-[12px] font-mono text-gray-400 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-500" /> {timeAgo(item.time)}
                             </span>
                             <button className="inline-flex items-center justify-center gap-2 text-[14px] font-bold text-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] group-hover:from-[#2563EB] group-hover:to-[#7C3AED] px-4 py-2 rounded-[999px] transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]">
                                📖 Read Full News
                             </button>
                          </div>
                       </div>
                    </motion.div>
                 );
              })}
           </div>
        )}
      </div>

    </div>
  );
}
