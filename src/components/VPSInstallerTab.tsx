import React, { useState } from 'react';
import { Terminal, Copy, Check, Shield, Server, FileText, Download } from 'lucide-react';

export const VPSInstallerTab: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeFile, setActiveFile] = useState<'install' | 'stunnel' | 'nginx'>('install');

  const oneLinerCmd = `git clone https://github.com/cookiebaits/cookie-rtmps.git && cd cookie-rtmps && chmod +x install.sh && ./install.sh`;

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
            Deploy CookieRTMPS on any Linux VPS with one interactive command. Stunnel proxies handle SSL/TLS encapsulation for YouTube, Kick, Facebook, and Instagram.
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
        <span className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>One-Line VPS Deployment Command</span>
        </span>
        <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 font-semibold overflow-x-auto">
          {oneLinerCmd}
        </pre>
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
            install.sh Flow
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
              <p className="font-semibold text-amber-400">Interactive Menu Menu Options provided in <code className="font-mono">install.sh</code>:</p>
              <ol className="list-decimal list-inside space-y-1.5 font-mono text-[11px] text-slate-300">
                <li>Install Docker & Dependencies</li>
                <li>Configure Horizontal Stream Keys (Twitch, YT, Kick, TikTok, X, Trovo)</li>
                <li>Configure Vertical Stream Keys (Aitum Vertical Targets)</li>
                <li>Set Custom Master OBS Key</li>
                <li>Set Domain & SSL Certificate</li>
                <li>Configure Nginx <code className="text-amber-300">chunk_size</code> (Default: 8192)</li>
                <li>Set IP Whitelist (<code className="text-amber-300">ACCEPTED_IP</code>)</li>
                <li>Build & Start CookieRTMPS Docker Relay Container</li>
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
