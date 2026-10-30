import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeliverables } from '../context/DeliverablesContext';
import { DeliverableThumbnail } from '../components/DeliverableThumbnail';
import { CreateDeliverableModal } from '../components/CreateDeliverableModal';
import { FreelancerSettingsPanel } from '../components/FreelancerSettingsPanel';
import {
  Plus,
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#06b6d4'],
      });
    } else {
      lockDeliverable(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <span>Agency Deliverables Hub</span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Escrow Engine
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Safely distribute watermarked previews. Master source assets and high-res files unlock automatically upon escrow payment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Connected Payout Account Pill */}
          <button
            onClick={() => setActiveTab('settings')}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 shadow-xs transition-colors"
            title="Configure Stripe Connected Account"
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono text-gray-900">
              {creatorSettings.stripeAccountId ? `${creatorSettings.stripeAccountId.substring(0, 11)}...` : 'Add Payout Acct'}
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">
              99% Payout
            </span>
          </button>

          <button
            onClick={resetToDefault}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-xs font-medium text-gray-600 border border-gray-200 shadow-xs transition-colors"
          >
            Reset Demo Data
          </button>
          
          <Link
            to="/p/demo"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 hover:text-blue-600 shadow-xs transition-colors"
          >
            <span>Live Client Demo</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Deliverable</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATOR: Deliverables vs Freelancer Settings */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'deliverables'
              ? 'bg-white text-blue-600 border border-gray-200 shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Deliverables ({deliverables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-white text-blue-600 border border-gray-200 shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Freelancer Payout Settings</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>
      </div>

      {/* TAB 1: DELIVERABLES HUB VIEW */}
      {activeTab === 'deliverables' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* REQUIREMENT 1: 3 CLEAN ENTERPRISE STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Total Revenue Unlocked */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Revenue Unlocked
                </span>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-baseline gap-1.5">
                  <span>${paidVolume.toLocaleString()}</span>
                  <span className="text-xs font-normal text-gray-500">USD</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Settled via Smart Escrow</span>
                  </span>
                  <span className="text-gray-400 font-medium">
                    Pending: ${pendingVolume.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Active Locked Links */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Active Locked Links
                </span>
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-baseline gap-2">
                  <span>{lockedCount}</span>
                  <span className="text-xs font-normal text-gray-500">
                    {lockedCount === 1 ? 'Deliverable' : 'Deliverables'}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Watermarks Guarded</span>
                  </span>
                  <span className="text-gray-400 font-medium">
                    {deliverables.length} total links
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Payment Success Rate */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment Success Rate
                </span>
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-baseline gap-2">
                  <span>{successRate}</span>
                  <span className="text-xs font-normal text-gray-500">Automated</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-blue-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Instant High-Res Delivery</span>
                  </span>
                  <span className="text-gray-400 font-medium">
                    0 Chargebacks
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* DELIVERABLES SECTION CONTROLS (HEADER + VIEW TOGGLE) */}
          <div className="rounded-xl bg-white border border-gray-200 shadow-xs overflow-hidden">
            
            {/* Header Controls Bar */}
            <div className="p-5 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Deliverables & Client Links</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Live status, client impression telemetry, and instant unlock simulations.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* VIEW TOGGLE */}
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-xs font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Visual Card Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Card Grid</span>
                  </button>

                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-xs font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
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
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>New Deliverable</span>
                </button>
              </div>
            </div>

            {/* VIEW MODE 1: VISUAL CARD GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="p-6 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deliverables.map((item) => {
                    const isItemLocked = item.status === 'LOCKED';
                    const targetAcct = item.stripeAccountId || creatorSettings.stripeAccountId || 'acct_1N48K2PayLockDemo';
                    const fee = Math.round(item.price * (creatorSettings.platformFeePercent / 100));
                    const payout = item.price - fee;

                    return (
                      <div
                        key={item.id}
                        className="group rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between overflow-hidden"
                      >
                        <div>
                          {/* Visual Thumbnail Banner */}
                          <div className="p-3 bg-gray-50 border-b border-gray-100">
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
                                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full font-medium text-[11px] bg-amber-50 text-amber-700 border border-amber-200">
                                  <Lock className="w-3 h-3 text-amber-600" />
                                  <span>ESCROW LOCKED</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full font-medium text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>PAID & RELEASED</span>
                                </span>
                              )}

                              {/* Countdown Timer Badge */}
                              <div className="flex items-center space-x-1 text-gray-500 text-[11px] bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span>{isItemLocked ? `${item.expiryDays}d Review Left` : 'Unlocked'}</span>
                              </div>
                            </div>

                            {/* Title and Client */}
                            <div>
                              <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider flex items-center justify-between">
                                <span>{item.clientName}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{targetAcct.substring(0, 10)}...</span>
                              </div>
                              <Link
                                to={`/p/${item.id}`}
                                className="block font-bold text-gray-900 text-base mt-1 hover:text-blue-600 transition-colors line-clamp-1"
                                title={item.deliverableTitle}
                              >
                                {item.deliverableTitle}
                              </Link>
                            </div>

                            {/* Price and Split Summary */}
                            <div className="pt-3 border-t border-gray-100 space-y-2">
                              <div className="flex items-baseline justify-between">
                                <div>
                                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Balance</span>
                                  <span className="text-xl font-bold text-gray-900">
                                    ${item.price.toLocaleString()}
                                    <span className="text-xs font-normal text-gray-500 ml-1">USD</span>
                                  </span>
                                </div>

                                <div className="flex items-center space-x-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                                  <span>{item.views} views</span>
                                </div>
                              </div>

                              <div className="text-[10px] text-gray-600 font-mono flex items-center justify-between bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <span className="text-emerald-700 font-semibold">Creator 99%: ${payout.toLocaleString()}</span>
                                <span className="text-gray-500">Platform 1%: ${fee.toLocaleString()}</span>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleSimulatePayment(item.id, item.status)}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 ${
                              isItemLocked
                                ? 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-2xs'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {isItemLocked ? (
                              <>
                                <Unlock className="w-3.5 h-3.5 text-blue-600" />
                                <span>Simulate Unlock</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Re-Lock</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleCopyLink(item.id)}
                            className="p-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 shadow-2xs transition-colors"
                            title="Copy Share Link"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <Link
                            to={`/p/${item.id}`}
                            className="p-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-600 hover:text-blue-600 border border-gray-200 shadow-2xs transition-colors"
                            title="Open Client Preview"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {item.id !== 'demo' && (
                            <button
                              onClick={() => deleteDeliverable(item.id)}
                              className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 shadow-2xs transition-colors"
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
                    <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Media Preview & Project Title</th>
                      <th className="py-3.5 px-6">Format</th>
                      <th className="py-3.5 px-6">Balance & 99% Payout</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6">Review Expiry</th>
                      <th className="py-3.5 px-6">Views</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {deliverables.map((item) => {
                      const isItemLocked = item.status === 'LOCKED';
                      const fee = Math.round(item.price * (creatorSettings.platformFeePercent / 100));
                      const payout = item.price - fee;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50/80 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3.5">
                              <DeliverableThumbnail
                                type={item.assetType}
                                status={item.status}
                                size="sm"
                              />

                              <div>
                                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center space-x-2">
                                  <span>{item.deliverableTitle}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Client: <span className="text-gray-700 font-medium">{item.clientName}</span>
                                </div>
                                <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                                  File: {item.fileName || 'Archive.zip'} ({item.fileSize || '380 MB'})
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 uppercase border border-gray-200">
                              {item.assetType}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-900 text-base">
                              ${item.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-emerald-600 font-medium">
                              Net: ${payout.toLocaleString()} (99%)
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            {isItemLocked ? (
                              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                <Lock className="w-3 h-3 text-amber-600" />
                                <span>LOCKED</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>PAID</span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-xs text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>{isItemLocked ? `${item.expiryDays} Days` : 'Unlocked'}</span>
                            </span>
                          </td>

                          <td className="py-4 px-6 text-xs text-gray-600">
                            <span className="flex items-center space-x-1.5">
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              <span>{item.views}</span>
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleSimulatePayment(item.id, item.status)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                                  isItemLocked
                                    ? 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 shadow-2xs'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                                }`}
                                title="Simulate client payment status change"
                              >
                                {isItemLocked ? (
                                  <>
                                    <Unlock className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Simulate Unlock</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Re-Lock</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleCopyLink(item.id)}
                                className="p-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 shadow-2xs transition-colors"
                                title="Copy Client Link"
                              >
                                {copiedId === item.id ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>

                              <Link
                                to={`/p/${item.id}`}
                                className="p-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-600 hover:text-blue-600 border border-gray-200 shadow-2xs transition-colors"
                                title="Open Client Preview"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>

                              {item.id !== 'demo' && (
                                <button
                                  onClick={() => deleteDeliverable(item.id)}
                                  className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 shadow-2xs transition-colors"
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

      {/* TAB 2: FREELANCER SETTINGS VIEW */}
      {activeTab === 'settings' && (
        <FreelancerSettingsPanel />
      )}

      {/* CREATE MODAL */}
      <CreateDeliverableModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />

    </div>
  );
};
