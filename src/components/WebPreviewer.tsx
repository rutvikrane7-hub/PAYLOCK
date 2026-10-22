import React from 'react';
import { Globe, Lock, ShieldCheck, Sparkles } from 'lucide-react';

interface WebPreviewerProps {
  isLocked: boolean;
  title: string;
  clientName: string;
  price: number;
  onPayClick?: () => void;
}

export const WebPreviewer: React.FC<WebPreviewerProps> = ({
  isLocked,
  title,
  clientName,
  price,
  onPayClick,
}) => {
  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Mock Browser Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="text-[11px] text-slate-400 font-mono ml-2 hidden sm:inline truncate max-w-[140px]">{title}</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 w-full max-w-md mx-4">
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">https://staging-client-preview.paylock.net/sandbox/{clientName.toLowerCase().replace(/\s+/g, '-')}</span>
          {isLocked ? (
            <Lock className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
          )}
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          {isLocked ? 'STAGING PREVIEW' : 'PRODUCTION READY'}
        </div>
      </div>

      {/* Browser Body */}
      <div className="relative min-h-[500px] bg-slate-950 p-6 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Mock Live Web App Interface */}
        <div className={`w-full max-w-3xl space-y-6 transition-all duration-500 ${isLocked ? 'blur-[6px] opacity-40 pointer-events-none' : 'filter-none opacity-100'}`}>
          <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/60 shadow-lg">
            <div className="h-6 w-32 bg-cyan-500/30 rounded mb-4"></div>
            <div className="h-10 w-3/4 bg-slate-700/60 rounded mb-3"></div>
            <div className="h-4 w-full bg-slate-800 rounded mb-2"></div>
            <div className="h-4 w-4/5 bg-slate-800 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((card) => (
              <div key={card} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/20 mb-3"></div>
                <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 w-full bg-slate-800 rounded mb-1"></div>
                <div className="h-3 w-2/3 bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
            <code>// Deployed Build Package: production-react-v1.4.0 • Node v20</code>
          </div>
        </div>

        {/* Watermark and Lock Overlay if locked */}
        {isLocked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md">
            {/* Repeating watermark */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-12 opacity-20 transform -rotate-12 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="text-xl font-black text-white uppercase tracking-widest">
                  PREVIEW ONLY - PAYLOCK
                </span>
              ))}
            </div>

            <div className="relative z-30 text-center max-w-md p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-cyan-950/80 border border-cyan-400 mx-auto mb-4 flex items-center justify-center shadow-[0_0_25px_rgba(0,242,254,0.3)]">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Interactive Web Link Protected</h3>
              <p className="text-xs text-slate-300 mb-5">
                Staging environment is locked with PayLock access-gate. Pay balance to unlock live domain DNS pointer and full GitHub source repository.
              </p>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 mb-4">
                <span className="text-xs text-slate-400">Total Deliverable Balance:</span>
                <span className="text-lg font-black text-cyan-300">${price.toLocaleString()}</span>
              </div>

              {onPayClick && (
                <button
                  onClick={onPayClick}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm glow-btn transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Pay ${price.toLocaleString()} & Release Staging Access</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Unlocked banner if paid */}
        {!isLocked && (
          <div className="absolute top-4 right-4 z-30 flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Interactive Web Environment Unlocked</span>
          </div>
        )}
      </div>
    </div>
  );
};
