import React, { useState, useEffect } from 'react';
import { EVENT_CATEGORIES } from '../utils/constants';
import { convertAmountToWords, formatINR } from '../utils/numberToWords';
import { generateNextReinvestmentNumber } from '../services/expenseService';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function EntryView({ existingRecords = [], onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    reinvestmentNumber: '',
    eventTitle: '',
    facultyName: '',
    resourcePerson: '',
    category: '',
    eventDate: new Date().toISOString().slice(0, 10),
    amount: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-generate next reinvestment number
  useEffect(() => {
    const nextNum = generateNextReinvestmentNumber(existingRecords);
    setFormData((prev) => ({
      ...prev,
      reinvestmentNumber: nextNum,
    }));
  }, [existingRecords]);

  const numericAmount = Number(formData.amount) || 0;
  const amountInWords = numericAmount > 0 ? convertAmountToWords(numericAmount) : '';

  const validate = () => {
    const errs = {};
    if (!formData.eventTitle.trim()) errs.eventTitle = 'Event title is required';
    if (!formData.facultyName.trim()) errs.facultyName = 'Faculty Coordinator is required';
    if (!formData.resourcePerson.trim()) errs.resourcePerson = 'Resource Person / Guest is required';
    if (!formData.category) errs.category = 'Please select one of the 8 event categories';
    if (!formData.eventDate) errs.eventDate = 'Event date is required';
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Valid positive expenditure amount is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      await onSubmitSuccess({
        reinvestmentNumber: formData.reinvestmentNumber,
        eventTitle: formData.eventTitle.trim(),
        facultyName: formData.facultyName.trim(),
        resourcePerson: formData.resourcePerson.trim(),
        category: formData.category,
        eventDate: formData.eventDate,
        amount: Number(formData.amount),
      });

      setSuccessMsg(`Voucher ${formData.reinvestmentNumber} saved successfully to Firestore!`);

      // Reset form with new sequence number
      const nextNum = generateNextReinvestmentNumber([
        { reinvestmentNumber: formData.reinvestmentNumber },
        ...existingRecords,
      ]);

      setFormData({
        reinvestmentNumber: nextNum,
        eventTitle: '',
        facultyName: '',
        resourcePerson: '',
        category: '',
        eventDate: new Date().toISOString().slice(0, 10),
        amount: '',
      });
      setErrors({});

      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save record.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setFormData({
      reinvestmentNumber: generateNextReinvestmentNumber(existingRecords),
      eventTitle: 'Advanced Deep Learning & Agentic Systems Workshop',
      facultyName: 'Dr. R. Selvakumar',
      resourcePerson: 'Dr. Arvind Swaminathan (Google DeepMind)',
      category: 'Expert Talk',
      eventDate: new Date().toISOString().slice(0, 10),
      amount: '65000',
    });
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl p-6 sm:p-10 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
        {/* Header (Matching Pic 2) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Register New Event
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Record reinvestment disbursement directly into collection{' '}
              <code className="text-blue-600 font-mono">iic_reinvestments</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
              ID: {formData.reinvestmentNumber || 'IIC-REV-2026-001'}
            </span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Fill Sample</span>
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {successMsg && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errors.form && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Form Body (Exact style of Pic 2) */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* 1. Event Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Event Name / Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.eventTitle}
              onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
              placeholder="Enter event name or technical session title"
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.eventTitle ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
              } rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#180c4c] focus:ring-1 focus:ring-[#180c4c]`}
            />
            {errors.eventTitle && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.eventTitle}</p>
            )}
          </div>

          {/* 2. Faculty Coordinator */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Faculty Coordinator *
            </label>
            <input
              type="text"
              required
              value={formData.facultyName}
              onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
              placeholder="e.g. Dr. R. Selvakumar (School of Electrical Engineering)"
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.facultyName ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
              } rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#180c4c] focus:ring-1 focus:ring-[#180c4c]`}
            />
            {errors.facultyName && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.facultyName}</p>
            )}
          </div>

          {/* 3. Resource Person / Guest Speaker */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Resource Person / Guest Speaker *
            </label>
            <input
              type="text"
              required
              value={formData.resourcePerson}
              onChange={(e) => setFormData({ ...formData, resourcePerson: e.target.value })}
              placeholder="e.g. Dr. Arvind Swaminathan (Google DeepMind) / Industry CXO"
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.resourcePerson ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
              } rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#180c4c] focus:ring-1 focus:ring-[#180c4c]`}
            />
            {errors.resourcePerson && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.resourcePerson}</p>
            )}
          </div>

          {/* 4. Event Type (8 Prescribed Categories) */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Event Type (8 Mandated Innovation Categories) *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.category ? 'border-rose-400' : 'border-slate-200'
              } rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#180c4c] focus:ring-1 focus:ring-[#180c4c] cursor-pointer`}
            >
              <option value="">-- Select Event Type --</option>
              {EVENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 5. Event Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className={`w-full px-4 py-2.5 bg-white border ${
                  errors.eventDate ? 'border-rose-400' : 'border-slate-200'
                } rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#180c4c] focus:ring-1 focus:ring-[#180c4c]`}
              />
              {errors.eventDate && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.eventDate}</p>
              )}
            </div>

            {/* 6. Disbursed Amount (INR) */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
                  className={`w-full pl-8 pr-4 py-2.5 bg-white border ${
                    errors.amount ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
                  } rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#180c4c] focus:ring-1 focus:ring-[#180c4c]`}
                />
              </div>
              {errors.amount && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Real-time Amount in Words Preview */}
          {amountInWords && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-0.5">
                Statutory Amount in Words:
              </span>
              <p className="font-serif italic text-slate-900 font-semibold">
                "{amountInWords}"
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[200px] py-3 px-8 rounded-lg font-bold text-sm text-white bg-[#180c4c] hover:bg-[#12073d] active:scale-[0.99] transition-all disabled:opacity-75 shadow-sm"
            >
              {isSubmitting ? 'Saving to Firestore...' : 'Register Event Reinvestment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

