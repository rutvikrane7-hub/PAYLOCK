import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Zap,
  ArrowRight,
  Loader2,
  Building2,
  Smartphone
} from 'lucide-react';
import type { Deliverable } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverable: Deliverable;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  deliverable,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'apple' | 'wire'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('08/29');
  const [cvc, setCvc] = useState('884');
  const [name, setName] = useState('Apex Finance Director');

  if (!isOpen) return null;

  const triggerConfetti = () => {
    // Multi-stage confetti celebration
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#00f2fe', '#38bdf8', '#ffffff'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#10b981', '#34d399', '#00f2fe'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#06b6d4', '#60a5fa', '#f59e0b'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#00f2fe', '#ffffff', '#10b981'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#38bdf8', '#0284c7'],
    });
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      triggerConfetti();

      // Trigger unlock in application context
      onPaymentSuccess();

      // Close modal after brief celebratory confirmation
      setTimeout(() => {
        setIsComplete(false);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#0c1222] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d19]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>PayLock Escrow Checkout</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  256-Bit SSL
                </span>
              </h2>
              <p className="text-xs text-slate-400">Secure automated pay-to-unlock protocol</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deliverable Summary Bar */}
        <div className="px-6 py-3.5 bg-cyan-950/30 border-b border-cyan-500/20 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-300 truncate max-w-[280px]">
              {deliverable.deliverableTitle}
            </div>
            <div className="text-[11px] text-slate-400">
              Client: <span className="text-cyan-300 font-medium">{deliverable.clientName}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Amount Due</div>
            <div className="text-xl font-black text-white glow-cyan">
              ${deliverable.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'card'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('apple')}
              className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'apple'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Apple Pay</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wire')}
              className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'wire'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bank Wire</span>
            </button>
          </div>

          {/* Form Content */}
          {activeTab === 'card' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cardholder Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex justify-between">
                  <span>Card Number</span>
                  <span className="text-[11px] text-slate-400 font-mono">Demo Mode (Valid Test Card)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-10 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    placeholder="4242 4242 4242 4242"
                  />
                  <CreditCard className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-cyan-400"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-cyan-400"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apple' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 mx-auto flex items-center justify-center text-white">
                <Smartphone className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Instant One-Touch Payment</div>
                <div className="text-xs text-slate-400 mt-1">
                  Authenticate with Touch ID / Face ID for instant asset release.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wire' && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Beneficiary:</span>
                <span className="text-slate-200 font-mono">PayLock Escrow Trust Inc.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Routing (ABA):</span>
                <span className="text-slate-200 font-mono">021000021</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account:</span>
                <span className="text-slate-200 font-mono">8829-1029-4401</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference:</span>
                <span className="text-cyan-400 font-mono font-bold">PL-{deliverable.id.toUpperCase()}</span>
              </div>
            </div>
          )}

          {/* Escrow Guarantee Callout */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-semibold">PayLock Guaranteed Release:</span>
              <p className="text-[11px] mt-0.5 leading-normal">
                Upon confirmation, all watermarks and blur shrouds are removed in real-time, and
                high-resolution vector/master source files become immediately downloadable.
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleCompletePayment}
            disabled={isProcessing || isComplete}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 ${
              isComplete
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 glow-btn shadow-[0_0_25px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span>Processing Escrow Authorization...</span>
              </>
            ) : isComplete ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>Payment Confirmed! Releasing Master Assets...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Complete Payment • ${deliverable.price.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Modal Footer Security Badge */}
        <div className="px-6 py-3 bg-[#060a14] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>POWERED BY PAYLOCK ESCROW VAULT</span>
          <span>END-TO-END VERIFIED</span>
        </div>
      </div>
    </div>
  );
};
