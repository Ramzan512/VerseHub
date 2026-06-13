/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { SplashScreen } from './components/layout/SplashScreen';

const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Detector = lazy(() => import('./pages/Detector'));
const Humanizer = lazy(() => import('./pages/Humanizer'));
const Tools = lazy(() => import('./pages/Tools'));
const Football = lazy(() => import('./pages/Football'));
const Admin = lazy(() => import('./pages/Admin'));
const NewsHub = lazy(() => import('./pages/NewsHub').then(module => ({ default: module.NewsHub })));
const NewsReader = lazy(() => import('./pages/NewsReader').then(module => ({ default: module.NewsReader })));
const WeatherHub = lazy(() => import('./pages/WeatherHub'));

export default function App() {
  return (
    <div className="dark min-h-screen w-full max-w-full text-foreground selection:bg-[#00BFFF]/30 relative overflow-x-hidden font-sans" style={{ background: 'linear-gradient(180deg, #050816 0%, #081530 50%, #0A1035 100%)' }}>
      {/* Animated Glow Particles */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-[#00BFFF]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-[#8A2BE2]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }} />
        <div className="absolute bottom-[20%] left-[30%] w-[250px] h-[250px] bg-[#00FFFF]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
      </div>
      
      <BrowserRouter>
        <Suspense fallback={<SplashScreen />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/detector" element={<Detector />} />
              <Route path="/humanizer" element={<Humanizer />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/football" element={<Football />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/news" element={<NewsHub />} />
              <Route path="/news/:id" element={<NewsReader />} />
              <Route path="/weather" element={<WeatherHub />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}
