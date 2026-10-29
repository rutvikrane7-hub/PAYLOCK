export type AssetType = 'video' | 'pdf' | 'web';

export type DeliverableStatus = 'LOCKED' | 'PAID';

export interface PayoutSplit {
  platformFee: number;
  creatorPayout: number;
  destinationAccount: string;
}

export interface Deliverable {
  id: string;
  clientName: string;
  deliverableTitle: string;
  price: number;
  expiryDays: number;
  createdAt: string;
  status: DeliverableStatus;
  views: number;
  assetType: AssetType;
  fileName?: string;
  fileSize?: string;
  assetUrl?: string;
  notes?: string;
  paidAt?: string;
  stripeAccountId?: string;
  payoutSplit?: PayoutSplit;
}

export interface CreatorSettings {
  stripeAccountId: string;
  razorpayAccountId: string;
  platformFeePercent: number; // default 1% platform margin
  currency: string; // 'USD' or 'INR'
  conversionRate: number; // conversion rate from USD to selected currency (e.g., 82 for INR)
  businessName: string;
}
