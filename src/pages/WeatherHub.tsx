import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Loader2, ThermometerSun, Search, Sunrise, Sunset, Navigation2, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';

// Types
interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    is_day: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export default function WeatherHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState({ name: 'New York', lat: 40.7128, lon: -74.0060 });
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCityCoords = async (city: string) => {
    try {
      setSearching(true);
      setError(null);
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return {
          name: `${data.results[0].name}${data.results[0].country ? `, ${data.results[0].country}` : ''}`,
          lat: data.results[0].latitude,
          lon: data.results[0].longitude
        };
      }
      throw new Error("City not found");
    } catch (err) {
      throw err;
    } finally {
      setSearching(false);
    }
  };

  const loadWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Weather fetch error", err);
      setError("Failed to load weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(activeCity.lat, activeCity.lon);
  }, [activeCity.lat, activeCity.lon]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const cityData = await fetchCityCoords(searchQuery);
      setActiveCity(cityData);
      setSearchQuery(cityData.name);
    } catch (err) {
      setError("City not found. Try a different search.");
    }
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear sky";
    if (code >= 1 && code <= 3) return "Partly cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Unknown";
  };

  const getWeatherIcon = (code: number, isDay: number = 1, className: string = "w-16 h-16") => {
    if (code === 0) return isDay ? <Sun className={`${className} text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]`} /> : <Sun className={`${className} text-blue-200`} />;
    if (code >= 1 && code <= 3) return <Cloud className={`${className} text-gray-300 drop-shadow-[0_0_10px_rgba(156,163,175,0.5)]`} />;
    if (code >= 51 && code <= 67) return <CloudRain className={`${className} text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]`} />;
    if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]`} />;
    if (code >= 71 && code <= 77) return <Cloud className={`${className} text-text drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]`} />;
    return <Sun className={`${className} text-yellow-400`} />;
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDateDay = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString([], { weekday: 'short' });
  };

  return (
    <div className="w-full flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#00BFFF] drop-shadow-[0_0_15px_rgba(0,191,255,0.4)] tracking-tighter">
            OPEN WEATHER HUB
          </h1>
          <p className="text-text-muted font-medium tracking-wide">Real-time global atmospheric data</p>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-auto relative group flex-shrink-0">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-[#00D4FF] brightness-125" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city..."
            className="w-full md:w-[320px] lg:w-[400px] h-12 bg-black/40 border-2 border-[#00D4FF] focus-within:border-[#00FFFF] rounded-2xl py-3 pl-12 pr-10 text-white placeholder-white/80 outline-none shadow-[0_0_15px_rgba(0,212,255,0.4)] focus:shadow-[0_0_25px_rgba(0,212,255,0.6)] transition-all backdrop-blur-md font-bold text-[16px]"
          />
          {searching && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              <Loader2 className="w-5 h-5 text-[#00D4FF] animate-spin" />
            </div>
          )}
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-sm">
          {error}
        </div>
      )}

      {loading && !weatherData ? (
        <div className="w-full h-64 flex flex-col items-center justify-center bg-card rounded-3xl border border-border backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-[#00FFFF] animate-spin mb-4" />
          <p className="text-text-muted font-medium">Synchronizing atmospheric data...</p>
        </div>
      ) : weatherData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Current Weather */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-[#050816]/90 to-[#0A1035]/90 border border-border overflow-hidden relative h-full">
              <div className="absolute top-0 right-0 p-8 opacity-20 blur-3xl pointer-events-none">
                {getWeatherIcon(weatherData.current.weather_code, weatherData.current.is_day, "w-64 h-64")}
              </div>
              <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                     <Navigation2 className="w-5 h-5 text-[#00D4FF]" />
                     <span className="text-[#00D4FF] font-black uppercase tracking-widest text-sm">Current Location</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black text-text tracking-tight mb-8">
                     {activeCity.name}
                   </h2>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-auto">
                   <div className="flex items-center gap-6">
                     {getWeatherIcon(weatherData.current.weather_code, weatherData.current.is_day, "w-24 h-24 md:w-32 md:h-32")}
                     <div>
                       <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tighter tabular-nums drop-shadow-lg">
                         {Math.round(weatherData.current.temperature_2m)}°
                       </div>
                       <p className="text-[#00FFFF] text-xl md:text-2xl font-bold mt-2">
                         {getWeatherDescription(weatherData.current.weather_code)}
                       </p>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 md:gap-6 bg-card rounded-2xl p-6 border border-border backdrop-blur-md">
                     <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase">
                         <Droplets className="w-3 h-3 text-blue-400" /> Humidity
                       </div>
                       <div className="text-xl font-bold text-text tabular-nums">{weatherData.current.relative_humidity_2m}%</div>
                     </div>
                     <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase">
                         <Wind className="w-3 h-3 text-teal-400" /> Wind Speed
                       </div>
                       <div className="text-xl font-bold text-text tabular-nums">{weatherData.current.wind_speed_10m} km/h</div>
                     </div>
                     
                     {weatherData.daily.sunrise[0] && (
                       <>
                         <div className="flex flex-col gap-1 mt-2">
                           <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase">
                             <Sunrise className="w-3 h-3 text-yellow-400" /> Sunrise
                           </div>
                           <div className="text-sm md:text-base font-bold text-text tabular-nums">{formatTime(weatherData.daily.sunrise[0])}</div>
                         </div>
                         <div className="flex flex-col gap-1 mt-2">
                           <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase">
                             <Sunset className="w-3 h-3 text-orange-400" /> Sunset
                           </div>
                           <div className="text-sm md:text-base font-bold text-text tabular-nums">{formatTime(weatherData.daily.sunset[0])}</div>
                         </div>
                       </>
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 5-Day Forecast */}
          <div className="lg:col-span-1">
            <Card className="bg-card border border-border h-full backdrop-blur-md">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarDays className="w-5 h-5 text-[#00FFFF]" />
                  <h3 className="text-lg font-bold text-text">5-Day Forecast</h3>
                </div>
                
                <div className="flex flex-col gap-3 flex-1 justify-between">
                  {weatherData.daily.time.slice(0, 5).map((time, index) => (
                    <div key={time} className="flex items-center justify-between p-4 rounded-xl bg-card-hover border border-border hover:bg-white/10 transition-colors">
                      <div className="w-16 font-bold text-text border-r border-border">
                        {formatDateDay(time)}
                      </div>
                      <div className="flex items-center justify-center flex-1">
                        {getWeatherIcon(weatherData.daily.weather_code[index], 1, "w-8 h-8")}
                      </div>
                      <div className="flex items-center gap-3 w-24 justify-end font-bold text-sm tracking-tighter tabular-nums">
                         <span className="text-text">{Math.round(weatherData.daily.temperature_2m_max[index])}°</span>
                         <span className="text-text-muted">{Math.round(weatherData.daily.temperature_2m_min[index])}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
