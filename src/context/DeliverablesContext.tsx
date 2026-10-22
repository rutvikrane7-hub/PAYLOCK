import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Deliverable, CreatorSettings, PayoutSplit } from '../types';

interface DeliverablesContextType {
  deliverables: Deliverable[];
  creatorSettings: CreatorSettings;
  updateCreatorSettings: (settings: Partial<CreatorSettings>) => void;
  getDeliverable: (id: string) => Deliverable | undefined;
  addDeliverable: (newDeliverable: Omit<Deliverable, 'id' | 'createdAt' | 'status' | 'views'>) => Deliverable;
  unlockDeliverable: (id: string, split?: PayoutSplit) => void;
  lockDeliverable: (id: string) => void;
  deleteDeliverable: (id: string) => void;
  incrementViews: (id: string) => void;
  resetToDefault: () => void;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

const STORAGE_KEY = 'paylock_deliverables_v1';
const SETTINGS_KEY = 'paylock_creator_settings_v1';

const DEFAULT_SETTINGS: CreatorSettings = {
  stripeAccountId: 'acct_1N48K2PayLockDemo',
  razorpayAccountId: '',
  platformFeePercent: 3, // 3% Platform Fee, 97% to creator
  currency: 'USD',
  businessName: 'Apex Creative Studio'
};

const DEFAULT_DELIVERABLES: Deliverable[] = [
  {
    id: 'demo',
    clientName: 'Apex Media Global',
    deliverableTitle: '4K Cyberpunk Brand Commercial & Final Cut',
    price: 1500,
    expiryDays: 7,
    createdAt: new Date().toISOString(),
    status: 'LOCKED',
    views: 42,
    assetType: 'video',
    fileName: 'Apex_Cyberpunk_Commercial_4K_Master.mp4',
    fileSize: '842 MB',
    stripeAccountId: 'acct_1N48K2PayLockDemo',
    payoutSplit: {
      platformFee: 45, // 3% of $1,500
      creatorPayout: 1455, // 97% of $1,500
      destinationAccount: 'acct_1N48K2PayLockDemo'
    },
    notes: 'Final master export delivered with stereoscopic sound mixing and graded color palette.'
  },
  {
    id: 'demo-pdf',
    clientName: 'Vanguard Capital',
    deliverableTitle: 'Quarterly Financial Audit & Strategic Deck (Confidential)',
    price: 2400,
    expiryDays: 7,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'LOCKED',
    views: 19,
    assetType: 'pdf',
    fileName: 'Vanguard_Strategic_Audit_2026_Final.pdf',
    fileSize: '24.8 MB',
    stripeAccountId: 'acct_1N48K2PayLockDemo',
    payoutSplit: {
      platformFee: 72, // 3% of $2,400
      creatorPayout: 2328, // 97% of $2,400
      destinationAccount: 'acct_1N48K2PayLockDemo'
    },
    notes: 'Multi-page executive report with board-level financial projections and asset distribution models.'
  },
  {
    id: 'link-3',
    clientName: 'Solana Labs Studio',
    deliverableTitle: 'Interactive Web3 Landing Page & 3D Interactive Assets',
    price: 3200,
    expiryDays: 14,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'PAID',
    views: 114,
    assetType: 'web',
    fileName: 'Solana_Interactive_Experience_Package.zip',
    fileSize: '185 MB',
    paidAt: new Date(Date.now() - 86400000).toISOString(),
    stripeAccountId: 'acct_1N48K2PayLockDemo',
    payoutSplit: {
      platformFee: 96,
      creatorPayout: 3104,
      destinationAccount: 'acct_1N48K2PayLockDemo'
    },
    notes: 'Production build archive including source React components, GLTF models, and deployed preview.'
  }
];

const DeliverablesContext = createContext<DeliverablesContextType | undefined>(undefined);

export const DeliverablesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage deliverables:', e);
    }
    return DEFAULT_DELIVERABLES;
  });

  const [creatorSettings, setCreatorSettings] = useState<CreatorSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse localStorage settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deliverables));
    } catch (e) {
      console.error('Failed to save deliverables to localStorage:', e);
    }
  }, [deliverables]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(creatorSettings));
    } catch (e) {
      console.error('Failed to save creator settings to localStorage:', e);
    }
  }, [creatorSettings]);

  const updateCreatorSettings = (newSettings: Partial<CreatorSettings>) => {
    setCreatorSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const getDeliverable = (id: string): Deliverable | undefined => {
    return deliverables.find((d) => d.id === id);
  };

  const addDeliverable = (item: Omit<Deliverable, 'id' | 'createdAt' | 'status' | 'views'>): Deliverable => {
    const fee = Math.round(item.price * (creatorSettings.platformFeePercent / 100));
    const payout = item.price - fee;

    const newDeliverable: Deliverable = {
      ...item,
      id: 'pl_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      status: 'LOCKED',
      views: 0,
      stripeAccountId: creatorSettings.stripeAccountId,
      payoutSplit: {
        platformFee: fee,
        creatorPayout: payout,
        destinationAccount: creatorSettings.stripeAccountId || 'platform_default'
      }
    };
    setDeliverables((prev) => [newDeliverable, ...prev]);
    return newDeliverable;
  };

  const unlockDeliverable = (id: string, split?: PayoutSplit) => {
    setDeliverables((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'PAID',
              paidAt: new Date().toISOString(),
              payoutSplit: split || item.payoutSplit || {
                platformFee: Math.round(item.price * (creatorSettings.platformFeePercent / 100)),
                creatorPayout: Math.round(item.price * (1 - creatorSettings.platformFeePercent / 100)),
                destinationAccount: creatorSettings.stripeAccountId || 'acct_1N48K2PayLockDemo'
              }
            }
          : item
      )
    );
  };

  const lockDeliverable = (id: string) => {
    setDeliverables((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'LOCKED', paidAt: undefined } : item
      )
    );
  };

  const deleteDeliverable = (id: string) => {
    setDeliverables((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementViews = (id: string) => {
    setDeliverables((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, views: item.views + 1 } : item
      )
    );
  };

  const resetToDefault = () => {
    setDeliverables(DEFAULT_DELIVERABLES);
    setCreatorSettings(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DELIVERABLES));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return (
    <DeliverablesContext.Provider
      value={{
        deliverables,
        creatorSettings,
        updateCreatorSettings,
        getDeliverable,
        addDeliverable,
        unlockDeliverable,
        lockDeliverable,
        deleteDeliverable,
        incrementViews,
        resetToDefault,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
      }}
    >
      {children}
    </DeliverablesContext.Provider>
  );
};

export const useDeliverables = () => {
  const context = useContext(DeliverablesContext);
  if (!context) {
    throw new Error('useDeliverables must be used within a DeliverablesProvider');
  }
  return context;
};
