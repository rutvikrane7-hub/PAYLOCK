import React from 'react';
import { Shield, Lock, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#060911]/90 backdrop-blur py-8 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        
        {/* Core required prompt branding line */}
        <div className="flex items-center space-x-2 text-sm font-medium text-slate-300">
          <span className="text-cyan-400">⚡</span>
          <span>Get paid on time, every time. Built with PayLock</span>
        </div>

        <div className="flex items-center space-x-6 text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>256-Bit Asset Watermarking</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Risk Client Escrow</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Release Delivery</span>
          </span>
        </div>

        <div className="text-slate-500">
          © {new Date().getFullYear()} PayLock Technologies. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
