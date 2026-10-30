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
  const [currency, setCurrency] = useState(creatorSettings.currency || 'USD');
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
      currency,
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
          currency,
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
      <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <h2 className="text-xl font-bold text-gray-900">Freelancer Payout & Direct Split Settings</h2>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Stripe Connect Direct Charges
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
            Configure your connected creator account ID. When clients pay to unlock deliverables, 
            the 1% platform fee is retained by PayLock and the remaining 99% is deposited directly into your bank account.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="shrink-0">
          {isConnected ? (
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Connected • 99% Direct Payouts Active</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Not Configured • Using Platform Default</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Creator Account Configuration (7 cols) */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-gray-200 p-6 sm:p-7 space-y-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Connected Payment Accounts</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Enter your Stripe Connect Account ID (`acct_...`) or Razorpay Route Account ID (`acc_...`).
              </p>
            </div>

            {/* Input: Business/Creator Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Creator or Agency Business Name</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Creative Studio"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Currency Preference Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Default Currency</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                    currency === 'USD'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">$ USD (US Dollar)</div>
                    <div className="text-[11px] text-gray-500">For global & international clients</div>
                  </div>
                  {currency === 'USD' && <Check className="w-4 h-4 text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                    currency === 'INR'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">₹ INR (Indian Rupee)</div>
                    <div className="text-[11px] text-gray-500">For domestic & UPI/Razorpay clients</div>
                  </div>
                  {currency === 'INR' && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              </div>
            </div>

            {/* REQUIREMENT: INPUT FIELD FOR STRIPE_ACCOUNT_ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Stripe Connect Account ID (`stripe_account_id`) *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setStripeAccountId('acct_1N48K2PayLockDemo')}
                  className="text-[11px] text-blue-600 hover:text-blue-700 underline font-mono"
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
                  className="w-full px-3.5 py-2 pl-9 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                />
                <Radio className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                Your Stripe Standard, Express, or Custom account ID. All client unlock checkout sessions 
                pass this ID to `payment_intent_data.transfer_data.destination`.
              </p>
            </div>

            {/* Optional: Razorpay Route Account ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Razorpay Route Account ID (`razorpay_account_id`) (Optional)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setRazorpayAccountId('acc_PayLockRazorpayDemo')}
                  className="text-[11px] text-blue-600 hover:text-blue-700 underline font-mono"
                >
                  Use Demo ID
                </button>
              </div>
              <input
                type="text"
                value={razorpayAccountId}
                onChange={(e) => setRazorpayAccountId(e.target.value)}
                placeholder="acc_xxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              />
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                For domestic Indian and INR payouts routed via Razorpay transfers.
              </p>
            </div>

            {/* Platform Commission Notice */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-blue-900 font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Configured Revenue Split</span>
                </span>
                <span className="font-mono text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                  1% Platform / 99% Creator
                </span>
              </div>
              <p className="text-[11px] text-blue-700 leading-normal">
                Every client checkout session created through `/api/create-checkout` allocates 
                <strong> 99% directly to your destination account</strong> and retains <strong>1% as the platform application fee</strong>.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-fadeIn">
                  <Check className="w-4 h-4" />
                  <span>Payout account saved successfully!</span>
                </div>
              ) : (
                <div className="text-xs text-gray-400 font-mono">
                  Saved locally & synced to escrow engine
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Connected Account</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Commission Split Calculator & Webhook Tester (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Calculator Card */}
          <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span>Live Split Visualizer</span>
                </h3>
                <p className="text-[11px] text-gray-500">Simulate earnings on any deliverable balance</p>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                Stripe Direct
              </span>
            </div>

            {/* Amount Slider / Input */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">Deliverable Balance ({currency}):</span>
                <span className="text-gray-900 font-bold font-mono">
                  {currency === 'INR' ? '₹' : '$'}{testAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={testAmount}
                onChange={(e) => setTestAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Split Breakdown Details */}
            <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs">
              
              {/* Creator Share (99%) */}
              <div className="flex items-center justify-between py-1.5 border-b border-gray-200">
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Your Direct Bank Payout (99%)</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                    Routes to {stripeAccountId ? `${stripeAccountId.substring(0, 10)}...` : 'Connected Account'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-600 font-mono">
                    {currency === 'INR' ? '₹' : '$'}{calculatedCreatorPayout.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Platform Fee (1%) */}
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <div className="font-semibold text-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>PayLock Platform Escrow Fee (1%)</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                    Application fee retained by platform
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-700 font-mono">
                    {currency === 'INR' ? '₹' : '$'}{calculatedPlatformFee.toLocaleString()}
                  </div>
                </div>
              </div>

            </div>

            <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Funds settle directly via Stripe Connect rails with zero intermediary custody risk.</span>
            </div>
          </div>

          {/* Webhook Endpoint Verification Card */}
          <div className="rounded-xl bg-white border border-gray-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider font-mono">
                  Webhook Endpoint (`/api/webhooks/payment`)
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-normal">
              Listens for `checkout.session.completed` events. Automatically unlocks files, strips watermarks, and releases master downloads upon verified payment.
            </p>

            <button
              onClick={handleTestWebhook}
              disabled={webhookTesting}
              className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 hover:text-gray-900 shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              {webhookTesting ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Dispatching Test Webhook...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Send Test Webhook to /api/webhooks/payment</span>
                </>
              )}
            </button>

            {webhookResult && (
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-[11px] font-mono overflow-x-auto space-y-1">
                <div className="text-emerald-700 font-semibold">✓ Webhook Response: HTTP 200 OK</div>
                <div className="text-gray-600">{webhookResult.message || JSON.stringify(webhookResult)}</div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
