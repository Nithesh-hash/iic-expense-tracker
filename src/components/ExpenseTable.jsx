import React, { useState } from 'react';
import {
  ArrowUpDown,
  Calendar,
  User,
  Mic,
  Tag,
  DollarSign,
  Eye,
  Trash2,
  FileCheck,
  AlertCircle,
  FileDown,
  CheckSquare,
  Square,
  SearchX,
} from 'lucide-react';
import { formatINR } from '../utils/numberToWords';
import { CATEGORY_COLORS } from '../utils/constants';

export default function ExpenseTable({
  records = [],
  selectedIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onDeleteRecord,
  onDownloadSelectedPDF,
}) {
  const [sortField, setSortField] = useState('eventDate');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [deletingId, setDeletingId] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'amount') {
      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    if (sortField === 'eventDate') {
      return sortDirection === 'asc'
        ? new Date(aVal) - new Date(bVal)
        : new Date(bVal) - new Date(aVal);
    }

    aVal = (aVal || '').toString().toLowerCase();
    bVal = (bVal || '').toString().toLowerCase();
    return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const isAllSelected = records.length > 0 && selectedIds.size === records.length;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < records.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Floating Selection Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-900 text-white px-5 py-3 flex items-center justify-between text-xs sm:text-sm animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <span className="font-bold">
              {selectedIds.size} of {records.length} items selected
            </span>
            <button
              onClick={() => onToggleSelectAll(false)}
              className="text-blue-200 hover:text-white underline text-xs"
            >
              Deselect All
            </button>
          </div>
          <button
            onClick={onDownloadSelectedPDF}
            className="px-3.5 py-1.5 rounded-lg bg-white text-blue-950 font-bold hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <FileDown className="w-4 h-4 text-blue-700" />
            <span>Export Selected to PDF</span>
          </button>
        </div>
      )}

      {/* Main Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {/* Checkbox column */}
              <th className="py-3.5 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  title="Select / Deselect All Filtered Rows"
                />
              </th>

              {/* Reinvestment Number */}
              <th
                onClick={() => handleSort('reinvestmentNumber')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Reinvestment ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Event Date */}
              <th
                onClick={() => handleSort('eventDate')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Event Title */}
              <th
                onClick={() => handleSort('eventTitle')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Event Title</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Category */}
              <th
                onClick={() => handleSort('category')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Category (8 Types)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Faculty & Resource Person */}
              <th className="py-3.5 px-4">
                <span>Faculty Coordinator / Resource Person</span>
              </th>

              {/* Amount */}
              <th
                onClick={() => handleSort('amount')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount (INR)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Actions */}
              <th className="py-3.5 px-4 text-center w-24">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
            {sortedRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <SearchX className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-800 text-sm">No Matching Reinvestments</div>
                    <p className="text-xs text-slate-500 mt-1">
                      No records matched your search query or date range filters. Try resetting the filters or adding a new voucher.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedRecords.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const categoryColor = CATEGORY_COLORS[item.category] || {
                  badge: 'bg-slate-100 text-slate-700 border-slate-200',
                  dot: 'bg-slate-400',
                };

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isSelected ? 'bg-blue-50/70' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(item.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* Reinvestment Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/80">
                        {item.reinvestmentNumber}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {item.eventDate}
                    </td>

                    {/* Event Title */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate" title={item.eventTitle}>
                      {item.eventTitle}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${categoryColor.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${categoryColor.dot}`} />
                        {item.category}
                      </span>
                    </td>

                    {/* Faculty & Resource Person */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.facultyName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs" title={item.resourcePerson}>
                        Guest: {item.resourcePerson}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm whitespace-nowrap">
                      {formatINR(item.amount)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewDetails(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Voucher Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(item.id, item.reinvestmentNumber)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

