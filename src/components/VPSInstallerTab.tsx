import React, { useState } from 'react';
import { Terminal, Copy, Check, Shield, Server, FileText, Download } from 'lucide-react';

export const VPSInstallerTab: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeFile, setActiveFile] = useState<'install' | 'stunnel' | 'nginx'>('install');

  const oneLinerCmd = `if [ -f "./install.sh" ]; then (git pull 2>/dev/null || true); elif [ -d "CookieRTMP-v2" ]; then cd CookieRTMP-v2 && (git pull 2>/dev/null || true); else git clone https://github.com/cookiebaits/CookieRTMP-v2.git && cd CookieRTMP-v2; fi && chmod +x install.sh && ./install.sh`;

  const handleCopyOneLiner = () => {
    navigator.clipboard.writeText(oneLinerCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const stunnelConfigSnippet = `; Stunnel RTMPS Proxy Configuration for CookieRTMPS
[youtube]
client = yes
accept = 127.0.0.1:19352
connect = a.rtmp.youtube.com:443
checkHost = a.rtmp.youtube.com

[facebook]
client = yes
accept = 127.0.0.1:19350
connect = live-api-s.facebook.com:443
checkHost = live-api-s.facebook.com

[kick]
client = yes
accept = 127.0.0.1:19353
connect = fa723fc1b01a.global-contribute.live-video.net:443

[x-twitter]
client = yes
accept = 127.0.0.1:19354
connect = va.pscp.tv:443`;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <span>VPS Deployment Assistant & Stunnel RTMPS Proxies</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Universal one-step command: works for fresh installations, existing directories, and version upgrades without errors.
          </p>
        </div>

        <button
          onClick={handleCopyOneLiner}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
        >
          {copiedCmd ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
          <span>{copiedCmd ? 'Command Copied!' : 'Copy Quick Install Command'}</span>
        </button>
      </div>

      {/* Installer Script Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Universal One-Step Deployment & Upgrade Command</span>
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
            Auto-handles existing directory & updates
          </span>
        </div>
        <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 font-semibold overflow-x-auto whitespace-pre-wrap break-all">
          {oneLinerCmd}
        </pre>
        <p className="text-[11px] text-slate-400">
          Paste into your terminal. If <code className="text-amber-400">CookieRTMP-v2</code> already exists, it updates without directory collision errors, stops any active old container, preserves your configuration, and opens the setup menu.
        </p>
      </div>

      {/* File Inspector Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveFile('install')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFile === 'install' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            install.sh Flow (12 Steps)
          </button>
          <button
            onClick={() => setActiveFile('stunnel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFile === 'stunnel' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            stunnel.conf Proxies
          </button>
        </div>

        <div>
          {activeFile === 'install' && (
            <div className="space-y-3 text-xs text-slate-300">
              <p className="font-semibold text-amber-400">Sequential Menu Options in <code className="font-mono">install.sh</code>:</p>
              <ol className="list-decimal list-inside space-y-1 font-mono text-[11px] text-slate-300">
                <li>Install Docker & Dependencies</li>
                <li>Configure Horizontal (Main) Stream Destinations</li>
                <li>Configure Vertical Stream Destinations</li>
                <li>Configure OBS Setup & Ingest Security (Stream Key Password)</li>
                <li>Configure Server Performance & Chunk Size</li>
                <li>Configure Network & IP Whitelist</li>
                <li>Configure Titles & Chat Credentials (Twitch/YouTube OAuth)</li>
                <li>Configure Domain / Reverse Proxy</li>
                <li>Configure RTMPS Stunnel Proxy Ports</li>
                <li>Configure NOALBS Scene Switcher (Cloud MP4 Looping Failover)</li>
                <li>Build & Start Server</li>
                <li>Stop Server & Complete Clean Uninstall</li>
              </ol>
            </div>
          )}

          {activeFile === 'stunnel' && (
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
              {stunnelConfigSnippet}
            </pre>
          )}
        </div>
      </div>

    </div>
  );
};
