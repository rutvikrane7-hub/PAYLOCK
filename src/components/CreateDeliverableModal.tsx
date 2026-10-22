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
  const { addDeliverable } = useDeliverables();

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
      setClientName('Marvel Studios Partner');
      setDeliverableTitle('CGI VFX Teaser Master Cut (ProRes 422 HQ)');
      setPrice(3500);
      setExpiryDays(7);
      setUploadedFile({ name: 'Marvel_CGI_VFX_Master_v4.mov', size: '1.4 GB' });
      setNotes('Final approved cut with Dolby 5.1 surround mix and graded LUT.');
    } else if (type === 'pdf') {
      setClientName('Benchmark Capital');
      setDeliverableTitle('SaaS Due Diligence & Technical Security Audit');
      setPrice(2400);
      setExpiryDays(7);
      setUploadedFile({ name: 'Benchmark_DueDiligence_Audit.pdf', size: '18.2 MB' });
      setNotes('Contains executive overview on Page 1 and blurred credentials on Page 2.');
    } else {
      setClientName('Aether Web3 Labs');
      setDeliverableTitle('Full Production React App & Smart Contract Repository');
      setPrice(4800);
      setExpiryDays(14);
      setUploadedFile({ name: 'Aether_Web3_Source_Master.zip', size: '210 MB' });
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
      colors: ['#00f2fe', '#38bdf8', '#10b981'],
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#0c1222] border border-cyan-500/40 shadow-[0_0_60px_rgba(0,242,254,0.18)] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-[#080d19]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.25)]">
              <img
                src="/watermarked_img_17212940726602837843.png"
                alt="PayLock"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Create PayLock Deliverable Link</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Escrow Lock
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Generate a protected deliverable link that unlocks only upon verified client payment.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(85vh-140px)] overflow-y-auto">
          
          {/* REQUIREMENT 4: DISTINCT ICON-BASED TABS FOR ASSET TYPES */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Select Deliverable Format:
              </label>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <span>Autofill demo:</span>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('video')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('pdf')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('web')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
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
                    ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${assetType === 'video' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'}`}>
                    <Video className="w-5 h-5" />
                  </div>
                  {assetType === 'video' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  )}
                </div>
                <div>
                  <div className={`font-bold text-sm ${assetType === 'video' ? 'text-white' : 'text-slate-300'}`}>
                    Video Asset
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-tight">
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
                    ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${assetType === 'pdf' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-slate-800 text-slate-400'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  {assetType === 'pdf' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  )}
                </div>
                <div>
                  <div className={`font-bold text-sm ${assetType === 'pdf' ? 'text-white' : 'text-slate-300'}`}>
                    PDF Document
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-tight">
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
                    ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${assetType === 'web' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-slate-800 text-slate-400'}`}>
                    <Globe className="w-5 h-5" />
                  </div>
                  {assetType === 'web' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  )}
                </div>
                <div>
                  <div className={`font-bold text-sm ${assetType === 'web' ? 'text-white' : 'text-slate-300'}`}>
                    Web Link
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-tight">
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Client Name *</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp, Vanguard Labs"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Deliverable Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deliverable Title *</span>
              </label>
              <input
                type="text"
                required
                value={deliverableTitle}
                onChange={(e) => setDeliverableTitle(e.target.value)}
                placeholder="e.g. 4K Commercial Reel Master"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Price / Balance ($ USD) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                <span>Balance Owed ($ USD) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1500"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Expiry Timer */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Expiry Review Timer</span>
                </span>
                <span className="text-[11px] text-cyan-400 font-mono">Default 7d</span>
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deliverable Master Files (Drag & Drop)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(0,242,254,0.25)]'
                  : 'border-slate-700 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-slate-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-3 text-cyan-300">
                  <div className="p-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40">
                    <FileCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white text-sm">{uploadedFile.name}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {uploadedFile.size} • Master source attached and locked
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-white">
                    Drop high-res video, PDF, or zip archive here
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Assets will be protected by PayLock until escrow settlement.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Release Notes / Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Master archive contains 4K ProRes video, uncompressed audio stems, and vector deeds."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 glow-btn shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center space-x-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate & Lock Deliverable Link</span>
            </button>
          </div>
        </form>

        {/* Modal Security Footer */}
        <div className="px-6 py-3 bg-[#060a14] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>256-BIT ESCROW PROTECTED</span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>INSTANT RELEASE ACTIVE</span>
          </span>
        </div>
      </div>
    </div>
  );
};
