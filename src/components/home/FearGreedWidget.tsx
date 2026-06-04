import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Gauge, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';

export function FearGreedWidget() {
  const [data, setData] = useState<{ value: number; classification: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/fear-greed');
      if (res.data && res.data.data && res.data.data.length > 0) {
        const item = res.data.data[0];
        setData({
          value: parseInt(item.value, 10),
          classification: item.value_classification,
          // Format the unix timestamp
          timestamp: new Date(parseInt(item.timestamp, 10) * 1000).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        });
      }
    } catch (e) {
      console.warn("Fear and Greed fetch failed, using fallback.");
      // Fallback
      setData({ 
        value: 50, 
        classification: "Neutral", 
        timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15 * 60 * 1000); // 15 mins
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <Card className="h-full bg-gradient-to-br from-[#0F172A]/80 to-[#1E1B4B]/80 border-[#00BFFF]/40 backdrop-blur-xl rounded-[2rem] flex items-center justify-center min-h-[300px]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#00FFFF]" />
      </Card>
    );
  }

  const value = data?.value || 50;
  
  let colorClass = "text-[#FFD700]";
  let bgClass = "bg-[#FFD700]/20";
  let borderClass = "border-[#FFD700]";
  let shadowClass = "drop-shadow-[0_0_20px_rgba(255,215,0,0.7)]";
  let classificationText = data?.classification || 'Neutral';
  
  if (value <= 24) {
    colorClass = "text-[#FF3B30]"; // Bright Red
    bgClass = "bg-[#FF3B30]/20";
    borderClass = "border-[#FF3B30]";
    shadowClass = "drop-shadow-[0_0_20px_rgba(255,59,48,0.7)]";
    classificationText = 'Extreme Fear';
  } else if (value <= 46) {
    colorClass = "text-[#FF9500]"; // Orange
    bgClass = "bg-[#FF9500]/20";
    borderClass = "border-[#FF9500]";
    shadowClass = "drop-shadow-[0_0_20px_rgba(255,149,0,0.7)]";
    classificationText = 'Fear';
  } else if (value >= 75) {
    colorClass = "text-[#34C759]"; // Green
    bgClass = "bg-[#34C759]/20";
    borderClass = "border-[#34C759]";
    shadowClass = "drop-shadow-[0_0_20px_rgba(52,199,89,0.7)]";
    classificationText = 'Extreme Greed';
  } else if (value >= 54) {
    colorClass = "text-[#86EFAC]"; // Light Green
    bgClass = "bg-[#86EFAC]/20";
    borderClass = "border-[#86EFAC]";
    shadowClass = "drop-shadow-[0_0_20px_rgba(134,239,172,0.7)]";
    classificationText = 'Greed';
  }

  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Card className="h-full bg-gradient-to-br from-[#38BDF8] via-[#8B5CF6] to-[#6366F1] border-2 border-[#FFD700] backdrop-blur-xl shadow-[0_0_30px_rgba(0,229,255,0.4),_0_0_30px_rgba(139,92,246,0.4)] rounded-[2rem] overflow-hidden relative group transition-all flex flex-col items-center">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md z-0" />
      <CardContent className="p-8 md:p-12 relative z-10 flex flex-col h-full w-full flex-1">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 w-full text-center md:text-left">
           <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-md flex items-center gap-3">
             <Gauge className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
             Fear & Greed Index
           </h3>
           <div className={`px-6 py-2 rounded-full text-sm md:text-base font-black ${bgClass} ${colorClass} ${borderClass} border-2 shadow-lg backdrop-blur-lg flex items-center justify-center uppercase tracking-wider`}>
             {classificationText}
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[220px]">
          <div className="relative w-full max-w-[320px] mx-auto aspect-[2/1] mb-6">
            <svg viewBox="0 -10 100 65" className="w-full h-full overflow-visible drop-shadow-2xl">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="12" strokeLinecap="round" />
              <path 
                d="M 10 50 A 40 40 0 0 1 90 50" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="12" 
                strokeLinecap="round" 
                className={`${colorClass} transition-all duration-1000 ease-out`} 
                strokeDasharray={circumference} 
                strokeDashoffset={offset} 
              />
            </svg>
            <div className="absolute bottom-[-10%] left-0 right-0 flex flex-col items-center pb-0">
              <span className={`text-6xl md:text-8xl font-black ${colorClass} ${shadowClass} tracking-tighter drop-shadow-xl`}>
                {value}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center mt-10">
            <p className="text-white/90 font-bold text-sm md:text-base uppercase tracking-widest drop-shadow-md">Current Score</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 w-full flex flex-col md:flex-row items-center justify-between gap-4 text-sm md:text-base text-white font-bold drop-shadow-md">
          <div className="flex items-center gap-2">
            <span className="opacity-80">Market Sentiment:</span>
            <span className={`${colorClass}`}>{classificationText}</span>
          </div>
          <div className="flex items-center justify-center gap-2 opacity-80">
            <Clock className="w-5 h-5" />
            Last Updated: {data?.timestamp}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
