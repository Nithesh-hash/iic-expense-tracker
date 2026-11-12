import React from 'react';
import {
  DollarSign,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
  Tag,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '../utils/numberToWords';
import { EVENT_CATEGORIES, CATEGORY_COLORS } from '../utils/constants';

export default function MetricsCards({ records = [] }) {
  const totalCount = records.length;
  const totalAmount = records.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const avgAmount = totalCount > 0 ? totalAmount / totalCount : 0;

  // Compute breakdown per category
  const breakdown = EVENT_CATEGORIES.map((cat) => {
    const matching = records.filter((r) => r.category === cat);
    const amount = matching.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    return {
      category: cat,
      count: matching.length,
      amount,
      percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
    };
  }).filter((b) => b.count > 0);

  // Find top category by expenditure
  const topCategory = [...breakdown].sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="space-y-6">
      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Expenditure */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Expenditure Sum
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(totalAmount)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
              100% Allocated
            </span>
            <span>across all 8 streams</span>
          </div>
        </div>

        {/* Total Reinvestment Records */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Vouchers
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 tracking-tight">
            {totalCount}{' '}
            <span className="text-sm font-semibold text-slate-400">Records</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Stored in <code className="text-blue-600 font-semibold">iic_reinvestments</code>
          </div>
        </div>

        {/* Average Voucher Amount */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Average Disbursal
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(avgAmount)}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Per approved event requisition
          </div>
        </div>

        {/* Highest Disbursed Track */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Leading Innovation Track
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-base font-bold text-slate-900 tracking-tight truncate" title={topCategory?.category || 'None'}>
            {topCategory?.category || 'None Yet'}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold">
            {topCategory ? `${formatINR(topCategory.amount)} (${topCategory.percentage}%)` : 'No data'}
          </div>
        </div>
      </div>

      {/* Category Breakdown Bar & Mini Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Expenditure Breakdown by Mandated Event Type
            </h4>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {breakdown.length} Active Tracks
          </span>
        </div>

        {/* Mini progress bar strip */}
        {totalAmount > 0 && (
          <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden mb-4">
            {breakdown.map((item) => {
              const colorInfo = CATEGORY_COLORS[item.category] || { accent: '#64748b' };
              return (
                <div
                  key={item.category}
                  title={`${item.category}: ${formatINR(item.amount)} (${item.percentage}%)`}
                  style={{
                    width: `${Math.max(item.percentage, 2)}%`,
                    backgroundColor: colorInfo.accent,
                  }}
                  className="h-full transition-all hover:opacity-80 cursor-pointer"
                />
              );
            })}
          </div>
        )}

        {/* Category Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {EVENT_CATEGORIES.map((cat) => {
            const found = breakdown.find((b) => b.category === cat);
            const count = found?.count || 0;
            const amount = found?.amount || 0;
            const colors = CATEGORY_COLORS[cat] || { dot: 'bg-slate-400', badge: 'bg-slate-50 text-slate-700' };

            return (
              <div
                key={cat}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                  <span className="text-xs font-semibold text-slate-800 truncate" title={cat}>
                    {cat}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400 font-mono">{count} {count === 1 ? 'event' : 'events'}</span>
                  <span className="font-bold text-slate-900">{formatINR(amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

