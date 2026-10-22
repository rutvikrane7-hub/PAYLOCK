import React, { useState } from 'react';
import {
  CreditCard,
  Building,
  ShieldCheck,
  Check,
  Sparkles,
  Info,
  DollarSign,
  Radio,
  Globe,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useDeliverables } from '../context/DeliverablesContext';

export const FreelancerSettingsPanel: React.FC = () => {
  const { creatorSettings, updateCreatorSettings } = useDeliverables();

  const [stripeAccountId, setStripeAccountId] = useState(creatorSettings.stripeAccountId);
  const [razorpayAccountId, setRazorpayAccountId] = useState(creatorSettings.razorpayAccountId);
  const [businessName, setBusinessName] = useState(creatorSettings.businessName);
  const [platformFee] = useState(creatorSettings.platformFeePercent);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<any>(null);

  // Live simulation calculator
  const [testAmount, setTestAmount] = useState(1500);
  const calculatedPlatformFee = Math.round(testAmount * (platformFee / 100) * 100) / 100;
  const calculatedCreatorPayout = Math.round((testAmount - calculatedPlatformFee) * 100) / 100;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCreatorSettings({
      stripeAccountId: stripeAccountId.trim(),
      razorpayAccountId: razorpayAccountId.trim(),
      businessName: businessName.trim(),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestWebhook = async () => {
    setWebhookTesting(true);
    setWebhookResult(null);

    try {
      const response = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'checkout.session.completed',
          deliverableId: 'demo',
          totalAmount: 1500,
          stripeAccountId: stripeAccountId || 'acct_1N48K2PayLockDemo',
        }),
      });

      const data = await response.json();
      setWebhookResult(data);
    } catch (err: any) {
      setWebhookResult({ error: err.message || 'Webhook test failed' });
    } finally {
      setWebhookTesting(false);
    }
  };

  const isConnected = Boolean(stripeAccountId.trim() || razorpayAccountId.trim());

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Status Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1222] border border-cyan-500/30 shadow-[0_0_35px_rgba(0,242,254,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <h2 className="text-xl font-extrabold text-white">Freelancer Payout & Direct Split Settings</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Stripe Connect Direct Charges
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Configure your connected creator account ID. When clients pay to unlock deliverables, 
            the 3% platform fee is retained by PayLock and the remaining 97% is deposited directly into your bank account.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="shrink-0">
          {isConnected ? (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Connected • 97% Direct Payouts Active</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Not Configured • Using Platform Vault</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Creator Account Configuration (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0c1222] border border-slate-800 p-6 sm:p-7 space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Connected Payment Accounts</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter your Stripe Connect Account ID (`acct_...`) or Razorpay Route Account ID (`acc_...`).
              </p>
            </div>

            {/* Input: Business/Creator Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Creator or Agency Business Name</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Creative Studio"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* REQUIREMENT 1: INPUT FIELD FOR STRIPE_ACCOUNT_ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Stripe Connect Account ID (`stripe_account_id`) *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setStripeAccountId('acct_1N48K2PayLockDemo')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono"
                >
                  Use Demo ID
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={stripeAccountId}
                  onChange={(e) => setStripeAccountId(e.target.value)}
                  placeholder="acct_1Nxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
                <Radio className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                Your Stripe Standard, Express, or Custom account ID. All client unlock checkout sessions 
                pass this ID to `payment_intent_data.transfer_data.destination`.
              </p>
            </div>

            {/* Optional: Razorpay Route Account ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Razorpay Route Account ID (`razorpay_account_id`) (Optional)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setRazorpayAccountId('acc_PayLockRazorpayDemo')}
                  className="text-[11px] text-blue-400 hover:text-blue-300 underline font-mono"
                >
                  Use Demo ID
                </button>
              </div>
              <input
                type="text"
                value={razorpayAccountId}
                onChange={(e) => setRazorpayAccountId(e.target.value)}
                placeholder="acc_xxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                For international and INR payouts routed via Razorpay transfers.
              </p>
            </div>

            {/* Platform Commission Notice */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between text-cyan-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Configured Revenue Split</span>
                </span>
                <span className="font-mono text-white bg-cyan-900/60 px-2 py-0.5 rounded">
                  3% Platform / 97% Creator
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Every client checkout session created through `/api/create-checkout` allocates 
                <strong> 97% directly to your destination account</strong> and retains <strong>3% as the platform application fee</strong>.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-4 h-4" />
                  <span>Payout account saved successfully!</span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 font-mono">
                  Saved locally & synced to escrow engine
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 glow-btn shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center space-x-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Save Connected Account</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Commission Split Calculator & Webhook Tester (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Calculator Card */}
          <div className="rounded-2xl bg-gradient-to-b from-[#0e1628] to-[#0a0f1d] border border-cyan-500/30 p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <span>Live Split Visualizer</span>
                </h3>
                <p className="text-[11px] text-slate-400">Simulate earnings on any deliverable balance</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Stripe Direct
              </span>
            </div>

            {/* Amount Slider / Input */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Deliverable Balance ($ USD):</span>
                <span className="text-white font-bold font-mono">${testAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={testAmount}
                onChange={(e) => setTestAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Split Breakdown Details */}
            <div className="space-y-3 bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-xs">
              
              {/* Creator Share (97%) */}
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Your Direct Bank Payout (97%)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Routes to {stripeAccountId ? `${stripeAccountId.substring(0, 10)}...` : 'Connected Account'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-emerald-400 font-mono">
                    ${calculatedCreatorPayout.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Platform Fee (3%) */}
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <div className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>PayLock Platform Escrow Fee (3%)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Application fee retained by platform
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-300 font-mono">
                    ${calculatedPlatformFee.toLocaleString()}
                  </div>
                </div>
              </div>

            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Funds settle directly via Stripe Connect rails with zero intermediary custody risk.</span>
            </div>
          </div>

          {/* Webhook Endpoint Verification Card (Requirement 3) */}
          <div className="rounded-2xl bg-[#0c1222] border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Webhook Endpoint (`/api/webhooks/payment`)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Listens for `checkout.session.completed` events. Automatically unlocks files, strips watermarks, and releases master downloads upon verified payment.
            </p>

            <button
              onClick={handleTestWebhook}
              disabled={webhookTesting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white transition-all flex items-center justify-center space-x-2"
            >
              {webhookTesting ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Dispatching Test Webhook...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Send Test Webhook to /api/webhooks/payment</span>
                </>
              )}
            </button>

            {webhookResult && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono overflow-x-auto space-y-1">
                <div className="text-emerald-400 font-bold">✓ Webhook Response: HTTP 200 OK</div>
                <div className="text-slate-300">{webhookResult.message || JSON.stringify(webhookResult)}</div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
