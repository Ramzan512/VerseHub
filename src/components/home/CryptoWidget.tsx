import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, Activity, Globe, DollarSign, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import axios from 'axios';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
  cmc_link: string;
}

const COINS = [
  { id: 'bitcoin', cmc: 'bitcoin' },
  { id: 'ethereum', cmc: 'ethereum' },
  { id: 'binancecoin', cmc: 'bnb' },
  { id: 'solana', cmc: 'solana' },
  { id: 'ripple', cmc: 'xrp' }
];

export function CryptoWidget() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/crypto-market');

      if (!data || !data.coins || !Array.isArray(data.coins)) {
        throw new Error('Invalid or rate-limited coin data');
      }

      const mappedCoins = data.coins.map((coin: any) => ({
        ...coin,
        cmc_link: COINS.find(c => c.id === coin.id)?.cmc || coin.id
      }));

      setCoins(mappedCoins);
      setGlobalData(data.globalData);
    } catch (error) {
      console.warn('Crypto API rate limited, using fallback data.');
      // Fallback data for demo purposes if API rate limited
      setGlobalData({
        total_market_cap: { usd: 2500000000000 },
        total_volume: { usd: 85000000000 },
        market_cap_change_percentage_24h_usd: 2.4,
        market_cap_percentage: { btc: 52.1, eth: 16.5 }
      });
      setCoins([
        {
          id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 64230, market_cap: 1250000000000, price_change_percentage_24h: 1.5, cmc_link: 'bitcoin',
          sparkline_in_7d: { price: [62000, 63500, 63000, 64500, 65000, 64230, 64230] }
        },
        {
          id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          current_price: 3450, market_cap: 415000000000, price_change_percentage_24h: -0.8, cmc_link: 'ethereum',
          sparkline_in_7d: { price: [3500, 3550, 3400, 3350, 3450, 3420, 3450] }
        },
        {
          id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
          current_price: 590, market_cap: 90000000000, price_change_percentage_24h: 3.2, cmc_link: 'bnb',
          sparkline_in_7d: { price: [560, 565, 570, 580, 585, 590, 590] }
        },
        {
          id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
          current_price: 145, market_cap: 65000000000, price_change_percentage_24h: 5.4, cmc_link: 'solana',
          sparkline_in_7d: { price: [130, 135, 140, 142, 148, 145, 145] }
        },
        {
          id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
          current_price: 0.58, market_cap: 32000000000, price_change_percentage_24h: -1.2, cmc_link: 'xrp',
          sparkline_in_7d: { price: [0.60, 0.59, 0.58, 0.55, 0.57, 0.58, 0.58] }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 minute refresh
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  if (loading && !coins.length) {
    return (
      <div className="flex justify-center items-center h-64 bg-[#081120]/60 rounded-3xl backdrop-blur-md border border-border">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
          <Activity className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
          Crypto Market Overview
        </h2>
        <div className="flex items-center gap-2 text-xs md:text-sm text-blue-200">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live Updates
        </div>
      </div>

      {/* Global Market Overview */}
      {globalData && (
        <Card className="bg-gradient-to-br from-[#00E5FF]/40 via-[#8B5CF6]/40 to-[#FFD700]/40 border-2 border-[#FFD700] backdrop-blur-xl shadow-[0_0_20px_rgba(255,215,0,0.6)] rounded-[2rem] overflow-hidden relative transition-all group">
          <div className="absolute inset-0 bg-card-hover backdrop-blur-sm z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none animate-pulse" />
          <CardContent className="p-5 md:p-8 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            <div className="flex flex-col gap-3">
              <span className="text-text-muted text-[11px] md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">
                <Globe className="w-5 h-5 text-[#00E5FF]" /> Total Market Cap
              </span>
              <span className="text-2xl md:text-4xl font-black text-text drop-shadow-md">
                {formatCurrency(globalData.total_market_cap.usd)}
              </span>
              <span className={`text-base font-bold flex items-center gap-1 ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-[#00FF88] drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]' : 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]'}`}>
                {globalData.market_cap_change_percentage_24h_usd >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(globalData.market_cap_change_percentage_24h_usd).toFixed(2)}%
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-text-muted text-[11px] md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">
                <Activity className="w-5 h-5 text-[#8B5CF6]" /> 24h Volume
              </span>
              <span className="text-2xl md:text-4xl font-black text-text drop-shadow-md">
                {formatCurrency(globalData.total_volume.usd)}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-text-muted text-[11px] md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">
                <DollarSign className="w-5 h-5 text-[#00E5FF]" /> BTC Dominance
              </span>
              <span className="text-2xl md:text-4xl font-black text-text drop-shadow-md">
                {globalData.market_cap_percentage.btc.toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-text-muted text-[11px] md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]">
                <RefreshCw className="w-5 h-5 text-[#00FF88]" /> ETH Dominance
              </span>
              <span className="text-2xl md:text-4xl font-black text-text drop-shadow-md">
                {globalData.market_cap_percentage.eth.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crypto Prices Table (Desktop) & Cards (Mobile) */}
      <div className="hidden md:block overflow-hidden rounded-[2rem] border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)] bg-gradient-to-br from-[#0A1035] to-[#1E1B4B] backdrop-blur-xl group relative">
        <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,229,255,0.2),inset_0_0_50px_rgba(139,92,246,0.2)] pointer-events-none" />
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-text">
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Asset</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Price</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">24h Change</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Market Cap</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-center">Last 7 Days</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, idx) => (
                <tr key={coin.id} className={`border-b border-border transition-colors group/row ${idx % 2 === 0 ? 'bg-[#0F172A]/80' : 'bg-[#1E1B4B]/80'} hover:bg-[#8B5CF6]/30`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {coin.image ? (
                           <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
                      ) : (
                           <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-text drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{coin.symbol?.charAt(0)}</div>
                      )}
                      <div>
                        <div className="font-bold text-text text-base">{coin.name}</div>
                        <div className="text-text-muted text-sm uppercase font-semibold tracking-wider">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="font-bold text-text text-base drop-shadow-sm">{formatCurrency(coin.current_price)}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className={`font-bold flex items-center justify-end gap-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]'}`}>
                      {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="font-medium text-text-muted drop-shadow-sm">{formatCurrency(coin.market_cap)}</div>
                  </td>
                  <td className="px-6 py-5 w-32 h-16">
                    <div className="h-12 w-32 opacity-80 group-hover/row:opacity-100 transition-opacity">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={coin.sparkline_in_7d.price.map((p, i) => ({ value: p, index: i }))}>
                          <YAxis domain={['dataMin', 'dataMax']} hide />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={coin.price_change_percentage_24h >= 0 ? '#4ade80' : '#f87171'} 
                            strokeWidth={2.5} 
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <a href={`https://coinmarketcap.com/currencies/${coin.cmc_link}/`} target="_blank" rel="noopener noreferrer">
                      <Button className="rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] text-text font-bold shadow-[0_0_15px_rgba(255,215,0,0.4)] border border-[#FFD700] transition-all text-xs h-9 px-6 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                        Details
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="md:hidden space-y-4">
        {coins.map((coin) => (
          <Card key={coin.id} className="bg-gradient-to-br from-[#0A1035] to-[#1E1B4B] border-2 border-[#FFD700] backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(255,215,0,0.3)] group relative">
            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,229,255,0.1),inset_0_0_50px_rgba(139,92,246,0.1)] pointer-events-none" />
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {coin.image ? (
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]" />
                  ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-text text-xs drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{coin.symbol?.charAt(0)}</div>
                  )}
                  <div>
                    <div className="font-bold text-text leading-tight drop-shadow-sm">{coin.name}</div>
                    <div className="text-text-muted text-xs uppercase font-semibold">{coin.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-text text-base drop-shadow-sm">{formatCurrency(coin.current_price)}</div>
                  <div className={`text-xs font-bold flex items-center justify-end gap-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]'}`}>
                    {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <div className="bg-card-hover rounded-lg p-2 mb-3 flex items-center justify-between text-xs">
                <span className="text-text-muted font-semibold uppercase tracking-wider text-[10px]">Market Cap</span>
                <span className="font-bold text-text">{formatCurrency(coin.market_cap)}</span>
              </div>
              
              <div className="flex items-center justify-between mt-1 gap-4">
                <div className="w-24 h-10 opacity-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={coin.sparkline_in_7d.price.map((p, i) => ({ value: p, index: i }))}>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={coin.price_change_percentage_24h >= 0 ? '#4ade80' : '#f87171'} 
                        strokeWidth={2.5} 
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <a href={`https://coinmarketcap.com/currencies/${coin.cmc_link}/`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] text-text font-bold shadow-[0_0_15px_rgba(255,215,0,0.4)] border border-[#FFD700] transition-all text-xs h-9 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                    Details
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>



    </div>
  );
}
