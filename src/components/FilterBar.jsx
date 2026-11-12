import React from 'react';
import {
  Search,
  Filter,
  Calendar,
  X,
  FileDown,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { EVENT_CATEGORIES } from '../utils/constants';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onResetFilters,
  selectedCount,
  onDownloadSelectedPDF,
  totalFilteredCount,
}) {
  const isFiltered = Boolean(
    searchQuery ||
    selectedCategory !== 'ALL' ||
    startDate ||
    endDate
  );

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      {/* Top Search & Actions Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Global Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Reinvestment #, Faculty Coordinator, Resource Person, or Event Title..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action: Download Selected PDF */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadSelectedPDF}
            disabled={selectedCount === 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-xs active:scale-95 ${
              selectedCount > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 ring-2 ring-blue-600/20'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
            title={
              selectedCount > 0
                ? `Export ${selectedCount} selected records to PDF`
                : 'Select one or more rows below using checkboxes to download PDF report'
            }
          >
            <FileDown className="w-4 h-4" />
            <span>Download Selected PDF</span>
            {selectedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-xs font-black bg-white text-blue-700">
                {selectedCount}
              </span>
            )}
          </button>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Category Dropdown Filter */}
        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="ALL">All 8 Event Categories</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range: From Date */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <span className="text-xs text-slate-500 font-medium">From:</span>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Date Range: To Date */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <span className="text-xs text-slate-500 font-medium">To:</span>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Filtered Result Counter */}
        <div className="ml-auto text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{totalFilteredCount}</span> records
        </div>
      </div>
    </div>
  );
}

