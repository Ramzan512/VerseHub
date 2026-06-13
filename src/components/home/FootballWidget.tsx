import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Flame, ChevronRight, Activity, CalendarDays } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { trackEvent } from "../../lib/analytics";

export function FootballWidget() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/football/scoreboard")
      .then(r => r.json())
      .then(setData)
      .catch(e => console.warn(e));
  }, []);

  if (!data?.events) {
    return (
      <div className="h-64 flex items-center justify-center border border-[#22c55e]/20 bg-[#064e3b]/20 rounded-[2rem] w-full">
         <div className="animate-pulse flex flex-col items-center">
            <Trophy className="w-8 h-8 text-[#22c55e] mb-3" />
            <p className="text-[#22c55e]/70">Loading Football Data...</p>
         </div>
      </div>
    );
  }

  const events = data.events.slice(0, 4); // Show top 4 matches

  const handleMatchClick = (eventName: string) => {
    trackEvent('Football Widget Match Clicked', { match: eventName });
    navigate('/football');
  };

  return (
    <div className="relative rounded-[2rem] p-6 lg:p-8 border-2 border-[#00FF88]/40 shadow-[0_0_30px_rgba(0,255,136,0.3)] overflow-hidden group">
       {/* Background Stadium Image */}
       <div 
         className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] group-hover:scale-110"
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518605368461-1ee7e55047dc?auto=format&fit=crop&q=80&w=2000)' }}
       />
       
       {/* Glass Overlay for Readability */}
       <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050816]/90 via-[#050816]/70 to-[#004d40]/80 backdrop-blur-[2px]" />

       {/* Stadium Lights / Glow Effects */}
       <div className="absolute -top-40 right-10 w-96 h-96 bg-[#00D4FF] rounded-full blur-[120px] opacity-20 pointer-events-none" />
       <div className="absolute -top-40 left-10 w-96 h-96 bg-[#8B5CF6] rounded-full blur-[120px] opacity-20 pointer-events-none" />
       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full h-80 bg-[#00FF88] rounded-full blur-[150px] opacity-10 pointer-events-none" />

       {/* Animated Grass Texture Gradient at Bottom */}
       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgba(0,255,136,0.15)] to-transparent z-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none animate-pulse" 
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,255,136,0.5) 10px, rgba(0,255,136,0.5) 20px)' }}></div>
       </div>

       {/* Player Silhouettes (SVG) */}
       <div className="absolute top-1/2 -left-10 md:left-5 -translate-y-1/2 z-0 opacity-[0.07] pointer-events-none w-48 h-48 md:w-64 md:h-64 text-[#00FF88]">
          <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform -scale-x-100">
             <path d="M50 20C54.4 20 58 16.4 58 12C58 7.6 54.4 4 50 4C45.6 4 42 7.6 42 12C42 16.4 45.6 20 50 20ZM40 25C30 28 20 35 15 45L22 58L32 48L32 95H40V70H50V95H58V55L45 42L52 35C58 40 68 45 75 45L80 35C75 32 65 28 58 20L40 25Z" />
             {/* Ball */}
             <circle cx="85" cy="85" r="8" />
          </svg>
       </div>
       <div className="absolute top-1/2 -right-10 md:right-5 -translate-y-1/2 z-0 opacity-[0.07] pointer-events-none w-48 h-48 md:w-64 md:h-64 text-[#00D4FF]">
          <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_10px_currentColor]">
             <path d="M50 20C54.4 20 58 16.4 58 12C58 7.6 54.4 4 50 4C45.6 4 42 7.6 42 12C42 16.4 45.6 20 50 20ZM35 30C30 35 25 45 30 55L35 70L40 65L35 50L45 45V95H53V70H60V95H68V55C68 45 60 38 52 35V28L65 35L70 28C60 20 50 20 42 22L35 30Z" />
          </svg>
       </div>

       <div className="relative z-10 flex flex-col h-full">
         <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
               <div className="inline-flex items-center rounded-full bg-[#00FF88]/20 border border-[#00FF88]/50 px-3 py-1 mb-2 text-xs font-black text-[#00FF88] uppercase tracking-widest w-fit shadow-[0_0_15px_rgba(0,255,136,0.4)] backdrop-blur-md">
                  <Flame className="w-3.5 h-3.5 mr-2 text-red-500 animate-pulse" />
                  Live & Upcoming
               </div>
               <h3 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#00FF88] to-[#00FF88] drop-shadow-[0_0_10px_rgba(0,255,136,0.5)] flex items-center gap-2">
                  FIFA World Cup 2026
               </h3>
               <p className="text-[#00FF88]/70 text-sm font-medium mt-1">Match Schedule & Live Scores</p>
            </div>
            <Link to="/football" onClick={() => trackEvent('Football Widget Full Hub Clicked')}>
               <Button className="bg-gradient-to-r from-[#00FF88]/20 to-[#00D4FF]/20 text-[#00FF88] hover:bg-[#00FF88]/30 border-2 border-[#00FF88]/50 rounded-full px-6 font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all">
                  Full Hub <ChevronRight className="w-4 h-4 ml-2" />
               </Button>
            </Link>
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {events.map((event: any) => {
               const compHeader = event.competitions[0];
               const home = compHeader.competitors.find((c:any) => c.homeAway === 'home');
               const away = compHeader.competitors.find((c:any) => c.homeAway === 'away');
               const matchStatus = event.status.type.state;
               const detailText = event.status.type.detail;
               
               return (
                  <Card key={event.id} onClick={() => handleMatchClick(event.name)} className="bg-[rgba(0,0,0,0.45)] backdrop-blur-xl border border-border hover:border-[#00FF88]/60 transition-all duration-300 cursor-pointer group/card overflow-hidden hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(0,255,136,0.4)]">
                     <div className="bg-card px-4 py-2 text-[10px] font-black tracking-widest flex justify-between uppercase border-b border-border">
                        <span className={matchStatus === 'in' ? 'text-[#00FF88] animate-pulse flex items-center gap-1 drop-shadow-[0_0_5px_rgba(0,255,136,0.8)]' : 'text-[#00D4FF]'}><Activity className="w-3 h-3" /> {detailText}</span>
                        <span className="text-text-muted font-bold">{event.name}</span>
                     </div>
                     <CardContent className="p-5 flex justify-between items-center relative">
                        {/* Inner card glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.1)_0%,transparent_70%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        <div className="flex flex-col items-center gap-2 w-[40%] relative z-10">
                           <div className="w-14 h-14 md:w-16 md:h-16 bg-[#050816]/80 rounded-full p-2 border border-border group-hover/card:border-[#00D4FF]/50 group-hover/card:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all flex items-center justify-center">
                              <img src={home?.team?.logo || 'https://via.placeholder.com/64'} alt={home?.team?.name} className="w-full h-full object-contain" />
                           </div>
                           <span className="font-bold text-text text-sm md:text-base text-center group-hover/card:text-[#00D4FF] transition-colors">{home?.team?.shortDisplayName || home?.team?.name}</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1 w-[20%] relative z-10">
                           <div className="text-3xl md:text-4xl font-black flex items-center justify-center gap-2">
                              <span className={matchStatus === 'pre' ? 'text-text-muted' : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-[#00FF88] drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]'}>{home?.score ?? '-'}</span>
                              <span className="text-text-muted text-xl font-normal mb-1">:</span>
                              <span className={matchStatus === 'pre' ? 'text-text-muted' : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-[#00FF88] drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]'}>{away?.score ?? '-'}</span>
                           </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 w-[40%] relative z-10">
                           <div className="w-14 h-14 md:w-16 md:h-16 bg-[#050816]/80 rounded-full p-2 border border-border group-hover/card:border-[#8B5CF6]/50 group-hover/card:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center">
                              <img src={away?.team?.logo || 'https://via.placeholder.com/64'} alt={away?.team?.name} className="w-full h-full object-contain" />
                           </div>
                           <span className="font-bold text-text text-sm md:text-base text-center group-hover/card:text-[#8B5CF6] transition-colors">{away?.team?.shortDisplayName || away?.team?.name}</span>
                        </div>
                     </CardContent>
                  </Card>
               );
            })}
         </div>

         <div className="mt-8 flex justify-center backdrop-blur-sm bg-card p-3 rounded-2xl border border-border">
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[#00FF88]/80 text-xs md:text-sm font-bold uppercase tracking-wider w-full justify-center">
               <span onClick={() => { trackEvent('Football Widget Quick Link', { link: 'Team Standings' }); navigate('/football'); }} className="flex items-center gap-1.5 hover:text-text transition-colors cursor-pointer"><Trophy className="w-4 h-4" /> Team Standings</span>
               <span onClick={() => { trackEvent('Football Widget Quick Link', { link: 'Match Schedule' }); navigate('/football'); }} className="flex items-center gap-1.5 hover:text-text transition-colors cursor-pointer"><CalendarDays className="w-4 h-4" /> Match Schedule</span>
               <span onClick={() => { trackEvent('Football Widget Quick Link', { link: 'Top Scorers' }); navigate('/football'); }} className="flex items-center gap-1.5 hover:text-text transition-colors cursor-pointer"><Flame className="w-4 h-4" /> Top Scorers</span>
            </div>
         </div>
       </div>
    </div>
  );
}
