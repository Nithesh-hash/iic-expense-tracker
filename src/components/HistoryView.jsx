import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  FileDown,
  ArrowUpDown,
  Search,
  Eye,
  Trash2,
  SearchX,
  RefreshCw,
  Database,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { EVENT_CATEGORIES, CATEGORY_COLORS } from '../utils/constants';
import { formatINR } from '../utils/numberToWords';
import { generateReinvestmentPDF } from '../utils/pdfGenerator';
import ExpenseDetailsModal from './ExpenseDetailsModal';
import { deleteReinvestment, seedSampleDataToFirestore } from '../services/expenseService';

export default function HistoryView({
  records = [],
  onRefresh,
  isLoading,
  showToast,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortField, setSortField] = useState('eventDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewItem, setViewItem] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          (item.reinvestmentNumber && item.reinvestmentNumber.toLowerCase().includes(q)) ||
          (item.eventTitle && item.eventTitle.toLowerCase().includes(q)) ||
          (item.facultyName && item.facultyName.toLowerCase().includes(q)) ||
          (item.resourcePerson && item.resourcePerson.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // Date Range
      if (startDate && item.eventDate && item.eventDate < startDate) return false;
      if (endDate && item.eventDate && item.eventDate > endDate) return false;

      return true;
    });
  }, [records, searchQuery, selectedCategory, startDate, endDate]);

  // Sort
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
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
  }, [filteredRecords, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setSelectedIds(new Set());
  };

  // Selection
  const isAllSelected = sortedRecords.length > 0 && selectedIds.size === sortedRecords.length;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < sortedRecords.length;

  const handleToggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(sortedRecords.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Download PDF
  const handleDownloadPDF = () => {
    const selectedList = records.filter((r) => selectedIds.has(r.id));
    if (selectedList.length === 0) {
      showToast({
        type: 'error',
        title: 'Selection Required',
        message: 'Please check at least one row in the table to export.',
      });
      return;
    }

    try {
      const filename = generateReinvestmentPDF(selectedList, {
        generatedBy: 'IIC-VIT Administrator',
      });
      showToast({
        type: 'success',
        title: 'PDF Report Generated',
        message: `Saved ${selectedList.length} items to ${filename}`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'PDF Error',
        message: err.message,
      });
    }
  };

  // Delete
  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    try {
      await deleteReinvestment(deleteConfirmation.id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteConfirmation.id);
        return next;
      });
      if (onRefresh) onRefresh();
      showToast({
        type: 'success',
        title: 'Voucher Deleted',
        message: `Voucher ${deleteConfirmation.refNum} removed.`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    } finally {
      setDeleteConfirmation(null);
    }
  };

  // Seed sample data if empty
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await seedSampleDataToFirestore();
      if (onRefresh) await onRefresh();
      showToast({
        type: 'success',
        title: 'Sample Data Seeded',
        message: `Seeded ${res.count} records successfully.`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Seed Error',
        message: err.message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* 1. FILTERS ROW (Matching Pic 3) */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FILTERS:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#180c4c] cursor-pointer"
          >
            <option value="ALL">All 8 Event Categories</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Date Range: From */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#180c4c]"
            />
          </div>

          {/* Date Range: To */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#180c4c]"
            />
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Title, Faculty, ID..."
              className="pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#180c4c] w-48 sm:w-60"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
            title="Reset all filters to default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Right side Actions & Records Count */}
        <div className="flex items-center gap-3 ml-auto">
          {records.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-100 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isSeeding ? 'Seeding...' : 'Load Sample Vouchers'}</span>
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            disabled={selectedIds.size === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedIds.size > 0
                ? 'bg-[#180c4c] text-white hover:bg-[#12073d] shadow-sm'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Selected PDF</span>
            {selectedIds.size > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-white text-[#180c4c] text-[10px] font-black">
                {selectedIds.size}
              </span>
            )}
          </button>

          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{sortedRecords.length}</strong> records
          </span>
        </div>
      </div>

      {/* 2. MAIN TABLE (Matching Pic 3) */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white">
                <th className="py-4 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={(e) => handleToggleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#180c4c] focus:ring-[#180c4c] w-4 h-4 cursor-pointer"
                  />
                </th>

                <th
                  onClick={() => handleSort('reinvestmentNumber')}
                  className="py-4 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>REINVESTMENT ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('eventDate')}
                  className="py-4 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>DATE</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('eventTitle')}
                  className="py-4 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>EVENT TITLE</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('category')}
                  className="py-4 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>CATEGORY (8 TYPES)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th className="py-4 px-4">
                  <span>FACULTY COORDINATOR / RESOURCE PERSON</span>
                </th>

                <th
                  onClick={() => handleSort('amount')}
                  className="py-4 px-4 text-right cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>AMOUNT (INR)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th className="py-4 px-4 text-center w-20">
                  <span>ACTIONS</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {sortedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="max-w-xs mx-auto flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                        <SearchX className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-slate-800 text-sm">No Records Found</div>
                      <p className="text-xs text-slate-500 mt-1">
                        Try resetting your filters or click "Load Sample Vouchers" to populate initial data.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedRecords.map((item) => {
                  const isChecked = selectedIds.has(item.id);
                  const color = CATEGORY_COLORS[item.category] || {
                    badge: 'bg-slate-50 text-slate-700 border-slate-200',
                    dot: 'bg-slate-400',
                  };

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isChecked ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(item.id)}
                          className="rounded border-slate-300 text-[#180c4c] focus:ring-[#180c4c] w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Reinvestment ID (Matching Pic 3 Pill) */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs">
                          {item.reinvestmentNumber}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {item.eventDate}
                      </td>

                      {/* Event Title */}
                      <td className="py-4 px-4 font-medium text-slate-900 max-w-xs truncate" title={item.eventTitle}>
                        {item.eventTitle}
                      </td>

                      {/* Category Pill with Colored Dot (Matching Pic 3) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${color.badge}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                          <span>{item.category}</span>
                        </span>
                      </td>

                      {/* Faculty / Resource Person */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">{item.facultyName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs" title={item.resourcePerson}>
                          Guest: {item.resourcePerson}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-right font-bold text-slate-950 text-sm whitespace-nowrap">
                        {formatINR(item.amount)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewItem(item)}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                            title="View Voucher"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                id: item.id,
                                refNum: item.reinvestmentNumber,
                              })
                            }
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                            title="Delete"
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

      {/* Voucher Details Modal */}
      <ExpenseDetailsModal
        item={viewItem}
        isOpen={Boolean(viewItem)}
        onClose={() => setViewItem(null)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-slate-200 shadow-xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Delete
            </h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently delete voucher{' '}
              <strong className="font-mono text-slate-800">{deleteConfirmation.refNum}</strong>?
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

