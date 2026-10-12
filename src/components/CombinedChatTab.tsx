import React, { useState, useEffect } from 'react';
import { ChatPlatformConfig } from '../types';
import { Copy, Check, ExternalLink, Columns, Monitor, Search, Layers, Radio, Sparkles, KeyRound, RefreshCw } from 'lucide-react';

interface CombinedChatTabProps {
  obsHexKey?: string;
  onCycleObsKey?: () => void;
  platforms?: ChatPlatformConfig[];
  setPlatforms?: React.Dispatch<React.SetStateAction<ChatPlatformConfig[]>>;
}

export const CombinedChatTab: React.FC<CombinedChatTabProps> = ({
  obsHexKey = 'e4a91c8f0b7d3a2e',
  onCycleObsKey,
  platforms: propPlatforms,
  setPlatforms: propSetPlatforms,
}) => {
  const [localPlatforms, setLocalPlatforms] = useState<ChatPlatformConfig[]>(() => {
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

  const platforms = propPlatforms || localPlatforms;
  const setPlatforms = propSetPlatforms || setLocalPlatforms;

  const [chatMode, setChatMode] = useState<'unified' | 'columns'>('unified');
  const [includeDemo, setIncludeDemo] = useState(false);
  const [copiedUnified, setCopiedUnified] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedColumns, setCopiedColumns] = useState(false);

  const [unifiedObsUrl, setUnifiedObsUrl] = useState('');
  const [columnsObsUrl, setColumnsObsUrl] = useState('');
  const [hexEncodedUrl, setHexEncodedUrl] = useState('');

  // Persist platforms to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cookiertmps_chat_platforms', JSON.stringify(platforms));
    } catch (e) {}
  }, [platforms]);

  function cleanChannel(input: string): string {
    input = input.trim();
    if (input.includes('youtube.com/') || input.includes('youtu.be/')) {
      try {
        const u = new URL(input.startsWith('http') ? input : 'https://' + input);
        const v = u.searchParams.get('v');
        if (v && v.length === 11) return v;
        const parts = u.pathname.split('/').filter(Boolean);
        const handle = parts.find((p) => p.startsWith('@'));
        if (handle) return handle.slice(1);
        if (parts[0] && parts[0] !== 'live' && parts[0] !== 'watch') {
          return parts[0] === 'c' || parts[0] === 'channel' || parts[0] === 'user' ? (parts[1] || parts[0]) : parts[0];
        }
      } catch (e) {}
    }
    return input.replace(/^@/, '').replace(/\/live\/?$/, '');
  }

  // Convert string to hex characters
  function stringToHex(str: string): string {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
  }

  // Generate URLs for OBS Browser Sources with the private hex key
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('key', obsHexKey);

    platforms.forEach((p) => {
      if (p.active && p.channel.trim()) {
        const cleaned = cleanChannel(p.channel);
        params.set(p.id, cleaned);
      }
    });

    const origin = window.location.origin;

    // 1. Unified Single-Feed URL (with platform logos)
    const uParams = new URLSearchParams(params);
    uParams.set('mode', 'unified');
    if (includeDemo) uParams.set('demo', '1');
    const uUrl = `${origin}/chat.html?${uParams.toString()}`;
    setUnifiedObsUrl(uUrl);

    // 2. Pure Hex-Coded URL (?obs=<hex>)
    const rawQuery = uParams.toString();
    const hexBytes = stringToHex(rawQuery);
    const hexUrl = `${origin}/chat.html?obs=${hexBytes}`;
    setHexEncodedUrl(hexUrl);

    // 3. Multi-Column Grid URL
    const cUrl = `${origin}/chat.html?${params.toString()}`;
    setColumnsObsUrl(cUrl);
  }, [platforms, obsHexKey, includeDemo]);

  const handleTogglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleChannelChange = (id: string, channel: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, channel } : p))
    );
  };

  const handleCopy = (type: 'unified' | 'hex' | 'columns') => {
    let text = unifiedObsUrl;
    if (type === 'hex') text = hexEncodedUrl;
    if (type === 'columns') text = columnsObsUrl;

    navigator.clipboard.writeText(text);
    if (type === 'unified') {
      setCopiedUnified(true);
      setTimeout(() => setCopiedUnified(false), 2000);
    } else if (type === 'hex') {
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    } else {
      setCopiedColumns(true);
      setTimeout(() => setCopiedColumns(false), 2000);
    }
  };

  const activePlatforms = platforms.filter((p) => p.active && p.channel.trim());
  const activePreviewUrl = chatMode === 'unified' ? unifiedObsUrl : columnsObsUrl;

  return (
    <div className="space-y-6">
      
      {/* OBS Overlay Header */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Unified Multi-Platform OBS Chat Overlay</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Merges <strong>Twitch, Kick, and YouTube into ONE single transparent OBS window</strong> with platform logos (🟣 Twitch, 🟢 Kick, 🔴 YouTube) next to every message.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Key indicator & cycle trigger */}
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Key:</span>
            <span className="text-amber-400 font-bold">{obsHexKey.slice(0, 8)}...</span>
            {onCycleObsKey && (
              <button
                onClick={onCycleObsKey}
                className="ml-1 p-1 hover:text-amber-400 transition"
                title="Change / Cycle Private Hex Key"
              >
                <RefreshCw className="w-3 h-3 text-slate-400 hover:text-amber-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleCopy('unified')}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
          >
            {copiedUnified ? <Check className="w-4 h-4 text-emerald-950 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedUnified ? 'Copied OBS URL!' : 'Copy OBS URL'}</span>
          </button>
        </div>
      </div>

      {/* Configuration & Channel Setup */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Channel Setup</h3>
            <p className="text-xs text-slate-400">Enter your channel URL or username for each streaming platform:</p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChatMode('unified')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition ${
                chatMode === 'unified' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Unified Stream Feed (1 Window)</span>
            </button>
            <button
              onClick={() => setChatMode('columns')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition ${
                chatMode === 'columns' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side Columns</span>
            </button>
          </div>
        </div>

        {/* Platform Input Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <div
              key={p.id}
              className={`p-3.5 rounded-xl border transition ${
                p.active
                  ? 'bg-slate-950/80 border-amber-500/30 ring-1 ring-amber-500/10'
                  : 'bg-slate-950/30 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {p.icon ? (
                    <img src={p.icon} alt={p.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <div className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-[10px] font-bold text-amber-400">
                      {p.name.slice(0, 1)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-200">{p.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={p.active}
                  onChange={() => handleTogglePlatform(p.id)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer w-4 h-4"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={p.channel}
                  disabled={!p.active}
                  onChange={(e) => handleChannelChange(p.id, e.target.value)}
                  placeholder={
                    p.id === 'youtube'
                      ? 'https://youtube.com/@cookiebaits'
                      : `${p.name} channel (e.g. cookiebaits)`
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 disabled:opacity-50"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {p.id === 'youtube' && 'Accepts channel URL, handle @cookiebaits, or live URL'}
                  {p.id === 'twitch' && 'Twitch username (e.g. cookiebaits)'}
                  {p.id === 'kick' && 'Kick username (e.g. cookiebaits)'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* OBS Copy URLs Section */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Copy OBS Browser Source URLs</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">Transparent Background & Platform Logos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Unified Feed OBS URL */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center space-x-1">
                  <span>🟣 🟢 🔴 Unified Chat (1 Window with Logos)</span>
                </span>
                <button
                  onClick={() => handleCopy('unified')}
                  className="text-amber-400 hover:underline text-[11px] font-bold flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedUnified ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Merges all messages into one vertical list with Twitch/Kick/YouTube logos.</p>
              <code className="block bg-slate-950 p-2 rounded text-[10px] font-mono text-amber-300/90 truncate">
                {unifiedObsUrl}
              </code>
            </div>

            {/* Hex / Encoded URL */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-400 flex items-center space-x-1">
                  <span>Hex-Coded Private URL for OBS</span>
                </span>
                <button
                  onClick={() => handleCopy('hex')}
                  className="text-blue-400 hover:underline text-[11px] font-bold flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedHex ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Safely URL-encoded with private hex key for OBS browser source plugins.</p>
              <code className="block bg-slate-950 p-2 rounded text-[10px] font-mono text-blue-300/90 truncate">
                {hexEncodedUrl}
              </code>
            </div>

          </div>
        </div>
      </div>

      {/* Embedded Live Preview */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[580px] flex flex-col">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 mb-4 text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-emerald-400" />
            <span>Interactive Live Preview ({chatMode === 'unified' ? 'Unified Single Feed with Platform Logos' : 'Multi-Column Grid'})</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIncludeDemo((v) => !v)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center space-x-1 ${
                includeDemo
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Inject demo messages from Twitch, Kick, and YouTube to test logos and font in OBS"
            >
              <span>{includeDemo ? '✓ Test Messages Active' : '+ Test Platform Logos'}</span>
            </button>
            <a
              href={activePreviewUrl || undefined}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>Open Standalone Window</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden min-h-[500px] relative">
          {activePreviewUrl ? (
            <iframe
              src={activePreviewUrl}
              title="Combined Chat Preview"
              className="w-full h-full min-h-[500px] border-none"
              allow="autoplay; fullscreen"
            />
          ) : (
            <div className="w-full h-full min-h-[500px] flex items-center justify-center text-slate-500 text-xs font-mono">
              Loading Chat Preview...
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
