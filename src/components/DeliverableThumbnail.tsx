import React from 'react';
import { Play, Lock, Globe, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { AssetType, DeliverableStatus } from '../types';

interface DeliverableThumbnailProps {
  type: AssetType;
  status: DeliverableStatus;
  size?: 'sm' | 'lg';
  className?: string;
}

export const DeliverableThumbnail: React.FC<DeliverableThumbnailProps> = ({
  type,
  status,
  size = 'sm',
  className = '',
}) => {
  const isLocked = status === 'LOCKED';

  // Small size for table rows (approx 52px width, 44px height)
  if (size === 'sm') {
    return (
      <div
        className={`relative shrink-0 w-13 h-11 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 flex items-center justify-center select-none shadow-md ${className}`}
      >
        {/* VIDEO THUMBNAIL (SM) */}
        {type === 'video' && (
          <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 flex items-center justify-center">
            {/* Film reel markers on sides */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-slate-800 flex flex-col justify-around py-0.5">
              <div className="w-0.5 h-1 bg-slate-900 mx-auto rounded-xs"></div>
              <div className="w-0.5 h-1 bg-slate-900 mx-auto rounded-xs"></div>
              <div className="w-0.5 h-1 bg-slate-900 mx-auto rounded-xs"></div>
            </div>

            {/* Play Button Icon */}
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_8px_rgba(0,242,254,0.3)]">
              <Play className="w-2.5 h-2.5 text-cyan-300 fill-cyan-300 ml-0.5" />
            </div>

            {/* Locked watermark stripes */}
            {isLocked && (
              <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[0.5px] flex items-center justify-center">
                <span className="text-[7px] font-black text-red-300/80 uppercase font-mono tracking-tighter transform -rotate-12">
                  PREVIEW
                </span>
              </div>
            )}

            {/* Resolution pill */}
            <div className="absolute bottom-0.5 right-1 text-[7px] font-mono font-bold text-cyan-400/80 bg-black/70 px-1 rounded-xs">
              4K
            </div>
          </div>
        )}

        {/* PDF THUMBNAIL (SM) */}
        {type === 'pdf' && (
          <div className="w-full h-full relative bg-gradient-to-b from-slate-900 to-slate-950 p-1 flex flex-col justify-between">
            {/* Page 1 (Clear lines) */}
            <div className="space-y-0.5 pt-0.5 px-0.5">
              <div className="h-1 w-6 bg-cyan-400/60 rounded-xs"></div>
              <div className="h-0.5 w-8 bg-slate-500/50 rounded-xs"></div>
              <div className="h-0.5 w-7 bg-slate-600/40 rounded-xs"></div>
            </div>

            {/* Page 2 (Heavily blurred with lock icon if locked) */}
            <div className="relative mt-auto h-4 rounded-xs overflow-hidden flex items-center justify-center">
              <div className={`absolute inset-0 bg-slate-800 ${isLocked ? 'blur-[1.5px] opacity-70' : 'opacity-90'}`}>
                <div className="h-0.5 w-8 bg-slate-400/50 mt-1 mx-auto rounded-xs"></div>
                <div className="h-0.5 w-6 bg-slate-400/40 mt-1 mx-auto rounded-xs"></div>
              </div>

              {isLocked ? (
                <div className="relative z-10 w-3.5 h-3.5 rounded-full bg-slate-950/80 border border-amber-400/70 flex items-center justify-center shadow-[0_0_6px_rgba(245,158,11,0.4)]">
                  <Lock className="w-2 h-2 text-amber-400" />
                </div>
              ) : (
                <div className="relative z-10 w-3.5 h-3.5 rounded-full bg-emerald-950/80 border border-emerald-400/70 flex items-center justify-center">
                  <CheckCircle2 className="w-2 h-2 text-emerald-400" />
                </div>
              )}
            </div>

            {/* PDF corner badge */}
            <div className="absolute top-0.5 right-0.5 text-[7px] font-bold font-mono text-red-400 bg-red-950/80 px-1 rounded-xs border border-red-500/30">
              PDF
            </div>
          </div>
        )}

        {/* WEB LINK THUMBNAIL (SM) */}
        {type === 'web' && (
          <div className="w-full h-full relative bg-slate-950 flex flex-col">
            {/* Browser top dots */}
            <div className="h-2.5 bg-slate-900 border-b border-slate-800 px-1 flex items-center space-x-0.5">
              <div className="w-1 h-1 rounded-full bg-red-400"></div>
              <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
              <div className="w-1 h-1 rounded-full bg-green-400"></div>
            </div>

            {/* Browser window content */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 to-blue-950/40">
              <Globe className="w-4 h-4 text-cyan-400/70" />
              {isLocked ? (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[0.5px] flex items-center justify-center">
                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                </div>
              ) : (
                <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.8)]"></div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Large size for Card Grid view (full width preview banner, 140px height)
  return (
    <div
      className={`relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center select-none shadow-inner group ${className}`}
    >
      {/* LARGE VIDEO PREVIEW */}
      {type === 'video' && (
        <div className="w-full h-full relative bg-gradient-to-tr from-slate-950 via-[#0b1329] to-cyan-950/40 flex items-center justify-center overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>

          {/* Film reel edge markers */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-slate-900/80 border-r border-slate-800 flex flex-col justify-around py-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-1 h-2 bg-slate-950 mx-auto rounded-xs"></div>
            ))}
          </div>
          <div className="absolute inset-y-0 right-0 w-2.5 bg-slate-900/80 border-l border-slate-800 flex flex-col justify-around py-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-1 h-2 bg-slate-950 mx-auto rounded-xs"></div>
            ))}
          </div>

          {/* Central Play Button */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-slate-900/90 border-2 border-cyan-400/80 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.4)] group-hover:scale-110 group-hover:border-cyan-300 transition-all duration-300">
            <Play className="w-5 h-5 text-cyan-300 fill-cyan-300 ml-0.5" />
          </div>

          {/* Watermark overlay when locked */}
          {isLocked && (
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
                  <ShieldAlert className="w-3 h-3 text-red-400" />
                  WATERMARKED DRAFT
                </span>
                <span className="px-1.5 py-0.5 rounded bg-black/80 text-cyan-400 text-[10px] font-mono font-bold">
                  4K MASTER
                </span>
              </div>

              {/* Diagonal watermark stripes */}
              <div className="text-center font-black text-white/20 tracking-widest text-xs uppercase transform -rotate-6">
                PREVIEW ONLY - PAYLOCK
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-right">
                Encrypted Stream
              </div>
            </div>
          )}

          {!isLocked && (
            <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              UNLOCKED MASTER 4K
            </div>
          )}
        </div>
      )}

      {/* LARGE PDF PREVIEW */}
      {type === 'pdf' && (
        <div className="w-full h-full relative bg-slate-900/90 p-4 flex gap-4 items-center justify-center overflow-hidden">
          {/* Mock Document Page 1 (Clear) */}
          <div className="w-24 h-28 bg-white rounded-md shadow-lg p-2.5 flex flex-col justify-between border border-slate-300 relative group-hover:scale-105 transition-transform">
            <div>
              <div className="h-1.5 w-12 bg-cyan-600 rounded-xs mb-1.5"></div>
              <div className="h-1 w-16 bg-slate-300 rounded-xs mb-1"></div>
              <div className="h-1 w-14 bg-slate-200 rounded-xs mb-1"></div>
              <div className="h-1 w-18 bg-slate-200 rounded-xs"></div>
            </div>
            <div className="text-[8px] font-mono font-bold text-slate-500 flex justify-between pt-1 border-t border-slate-100">
              <span>PG. 1</span>
              <span className="text-emerald-600">CLEAR</span>
            </div>
          </div>

          {/* Mock Document Page 2 (Heavy Blur & Lock when locked) */}
          <div className="w-24 h-28 bg-white rounded-md shadow-lg p-2.5 flex flex-col justify-between border border-slate-300 relative overflow-hidden group-hover:scale-105 transition-transform">
            <div className={`transition-all duration-300 ${isLocked ? 'filter blur-[4px] opacity-40 select-none' : 'filter-none opacity-100'}`}>
              <div className="h-1.5 w-14 bg-emerald-600 rounded-xs mb-1.5"></div>
              <div className="h-1 w-16 bg-slate-400 rounded-xs mb-1"></div>
              <div className="h-1 w-12 bg-slate-300 rounded-xs mb-1"></div>
              <div className="h-1 w-18 bg-slate-300 rounded-xs"></div>
            </div>

            {/* Heavy Blur Shroud with glowing Lock Icon */}
            {isLocked && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md flex flex-col items-center justify-center p-1.5">
                <div className="w-7 h-7 rounded-full bg-slate-900 border border-amber-400/80 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)] mb-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-[8px] font-bold text-white font-mono text-center leading-tight">
                  PAGE 2 SHROUDED
                </span>
              </div>
            )}

            <div className="text-[8px] font-mono font-bold text-slate-500 flex justify-between pt-1 border-t border-slate-100">
              <span>PG. 2</span>
              <span className={isLocked ? 'text-amber-600' : 'text-emerald-600'}>
                {isLocked ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold flex items-center gap-1">
            <FileText className="w-3 h-3" />
            PDF REPORT
          </div>
        </div>
      )}

      {/* LARGE WEB LINK PREVIEW */}
      {type === 'web' && (
        <div className="w-full h-full relative bg-slate-950 flex flex-col overflow-hidden">
          {/* Browser header */}
          <div className="h-6 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <div className="ml-3 flex-1 h-3.5 bg-slate-950 rounded border border-slate-800 px-2 flex items-center text-[8px] font-mono text-slate-400 truncate">
              https://staging-client-preview.paylock.net
            </div>
          </div>

          {/* Browser content */}
          <div className="flex-1 relative p-3 flex flex-col justify-center items-center bg-gradient-to-b from-slate-950 via-[#0d1629] to-slate-950">
            <div className={`w-full max-w-xs space-y-2 transition-all ${isLocked ? 'blur-[3px] opacity-40' : 'filter-none'}`}>
              <div className="h-3 w-28 bg-cyan-500/30 rounded"></div>
              <div className="h-2 w-full bg-slate-800 rounded"></div>
              <div className="h-2 w-4/5 bg-slate-800 rounded"></div>
            </div>

            {isLocked && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)] mb-1">
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[10px] font-bold text-white font-mono">
                  STAGING REPO LOCKED
                </span>
              </div>
            )}

            {!isLocked && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                PRODUCTION UNLOCKED
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
