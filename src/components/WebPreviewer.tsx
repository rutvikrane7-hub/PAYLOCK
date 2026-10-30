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
    <div className="w-full rounded-xl bg-white border border-gray-200 shadow-xs overflow-hidden flex flex-col">
      {/* Mock Browser Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          <span className="text-[11px] text-gray-500 font-mono ml-2 hidden sm:inline truncate max-w-[140px]">{title}</span>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono text-gray-700 w-full max-w-md mx-4 shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">https://staging-client-preview.paylock.net/sandbox/{clientName.toLowerCase().replace(/\s+/g, '-')}</span>
          {isLocked ? (
            <Lock className="w-3.5 h-3.5 text-amber-600 ml-auto shrink-0" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />
          )}
        </div>

        <div className="text-xs text-gray-500 font-mono hidden sm:block">
          {isLocked ? 'STAGING PREVIEW' : 'PRODUCTION READY'}
        </div>
      </div>

      {/* Browser Body */}
      <div className="relative min-h-[500px] bg-gray-50 p-6 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Mock Live Web App Interface */}
        <div className={`w-full max-w-3xl space-y-6 transition-all duration-500 ${isLocked ? 'blur-[6px] opacity-40 pointer-events-none' : 'filter-none opacity-100'}`}>
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="h-5 w-32 bg-blue-100 rounded mb-4"></div>
            <div className="h-9 w-3/4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
            <div className="h-4 w-4/5 bg-gray-100 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((card) => (
              <div key={card} className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
                <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 mb-3"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
                <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 text-xs font-mono text-gray-600">
            <code>// Deployed Build Package: production-react-v1.4.0 • Node v20</code>
          </div>
        </div>

        {/* Watermark and Lock Overlay if locked */}
        {isLocked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-md">
            {/* Repeating watermark */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-12 opacity-15 transform -rotate-12 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="text-xl font-bold text-gray-500 uppercase tracking-widest">
                  PREVIEW ONLY - PAYLOCK
                </span>
              ))}
            </div>

            <div className="relative z-30 text-center max-w-md p-6 rounded-2xl bg-white border border-gray-200 shadow-lg">
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Interactive Web Link Protected</h3>
              <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                Staging environment is locked with PayLock access-gate. Pay balance to unlock live domain DNS pointer and full GitHub source repository.
              </p>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 mb-4">
                <span className="text-xs text-gray-500">Total Deliverable Balance:</span>
                <span className="text-lg font-bold text-gray-900">${price.toLocaleString()}</span>
              </div>

              {onPayClick && (
                <button
                  onClick={onPayClick}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Pay ${price.toLocaleString()} & Release Staging Access</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Unlocked banner if paid */}
        {!isLocked && (
          <div className="absolute top-4 right-4 z-30 flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Interactive Web Environment Unlocked</span>
          </div>
        )}
      </div>
    </div>
  );
};
