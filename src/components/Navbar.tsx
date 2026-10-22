import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, PlusCircle, ExternalLink, Sparkles } from 'lucide-react';
import { useDeliverables } from '../context/DeliverablesContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { openCreateModal } = useDeliverables();

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isPreview = location.pathname.startsWith('/p/');

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/15 bg-[#070b14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3.5">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-600/10 to-blue-900/30 border border-cyan-500/30 p-1 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all">
                <img
                  src="/watermarked_img_17212940726602837843.png"
                  alt="PayLock Logo"
                  className="w-full h-full object-contain rounded-lg drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Pay<span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(0,242,254,0.7)]">Lock</span>
                </span>
                
                {/* Beta v1.0 Badge */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
                  Beta v1.0
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDashboard
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Agency Dashboard
            </Link>
            
            <Link
              to="/p/demo"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                isPreview
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>Client Demo Preview</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Link>
          </nav>

          {/* Right Section Actions / Status */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Escrow Safe Release</span>
            </div>

            {/* Click to open the polished Create Deliverable Modal */}
            <button
              onClick={openCreateModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 hover:from-cyan-400 hover:to-sky-500 glow-btn transition-all active:scale-95 shadow-[0_0_16px_rgba(6,182,212,0.35)] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>New Deliverable</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
