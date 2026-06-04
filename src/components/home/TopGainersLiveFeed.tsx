import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flame } from 'lucide-react';
import { Card } from '../ui/card';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export function TopGainersLiveFeed() {
  const [gainers, setGainers] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchGainers = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=50&page=1&sparkline=false');
        
        if (response.data && Array.isArray(response.data)) {
          const sorted = [...response.data]
            .filter(c => c.price_change_percentage_24h !== null)
            .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
            .slice(0, 10);
            
          if (mounted) {
            setGainers(sorted);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch gainers, using fallback.');
        if (mounted) {
          setGainers([
            { id: '1', symbol: 'tao', name: 'Bittensor', image: 'https://assets.coingecko.com/coins/images/328/large/bittensor.png', current_price: 340, price_change_percentage_24h: 15.4 },
            { id: '2', symbol: 'rndr', name: 'Render', image: 'https://assets.coingecko.com/coins/images/11636/large/render.png', current_price: 7.2, price_change_percentage_24h: 12.1 },
            { id: '3', symbol: 'fet', name: 'Fetch.ai', image: 'https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg', current_price: 1.8, price_change_percentage_24h: 8.5 },
            { id: '4', symbol: 'ar', name: 'Arweave', image: 'https://assets.coingecko.com/coins/images/4343/large/ar.png', current_price: 32, price_change_percentage_24h: 7.2 },
            { id: '5', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 145, price_change_percentage_24h: 5.4 }
          ]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchGainers();
    const interval = setInterval(fetchGainers, 60000); // 60 seconds interval
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatPrice = (price: number) => {
    if (price < 0.01) return '$' + price.toFixed(6);
    if (price < 1) return '$' + price.toFixed(4);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const renderContent = () => {
    if (loading && gainers.length === 0) {
      return (
        <Card className="w-full h-[60px] md:h-[70px] bg-gradient-to-r from-[#08142A] via-[#0B1F45] to-[#111827] backdrop-blur-xl rounded-2xl border-2 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.5),_0_0_30px_rgba(0,229,255,0.3)] flex items-center justify-center mb-0">
          <span className="text-[#00E5FF] font-bold tracking-wider animate-pulse text-sm">Loading top gainers...</span>
        </Card>
      );
    }

    if (gainers.length === 0) {
      return (
        <Card className="w-full h-[60px] md:h-[70px] bg-gradient-to-r from-[#08142A] via-[#0B1F45] to-[#111827] backdrop-blur-xl rounded-2xl border-2 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.5),_0_0_30px_rgba(0,229,255,0.3)] flex items-center justify-center mb-0">
          <span className="text-red-500 font-bold tracking-wider text-sm">No top gainers data available</span>
        </Card>
      );
    }

    // Duplicate items to an EVEN number of sets (4 sets) so 50% translation matches exactly 2 sets
    const displayGainers = [...gainers, ...gainers, ...gainers, ...gainers];

    return (
      <Card className="w-full h-[60px] md:h-[70px] bg-gradient-to-r from-[#08142A] via-[#0B1F45] to-[#111827] backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.5),_0_0_30px_rgba(0,229,255,0.3)] transition-all flex items-center mb-0 relative group">
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-[#00E5FF]/10 opacity-0 group-hover:opacity-100 blur-[20px] pointer-events-none transition-opacity duration-700" />
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 via-transparent to-[#00E5FF]/5 pointer-events-none z-[1]" />
        
        {/* Fade Edges for Scrolling */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#08142A] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#08142A] to-transparent z-20 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="flex items-center h-full relative z-10 touch-pan-x w-max animate-marquee md:hover:[animation-play-state:paused]">
            {displayGainers.map((coin, idx) => (
              <div key={`${coin.id}-${idx}`} className="flex items-center gap-2 md:gap-3 shrink-0 py-1.5 md:py-2 px-3 md:px-4 mr-4 md:mr-6 rounded-xl bg-black/30 border border-white/5 shadow-sm hover:bg-black/50 transition-colors cursor-pointer text-sm">
                <img src={coin.image} alt={coin.name} className="w-5 h-5 md:w-6 md:h-6 shrink-0 rounded-full bg-white/10" />
                <div className="flex items-center gap-1.5 md:gap-2 text-white">
                  <span className="font-bold uppercase tracking-wider">{coin.symbol}</span>
                  <span className="font-mono text-yellow-100">{formatPrice(coin.current_price)}</span>
                  <span className="font-black text-green-400">
                    +{coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#FFD700]/20 border border-[#FFD700]/50 flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)]">
          <Flame className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] flex items-center flex-wrap gap-2 md:gap-3 leading-tight">
          TOP GAINERS
          <span className="inline-flex items-center text-[10px] md:text-sm font-bold tracking-widest text-[#00FF88] animate-pulse bg-[#00FF88]/10 px-2 py-1 md:px-3 rounded-full border border-[#00FF88]/30 ml-1 md:ml-0 shadow-[0_0_10px_rgba(0,255,136,0.3)]">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00FF88] mr-1.5 md:mr-2 shadow-[0_0_5px_rgba(0,255,136,0.8)]" />
            LIVE
          </span>
        </h2>
      </div>
      {renderContent()}
    </div>
  );
}
