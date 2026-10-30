import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Plus, ExternalLink, Sparkles } from 'lucide-react';
import { useDeliverables } from '../context/DeliverablesContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { openCreateModal } = useDeliverables();

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isPreview = location.pathname.startsWith('/p/');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3.5">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 p-1 group-hover:border-blue-400 transition-colors shadow-xs">
                <img
                  src="/watermarked_img_17212940726602837843.png"
                  alt="PayLock Logo"
                  className="w-full h-full object-contain rounded-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                  Pay<span className="text-blue-600">Lock</span>
                </span>
                
                {/* Beta v1.0 Badge */}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
                  Beta v1.0
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isDashboard
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Agency Dashboard
            </Link>
            
            <Link
              to="/p/demo"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isPreview
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>Client Demo Preview</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </nav>

          {/* Right Section Actions / Status */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Escrow Protection Active</span>
            </div>

            {/* Solid Brand Color Primary Button */}
            <button
              onClick={openCreateModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Deliverable</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
