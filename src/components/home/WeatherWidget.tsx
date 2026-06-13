import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, MapPin, Loader2, ThermometerSun, ArrowRight, Gauge, Navigation, Sunrise, Sunset, CalendarDays, CloudLightning, Snowflake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const CITIES = [
  { name: 'Dubai', lat: 25.276987, lon: 55.296249, icon: Sun },
  { name: 'New York', lat: 40.7128, lon: -74.0060, icon: Cloud },
  { name: 'London', lat: 51.5074, lon: -0.1278, icon: CloudRain },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, icon: Sun },
  { name: 'El Salvador', lat: 13.794185, lon: -88.89653, icon: ThermometerSun },
];

export function WeatherWidget() {
  const [activeCity, setActiveCity] = useState(CITIES[0]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${activeCity.lat}&longitude=${activeCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=6`);
        const data = await res.json();
        if (isMounted) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load weather data", error);
        if (isMounted) setLoading(false);
      }
    };
    loadWeather();
    return () => { isMounted = false; };
  }, [activeCity.name]);

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Unknown";
  };

  const getWeatherIcon = (code: number, isDay: number, className: string = "w-16 h-16") => {
    if (code === 0) return isDay ? <Sun className={`${className} text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]`} /> : <Sun className={`${className} text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.6)]`} />;
    if (code >= 1 && code <= 3) return <Cloud className={`${className} text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]`} />;
    if (code >= 51 && code <= 67) return <CloudRain className={`${className} text-[#00D4FF] drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]`} />;
    if (code >= 71 && code <= 77) return <Snowflake className={`${className} text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />;
    if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-[#00D4FF] drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]`} />;
    if (code >= 95 && code <= 99) return <CloudLightning className={`${className} text-slate-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]`} />;
    return <Sun className={`${className} text-[#FFD700]`} />;
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getDayName = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const WeatherScene = ({ code, isDay }: { code: number, isDay: number }) => {
    const isSunny = code === 0 && isDay;
    const isClearNight = code === 0 && !isDay;
    const isCloudyDay = code >= 1 && code <= 48 && isDay;
    const isCloudyNight = code >= 1 && code <= 48 && !isDay;
    const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
    const isSnow = code >= 71 && code <= 77;
    const isStorm = code >= 95 && code <= 99;

    let baseGradient = "bg-gradient-to-br from-[#00D4FF]/20 to-[#8B5CF6]/20";
    if (isSunny) baseGradient = "bg-gradient-to-b from-[#0C4A6E] via-[#0284C7] to-[#38BDF8]";
    else if (isClearNight) baseGradient = "bg-gradient-to-b from-[#020617] via-[#0F172A] to-[#1E1B4B]";
    else if (isCloudyDay) baseGradient = "bg-gradient-to-b from-[#475569] via-[#64748B] to-[#94A3B8]";
    else if (isCloudyNight) baseGradient = "bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#334155]";
    else if (isRain) baseGradient = "bg-gradient-to-b from-[#0F172A] via-[#1E3A8A] to-[#1E40AF]";
    else if (isSnow) baseGradient = "bg-gradient-to-b from-[#64748B] via-[#94A3B8] to-[#CBD5E1]";
    else if (isStorm) baseGradient = "bg-gradient-to-b from-[#020617] via-[#0F172A] to-[#1E1B4B]";

    return (
      <div className={`absolute inset-0 overflow-hidden ${baseGradient}`}>
         {isSunny && (
            <>
               <motion.div
                 className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-radial from-[#FFA500]/40 via-[#FFD700]/10 to-transparent rounded-full mix-blend-screen filter blur-[60px]"
                 animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
               />
               <div className="absolute top-[10%] right-[15%] w-32 h-32 bg-[#FEF08A] rounded-full blur-[2px] shadow-[0_0_120px_rgba(253,224,71,1)]" />
               <motion.div
                 className="absolute top-[30%] left-[-20%] w-[800px] h-[300px] bg-white/20 rounded-full blur-[80px]"
                 animate={{ x: [0, 150, 0] }}
                 transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
               />
            </>
         )}

         {isClearNight && (
            <>
               {Array.from({ length: 80 }).map((_, i) => (
                 <motion.div
                   key={`star-${i}`}
                   className="absolute bg-white rounded-full"
                   style={{
                     width: Math.random() * 3 + 1 + 'px',
                     height: Math.random() * 3 + 1 + 'px',
                     top: `${Math.random() * 100}%`,
                     left: `${Math.random() * 100}%`,
                   }}
                   animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.2, 0.8] }}
                   transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
                 />
               ))}
               <div className="absolute top-[10%] right-[15%] w-40 h-40 bg-[#E2E8F0] rounded-full blur-[2px] shadow-[0_0_120px_rgba(226,232,240,0.6)]" />
               <motion.div
                 className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-radial from-blue-300/10 to-transparent rounded-full mix-blend-screen filter blur-[80px]"
                 animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
                 transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               />
            </>
         )}

         {(isCloudyDay || isCloudyNight) && (
            <>
               <motion.div
                 className="absolute top-[0%] left-[-40%] w-[1200px] h-[500px] bg-white/20 rounded-full blur-[100px]"
                 animate={{ x: [0, 300, 0] }}
                 transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
               />
               <motion.div
                 className="absolute top-[40%] right-[-40%] w-[1000px] h-[600px] bg-[#334155]/40 rounded-full blur-[100px]"
                 animate={{ x: [0, -200, 0] }}
                 transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
               />
               {isCloudyDay && (
                 <div className="absolute top-[10%] right-[20%] w-48 h-48 bg-[#FFD700]/20 rounded-full blur-[50px]" />
               )}
            </>
         )}

         {isRain && (
            <>
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#020617]/50 to-transparent opacity-90 z-0" />
               <motion.div
                 className="absolute top-[-10%] right-[-20%] w-[1000px] h-[500px] bg-[#0F172A]/80 rounded-full blur-[120px]"
                 animate={{ x: [0, -100, 0] }}
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               />
               {Array.from({ length: 120 }).map((_, i) => (
                 <motion.div
                   key={`rain-${i}`}
                   className="absolute w-[2px] bg-gradient-to-b from-transparent via-[#00D4FF]/60 to-[#00D4FF]"
                   style={{ height: Math.random() * 40 + 40 + 'px' }}
                   initial={{ y: -200, x: Math.random() * 1500 - 200, opacity: 0 }}
                   animate={{ y: 1500, x: Math.random() * 1500 - 200, opacity: [0, 1, 0.8, 0] }}
                   transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: Math.random() * 1, ease: "linear" }}
                 />
               ))}
            </>
         )}

         {isSnow && (
            <>
               <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#475569]/80 to-transparent" />
               <motion.div
                 className="absolute top-[-10%] right-[-20%] w-[1000px] h-[500px] bg-[#94A3B8]/60 rounded-full blur-[120px]"
                 animate={{ x: [0, -100, 0] }}
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               />
               {Array.from({ length: 80 }).map((_, i) => (
                 <motion.div
                   key={`snow-${i}`}
                   className="absolute bg-white rounded-full opacity-90 filter blur-[1px]"
                   style={{
                     width: Math.random() * 5 + 3 + 'px',
                     height: Math.random() * 5 + 3 + 'px',
                   }}
                   initial={{ y: -50, x: Math.random() * 1500 - 200, opacity: 0 }}
                   animate={{ 
                     y: 1500, 
                     x: (Math.random() * 1500 - 200) + (Math.random() * 300 - 150),
                     opacity: [0, 0.9, 0] 
                   }}
                   transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 3, ease: "easeInOut" }}
                 />
               ))}
            </>
         )}

         {isStorm && (
            <>
               <div className="absolute top-0 left-0 w-full h-full bg-[#020617]/90" />
               <motion.div
                 className="absolute top-[-10%] left-[-20%] w-[1200px] h-[600px] bg-[#1E1B4B]/90 rounded-full blur-[150px]"
                 animate={{ x: [0, 100, 0] }}
                 transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               />
               <motion.div
                 className="absolute inset-0 bg-[#00D4FF] mix-blend-screen"
                 animate={{ opacity: [0, 0, 0, 0.8, 0, 0, 0, 0.5, 0] }}
                 transition={{ duration: 8, repeat: Infinity, times: [0, 0.8, 0.81, 0.82, 0.85, 0.9, 0.91, 0.92, 1], ease: "linear" }}
               />
               {Array.from({ length: 150 }).map((_, i) => (
                 <motion.div
                   key={`storm-rain-${i}`}
                   className="absolute w-[2px] bg-gradient-to-b from-transparent to-[#00D4FF]/80"
                   style={{ height: Math.random() * 60 + 60 + 'px' }}
                   initial={{ y: -200, x: Math.random() * 1500 - 200, opacity: 0 }}
                   animate={{ y: 1500, x: Math.random() * 1500 - 200, opacity: [0, 1, 0.6, 0] }}
                   transition={{ duration: 0.3 + Math.random() * 0.2, repeat: Infinity, delay: Math.random() * 1, ease: "linear" }}
                 />
               ))}
            </>
         )}
      </div>
    );
  };

  return (
    <Card className="bg-card backdrop-blur-md border border-border shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative group rounded-3xl">
      <AnimatePresence mode="wait">
        <motion.div 
          key={weatherData ? `${weatherData.current.weather_code}-${weatherData.current.is_day}` : 'default'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          {weatherData ? (
             <WeatherScene code={weatherData.current.weather_code} isDay={weatherData.current.is_day} />
          ) : (
             <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/20 to-[#0284C7]/20" />
          )}
        </motion.div>
      </AnimatePresence>
      <CardContent className="p-6 md:p-8 relative z-10">
      
        {/* City Selector */}
        <div className="flex flex-row gap-2 overflow-x-auto pb-6 hide-scrollbar scroll-smooth">
          {CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => setActiveCity(city)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-md ${activeCity.name === city.name ? 'bg-white/20 border border-white/50 text-white shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-lg scale-105' : 'bg-black/30 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-md'}`}
            >
              <city.icon className={`w-4 h-4 ${activeCity.name === city.name ? 'text-[#00D4FF]' : 'text-white/50'}`} />
              <span className="text-sm tracking-wide">{city.name}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 min-h-[400px]">
             <Loader2 className="w-12 h-12 text-[#00D4FF] animate-spin mb-6 drop-shadow-[0_0_15px_rgba(0,212,255,0.6)]" />
             <p className="text-white/80 text-lg font-bold tracking-widest uppercase animate-pulse">Synchronizing Atmosphere...</p>
          </div>
        ) : weatherData?.current ? (
          <div className="flex flex-col lg:flex-row gap-6">
             {/* Left Column: Hero & Metrics */}
             <div className="w-full lg:w-[65%] flex flex-col gap-6">
                
                {/* Hero Widget */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="bg-black/20 rounded-3xl border border-white/20 p-8 md:p-10 relative overflow-hidden backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex flex-col justify-between min-h-[320px]"
                >
                  <div className="flex justify-between items-start w-full">
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-white/90 drop-shadow-md mb-2">
                           <MapPin className="w-5 h-5 text-[#00D4FF]" />
                           <h2 className="text-2xl md:text-3xl font-black tracking-wide">{activeCity.name}</h2>
                        </div>
                        <p className="text-white/80 font-bold text-lg drop-shadow-sm flex items-center gap-2">
                          Feels like {Math.round(weatherData.current.apparent_temperature)}°
                        </p>
                     </div>
                     <div className="flex flex-col items-end">
                       <h3 className="text-7xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
                         {Math.round(weatherData.current.temperature_2m)}°
                       </h3>
                     </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-8 gap-4 w-full">
                     <div className="flex items-center gap-4">
                        {getWeatherIcon(weatherData.current.weather_code, weatherData.current.is_day, "w-16 h-16 md:w-20 md:h-20")}
                        <p className="text-white text-3xl md:text-4xl font-black tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] capitalize">
                          {getWeatherDescription(weatherData.current.weather_code)}
                        </p>
                     </div>
                     
                     <div className="flex flex-wrap items-center gap-4 text-white/90 font-bold bg-black/30 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md w-full md:w-auto justify-center md:justify-start">
                        <div className="flex items-center gap-2">
                           <ThermometerSun className="w-5 h-5 text-red-400" />
                           <span>{Math.round(weatherData.daily.temperature_2m_max[0])}° High</span>
                        </div>
                        <div className="w-[1px] h-6 bg-white/20 hidden md:block"></div>
                        <div className="flex items-center gap-2">
                           <ThermometerSun className="w-5 h-5 text-blue-400" />
                           <span>{Math.round(weatherData.daily.temperature_2m_min[0])}° Low</span>
                        </div>
                        <div className="w-[1px] h-6 bg-white/20 hidden md:block"></div>
                        <div className="flex items-center gap-2">
                           <Sunrise className="w-5 h-5 text-[#FFD700]" />
                           <span>{formatTime(weatherData.daily.sunrise[0])}</span>
                        </div>
                        <div className="w-[1px] h-6 bg-white/20 hidden md:block"></div>
                        <div className="flex items-center gap-2">
                           <Sunset className="w-5 h-5 text-orange-400" />
                           <span>{formatTime(weatherData.daily.sunset[0])}</span>
                        </div>
                     </div>
                  </div>
                </motion.div>
                
                {/* Premium Metrics Row */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, type: 'spring' }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                   <div className="bg-black/30 border border-white/15 rounded-3xl p-5 flex flex-col gap-3 hover:bg-black/40 transition-all backdrop-blur-xl group shadow-lg">
                      <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] group-hover:scale-110 transition-transform">
                         <Droplets className="w-5 h-5" />
                      </div>
                      <span className="text-white/70 text-xs font-black uppercase tracking-widest">Humidity</span>
                      <span className="text-white font-black text-2xl drop-shadow-sm">{weatherData.current.relative_humidity_2m}%</span>
                   </div>
                   
                   <div className="bg-black/30 border border-white/15 rounded-3xl p-5 flex flex-col gap-3 hover:bg-black/40 transition-all backdrop-blur-xl group shadow-lg">
                      <div className="w-10 h-10 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                         <Wind className="w-5 h-5" />
                      </div>
                      <span className="text-white/70 text-xs font-black uppercase tracking-widest">Wind</span>
                      <span className="text-white font-black text-2xl drop-shadow-sm flex items-end gap-1">{weatherData.current.wind_speed_10m} <span className="text-xs text-white/50 mb-1 tracking-wider">KM/H</span></span>
                   </div>
                   
                   <div className="bg-black/30 border border-white/15 rounded-3xl p-5 flex flex-col gap-3 hover:bg-black/40 transition-all backdrop-blur-xl group shadow-lg">
                      <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                         <Sun className="w-5 h-5" />
                      </div>
                      <span className="text-white/70 text-xs font-black uppercase tracking-widest">UV Index</span>
                      <span className="text-white font-black text-2xl drop-shadow-sm">{weatherData.daily.uv_index_max[0]}</span>
                   </div>
                   
                   <div className="bg-black/30 border border-white/15 rounded-3xl p-5 flex flex-col gap-3 hover:bg-black/40 transition-all backdrop-blur-xl group shadow-lg">
                      <div className="w-10 h-10 rounded-full bg-orange-400/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                         <Gauge className="w-5 h-5" />
                      </div>
                      <span className="text-white/70 text-xs font-black uppercase tracking-widest">Pressure</span>
                      <span className="text-white font-black text-2xl drop-shadow-sm flex items-end gap-1">{Math.round(weatherData.current.surface_pressure)} <span className="text-xs text-white/50 mb-1 tracking-wider">HPA</span></span>
                   </div>
                </motion.div>
                
             </div>
             
             {/* Right Column: Forecast */}
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
                className="w-full lg:w-[35%] bg-black/20 rounded-3xl border border-white/20 p-6 md:p-8 backdrop-blur-xl shadow-lg flex flex-col h-full min-h-[320px]"
             >
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                   <CalendarDays className="w-5 h-5 text-[#00D4FF]" />
                   <h4 className="text-white font-black uppercase tracking-widest text-sm">5-Day Forecast</h4>
                </div>
                
                <div className="flex flex-col gap-1 w-full justify-between flex-1">
                   {weatherData.daily.time.slice(1, 6).map((timeStr: string, index: number) => (
                      <div key={timeStr} className="flex items-center justify-between py-3 px-2 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-xl transition-colors">
                         <span className="text-white font-bold w-12">{getDayName(timeStr)}</span>
                         <div className="flex items-center justify-center w-12">
                            {getWeatherIcon(weatherData.daily.weather_code[index + 1], 1, "w-8 h-8")}
                         </div>
                         <div className="flex items-center gap-3 font-bold w-24 justify-end">
                            <span className="text-white/50">{Math.round(weatherData.daily.temperature_2m_min[index + 1])}°</span>
                            <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"></div>
                            <span className="text-white">{Math.round(weatherData.daily.temperature_2m_max[index + 1])}°</span>
                         </div>
                      </div>
                   ))}
                </div>
             </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-white/70 text-lg font-medium">Weather data unavailable</div>
          </div>
        )}

        {/* Open Weather Hub Button */}
        <div className="mt-8 relative z-20 w-full">
          <Link to="/weather" onClick={() => {}} className="flex items-center justify-center w-full bg-gradient-to-r from-[#00D4FF] to-[#0284C7] hover:from-[#00BFFF] hover:to-[#0369A1] text-white font-black text-[15px] tracking-widest uppercase py-4 rounded-2xl shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all transform hover:-translate-y-0.5 relative overflow-hidden group border border-white/20">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
              🌤 OPEN VERSE WEATHER HUB
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

