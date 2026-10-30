import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDeliverables } from '../context/DeliverablesContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { PdfViewer } from '../components/PdfViewer';
import { WebPreviewer } from '../components/WebPreviewer';
import { PaymentModal } from '../components/PaymentModal';
import {
  Clock,
  ShieldCheck,
  Download,
  Lock,
  FileText,
  Video,
  Share2,
  CheckCircle2,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PayoutSplit } from '../types';

export const PreviewPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const deliverableId = id || 'demo';
  const { getDeliverable, unlockDeliverable, lockDeliverable, incrementViews, creatorSettings } = useDeliverables();

  const deliverable = getDeliverable(deliverableId) || getDeliverable('demo');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);
  const [autoUnlockedFromStripe, setAutoUnlockedFromStripe] = useState(false);

  // Live Countdown Timer (7 Days Remaining to Review)
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 58,
    seconds: 45,
  });

  // Calculate 1% / 99% split
  const targetStripeAccount = deliverable?.stripeAccountId || creatorSettings.stripeAccountId || 'acct_1N48K2PayLockDemo';
  const platformFee = deliverable ? Math.round(deliverable.price * (creatorSettings.platformFeePercent / 100) * 100) / 100 : 15;
  const creatorPayout = deliverable ? Math.round((deliverable.price - platformFee) * 100) / 100 : 1485;

  useEffect(() => {
    // Record view
    if (deliverable) {
      incrementViews(deliverable.id);
    }
  }, [deliverable?.id]);

  // Handle return from live Stripe Checkout session (?success=true)
  useEffect(() => {
    if (searchParams.get('success') === 'true' && deliverable && deliverable.status === 'LOCKED') {
      unlockDeliverable(deliverable.id, {
        platformFee,
        creatorPayout,
        destinationAccount: targetStripeAccount,
      });

      setAutoUnlockedFromStripe(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#06b6d4'],
      });
    }
  }, [searchParams, deliverable?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!deliverable) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Deliverable Not Found</h2>
        <p className="text-gray-500 mb-6">The requested PayLock deliverable link does not exist.</p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isLocked = deliverable.status === 'LOCKED';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDownloadSourceFiles = () => {
    setDownloadFeedback(true);
    // Create simulated file download
    const element = document.createElement('a');
    const fileContent = `=====================================================
PAYLOCK CERTIFIED ASSET DELIVERY PACKAGE
=====================================================
Deliverable Title : ${deliverable.deliverableTitle}
Client Name       : ${deliverable.clientName}
Status            : PAID & UNLOCKED
Amount Cleared    : $${deliverable.price.toLocaleString()} USD
Creator Payout    : $${creatorPayout.toLocaleString()} (99% routed to ${targetStripeAccount})
Platform Fee      : $${platformFee.toLocaleString()} (1% retained by PayLock)
Paid Timestamp    : ${deliverable.paidAt || new Date().toISOString()}
Hash ID           : PL-${deliverable.id.toUpperCase()}-VERIFIED-RELEASE

All watermarks and security blurs have been removed.
Commercial rights have been transferred in full to ${deliverable.clientName}.

High-Resolution Asset Links:
- Master High-Res 4K Video: https://cdn.paylock.net/vault/${deliverable.id}/master.mp4
- Uncompressed Audio Stems: https://cdn.paylock.net/vault/${deliverable.id}/stems.wav
- Vector Design & Source Project: https://cdn.paylock.net/vault/${deliverable.id}/source.zip

=====================================================
Generated by PayLock Escrow Vault
=====================================================`;

    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${deliverable.deliverableTitle.replace(/\s+/g, '_')}_HighRes_Source_Package.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => setDownloadFeedback(false), 2500);
  };

  return (
    <div className="min-h-screen pb-16 animate-fadeIn bg-[#f8f9fa]">
      
      {/* Stripe Checkout Auto-Unlock Banner */}
      {autoUnlockedFromStripe && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3 text-center text-xs text-emerald-800 font-semibold flex items-center justify-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Payment Verified via Stripe Connect! All watermarks and blur shrouds have been dissolved.</span>
        </div>
      )}

      {/* Client Preview Sub-Header */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Header with PayLock logo, deliverable name */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 p-1 flex items-center justify-center shadow-xs">
              <img
                src="/watermarked_img_17212940726602837843.png"
                alt="PayLock"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {deliverable.clientName}
                </span>
                <span className="text-gray-300">•</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  isLocked
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isLocked ? 'LOCKED DRAFT' : 'PAID & UNLOCKED'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {deliverable.deliverableTitle}
              </h1>
            </div>
          </div>

          {/* Live Countdown Timer ("7 Days Remaining to Review") */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-3 px-3.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 shadow-2xs">
              <div className="p-1 rounded bg-blue-100 text-blue-600">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {deliverable.expiryDays} Days Review Period
                </div>
                <div className="text-xs font-mono font-bold text-gray-800 flex items-center space-x-1">
                  <span className="text-blue-600">{timeLeft.days}d</span>
                  <span className="text-gray-400">:</span>
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span className="text-gray-400">:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span className="text-gray-400">:</span>
                  <span className="text-blue-600">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 shadow-2xs transition-colors cursor-pointer"
              title="Copy Preview Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {copyFeedback && (
              <span className="text-xs text-blue-600 font-semibold animate-fadeIn">
                Link Copied!
              </span>
            )}

            {/* Quick Demo Toggle */}
            <div className="hidden lg:flex items-center bg-gray-100 border border-gray-200 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => {
                  if (isLocked) {
                    setIsPaymentModalOpen(true);
                  } else {
                    lockDeliverable(deliverable.id);
                  }
                }}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  isLocked
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'bg-white text-amber-700 shadow-xs'
                }`}
              >
                {isLocked ? '⚡ Simulate Unlock' : '🔒 Re-lock for testing'}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Quick Asset Switcher Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-xs text-xs">
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="font-semibold text-gray-900">Deliverable Format:</span>
            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase font-mono font-medium">
              {deliverable.assetType}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Preview formats:</span>
            <Link
              to="/p/demo"
              className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors ${
                deliverable.id === 'demo'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Video ($1,500)</span>
            </Link>
            <Link
              to="/p/demo-pdf"
              className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors ${
                deliverable.id === 'demo-pdf'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>PDF Blur Test</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Main Preview Player (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Conditional Renderer based on Asset Type */}
            {deliverable.assetType === 'video' && (
              <VideoPlayer
                isLocked={isLocked}
                title={deliverable.deliverableTitle}
                clientName={deliverable.clientName}
              />
            )}

            {deliverable.assetType === 'pdf' && (
              <PdfViewer
                isLocked={isLocked}
                title={deliverable.deliverableTitle}
                clientName={deliverable.clientName}
                price={deliverable.price}
                onPayClick={() => setIsPaymentModalOpen(true)}
              />
            )}

            {deliverable.assetType === 'web' && (
              <WebPreviewer
                isLocked={isLocked}
                title={deliverable.deliverableTitle}
                clientName={deliverable.clientName}
                price={deliverable.price}
                onPayClick={() => setIsPaymentModalOpen(true)}
              />
            )}

            {/* Deliverable Specifications & Release Details */}
            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Deliverable Specifications & Asset Inventory</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="text-gray-500">Target Client</div>
                  <div className="font-semibold text-gray-900 mt-1">{deliverable.clientName}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="text-gray-500">File Package</div>
                  <div className="font-semibold text-gray-900 mt-1 truncate">{deliverable.fileName || 'Master_Archive.zip'}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="text-gray-500">Package Size</div>
                  <div className="font-semibold text-gray-900 mt-1">{deliverable.fileSize || '640 MB'}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="text-gray-500">Current Status</div>
                  <div className={`font-semibold mt-1 ${isLocked ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {isLocked ? 'Locked (Pending Pay)' : 'Paid & Unlocked'}
                  </div>
                </div>
              </div>

              {deliverable.notes && (
                <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-gray-700">
                  <span className="font-semibold text-gray-900">Agency Delivery Note: </span>
                  {deliverable.notes}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Checkout Card on the side (4 cols) */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            
            {/* The Checkout Card */}
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm space-y-6">
              
              {/* Card Header & Balance Owed */}
              <div className="border-b border-gray-100 pb-5">
                <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                  <span>Balance Owed:</span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                    isLocked ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {isLocked ? 'ESCROW LOCKED' : 'PAYMENT CLEARED'}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  ${deliverable.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 ml-1.5 font-sans">USD</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {isLocked
                    ? 'Payment unlocks instant watermark removal and master high-res source files.'
                    : 'Transaction cleared. High-resolution master assets and licensing deeds released.'}
                </p>
              </div>

              {/* STRIPE CONNECT DESTINATION & COMMISSION SPLIT CALLOUT */}
              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-500">Creator Destination:</span>
                  <span className="text-gray-800 font-semibold truncate max-w-[130px]">{targetStripeAccount}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-500">Creator Payout (99%):</span>
                  <span className="text-emerald-600 font-bold">${creatorPayout.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-500">Platform Escrow Fee (1%):</span>
                  <span className="text-gray-700 font-semibold">${platformFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Deliverable Highlights */}
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Instant watermark & blur removal</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Direct download of high-res source files</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Full commercial copyright transfer deed</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Automated invoice & receipt generation</span>
                </div>
              </div>

              {/* PRIMARY CTA BUTTON: Pay & Unlock OR Download High-Res Source Files */}
              {isLocked ? (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>Pay ${deliverable.price.toLocaleString()} & Unlock Files</span>
                </button>
              ) : (
                <button
                  onClick={handleDownloadSourceFiles}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Download High-Res Source Files</span>
                </button>
              )}

              {downloadFeedback && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium animate-fadeIn">
                  ✓ High-Res Deliverable Package downloading now!
                </div>
              )}

              {/* Escrow Guarantee Badge */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-800">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>PayLock Escrow Protection</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Powered by Stripe Connect. Funds are directly routed with automated webhook verification and instant asset release.
                </p>
              </div>

              {/* Supported Payment Logos */}
              <div className="pt-2 text-center">
                <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2">
                  Guaranteed Safe & Encrypted Checkout
                </div>
                <div className="flex items-center justify-center space-x-3 text-xs font-semibold text-gray-500">
                  <span>VISA</span>
                  <span>•</span>
                  <span>MASTERCARD</span>
                  <span>•</span>
                  <span>APPLE PAY</span>
                  <span>•</span>
                  <span>STRIPE</span>
                </div>
              </div>

            </div>

            {/* Client Assistance Callout */}
            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs text-xs text-gray-600 flex items-center justify-between">
              <div>
                <span className="text-gray-900 font-semibold block">Need revisions or have questions?</span>
                <p className="text-[11px] text-gray-500">Contact the creator directly.</p>
              </div>
              <a
                href={`mailto:delivery@paylock.agency?subject=Inquiry on ${deliverable.deliverableTitle}`}
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-xs font-medium"
              >
                Contact
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Checkout Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        deliverable={deliverable}
        onPaymentSuccess={(split?: PayoutSplit) => {
          unlockDeliverable(deliverable.id, split);
        }}
      />

    </div>
  );
};
