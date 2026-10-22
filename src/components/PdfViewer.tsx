import React, { useState } from 'react';
import { Lock, FileText, ChevronLeft, ChevronRight, Eye, ShieldCheck, Sparkles } from 'lucide-react';

interface PdfViewerProps {
  isLocked: boolean;
  title: string;
  clientName: string;
  price: number;
  onPayClick?: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  isLocked,
  title,
  clientName,
  price,
  onPayClick,
}) => {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      
      {/* Top Document Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800 text-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200 text-sm flex items-center space-x-2">
              <span className="truncate max-w-xs sm:max-w-md">{title}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                PDF Document (2 Pages)
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Prepared for: <span className="text-slate-200 font-medium">{clientName}</span>
            </div>
          </div>
        </div>

        {/* Page Switcher & Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1 rounded transition-all font-medium ${
                currentPage === 1
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Page 1 (Summary)
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`px-3 py-1 rounded transition-all font-medium flex items-center space-x-1 ${
                currentPage === 2
                  ? isLocked
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isLocked && <Lock className="w-3 h-3 text-amber-400" />}
              <span>Page 2 {isLocked ? '(Locked)' : '(Unlocked)'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-1 text-slate-400">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300">
              {currentPage} / 2
            </span>
            <button
              onClick={() => setCurrentPage(2)}
              disabled={currentPage === 2}
              className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Document View Canvas */}
      <div className="p-4 sm:p-8 bg-[#0b0f19] flex justify-center min-h-[580px] overflow-x-auto relative">
        
        {/* Render Page 1 (Always clear and crisp) */}
        {currentPage === 1 && (
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 relative border border-slate-300">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-cyan-600 uppercase">
                  Executive Deliverable & Milestone Report
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {title}
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Document ID: PAYLOCK-AUDIT-2026-X09 • Confidential Draft
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500">Target Client</div>
                <div className="text-base font-bold text-slate-900">{clientName}</div>
                <div className="inline-block px-2 py-0.5 mt-1 bg-blue-50 text-blue-700 rounded text-[11px] font-semibold border border-blue-200">
                  Deliverable Phase: Review
                </div>
              </div>
            </div>

            {/* Scope & Overview */}
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-cyan-500 pl-3 mb-2">
                  1. Executive Summary & Deliverables Completed
                </h2>
                <p>
                  This comprehensive master deliverable package represents the complete finalized
                  specifications, architecture review, and creative master assets produced under
                  the agreed engagement scope. All primary milestones have passed internal quality
                  assurance and validation checks.
                </p>
              </section>

              {/* Deliverable Key Milestones Table */}
              <section className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Scope Milestone Breakdown
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                    <span className="font-medium text-slate-800">1. Creative Master Identity & Asset Export</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Complete
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                    <span className="font-medium text-slate-800">2. High-Resolution Source Vectors & Audio Stems</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Complete
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="font-medium text-slate-800">3. Full Commercial Copyright IP Transfer Deed</span>
                    <span className="text-amber-600 font-semibold">
                      {isLocked ? 'Pending Escrow Release ($' + price.toLocaleString() + ')' : 'Released & Transferred'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Callout to Page 2 */}
              <div className="mt-8 p-4 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-cyan-600" />
                    <span>Page 2 includes Full Architecture Schematics & Source Access Keys</span>
                  </div>
                  <p className="text-[11px] text-cyan-700 mt-0.5">
                    Click next or switch to Page 2 to inspect the protected confidential appendix.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage(2)}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  View Page 2 →
                </button>
              </div>
            </div>

            {/* Document Footer */}
            <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span>PayLock Verified Deliverable Document</span>
              <span>Page 1 of 2</span>
            </div>
          </div>
        )}

        {/* Render Page 2 (Heavily Blurred if Locked, Clear if Paid) */}
        {currentPage === 2 && (
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 relative border border-slate-300 min-h-[620px] select-none">
            
            {/* The Document Content (will be blurred heavily if locked) */}
            <div className={`space-y-6 transition-all duration-500 ${isLocked ? 'filter blur-[10px] opacity-40 pointer-events-none select-none' : 'filter-none opacity-100'}`}>
              <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    Appendix B: Production Source Credentials & Master Keys
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    Direct Source File Access & Repository Transfers
                  </h2>
                </div>
                <div className="text-right font-mono text-xs text-slate-500">
                  SECTION 02 / 02
                </div>
              </div>

              {/* Sensitive production credentials section */}
              <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 font-mono text-xs space-y-2">
                <div className="text-slate-800 font-bold text-sm">Git Production Repository:</div>
                <div className="text-cyan-700 bg-white p-2 rounded border border-slate-200">
                  git@github.com:agency-vault/deliverable-production-master.git
                </div>
                <div className="text-slate-800 font-bold text-sm mt-3">AWS S3 Raw Footage & Vector Assets:</div>
                <div className="text-cyan-700 bg-white p-2 rounded border border-slate-200">
                  s3://paylock-encrypted-vault-us-east/deliverables/master_uncompressed_4k.tar.gz
                </div>
                <div className="text-slate-800 font-bold text-sm mt-3">Decryption Passphrase:</div>
                <div className="text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-300 font-bold">
                  PL-VAULT-2026-X8849-CONFIDENTIAL-RELEASED
                </div>
              </div>

              {/* Master architecture diagram and tables */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-200 p-3 rounded-lg bg-slate-50">
                  <div className="font-bold text-slate-800 mb-1">Asset Hash (SHA-256):</div>
                  <div className="text-[10px] text-slate-500 font-mono break-all">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </div>
                </div>
                <div className="border border-slate-200 p-3 rounded-lg bg-slate-50">
                  <div className="font-bold text-slate-800 mb-1">Commercial Rights Granted:</div>
                  <div className="text-emerald-700 font-semibold">
                    Worldwide, Perpetual, Exclusive Commercial Rights
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <strong>Proof of Title:</strong> This document serves as the binding receipt and legal transfer of ownership from the Creator to {clientName}.
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400 font-mono">
                <span>PayLock Escrow Protocol • Confidential Appendix</span>
                <span>Page 2 of 2</span>
              </div>
            </div>

            {/* HEAVY CSS BLUR SHROUD & LOCK ICON OVERLAY (WHEN LOCKED) */}
            {isLocked && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/70 backdrop-blur-xl rounded-xl border-2 border-dashed border-cyan-500/40 animate-fadeIn">
                
                {/* Glowing Lock Container */}
                <div className="relative mb-5 group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-xl opacity-60 animate-pulse"></div>
                  <div className="relative w-20 h-20 rounded-full bg-slate-900 border-2 border-cyan-400/80 flex items-center justify-center shadow-[0_0_35px_rgba(0,242,254,0.4)]">
                    <Lock className="w-10 h-10 text-cyan-400 animate-bounce" />
                  </div>
                </div>

                {/* Shroud Notice */}
                <h3 className="text-xl sm:text-2xl font-black text-white text-center tracking-tight mb-2">
                  LOCKED CONTENT — PAGE 2 OF 2
                </h3>
                
                <p className="text-sm text-slate-300 text-center max-w-md mb-6 leading-relaxed">
                  This page contains production source files, credentials, and high-resolution master assets.
                  A heavy CSS security shroud protects the deliverable until escrow payment is confirmed.
                </p>

                {/* Balance & CTA Trigger */}
                <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-slate-400 font-mono">Balance Due to Unlock:</div>
                    <div className="text-2xl font-black text-white glow-cyan">
                      ${price.toLocaleString()} <span className="text-xs text-cyan-400 font-normal">USD</span>
                    </div>
                  </div>

                  {onPayClick && (
                    <button
                      onClick={onPayClick}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-sm glow-btn transition-all active:scale-95 flex items-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Unlock Page 2 Now</span>
                    </button>
                  )}
                </div>

                <div className="mt-4 text-[11px] text-cyan-300/80 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant unblurring upon verified transaction receipt</span>
                </div>
              </div>
            )}

            {/* UNLOCKED BADGE (WHEN PAID) */}
            {!isLocked && (
              <div className="absolute top-4 right-4 z-30 flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Page 2 Unlocked & Unblurred</span>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Footer Navigation Bar for PDF */}
      <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>{isLocked ? 'Protected PDF Preview Mode' : 'Unlocked Full Master Document'}</span>
        </div>
        <div>
          {isLocked ? (
            <span className="text-amber-400 font-mono">Page 2 Shrouded With CSS Blur</span>
          ) : (
            <span className="text-emerald-400 font-mono">All Pages Unrestricted</span>
          )}
        </div>
      </div>

    </div>
  );
};
