import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  FileSpreadsheet,
  Calendar,
  User,
  Mic,
  Tag,
  DollarSign,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { EVENT_CATEGORIES } from '../utils/constants';
import { convertAmountToWords, formatINR } from '../utils/numberToWords';
import { generateNextReinvestmentNumber } from '../services/expenseService';

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  existingRecords = [],
}) {
  const [formData, setFormData] = useState({
    reinvestmentNumber: '',
    eventDate: new Date().toISOString().slice(0, 10),
    facultyName: '',
    resourcePerson: '',
    eventTitle: '',
    amount: '',
    category: EVENT_CATEGORIES[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next reinvestment number whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const nextNum = generateNextReinvestmentNumber(existingRecords);
      setFormData((prev) => ({
        ...prev,
        reinvestmentNumber: nextNum,
        eventDate: new Date().toISOString().slice(0, 10),
        facultyName: '',
        resourcePerson: '',
        eventTitle: '',
        amount: '',
        category: EVENT_CATEGORIES[0],
      }));
      setErrors({});
    }
  }, [isOpen, existingRecords]);

  if (!isOpen) return null;

  const numericAmount = Number(formData.amount) || 0;
  const amountInWords = numericAmount > 0 ? convertAmountToWords(numericAmount) : '';

  const validate = () => {
    const newErrors = {};
    if (!formData.reinvestmentNumber.trim()) {
      newErrors.reinvestmentNumber = 'Reinvestment number is required';
    }
    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }
    if (!formData.facultyName.trim()) {
      newErrors.facultyName = 'Faculty Coordinator name is required';
    }
    if (!formData.resourcePerson.trim()) {
      newErrors.resourcePerson = 'Resource Person / Guest name is required';
    }
    if (!formData.eventTitle.trim()) {
      newErrors.eventTitle = 'Event title is required';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid positive expenditure amount is required';
    }
    if (!formData.category) {
      newErrors.category = 'Event category is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        amount: Number(formData.amount),
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save record to Firebase' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = () => {
    const nextNum = generateNextReinvestmentNumber(existingRecords);
    setFormData({
      reinvestmentNumber: nextNum,
      eventDate: new Date().toISOString().slice(0, 10),
      facultyName: 'Dr. M. Sangeetha (School of CSE)',
      resourcePerson: 'Karthik Raja (Chief Architect, Zerodha)',
      eventTitle: 'High-Concurrency FinTech Systems Architecture Workshop',
      amount: '55000',
      category: 'Workshop / Seminar',
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Record New Reinvestment Voucher</h3>
              <p className="text-xs text-slate-300">
                Direct entry into Firestore collection <code className="text-amber-300">iic_reinvestments</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.form && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Quick Demo Fill Pill */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={fillQuickDemo}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Fill Sample Event Reinvestment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Reinvestment Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reinvestment Number *
              </label>
              <input
                type="text"
                required
                value={formData.reinvestmentNumber}
                onChange={(e) =>
                  setFormData({ ...formData, reinvestmentNumber: e.target.value })
                }
                placeholder="IIC-REV-2026-001"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                  errors.reinvestmentNumber ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300'
                } rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white`}
              />
              {errors.reinvestmentNumber && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.reinvestmentNumber}</p>
              )}
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                  errors.eventDate ? 'border-rose-400' : 'border-slate-300'
                } rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white`}
              />
              {errors.eventDate && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.eventDate}</p>
              )}
            </div>
          </div>

          {/* Event Category (The 8 Predefined Types) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Category (8 MoE Mandated Tracks) *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
            >
              {EVENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Title / Program Name *
            </label>
            <input
              type="text"
              required
              value={formData.eventTitle}
              onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
              placeholder="e.g. National Hackathon / Robotics Prototyping Conclave"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                errors.eventTitle ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300'
              } rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white`}
            />
            {errors.eventTitle && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.eventTitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Faculty Coordinator */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Faculty Coordinator *
              </label>
              <input
                type="text"
                required
                value={formData.facultyName}
                onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                placeholder="e.g. Dr. R. Selvakumar (SELECT)"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                  errors.facultyName ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300'
                } rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white`}
              />
              {errors.facultyName && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.facultyName}</p>
              )}
            </div>

            {/* Resource Person */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Resource Person / Guest Dignitary *
              </label>
              <input
                type="text"
                required
                value={formData.resourcePerson}
                onChange={(e) => setFormData({ ...formData, resourcePerson: e.target.value })}
                placeholder="e.g. Dr. Arvind Swaminathan (Google DeepMind)"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                  errors.resourcePerson ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300'
                } rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white`}
              />
              {errors.resourcePerson && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.resourcePerson}</p>
              )}
            </div>
          </div>

          {/* Amount (in INR) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Disbursed Reinvestment Amount (INR &#8377;) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-slate-400 text-sm">
                &#8377;
              </span>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 45000"
                className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 border ${
                  errors.amount ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300'
                } rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white`}
              />
            </div>
            {errors.amount && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.amount}</p>
            )}

            {/* Real-time Amount In Words Live Preview */}
            {amountInWords && (
              <div className="mt-2 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs">
                <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] block">
                  Amount in Words Preview:
                </span>
                <span className="font-serif italic text-emerald-950 font-medium">
                  "{amountInWords}"
                </span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-900 hover:bg-blue-950 shadow-md shadow-blue-950/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Reinvestment to Ledger</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

