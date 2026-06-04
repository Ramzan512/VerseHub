import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'motion/react';
import { Clock, Share2, Bookmark, ExternalLink, ChevronLeft, ChevronRight, ArrowLeft, Brain, Sparkles, Zap, MessageSquare } from 'lucide-react';

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
  content?: string;
}

export function NewsReader() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [article, setArticle] = useState<NewsItem | null>(location.state?.article || null);
  const [allNews, setAllNews] = useState<NewsItem[]>(location.state?.newsList || []);
  const [loading, setLoading] = useState(!location.state?.article);

  useEffect(() => {
    // Scroll to top on load/change
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/crypto-live-news');
        if (res.data && res.data.news && Array.isArray(res.data.news)) {
          setAllNews(res.data.news);
          const foundId = decodeURIComponent(id || '');
          const found = res.data.news.find((n: any) => n.id === foundId || n.headline === foundId);
          if (found) setArticle(found);
        }
      } catch (error) {
        // console.warn(error);
      } finally {
        setLoading(false);
      }
    };

    if (!article || allNews.length === 0) {
      if (id) {
          fetchData();
      } else {
          navigate('/news');
      }
    } else if (id) {
       const foundId = decodeURIComponent(id || '');
       const found = allNews.find(n => n.id === foundId || n.headline === foundId);
       if (found) {
           setArticle(found);
       }
    }
  }, [id, navigate]); // Removed dependencies to avoid infinite loops, we handle it on id change

  if (loading) {
    return (
       <div className="min-h-screen bg-[#050816] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
       </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center text-white">
         <h2 className="text-2xl font-bold mb-4">Article not found</h2>
         <button onClick={() => navigate('/news')} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold hover:scale-105 transition-transform">
            Return to News Hub
         </button>
      </div>
    );
  }

  const readTime = Math.max(2, Math.floor(((article.summary?.length || 500) + (article.content?.length || 0)) / 200));

  const fallbackImages = [
    "https://images.unsplash.com/photo-1621504450181-5d156f065317?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=1200"
  ];
  
  // Use a pseudo-random stable index based on headline length for the fallback image
  const fallbackIndex = article.headline.length % fallbackImages.length;
  const imageUrl = article.image && article.image.trim() !== '' ? article.image : fallbackImages[fallbackIndex];

  const currentIndex = allNews.findIndex(n => n.id === article.id || n.headline === article.headline);
  const prevArticle = currentIndex > 0 ? allNews[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < allNews.length - 1 ? allNews[currentIndex + 1] : null;

  const relatedArticles = allNews.filter(n => n.id !== article.id && n.headline !== article.headline).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
             onClick={() => navigate(-1)}
             className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/10">
                <ArrowLeft className="w-4 h-4" />
             </div>
             <span className="font-bold text-sm tracking-wide hidden sm:block">BACK</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
               title="Share News"
               className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Share2 className="w-[18px] h-[18px]" />
            </button>
            <button 
               title="Save News"
               className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Bookmark className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-3 md:px-6 py-8 pb-24">
        
        {/* Meta & Tags */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
            <img src={article.sourceLogo} alt={article.source} className="w-5 h-5 rounded-full bg-white object-contain p-0.5" />
            <span className="text-xs font-black text-white/90 uppercase tracking-widest">{article.source}</span>
          </div>
          
          <span className="flex items-center gap-1.5 text-xs text-white/60 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {new Date(article.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-white/60 font-mono ml-auto">
             <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
             {readTime} MIN READ
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[32px] sm:text-[46px] md:text-[56px] font-bold leading-tight mb-8 text-white">
           {article.headline || (article as any).title}
        </h1>

        {/* Featured Image */}
        <div className="w-full aspect-video sm:aspect-[21/9] bg-[#0A1020] rounded-2xl sm:rounded-[2rem] overflow-hidden mb-10 border border-white/10 shadow-2xl relative">
           <img 
              src={imageUrl} 
              alt="Featured" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImages[(fallbackIndex + 1) % fallbackImages.length];
              }}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent opacity-60"></div>
        </div>

        {/* AI ELI5 Summary */}
        <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/20 border border-purple-500/30 rounded-2xl p-6 mb-10 relative overflow-hidden group">
           <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-[30px] -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                 <Brain className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wide flex items-center gap-2">
                 🧠 ELI5 Summary <Sparkles className="w-4 h-4 text-yellow-400" />
              </h3>
           </div>
           <p className="text-gray-300 leading-[1.8] text-base sm:text-[19px] pl-11">
              "To keep it simple: {article.summary?.split('.')[0] || article.headline}. This is significant because it highlights recent shifts in how the market operates and tracks ongoing developments in the crypto space."
           </p>
        </div>

        {/* Content Area */}
        <div className="prose prose-invert max-w-none text-[18px] sm:text-[20px] leading-[1.8] text-white prose-p:text-white prose-p:leading-[1.8] prose-p:mb-[20px] prose-headings:text-white prose-li:text-gray-300">
           <p className="text-[20px] sm:text-[22px] font-medium text-white leading-[1.8] mb-8 border-l-4 border-cyan-500 pl-6 bg-cyan-500/5 py-5 rounded-r-xl">
              {article.summary}
           </p>

           <h3 className="text-[22px] sm:text-[26px] font-bold text-white mt-12 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" /> Key Highlights
           </h3>
           <ul className="space-y-4 mb-12 list-none pl-0">
             <li className="flex items-start gap-4 bg-white/5 p-5 rounded-xl border border-white/5">
                <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold font-mono">1</span>
                <span className="text-[18px] sm:text-[20px] text-gray-300 leading-[1.8]">{article.headline}</span>
             </li>
             <li className="flex items-start gap-4 bg-white/5 p-5 rounded-xl border border-white/5">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold font-mono">2</span>
                <span className="text-[18px] sm:text-[20px] text-gray-300 leading-[1.8]">Market reactions are highly anticipated following this major announcement.</span>
             </li>
             <li className="flex items-start gap-4 bg-white/5 p-5 rounded-xl border border-white/5">
                <span className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold font-mono">3</span>
                <span className="text-[18px] sm:text-[20px] text-gray-300 leading-[1.8]">Impact extends across different layers of the cryptocurrency ecosystem.</span>
             </li>
           </ul>

           {article.content && article.content.trim() !== '' && (
              <div dangerouslySetInnerHTML={{ __html: article.content }} className="mt-10 text-white leading-[1.8] [&>p]:mb-[20px]" />
           )}
        </div>

        {/* Source Attribution Block */}
        <div className="mt-16 p-6 sm:p-10 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[50px] rounded-full -mr-20 -mt-20"></div>
           <img src={article.sourceLogo} alt={article.source} className="w-20 h-20 rounded-2xl bg-white object-contain p-2 shadow-lg z-10" />
           <div className="z-10 flex-1">
              <h4 className="text-[22px] font-bold text-white mb-3">Source: {article.source}</h4>
              <p className="text-[16px] text-gray-300 leading-[1.8] max-w-xl">
                 News originally published by the source. Content displayed inside Verse Hub for educational purposes only. For full context and original reporting, please visit the source.
              </p>
           </div>
        </div>

        {/* Original Source Button */}
        <div className="mt-10 flex justify-center">
           <a 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm font-black text-[#050816] bg-white hover:bg-gray-200 px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 group tracking-widest uppercase"
           >
              Read Original Article <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </a>
        </div>

        {/* Multi-story Navigation */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
           {prevArticle ? (
              <Link 
                 to={`/news/${encodeURIComponent(prevArticle.id || prevArticle.headline)}`}
                 state={{ article: prevArticle, newsList: allNews }}
                 className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors group text-left"
              >
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors shrink-0">
                    <ChevronLeft className="w-5 h-5" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Previous Story</span>
                    <span className="text-sm font-bold text-white/90 truncate block">{prevArticle.headline}</span>
                 </div>
              </Link>
           ) : <div />}
           
           {nextArticle ? (
              <Link 
                 to={`/news/${encodeURIComponent(nextArticle.id || nextArticle.headline)}`}
                 state={{ article: nextArticle, newsList: allNews }}
                 className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors group text-right justify-end"
              >
                 <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Next Story</span>
                    <span className="text-sm font-bold text-white/90 truncate block">{nextArticle.headline}</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors shrink-0">
                    <ChevronRight className="w-5 h-5" />
                 </div>
              </Link>
           ) : <div />}
        </div>

        {/* More Related News */}
        {relatedArticles.length > 0 && (
           <div className="mt-20">
              <h3 className="text-2xl font-bold mb-8">More Related News</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 {relatedArticles.map((rel, idx) => {
                    const relImgUrl = rel.image && rel.image.trim() !== '' ? rel.image : fallbackImages[(idx + 4) % fallbackImages.length];
                    return (
                       <Link 
                          key={rel.id || idx}
                          to={`/news/${encodeURIComponent(rel.id || rel.headline)}`}
                          state={{ article: rel, newsList: allNews }}
                          className="group flex flex-col bg-[#0A1020] border border-white/5 hover:border-cyan-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1"
                       >
                          <div className="h-32 w-full bg-black/50 overflow-hidden relative">
                             <img 
                                src={relImgUrl} 
                                alt={rel.headline} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = fallbackImages[(idx + 2) % fallbackImages.length];
                                }}
                             />
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                <img src={rel.sourceLogo} alt={rel.source} className="w-3.5 h-3.5 rounded-full bg-white" />
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{rel.source}</span>
                             </div>
                             <h4 className="text-sm font-bold leading-snug line-clamp-3 group-hover:text-cyan-400 transition-colors">
                                {rel.headline}
                             </h4>
                          </div>
                       </Link>
                    );
                 })}
              </div>
           </div>
        )}

      </main>
    </div>
  );
}
