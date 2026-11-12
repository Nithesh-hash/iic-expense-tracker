import React from 'react';
import {
  X,
  FileCheck2,
  Calendar,
  User,
  Mic,
  Tag,
  DollarSign,
  Download,
  Building2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { formatINR, convertAmountToWords } from '../utils/numberToWords';
import { CATEGORY_COLORS } from '../utils/constants';
import { generateReinvestmentPDF } from '../utils/pdfGenerator';

export default function ExpenseDetailsModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  const categoryColor = CATEGORY_COLORS[item.category] || {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    accent: '#2563eb',
  };

  const amountInWords = convertAmountToWords(Number(item.amount) || 0);

  const handleDownloadSinglePDF = () => {
    generateReinvestmentPDF([item], {
      customTitle: `Voucher Details - ${item.reinvestmentNumber}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-300">
                {item.reinvestmentNumber}
              </div>
              <h3 className="text-sm font-bold tracking-tight">Reinvestment Voucher Particulars</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Content */}
        <div className="p-6 space-y-4">
          {/* Status & Category */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${categoryColor.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${categoryColor.dot}`} />
              {item.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audited & Disbursed</span>
            </div>
          </div>

          {/* Event Title */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Event Program Title
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
              {item.eventTitle}
            </h4>
          </div>

          {/* Key Particulars Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Event Date</span>
              <span className="font-bold text-slate-800">{item.eventDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Logged Timestamp</span>
              <span className="font-mono text-[11px] text-slate-600">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Faculty Coordinator</span>
              <span className="font-semibold text-slate-800">{item.facultyName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Resource Person / Speaker</span>
              <span className="font-semibold text-slate-800">{item.resourcePerson}</span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Reinvestment Disbursed Amount
              </span>
              <span className="text-xl font-black text-blue-950">
                {formatINR(item.amount)}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-blue-200/60">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-0.5">
                Amount in Words:
              </span>
              <p className="font-serif italic text-xs text-blue-900 font-medium">
                "{amountInWords}"
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadSinglePDF}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Voucher PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

