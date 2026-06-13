import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, CalendarDays, Search, Users, Shield, MapPin, Activity, Flame, ChevronRight, Filter, ArrowLeft, X } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Football() {
  const [activeTab, setActiveTab] = useState("matches");
  const [scoreboardCache, setScoreboardCache] = useState<any>(null);
  const [standingsCache, setStandingsCache] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchScoreboard = async () => {
    try {
      const res = await fetch("/api/football/scoreboard");
      if (res.ok) {
         setScoreboardCache(await res.json());
      }
    } catch (e) {
      // console.warn(e);
    }
  };

  const fetchStandings = async () => {
    try {
      const res = await fetch("/api/football/standings");
      if (res.ok) {
         setStandingsCache(await res.json());
      }
    } catch (e) {
      // console.warn(e);
    }
  };

  useEffect(() => {
    fetchScoreboard();
    fetchStandings();

    const scoreInterval = setInterval(fetchScoreboard, 30000);
    const standingsInterval = setInterval(fetchStandings, 300000);

    return () => {
      clearInterval(scoreInterval);
      clearInterval(standingsInterval);
    };
  }, []);

  const TABS = [
    { id: "matches", label: "Match Summary", icon: Activity },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "standings", label: "Groups", icon: Trophy },
    { id: "teams", label: "Teams", icon: Shield },
    { id: "stadiums", label: "Stadiums", icon: MapPin }
  ];

  const renderContent = () => {
    switch (activeTab) {
       case "matches":
          return <MatchCenter data={scoreboardCache} />;
       case "schedule":
          return <Schedule />;
       case "standings":
          return <Standings data={standingsCache} />;
       case "teams":
          return <TeamsSearch query={searchQuery} setQuery={setSearchQuery} />;
       case "stadiums":
          return <Stadiums />;
       default:
          return null;
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-7xl mx-auto w-full gap-8">
      {/* Header section */}
      <section className="relative z-10 w-full pt-4 pb-6 border-b border-blue-500/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-2"
           >
             <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
               <Trophy className="w-3.5 h-3.5 mr-2" />
               FIFA World Cup 2026 Hub
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text flex items-center gap-3">
               Football Center
               <span className="relative flex h-3 w-3 mt-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
               </span>
             </h1>
             <p className="text-muted-foreground text-lg max-w-2xl">
               Real-time livescores, group standings, schedules, and team deep-dives. 
             </p>
           </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
         {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-card text-muted-foreground border border-border hover:bg-card-hover'}`}
               >
                 <Icon className="w-4 h-4" />
                 {tab.label}
               </button>
            )
         })}
      </div>

      {/* Main Content Area */}
      <main className="w-full relative z-10 flex-1">
         <AnimatePresence mode="wait">
            <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
            >
               {renderContent()}
            </motion.div>
         </AnimatePresence>
      </main>
    </div>
  );
}

// ----------------------
// Sub-components
// ----------------------

function MatchCenter({ data }: { data: any }) {
  if (!data?.events) {
    return (
      <div className="h-64 flex items-center justify-center border border-border bg-card rounded-2xl w-full">
         <div className="animate-pulse flex flex-col items-center">
            <Activity className="w-8 h-8 text-blue-500/50 mb-3" />
            <p className="text-text-muted">Loading matches...</p>
         </div>
      </div>
    );
  }

  const events = data.events;

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text flex items-center gap-2">
             <Flame className="text-orange-500 w-5 h-5" />
             Live & Upcoming Matches
          </h2>
          <Button variant="outline" className="text-xs bg-card border-border hover:bg-card-hover">
             <Filter className="w-3.5 h-3.5 mr-2" />
             Filters
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {events.map((event: any) => {
             const compHeader = event.competitions[0];
             const home = compHeader.competitors.find((c:any) => c.homeAway === 'home');
             const away = compHeader.competitors.find((c:any) => c.homeAway === 'away');
             const matchStatus = event.status.type.state; // 'pre', 'in', 'post'
             const detailText = event.status.type.detail;
             
             return (
               <Card key={event.id} className="bg-[#0b1426]/80 border-blue-500/20 overflow-hidden hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all cursor-pointer group">
                  <div className="bg-card px-4 py-2 text-xs font-bold tracking-wider flex justify-between uppercase border-b border-border">
                     <span className={matchStatus === 'in' ? 'text-red-400 font-black' : 'text-blue-400'}>{detailText}</span>
                     <span className="text-text-muted">{event.name}</span>
                  </div>
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        {/* Home */}
                        <div className="flex flex-col items-center gap-3 w-1/3">
                           <div className="w-16 h-16 rounded-full bg-card-hover p-2 flex items-center justify-center border border-border group-hover:scale-110 transition-transform">
                              <img src={home?.team?.logo || 'https://via.placeholder.com/64'} alt={home?.team?.name} className="w-12 h-12 object-contain" />
                           </div>
                           <span className="font-bold text-text text-center text-sm md:text-base leading-tight">{home?.team?.shortDisplayName || home?.team?.name}</span>
                        </div>
                        
                        {/* Score */}
                        <div className="flex flex-col items-center justify-center w-1/3">
                           <div className="flex items-center gap-4 text-3xl md:text-4xl font-black">
                              <span className={matchStatus === 'pre' ? 'text-text-muted' : 'text-text'}>{home?.score ?? '-'}</span>
                              <span className="text-text-muted text-lg">vs</span>
                              <span className={matchStatus === 'pre' ? 'text-text-muted' : 'text-text'}>{away?.score ?? '-'}</span>
                           </div>
                           <Button variant="ghost" size="sm" className="mt-4 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 text-xs">
                              Match Details <ChevronRight className="w-3 h-3 ml-1" />
                           </Button>
                        </div>

                        {/* Away */}
                        <div className="flex flex-col items-center gap-3 w-1/3">
                           <div className="w-16 h-16 rounded-full bg-card-hover p-2 flex items-center justify-center border border-border group-hover:scale-110 transition-transform">
                              <img src={away?.team?.logo || 'https://via.placeholder.com/64'} alt={away?.team?.name} className="w-12 h-12 object-contain" />
                           </div>
                           <span className="font-bold text-text text-center text-sm md:text-base leading-tight">{away?.team?.shortDisplayName || away?.team?.name}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
             );
          })}
       </div>
    </div>
  );
}

function Standings({ data }: { data: any }) {
  if (!data?.children) {
    return (
      <div className="h-64 flex items-center justify-center border border-border bg-card rounded-2xl w-full">
         <div className="animate-pulse flex flex-col items-center">
            <Trophy className="w-8 h-8 text-blue-500/50 mb-3" />
            <p className="text-text-muted">Loading standings...</p>
         </div>
      </div>
    );
  }

  // data.children contains the groups
  const groups = data.children;

  return (
    <div className="flex flex-col gap-8">
       <h2 className="text-2xl font-bold text-text flex items-center gap-2 mb-2">
          Group Standings
       </h2>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groups.map((group: any) => {
             const standings = group.standings.entries;
             
             return (
               <div key={group.id} className="bg-[#0b1426]/80 rounded-2xl border border-border overflow-hidden">
                  <div className="bg-card px-4 py-3 font-bold text-blue-400 border-b border-border flex justify-between items-center">
                     {group.name}
                     <span className="text-xs font-normal text-text-muted uppercase">Pt | W-D-L (GD)</span>
                  </div>
                  <div className="flex flex-col">
                     {standings.map((entry: any, i: number) => {
                        return (
                           <div key={entry.team.id} className={`flex items-center justify-between p-3 px-4 ${i !== standings.length-1 ? 'border-b border-border' : ''} hover:bg-card-hover transition-colors`}>
                              <div className="flex items-center gap-3">
                                 <span className="font-mono text-text-muted w-4 font-bold">{i+1}</span>
                                 <img src={entry.team.logos?.[0]?.href || ''} className="w-6 h-6 object-contain" alt="" />
                                 <span className="font-bold text-text">{entry.team.displayName}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm font-mono">
                                 <span className="text-text font-bold">{entry.stats.find((s:any)=>s.name==='points')?.displayValue}</span>
                                 <div className="flex gap-2 text-text-muted w-24 justify-end">
                                    <span>{entry.stats.find((s:any)=>s.name==='wins')?.displayValue}</span>-
                                    <span>{entry.stats.find((s:any)=>s.name==='ties')?.displayValue}</span>-
                                    <span>{entry.stats.find((s:any)=>s.name==='losses')?.displayValue}</span>
                                    <span className="w-8 text-right font-bold text-text-muted">({entry.stats.find((s:any)=>s.name==='pointDifferential')?.displayValue})</span>
                                 </div>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               </div>
             )
          })}
       </div>
    </div>
  );
}


function TeamsSearch({ query, setQuery }: { query: string, setQuery: (q:string) => void }) {
  const [teamsData, setTeamsData] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [rosterData, setRosterData] = useState<any>(null);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState("");

  useEffect(() => {
    fetch('/api/football/teams').then(r=>r.json()).then(d => {
       if (d.sports?.[0]?.leagues?.[0]?.teams) {
          setTeamsData(d.sports[0].leagues[0].teams);
       }
    }).catch(e => console.warn(e));
  }, []);

  const fetchRoster = async (team: any) => {
     setSelectedTeam(team);
     setRosterLoading(true);
     setRosterError("");
     setRosterData(null);
     try {
       const res = await fetch(`/api/football/teams/${team.team.id}/roster`);
       if (!res.ok) throw new Error("Squad information currently unavailable.");
       
       const teamRes = await fetch(`/api/football/teams/${team.team.id}/details`);
       let teamDetails = null;
       if (teamRes.ok) {
          teamDetails = await teamRes.json();
          setSelectedTeam(teamDetails);
       } else {
          setSelectedTeam({ team: team.team }); // fallback
       }

       const data = await res.json();
       if (data.athletes && data.athletes.length > 0) {
         setRosterData(data);
       } else {
         throw new Error("Squad information currently unavailable.");
       }
     } catch (e: any) {
       setRosterError(e.message || "Squad information currently unavailable.");
     } finally {
       setRosterLoading(false);
     }
  };

  const filtered = teamsData ? teamsData.filter((t: any) => t.team.displayName.toLowerCase().includes(query.toLowerCase())) : [];

  if (selectedTeam) {
    const goalkeepers = rosterData?.athletes?.filter((a: any) => a.position.abbreviation === 'G' || a.position.name.toLowerCase().includes('goalkeeper')) || [];
    const defenders = rosterData?.athletes?.filter((a: any) => a.position.abbreviation === 'D' || a.position.name.toLowerCase().includes('defender')) || [];
    const midfielders = rosterData?.athletes?.filter((a: any) => a.position.abbreviation === 'M' || a.position.name.toLowerCase().includes('midfield')) || [];
    const forwards = rosterData?.athletes?.filter((a: any) => a.position.abbreviation === 'F' || a.position.abbreviation === 'S' || a.position.name.toLowerCase().includes('forward') || a.position.name.toLowerCase().includes('striker')) || [];

    return (
       <div className="flex flex-col gap-6 w-full relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row bg-[#0b1426]/80 p-6 rounded-2xl border border-border items-start md:items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                 <button onClick={() => setSelectedTeam(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text">
                    <ArrowLeft className="w-5 h-5" />
                 </button>
                 <img src={selectedTeam.team.logos?.[0]?.href} className="w-12 h-12 md:w-16 md:h-16 object-contain" alt={selectedTeam.team.name} />
                 <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-text leading-tight">{selectedTeam.team.displayName} Squad</h2>
                    <p className="text-text-muted text-sm mt-1">FIFA World Cup 2026 Roster {selectedTeam.team.standingSummary && `• ${selectedTeam.team.standingSummary}`}</p>
                 </div>
             </div>
             <div className="hidden md:flex flex-col items-end gap-1">
                {selectedTeam.team.location && <span className="text-text-muted font-medium text-sm flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/>{selectedTeam.team.location}</span>}
                {selectedTeam.team.nickname && <span className="text-blue-400 font-bold text-sm bg-blue-500/10 px-2 rounded-full border border-blue-500/20">{selectedTeam.team.nickname}</span>}
             </div>
          </div>
          
          {/* Roster Area */}
          {rosterLoading ? (
            <div className="h-64 border border-border bg-[#0b1426]/60 rounded-2xl flex flex-col items-center justify-center shadow-inner">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
               <p className="text-blue-400 font-medium tracking-wider">Loading Squad...</p>
            </div>
          ) : rosterError ? (
            <div className="h-64 border border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col items-center justify-center">
               <X className="w-10 h-10 text-red-500 mb-3" />
               <p className="text-red-400 font-bold text-lg">{rosterError}</p>
            </div>
          ) : rosterData ? (
             <div className="grid grid-cols-1 gap-8">
                 <RosterGroup title="Goalkeepers" players={goalkeepers} />
                 <RosterGroup title="Defenders" players={defenders} />
                 <RosterGroup title="Midfielders" players={midfielders} />
                 <RosterGroup title="Forwards" players={forwards} />
             </div>
          ) : null}
       </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b1426]/80 p-6 rounded-2xl border border-border">
          <h2 className="text-2xl font-bold text-text flex items-center gap-2">
             <Users className="w-5 h-5 text-blue-400" />
             National Teams
          </h2>
          <div className="relative w-full sm:w-auto">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
             <input 
                type="text" 
                placeholder="Search Teams (e.g. Argentina, Brazil)"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full sm:w-80 bg-card border border-border rounded-full py-2 pl-10 pr-4 text-sm text-text focus:outline-none focus:border-blue-500/50"
             />
          </div>
       </div>

       {teamsData ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {filtered.map((t: any) => (
                <Card key={t.team.id} onClick={() => fetchRoster(t)} className="bg-[#0b1426]/60 border-border hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-pointer group">
                   <CardContent className="p-6 flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-card-hover rounded-full flex items-center justify-center p-3 border border-border group-hover:scale-110 transition-transform">
                         <img src={t.team.logos?.[0]?.href} className="w-full h-full object-contain" alt={t.team.name} />
                      </div>
                      <div className="text-center">
                         <h3 className="font-bold text-text text-lg">{t.team.displayName}</h3>
                         <p className="text-xs text-text-muted">{t.team.abbreviation}</p>
                      </div>
                      <Button variant="outline" className="w-full text-xs bg-card border-border group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors pointer-events-none">
                         View Squad
                      </Button>
                   </CardContent>
                </Card>
             ))}
          </div>
       ) : (
          <div className="h-64 flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
       )}
    </div>
  );
}

function RosterGroup({ title, players }: { title: string, players: any[] }) {
   if (!players || players.length === 0) return null;
   return (
      <div className="flex flex-col gap-4">
         <h3 className="text-xl font-bold text-text border-b border-border pb-2">{title}</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {players.map((p: any) => (
               <Card key={p.id} className="bg-[#0b1426]/60 border-border overflow-hidden hover:border-blue-500/30 hover:bg-[#0f1d35] transition-colors group">
                  <CardContent className="p-4 flex gap-4 items-center">
                     <div className="relative w-14 h-14 bg-card rounded-full overflow-hidden border border-border shrink-0 shadow-inner group-hover:border-blue-500/50">
                        {p.headshot?.href ? (
                           <img src={p.headshot.href} alt={p.displayName} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-blue-500/20 text-blue-400 font-bold">
                              {p.displayName.charAt(0)}
                           </div>
                        )}
                        {p.jersey && (
                           <div className="absolute -bottom-1 -right-1 bg-blue-600 text-text text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#0b1426]">
                              #{p.jersey}
                           </div>
                        )}
                     </div>
                     <div className="flex flex-col min-w-0 flex-1">
                        <h4 className="text-text font-bold truncate text-sm" title={p.displayName}>{p.displayName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] text-blue-300 font-bold bg-blue-500/20 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase tracking-wider">{p.position.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] text-text-muted">{p.age ? `${p.age} yrs` : ''}</span>
                           {p.citizenship && (
                              <>
                                 <span className="text-text-muted text-[10px]">•</span>
                                 <span className="text-[10px] text-text-muted truncate w-full">{p.citizenship}</span>
                              </>
                           )}
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
}

function Stadiums() {
   // Hardcoded venues for WC 2026 (partial list for demo)
   const stadiums = [
      { name: "Estadio Azteca", city: "Mexico City", country: "Mexico", capacity: "83,264", img: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=600" },
      { name: "MetLife Stadium", city: "New York/New Jersey", country: "USA", capacity: "82,500", img: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=600" },
      { name: "AT&T Stadium", city: "Dallas", country: "USA", capacity: "80,000", img: "https://images.unsplash.com/photo-1614631446501-abcf76949eca?auto=format&fit=crop&q=80&w=600" },
      { name: "Arrowhead Stadium", city: "Kansas City", country: "USA", capacity: "76,416", img: "https://images.unsplash.com/photo-1508344928928-7137b29de218?auto=format&fit=crop&q=80&w=600" },
      { name: "BMO Field", city: "Toronto", country: "Canada", capacity: "30,000", img: "https://images.unsplash.com/photo-1518091043644-c1d445cbf92b?auto=format&fit=crop&q=80&w=600" },
      { name: "BC Place", city: "Vancouver", country: "Canada", capacity: "54,500", img: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=600" },
   ];

   return (
      <div className="flex flex-col gap-6">
         <h2 className="text-2xl font-bold text-text flex items-center gap-2">
             <MapPin className="text-blue-400 w-5 h-5" />
             Host Venues (North America)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {stadiums.map((s, idx) => (
                <Card key={idx} className="bg-[#0b1426]/80 overflow-hidden border-border group cursor-pointer">
                   <div className="h-48 overflow-hidden relative">
                      <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1426] via-transparent to-transparent"></div>
                      <div className="absolute top-3 right-3 bg-card backdrop-blur-md px-3 py-1 rounded-full border border-border text-xs font-bold text-text flex items-center gap-1">
                         <Users className="w-3 h-3 text-blue-400" />
                         {s.capacity}
                      </div>
                   </div>
                   <CardContent className="p-5 flex flex-col gap-1 relative z-10 -mt-8">
                      <h3 className="text-xl font-bold text-text">{s.name}</h3>
                      <p className="text-blue-400/80 font-medium text-sm flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                         {s.city}, {s.country}
                      </p>
                   </CardContent>
                </Card>
             ))}
          </div>
      </div>
   );
}

function Schedule() {
  const [filter, setFilter] = useState("All Matches");
  const [teamFilter, setTeamFilter] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date("2026-06-04T16:58:15Z"));
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/football/schedule')
      .then(res => res.json())
      .then(data => {
         if (data?.events) {
            setEvents(data.events);
         }
         setLoading(false);
      })
      .catch(e => {
         console.warn(e);
         setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date()); 
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getFilteredMatches = () => {
     const today = new Date(currentTime);
     today.setHours(0,0,0,0);
     
     const tomorrow = new Date(today);
     tomorrow.setDate(tomorrow.getDate() + 1);

     const endOfWeek = new Date(today);
     endOfWeek.setDate(today.getDate() + 7);

     return events.filter(match => {
        const matchDate = new Date(match.date);
        const stage = match.season?.slug || "group-stage";
        
        let matchFilter = true;
        if (filter === "Today") {
           matchFilter = matchDate >= today && matchDate < tomorrow;
        } else if (filter === "Tomorrow") {
           const nextDay = new Date(tomorrow);
           nextDay.setDate(nextDay.getDate() + 1);
           matchFilter = matchDate >= tomorrow && matchDate < nextDay;
        } else if (filter === "This Week") {
           matchFilter = matchDate >= today && matchDate <= endOfWeek;
        } else if (filter === "Group Stage") {
           matchFilter = stage.includes("group");
        } else if (filter === "Knockout Stage") {
           matchFilter = !stage.includes("group");
        }

        let passTeamMatch = true;
        if (teamFilter.trim() !== "") {
           const search = teamFilter.toLowerCase();
           const homeTeam = match.competitions?.[0]?.competitors?.find((c: any) => c.homeAway === "home")?.team?.displayName?.toLowerCase() || "";
           const awayTeam = match.competitions?.[0]?.competitors?.find((c: any) => c.homeAway === "away")?.team?.displayName?.toLowerCase() || "";
           const matchName = match.name?.toLowerCase() || "";
           passTeamMatch = homeTeam.includes(search) || awayTeam.includes(search) || matchName.includes(search);
        }

        return matchFilter && passTeamMatch;
     }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getMatchStatus = (dateStr: string, state: string) => {
     if (state === "post") return { status: "Finished", text: "FT" };
     if (state === "in") return { status: "Live", text: "LIVE" };

     const matchTime = new Date(dateStr).getTime();
     const now = currentTime.getTime();
     const diffMs = matchTime - now;
     
     if (diffMs < 0) return { status: "Live", text: "LIVE" };
     
     const hours = Math.floor(diffMs / 3600000);
     const mins = Math.floor((diffMs % 3600000) / 60000);
     if (hours > 24) {
        const days = Math.floor(hours / 24);
        return { status: "Upcoming", text: `In ${days} day${days > 1 ? 's' : ''}` };
     }
     if (hours > 0) return { status: "Upcoming", text: `In ${hours}h ${mins}m` };
     return { status: "Upcoming", text: `In ${mins}m` };
  };

  const allMatches = getFilteredMatches();
  const MATCHES_PER_PAGE = 20;
  const matches = allMatches.slice(0, page * MATCHES_PER_PAGE);
  const hasMore = matches.length < allMatches.length;

  const filters = ["All Matches", "Today", "Tomorrow", "This Week", "Group Stage", "Knockout Stage"];

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
       <div className="flex flex-wrap items-center gap-2 mb-2">
          {filters.map(f => (
             <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${filter === f ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-card-hover text-gray-400 border border-border hover:bg-white/10'}`}
             >
                {f}
             </button>
          ))}
          <div className="relative ml-auto flex-1 min-w-[200px] max-w-sm">
             <input
                type="text"
                placeholder="Search team..."
                value={teamFilter}
                onChange={(e) => { setTeamFilter(e.target.value); setPage(1); }}
                className="w-full bg-card border border-border rounded-full px-4 py-2 text-sm text-text placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
             />
          </div>
       </div>

       {loading ? (
          <div className="text-center py-12 bg-card-hover rounded-2xl border border-border">
             <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
             <p className="text-text-muted font-medium">Loading World Cup 2026 Fixtures...</p>
          </div>
       ) : (
          <>
             <div className="grid grid-cols-1 gap-4">
                {matches.map((match: any) => {
                   const competition = match.competitions[0];
                   const homeTeam = competition.competitors.find((c: any) => c.homeAway === "home")?.team;
                   const awayTeam = competition.competitors.find((c: any) => c.homeAway === "away")?.team;
                   const state = match.status?.type?.state || "pre";
                   
                   const statusObj = getMatchStatus(match.date, state);
                   const matchDate = new Date(match.date);
                   const timeString = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
                   const dateString = matchDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
                   
                   const stageName = match.season?.slug?.replace(/-/g, ' ').toUpperCase() || "STAGE";
                   const venue = competition?.venue?.fullName || "TBD";
                   const city = competition?.venue?.address?.city || "";
                   const stadiumName = city ? `${venue}, ${city}` : venue;
                   
                   return (
                      <Card key={match.id} className="bg-gradient-to-r from-black/60 to-black/40 border-border overflow-hidden relative group hover:border-blue-500/30 transition-all duration-300">
                         <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30 group-hover:bg-blue-500 transition-colors duration-300 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                         <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row items-stretch">
                               <div className="md:w-48 bg-card-hover p-4 flex flex-row md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-border gap-2">
                                  <div className="text-center">
                                     <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{dateString}</p>
                                     <p className="text-blue-400 text-xl md:text-2xl font-black">{timeString}</p>
                                  </div>
                                  <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider whitespace-nowrap mt-2
                                     ${statusObj.status === 'Live' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}
                                     ${statusObj.status === 'Finished' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' : ''}
                                     ${statusObj.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : ''}
                                  `}>
                                     {statusObj.text}
                                  </div>
                               </div>
                               
                               <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                                  <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                                     <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-blue-500/80">{stageName}</span>
                                     <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-text-muted font-medium text-right">
                                        <MapPin className="w-3 h-3 text-text-muted shrink-0" />
                                        {stadiumName}
                                     </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-2 gap-4">
                                     <div className="flex-1 flex items-center justify-end gap-3 md:gap-4 group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm sm:text-lg md:text-2xl font-black text-text text-right leading-tight">{homeTeam?.displayName || "TBD"}</span>
                                        {homeTeam?.logo ? (
                                           <img src={homeTeam.logo} alt={homeTeam.abbreviation} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain drop-shadow-lg" />
                                        ) : (
                                           <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 rounded-full" />
                                        )}
                                     </div>
                                     
                                     <div className="px-3 sm:px-4 py-2 bg-card rounded-xl border border-border font-black text-text-muted text-sm sm:text-lg mx-1 sm:mx-2">
                                        VS
                                     </div>
                                     
                                     <div className="flex-1 flex items-center justify-start gap-3 md:gap-4 group-hover:-translate-x-1 transition-transform">
                                        {awayTeam?.logo ? (
                                           <img src={awayTeam.logo} alt={awayTeam.abbreviation} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain drop-shadow-lg" />
                                        ) : (
                                           <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 rounded-full" />
                                        )}
                                        <span className="text-sm sm:text-lg md:text-2xl font-black text-text leading-tight">{awayTeam?.displayName || "TBD"}</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                   );
                })}
                
                {matches.length === 0 && (
                   <div className="text-center py-12 bg-card-hover rounded-2xl border border-border backdrop-blur-sm">
                      <CalendarDays className="w-12 h-12 text-text-muted mx-auto mb-3" />
                      <p className="text-text-muted font-medium text-lg">No matches found for this filter.</p>
                   </div>
                )}
             </div>

             {hasMore && (
                <div className="mt-6 flex justify-center">
                   <button 
                      onClick={() => setPage(prev => prev + 1)}
                      className="px-6 py-3 rounded-full bg-card-hover border border-border text-text-muted font-bold hover:bg-white/10 transition-colors duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                   >
                      Load More Matches
                   </button>
                </div>
             )}
          </>
       )}
    </div>
  );
}
