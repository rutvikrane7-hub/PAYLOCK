export type AssetType = 'video' | 'pdf' | 'web';

export type DeliverableStatus = 'LOCKED' | 'PAID';

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
}
