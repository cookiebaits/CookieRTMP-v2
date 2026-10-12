import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

interface PasswordAuthModalProps {
  onUnlock: (password: string) => void;
  isLoading?: boolean;
  errorMsg?: string | null;
}

export const PasswordAuthModal: React.FC<PasswordAuthModalProps> = ({
  onUnlock,
  isLoading = false,
  errorMsg = null,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onUnlock(password.trim());
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-3 mb-6 relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-1 shadow-lg shadow-amber-500/10">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Combined Chat Config Security</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
          Access to the Combined Chat Settings page is protected. Enter the <strong className="text-amber-400">Stream Key / Password</strong> configured in <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-200">Option 4 (OBS Setup & Security Key)</span> in <span className="font-mono text-emerald-400">install.sh</span>.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Stream Key / Password</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">OBS_KEY</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter stream key or password..."
              autoFocus
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !password.trim()}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <span>Verifying Stream Key...</span>
          ) : (
            <>
              <span>Unlock Combined Chat Config</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Information Tip Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="text-slate-300">Note:</strong> If no password is set in Option 4, the Combined Chat Config Page will remain open automatically.
        </p>
      </div>
    </div>
  );
};
