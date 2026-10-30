import React, { useState, useRef } from 'react';
import {
  X,
  Video,
  FileText,
  Globe,
  UploadCloud,
  FileCheck,
  Sparkles,
  Lock,
  Building,
  DollarSign,
  Clock,
  ShieldCheck,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDeliverables } from '../context/DeliverablesContext';
import type { AssetType } from '../types';

interface CreateDeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDeliverableModal: React.FC<CreateDeliverableModalProps> = ({ isOpen, onClose }) => {
  const { addDeliverable, creatorSettings } = useDeliverables();

  // Form State
  const [clientName, setClientName] = useState('');
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [price, setPrice] = useState<number | ''>(1500);
  const [expiryDays, setExpiryDays] = useState(7);
  const [assetType, setAssetType] = useState<AssetType>('video');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFile({
      name: file.name,
      size: `${sizeInMb} MB`,
    });

    if (!deliverableTitle) {
      setDeliverableTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    if (file.type.includes('video') || file.name.match(/\.(mp4|mov|avi|mkv)$/i)) {
      setAssetType('video');
    } else if (file.type.includes('pdf') || file.name.match(/\.(pdf)$/i)) {
      setAssetType('pdf');
    }
  };

  // Preset loaders for quick demo testing
  const handleLoadPreset = (type: AssetType) => {
    setAssetType(type);
    if (type === 'video') {
      setClientName('Apex Media Global');
      setDeliverableTitle('4K Cyberpunk Brand Commercial & Final Cut');
      setPrice(1500);
      setExpiryDays(7);
      setUploadedFile({ name: 'Apex_Cyberpunk_Commercial_4K_Master.mp4', size: '842 MB' });
      setNotes('Final approved cut with graded LUT and stereoscopic sound mix.');
    } else if (type === 'pdf') {
      setClientName('Vanguard Capital');
      setDeliverableTitle('Quarterly Financial Audit & Strategic Deck (Confidential)');
      setPrice(2400);
      setExpiryDays(7);
      setUploadedFile({ name: 'Vanguard_Strategic_Audit_2026_Final.pdf', size: '24.8 MB' });
      setNotes('Contains executive overview on Page 1 and blurred credentials on Page 2.');
    } else {
      setClientName('Solana Labs Studio');
      setDeliverableTitle('Interactive Web3 Landing Page & 3D Interactive Assets');
      setPrice(3200);
      setExpiryDays(14);
      setUploadedFile({ name: 'Solana_Interactive_Experience_Package.zip', size: '185 MB' });
      setNotes('Production build bundle with Docker compose and staging credentials.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !deliverableTitle.trim() || !price) {
      alert('Please fill in Client Name, Deliverable Title, and Price.');
      return;
    }

    addDeliverable({
      clientName: clientName.trim(),
      deliverableTitle: deliverableTitle.trim(),
      price: Number(price),
      expiryDays: Number(expiryDays),
      assetType,
      fileName: uploadedFile?.name || `${deliverableTitle.replace(/\s+/g, '_')}_master.zip`,
      fileSize: uploadedFile?.size || '450 MB',
      notes: notes.trim() || 'Master deliverable assets held in automated PayLock escrow.',
    });

    // Celebratory confetti
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#10b981', '#06b6d4'],
    });

    onClose();

    // Reset Form
    setClientName('');
    setDeliverableTitle('');
    setPrice(1500);
    setExpiryDays(7);
    setUploadedFile(null);
    setNotes('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 p-1 flex items-center justify-center">
              <img
                src="/watermarked_img_17212940726602837843.png"
                alt="PayLock"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>Create PayLock Deliverable Link</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Escrow Lock
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Generate a protected deliverable link that unlocks only upon verified client payment.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(85vh-140px)] overflow-y-auto">
          
          {/* REQUIREMENT: DISTINCT ICON-BASED TABS FOR ASSET TYPES */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Select Deliverable Format:
              </label>
              <div className="flex items-center space-x-1.5 text-[11px] text-gray-500">
                <span>Autofill demo:</span>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('video')}
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('pdf')}
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('web')}
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  Web
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tab 1: Video */}
              <button
                type="button"
                onClick={() => setAssetType('video')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  assetType === 'video'
                    ? 'bg-blue-50/60 border-blue-600 ring-1 ring-blue-600/30 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${assetType === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Video className="w-5 h-5" />
                  </div>
                  {assetType === 'video' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${assetType === 'video' ? 'text-gray-900' : 'text-gray-700'}`}>
                    Video Asset
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 leading-tight">
                    Diagonal watermark overlay with "PREVIEW ONLY - PAYLOCK"
                  </div>
                </div>
              </button>

              {/* Tab 2: PDF Document */}
              <button
                type="button"
                onClick={() => setAssetType('pdf')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  assetType === 'pdf'
                    ? 'bg-blue-50/60 border-blue-600 ring-1 ring-blue-600/30 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${assetType === 'pdf' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  {assetType === 'pdf' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${assetType === 'pdf' ? 'text-gray-900' : 'text-gray-700'}`}>
                    PDF Document
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 leading-tight">
                    Page 1 clear review, Page 2 veiled with heavy CSS blur shroud
                  </div>
                </div>
              </button>

              {/* Tab 3: Web Link */}
              <button
                type="button"
                onClick={() => setAssetType('web')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  assetType === 'web'
                    ? 'bg-blue-50/60 border-blue-600 ring-1 ring-blue-600/30 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${assetType === 'web' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Globe className="w-5 h-5" />
                  </div>
                  {assetType === 'web' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${assetType === 'web' ? 'text-gray-900' : 'text-gray-700'}`}>
                    Web Link
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 leading-tight">
                    Locked staging preview sandbox with access-gate paywall
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Client Name *</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp, Vanguard Labs"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Deliverable Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Deliverable Title *</span>
              </label>
              <input
                type="text"
                required
                value={deliverableTitle}
                onChange={(e) => setDeliverableTitle(e.target.value)}
                placeholder="e.g. 4K Commercial Reel Master"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Price / Balance ($ USD) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                <span>Balance Owed ({creatorSettings.currency || 'USD'}) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 font-semibold">
                  {creatorSettings.currency === 'INR' ? '₹' : '$'}
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1500"
                  className="w-full pl-8 pr-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            {/* Expiry Timer */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Expiry Review Timer</span>
                </span>
                <span className="text-[11px] text-gray-400 font-medium">Default 7d</span>
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              >
                <option value={3}>3 Days Review Period</option>
                <option value={7}>7 Days Review Period (Default)</option>
                <option value={14}>14 Days Review Period</option>
                <option value={30}>30 Days Review Period</option>
              </select>
            </div>
          </div>

          {/* Master File Drag & Drop Zone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Deliverable Master Files (Drag & Drop)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-3 text-blue-700">
                  <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-sm">{uploadedFile.name}</div>
                    <div className="text-xs text-gray-500 font-mono">
                      {uploadedFile.size} • Master source attached and locked
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-gray-900">
                    Drop high-res video, PDF, or zip archive here
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Assets will be protected by PayLock until escrow settlement.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Release Notes / Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Master archive contains 4K ProRes video, uncompressed audio stems, and vector deeds."
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate & Lock Deliverable Link</span>
            </button>
          </div>
        </form>

        {/* Modal Security Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-gray-400" />
            <span>256-BIT ESCROW PROTECTED</span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>INSTANT RELEASE ACTIVE</span>
          </span>
        </div>
      </div>
    </div>
  );
};
