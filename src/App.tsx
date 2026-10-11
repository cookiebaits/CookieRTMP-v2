import React, { useState, useEffect } from 'react';
import { TabType, ChatPlatformConfig } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CombinedChatTab } from './components/CombinedChatTab';
import { DestinationsTab } from './components/DestinationsTab';
import { TitlesAndEpisodeTab } from './components/TitlesAndEpisodeTab';
import { SecurityAndValidatorTab } from './components/SecurityAndValidatorTab';
import { NoalbsTab } from './components/NoalbsTab';
import { StatsMonitorTab } from './components/StatsMonitorTab';
import { VPSInstallerTab } from './components/VPSInstallerTab';

function generateHexKey(bytes = 8): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [isCyclingKey, setIsCyclingKey] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);

  // Private Hex Key for OBS Browser Source, persisted in localStorage
  const [obsHexKey, setObsHexKey] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('cookiertmps_obs_hex_key');
      if (saved && saved.length >= 8) return saved;
    } catch (e) {}
    const initial = generateHexKey(8);
    try {
      localStorage.setItem('cookiertmps_obs_hex_key', initial);
    } catch (e) {}
    return initial;
  });

  // Platforms state managed globally so Header and CombinedChatTab stay perfectly in sync
  const [platforms, setPlatforms] = useState<ChatPlatformConfig[]>(() => {
    try {
      const saved = localStorage.getItem('cookiertmps_chat_platforms');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'twitch',
        name: 'Twitch',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg',
        channel: 'cookiebaits',
        active: true,
      },
      {
        id: 'youtube',
        name: 'YouTube',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
        channel: 'https://www.youtube.com/@cookiebaits',
        active: true,
        resolvedYtVideoId: '',
        isResolvingYt: false,
      },
      {
        id: 'kick',
        name: 'Kick',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Kick_logo.svg',
        channel: 'cookiebaits',
        active: true,
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        icon: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg',
        channel: 'cookiebaits',
        active: false,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cookiertmps_chat_platforms', JSON.stringify(platforms));
    } catch (e) {}
  }, [platforms]);

  const handleCycleObsKey = () => {
    setIsCyclingKey(true);
    const newKey = generateHexKey(8);
    setObsHexKey(newKey);
    try {
      localStorage.setItem('cookiertmps_obs_hex_key', newKey);
    } catch (e) {}
    setTimeout(() => setIsCyclingKey(false), 500);
  };

  useEffect(() => {
    fetch('/health')
      .then((res) => {
        if (res.ok) setIsLive(true);
      })
      .catch(() => setIsLive(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header Bar with Copy OBS URL (respecting enabled platforms) and Hex Key Cycle Button */}
      <Header
        isLive={isLive}
        activeKeyCount={7}
        obsHexKey={obsHexKey}
        onCycleObsKey={handleCycleObsKey}
        isCyclingKey={isCyclingKey}
        platforms={platforms}
      />

      {/* Main Navigation Tabs */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chat' && (
          <CombinedChatTab
            obsHexKey={obsHexKey}
            onCycleObsKey={handleCycleObsKey}
            platforms={platforms}
            setPlatforms={setPlatforms}
          />
        )}
        {activeTab === 'destinations' && <DestinationsTab />}
        {activeTab === 'titles' && <TitlesAndEpisodeTab />}
        {activeTab === 'security' && <SecurityAndValidatorTab />}
        {activeTab === 'noalbs' && <NoalbsTab />}
        {activeTab === 'stats' && <StatsMonitorTab />}
        {activeTab === 'installer' && <VPSInstallerTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 CookieRTMPS Control Center — Hardened Nginx 1.30.3 & Local RTMP Module</p>
          <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-400">
            <span>Ports: 1935 (RTMP) / 8081 (Stat) / 3000 (UI)</span>
            <span>AMF Recursion: 128</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
