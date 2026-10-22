import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeliverables } from '../context/DeliverablesContext';
import { DeliverableThumbnail } from '../components/DeliverableThumbnail';
import { CreateDeliverableModal } from '../components/CreateDeliverableModal';
import { FreelancerSettingsPanel } from '../components/FreelancerSettingsPanel';
import {
  PlusCircle,
  ExternalLink,
  Copy,
  Check,
  Lock,
  Unlock,
  Eye,
  Trash2,
  DollarSign,
  TrendingUp,
  LayoutGrid,
  LayoutList,
  CheckCircle2,
  Zap,
  Clock,
  Sparkles,
  ShieldCheck,
  Settings,
  CreditCard,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DashboardPage: React.FC = () => {
  const {
    deliverables,
    creatorSettings,
    unlockDeliverable,
    lockDeliverable,
    deleteDeliverable,
    resetToDefault,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
  } = useDeliverables();

  // Navigation tab: 'deliverables' or 'settings'
  const [activeTab, setActiveTab] = useState<'deliverables' | 'settings'>('deliverables');

  // View state: 'table' or 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Computed Metrics
  const totalVolume = deliverables.reduce((sum, d) => sum + d.price, 0);
  const paidVolume = deliverables.filter((d) => d.status === 'PAID').reduce((sum, d) => sum + d.price, 0);
  const lockedCount = deliverables.filter((d) => d.status === 'LOCKED').length;
  const pendingVolume = totalVolume - paidVolume;
  const successRate = deliverables.length > 0 ? (paidVolume > 0 ? '98.8%' : '100%') : '100%';

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/p/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulatePayment = (id: string, currentStatus: string) => {
    if (currentStatus === 'LOCKED') {
      unlockDeliverable(id);
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#10b981', '#00f2fe', '#38bdf8', '#34d399'],
      });
    } else {
      lockDeliverable(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner & Agency Metrics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Agency Deliverables Hub</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Escrow Release Engine
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Safely distribute watermarked previews. Master source assets and high-res files unlock automatically upon escrow payment.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Connected Payout Account Pill */}
          <button
            onClick={() => setActiveTab('settings')}
            className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
            title="Configure Stripe Connected Account"
          >
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">{creatorSettings.stripeAccountId ? `${creatorSettings.stripeAccountId.substring(0, 11)}...` : 'Add Payout Acct'}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded font-bold">97% Split</span>
          </button>

          <button
            onClick={resetToDefault}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            Reset Demo Data
          </button>
          
          <Link
            to="/p/demo"
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-950/40 transition-colors"
          >
            <span>Live Client Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 glow-btn shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>New Deliverable</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATOR: Deliverables vs Freelancer Settings */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'deliverables'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Deliverables Hub ({deliverables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Freelancer Payout Settings</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      </div>

      {/* TAB 1: DELIVERABLES HUB VIEW */}
      {activeTab === 'deliverables' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* REQUIREMENT 1: 3 CLEAN STAT CARDS AT THE TOP WITH SOFT GLOWING GRADIENT BORDERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Total Revenue Unlocked */}
            <div className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/40 via-cyan-500/20 to-transparent shadow-[0_0_25px_rgba(16,185,129,0.12)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(16,185,129,0.22)]">
              <div className="rounded-2xl bg-gradient-to-b from-[#0b1724] to-[#080d19] p-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase font-mono text-slate-400">
                    Total Revenue Unlocked
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                    <span>${paidVolume.toLocaleString()}</span>
                    <span className="text-xs font-normal text-emerald-400 font-mono">USD</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Settled via Smart Escrow</span>
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      Pending: ${pendingVolume.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Active Locked Links */}
            <div className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-amber-500/40 via-yellow-500/20 to-transparent shadow-[0_0_25px_rgba(245,158,11,0.12)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(245,158,11,0.22)]">
              <div className="rounded-2xl bg-gradient-to-b from-[#181512] to-[#080d19] p-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase font-mono text-slate-400">
                    Active Locked Links
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-2">
                    <span>{lockedCount}</span>
                    <span className="text-xs font-normal text-amber-400 font-sans">
                      {lockedCount === 1 ? 'Deliverable' : 'Deliverables'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-amber-300 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Watermarks & Blurs Guarded</span>
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {deliverables.length} total links
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Payment Success Rate */}
            <div className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/40 via-sky-500/20 to-transparent shadow-[0_0_25px_rgba(0,242,254,0.12)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,242,254,0.22)]">
              <div className="rounded-2xl bg-gradient-to-b from-[#091524] to-[#080d19] p-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase font-mono text-slate-400">
                    Payment Success Rate
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.25)]">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-2">
                    <span className="glow-cyan">{successRate}</span>
                    <span className="text-xs font-normal text-cyan-300 font-sans">Automated</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-cyan-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Instant High-Res Delivery</span>
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      0 Chargebacks
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* DELIVERABLES SECTION CONTROLS (HEADER + VIEW TOGGLE) */}
          <div className="rounded-2xl bg-[#0c1222] border border-slate-800 shadow-xl overflow-hidden">
            
            {/* Header Controls Bar */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#090d18]">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Deliverables & Client Links</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live status, client impression telemetry, and instant unlock simulations.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* VIEW TOGGLE */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                      viewMode === 'grid'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Visual Card Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Card Grid</span>
                  </button>

                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                      viewMode === 'table'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Detailed Table View"
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    <span>Table View</span>
                  </button>
                </div>

                {/* Quick Trigger Modal Button */}
                <button
                  onClick={openCreateModal}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+ New Deliverable</span>
                </button>
              </div>
            </div>

            {/* VIEW MODE 1: VISUAL CARD GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deliverables.map((item) => {
                    const isItemLocked = item.status === 'LOCKED';
                    const targetAcct = item.stripeAccountId || creatorSettings.stripeAccountId || 'acct_1N48K2PayLockDemo';
                    const fee = Math.round(item.price * (creatorSettings.platformFeePercent / 100));
                    const payout = item.price - fee;

                    return (
                      <div
                        key={item.id}
                        className="group rounded-2xl bg-[#090d19] border border-slate-800 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,242,254,0.1)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                      >
                        <div>
                          {/* Visual Thumbnail Banner */}
                          <div className="p-3 bg-slate-950/50 border-b border-slate-800/80">
                            <DeliverableThumbnail
                              type={item.assetType}
                              status={item.status}
                              size="lg"
                            />
                          </div>

                          {/* Card Content Body */}
                          <div className="p-5 space-y-4">
                            
                            {/* Status Badge & Countdown Timer */}
                            <div className="flex items-center justify-between text-xs">
                              {isItemLocked ? (
                                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>ESCROW LOCKED</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>PAID & RELEASED</span>
                                </span>
                              )}

                              {/* Countdown Timer Badge */}
                              <div className="flex items-center space-x-1 text-slate-400 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                                <Clock className="w-3 h-3 text-cyan-400" />
                                <span>{isItemLocked ? `${item.expiryDays}d Review Left` : 'Unlocked'}</span>
                              </div>
                            </div>

                            {/* Title and Client */}
                            <div>
                              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                                <span>{item.clientName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{targetAcct.substring(0, 10)}...</span>
                              </div>
                              <Link
                                to={`/p/${item.id}`}
                                className="block font-bold text-white text-base mt-1 group-hover:text-cyan-300 transition-colors line-clamp-1"
                                title={item.deliverableTitle}
                              >
                                {item.deliverableTitle}
                              </Link>
                            </div>

                            {/* Price and Split Summary */}
                            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                              <div className="flex items-baseline justify-between">
                                <div>
                                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Total Balance</span>
                                  <span className="text-xl font-black text-white glow-cyan">
                                    ${item.price.toLocaleString()}
                                    <span className="text-xs font-normal text-slate-400 ml-1">USD</span>
                                  </span>
                                </div>

                                <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{item.views} views</span>
                                </div>
                              </div>

                              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60">
                                <span className="text-emerald-400 font-semibold">Creator 97%: ${payout.toLocaleString()}</span>
                                <span className="text-cyan-300">Fee 3%: ${fee.toLocaleString()}</span>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleSimulatePayment(item.id, item.status)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                              isItemLocked
                                ? 'bg-gradient-to-r from-cyan-500/20 to-sky-500/20 hover:from-cyan-500/30 hover:to-sky-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {isItemLocked ? (
                              <>
                                <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Simulate Unlock</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Re-Lock</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleCopyLink(item.id)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                            title="Copy Share Link"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <Link
                            to={`/p/${item.id}`}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                            title="Open Client Preview"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {item.id !== 'demo' && (
                            <button
                              onClick={() => deleteDeliverable(item.id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-500/40 transition-colors"
                              title="Delete Deliverable"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW MODE 2: TABLE VIEW WITH SPLIT TELEMETRY */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#070b15] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Media Preview & Project Title</th>
                      <th className="py-4 px-6">Format</th>
                      <th className="py-4 px-6">Balance & 97% Payout</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Review Expiry</th>
                      <th className="py-4 px-6">Views</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-sm">
                    {deliverables.map((item) => {
                      const isItemLocked = item.status === 'LOCKED';
                      const fee = Math.round(item.price * (creatorSettings.platformFeePercent / 100));
                      const payout = item.price - fee;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-900/60 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3.5">
                              <DeliverableThumbnail
                                type={item.assetType}
                                status={item.status}
                                size="sm"
                              />

                              <div>
                                <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-2">
                                  <span>{item.deliverableTitle}</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                  Client: <span className="text-cyan-400/90 font-medium">{item.clientName}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  File: {item.fileName || 'Archive.zip'} ({item.fileSize || '380 MB'})
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-300 uppercase font-mono">
                              {item.assetType}
                            </span>
                          </td>

                          <td className="py-4 px-6 font-mono">
                            <div className="font-bold text-white text-base">
                              ${item.price.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-emerald-400">
                              Net: ${payout.toLocaleString()} (97%)
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            {isItemLocked ? (
                              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                                <Lock className="w-3 h-3 text-amber-400" />
                                <span>LOCKED</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>PAID</span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 font-mono text-xs text-slate-400">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              <span>{isItemLocked ? `${item.expiryDays} Days` : 'Unlocked'}</span>
                            </span>
                          </td>

                          <td className="py-4 px-6 font-mono text-xs text-slate-300">
                            <span className="flex items-center space-x-1.5">
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>{item.views}</span>
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleSimulatePayment(item.id, item.status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                                  isItemLocked
                                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                                }`}
                                title="Simulate client payment status change"
                              >
                                {isItemLocked ? (
                                  <>
                                    <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Simulate Unlock</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Re-Lock</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleCopyLink(item.id)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                                title="Copy Client Link"
                              >
                                {copiedId === item.id ? (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>

                              <Link
                                to={`/p/${item.id}`}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-700 transition-colors"
                                title="Open Client Preview"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              {item.id !== 'demo' && (
                                <button
                                  onClick={() => deleteDeliverable(item.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                                  title="Delete Deliverable"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 2: FREELANCER SETTINGS VIEW (REQUIREMENT 1) */}
      {activeTab === 'settings' && (
        <FreelancerSettingsPanel />
      )}

      {/* POLISHED CREATE MODAL */}
      <CreateDeliverableModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />

    </div>
  );
};
