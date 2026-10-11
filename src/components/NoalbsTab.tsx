import React, { useState } from 'react';
import { Cpu, Film, Radio, Shield, Check, RefreshCw } from 'lucide-react';

export const NoalbsTab: React.FC = () => {
  const [noalbsEnabled, setNoalbsEnabled] = useState(true);
  const [obsHost, setObsHost] = useState('127.0.0.1');
  const [obsPort, setObsPort] = useState('4455');
  const [obsPassword, setObsPassword] = useState('secret_obs_pass');
  const [brbVideoPath, setBrbVideoPath] = useState('/app/media/brb_loop.mp4');
  const [bitrateThreshold, setBitrateThreshold] = useState('800');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <span>NOALBS Scene Switcher & Cloud BRB Failover</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automatically switch OBS scenes on stream disconnect or bitrate drops to prevent stream terminations.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Film className="w-4 h-4 text-purple-400" />
          <span className="font-mono text-slate-300">Cloud BRB Video Loop Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* NOALBS Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">NOALBS OBS WebSocket Configuration</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={noalbsEnabled}
                onChange={(e) => setNoalbsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  OBS WebSocket Host
                </label>
                <input
                  type="text"
                  value={obsHost}
                  onChange={(e) => setObsHost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Port
                </label>
                <input
                  type="text"
                  value={obsPort}
                  onChange={(e) => setObsPort(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                OBS WebSocket Password
              </label>
              <input
                type="password"
                value={obsPassword}
                onChange={(e) => setObsPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bitrate Drop Trigger Threshold (kbps)
              </label>
              <input
                type="number"
                value={bitrateThreshold}
                onChange={(e) => setBitrateThreshold(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Cloud BRB Video Loop Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">Cloud BRB Loop Video</h3>
            <p className="text-xs text-slate-400">Played back automatically when primary feed drops</p>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Loop Video Target Path
              </label>
              <input
                type="text"
                value={brbVideoPath}
                onChange={(e) => setBrbVideoPath(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-amber-400 block">
                Cloud BRB Stream Ingest Key
              </span>
              <p className="text-xs font-mono text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                cloud_brb_stream_fallback
              </p>
              <p className="text-[11px] text-slate-400">
                Streams matching key prefix <code className="text-emerald-400">cloud_brb</code> bypass key limits to seamlessly maintain viewer connection during network hiccups.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
