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

  // Small size for table rows (clean icon/preview thumbnail)
  if (size === 'sm') {
    return (
      <div
        className={`relative shrink-0 w-12 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center select-none shadow-xs ${className}`}
      >
        {/* VIDEO THUMBNAIL (SM) */}
        {type === 'video' && (
          <div className="w-full h-full relative bg-blue-50/70 flex items-center justify-center">
            {/* Play Button Icon */}
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow-xs">
              <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
            </div>

            {/* Locked indicator */}
            {isLocked && (
              <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center">
                <span className="text-[7px] font-bold text-amber-700 uppercase tracking-tighter transform -rotate-12 bg-white/90 px-0.5 rounded shadow-2xs">
                  DRAFT
                </span>
              </div>
            )}

            {/* Resolution pill */}
            <div className="absolute bottom-0.5 right-1 text-[7px] font-mono font-semibold text-gray-500 bg-white/90 px-1 rounded border border-gray-200">
              4K
            </div>
          </div>
        )}

        {/* PDF THUMBNAIL (SM) */}
        {type === 'pdf' && (
          <div className="w-full h-full relative bg-red-50/60 p-1 flex flex-col justify-between">
            {/* Page lines */}
            <div className="space-y-0.5 pt-0.5 px-0.5">
              <div className="h-1 w-5 bg-red-400 rounded-xs"></div>
              <div className="h-0.5 w-7 bg-gray-300 rounded-xs"></div>
              <div className="h-0.5 w-6 bg-gray-200 rounded-xs"></div>
            </div>

            {/* Page 2 lock indicator */}
            <div className="relative mt-auto h-3.5 rounded-xs overflow-hidden flex items-center justify-center bg-white border border-gray-200">
              {isLocked ? (
                <Lock className="w-2 h-2 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-2 h-2 text-emerald-600" />
              )}
            </div>

            {/* PDF corner badge */}
            <div className="absolute top-0.5 right-0.5 text-[7px] font-bold font-mono text-red-600 bg-red-100 px-1 rounded">
              PDF
            </div>
          </div>
        )}

        {/* WEB LINK THUMBNAIL (SM) */}
        {type === 'web' && (
          <div className="w-full h-full relative bg-gray-100 flex flex-col">
            {/* Browser top dots */}
            <div className="h-2 bg-gray-200 border-b border-gray-300 px-1 flex items-center space-x-0.5">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>

            {/* Browser window content */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-sky-50/70">
              <Globe className="w-4 h-4 text-sky-600" />
              {isLocked ? (
                <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center">
                  <Lock className="w-2 h-2 text-amber-600" />
                </div>
              ) : (
                <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Large size for Card Grid view (full width preview banner, 136px height)
  return (
    <div
      className={`relative w-full h-34 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center select-none shadow-xs group ${className}`}
    >
      {/* LARGE VIDEO PREVIEW */}
      {type === 'video' && (
        <div className="w-full h-full relative bg-gradient-to-br from-gray-100 via-blue-50/40 to-gray-100 flex items-center justify-center overflow-hidden">
          {/* Central Play Button */}
          <div className="relative z-10 w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-blue-300 transition-all">
            <Play className="w-4 h-4 text-blue-600 fill-blue-600 ml-0.5" />
          </div>

          {/* Watermark overlay when locked */}
          {isLocked && (
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 bg-amber-500/5">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-mono font-semibold flex items-center gap-1 shadow-xs">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  WATERMARKED PREVIEW
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white text-gray-600 text-[10px] font-mono font-medium border border-gray-200">
                  4K MASTER
                </span>
              </div>

              {/* Diagonal clean watermark */}
              <div className="text-center font-bold text-gray-400/30 tracking-widest text-xs uppercase transform -rotate-6 select-none">
                PREVIEW ONLY - PAYLOCK
              </div>

              <div className="text-[10px] text-gray-400 font-mono text-right">
                Protected Preview
              </div>
            </div>
          )}

          {!isLocked && (
            <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-semibold flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              UNLOCKED MASTER 4K
            </div>
          )}
        </div>
      )}

      {/* LARGE PDF PREVIEW */}
      {type === 'pdf' && (
        <div className="w-full h-full relative bg-gray-100/90 p-4 flex gap-4 items-center justify-center overflow-hidden">
          {/* Mock Document Page 1 (Clear) */}
          <div className="w-22 h-26 bg-white rounded-md shadow-xs p-2.5 flex flex-col justify-between border border-gray-200 group-hover:scale-102 transition-transform">
            <div>
              <div className="h-1.5 w-10 bg-blue-600 rounded-xs mb-1.5"></div>
              <div className="h-1 w-14 bg-gray-200 rounded-xs mb-1"></div>
              <div className="h-1 w-12 bg-gray-100 rounded-xs mb-1"></div>
              <div className="h-1 w-14 bg-gray-100 rounded-xs"></div>
            </div>
            <div className="text-[8px] font-mono font-semibold text-gray-400 flex justify-between pt-1 border-t border-gray-100">
              <span>PG. 1</span>
              <span className="text-emerald-600">CLEAR</span>
            </div>
          </div>

          {/* Mock Document Page 2 (Soft blur & lock if locked) */}
          <div className="w-22 h-26 bg-white rounded-md shadow-xs p-2.5 flex flex-col justify-between border border-gray-200 relative overflow-hidden group-hover:scale-102 transition-transform">
            <div className={`transition-all duration-300 ${isLocked ? 'filter blur-[3px] opacity-40 select-none' : 'filter-none opacity-100'}`}>
              <div className="h-1.5 w-12 bg-emerald-600 rounded-xs mb-1.5"></div>
              <div className="h-1 w-14 bg-gray-300 rounded-xs mb-1"></div>
              <div className="h-1 w-10 bg-gray-200 rounded-xs mb-1"></div>
              <div className="h-1 w-14 bg-gray-200 rounded-xs"></div>
            </div>

            {/* Clean blur lock overlay */}
            {isLocked && (
              <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-xs flex flex-col items-center justify-center p-1">
                <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs mb-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                </div>
                <span className="text-[7px] font-bold text-gray-700 font-mono text-center leading-tight">
                  LOCKED
                </span>
              </div>
            )}

            <div className="text-[8px] font-mono font-semibold text-gray-400 flex justify-between pt-1 border-t border-gray-100">
              <span>PG. 2</span>
              <span className={isLocked ? 'text-amber-600' : 'text-emerald-600'}>
                {isLocked ? 'SHROUDED' : 'UNLOCKED'}
              </span>
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white border border-gray-200 text-red-600 text-[10px] font-mono font-semibold flex items-center gap-1 shadow-xs">
            <FileText className="w-3 h-3" />
            PDF REPORT
          </div>
        </div>
      )}

      {/* LARGE WEB LINK PREVIEW */}
      {type === 'web' && (
        <div className="w-full h-full relative bg-gray-50 flex flex-col overflow-hidden">
          {/* Browser header */}
          <div className="h-6 bg-gray-100 border-b border-gray-200 px-3 flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="ml-2 flex-1 h-3.5 bg-white rounded border border-gray-200 px-2 flex items-center text-[8px] font-mono text-gray-500 truncate">
              https://staging-preview.paylock.net
            </div>
          </div>

          {/* Browser content */}
          <div className="flex-1 relative p-3 flex flex-col justify-center items-center bg-white">
            <div className={`w-full max-w-xs space-y-1.5 transition-all ${isLocked ? 'blur-[2px] opacity-40' : 'filter-none'}`}>
              <div className="h-2.5 w-24 bg-blue-100 rounded"></div>
              <div className="h-2 w-full bg-gray-100 rounded"></div>
              <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
            </div>

            {isLocked && (
              <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-xs flex flex-col items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs mb-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-[9px] font-semibold text-gray-700 font-mono">
                  STAGING GATE ACTIVE
                </span>
              </div>
            )}

            {!isLocked && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-semibold flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3" />
                DEPLOYED
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
