import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  PlusCircle,
  FileDown,
  RefreshCw,
  ShieldCheck,
  Building2,
  Database,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MetricsCards from './MetricsCards';
import FilterBar from './FilterBar';
import ExpenseTable from './ExpenseTable';
import AddExpenseModal from './AddExpenseModal';
import ExpenseDetailsModal from './ExpenseDetailsModal';
import {
  fetchReinvestments,
  createReinvestment,
  deleteReinvestment,
} from '../services/expenseService';
import { isFirebaseConfigured } from '../services/firebase';
import { generateReinvestmentPDF } from '../utils/pdfGenerator';

export default function Dashboard({
  onOpenConfigModal,
  showToast,
  isAddModalOpen,
  setIsAddModalOpen,
}) {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState('local');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Row selection state (Set of IDs)
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Modal states
  const [viewItem, setViewItem] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Load records
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchReinvestments();
      setRecords(res.data || []);
      setDataSource(res.source || 'local');
    } catch (err) {
      console.error('Failed to load reinvestments:', err);
      showToast({
        type: 'error',
        title: 'Data Load Warning',
        message: 'Could not load from Firestore; loaded local backup.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          (item.reinvestmentNumber && item.reinvestmentNumber.toLowerCase().includes(q)) ||
          (item.eventTitle && item.eventTitle.toLowerCase().includes(q)) ||
          (item.facultyName && item.facultyName.toLowerCase().includes(q)) ||
          (item.resourcePerson && item.resourcePerson.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q));

        if (!matchesQuery) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Date Range
      if (startDate && item.eventDate && item.eventDate < startDate) {
        return false;
      }
      if (endDate && item.eventDate && item.eventDate > endDate) {
        return false;
      }

      return true;
    });
  }, [records, searchQuery, selectedCategory, startDate, endDate]);

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = (checked) => {
    if (checked) {
      const allFilteredIds = new Set(filteredRecords.map((r) => r.id));
      setSelectedIds(allFilteredIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setStartDate('');
    setEndDate('');
  };

  // Create new reinvestment
  const handleCreateReinvestment = async (formData) => {
    const newRecord = await createReinvestment(formData);
    setRecords((prev) => [newRecord, ...prev]);
    showToast({
      type: 'success',
      title: 'Reinvestment Recorded',
      message: `Voucher ${newRecord.reinvestmentNumber} saved successfully to Firestore!`,
    });
  };

  // Delete reinvestment
  const handleDelete = async (id, refNum) => {
    setDeleteConfirmation({ id, refNum });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    const { id, refNum } = deleteConfirmation;
    try {
      await deleteReinvestment(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast({
        type: 'success',
        title: 'Record Removed',
        message: `Voucher ${refNum} has been permanently deleted.`,
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

  // Export Selected Rows to PDF
  const handleDownloadSelectedPDF = () => {
    const selectedList = records.filter((r) => selectedIds.has(r.id));
    if (selectedList.length === 0) {
      showToast({
        type: 'error',
        title: 'No Rows Selected',
        message: 'Please check at least one row in the table to export.',
      });
      return;
    }

    try {
      const filename = generateReinvestmentPDF(selectedList, {
        generatedBy: user?.username || 'IIC-VIT Administrator',
      });
      showToast({
        type: 'success',
        title: 'PDF Report Generated',
        message: `Saved ${selectedList.length} vouchers to ${filename}`,
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'PDF Generation Error',
        message: err.message,
      });
    }
  };

  const hasFirebase = isFirebaseConfigured();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Dashboard Title & Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                IIC Reinvestment &amp; Expenditure Dashboard
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Live Protected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Confidential internal ledger for the 8 mandated innovation activities &bull; Vellore Institute of Technology
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
              title="Refresh Firestore Records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-950/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Add Reinvestment Voucher</span>
            </button>
          </div>
        </div>

        {/* Cloud / Offline Status Notice if needed */}
        {!hasFirebase && (
          <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-amber-900">
              <Database className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Local Encrypted Sandbox Mode:</strong> Currently storing records locally with sample data.
                Connect your Firebase project to sync with Google Cloud Firestore.
              </span>
            </div>
            <button
              onClick={onOpenConfigModal}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors"
            >
              Configure Firebase
            </button>
          </div>
        )}

        {/* 1. Metrics Summary Cards */}
        <MetricsCards records={records} />

        {/* 2. Advanced Filtering & Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onResetFilters={handleResetFilters}
          selectedCount={selectedIds.size}
          onDownloadSelectedPDF={handleDownloadSelectedPDF}
          totalFilteredCount={filteredRecords.length}
        />

        {/* 3. Interactive Data Grid */}
        <ExpenseTable
          records={filteredRecords}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onViewDetails={(item) => setViewItem(item)}
          onDeleteRecord={handleDelete}
          onDownloadSelectedPDF={handleDownloadSelectedPDF}
        />

        {/* Modals */}
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateReinvestment}
          existingRecords={records}
        />

        <ExpenseDetailsModal
          item={viewItem}
          isOpen={Boolean(viewItem)}
          onClose={() => setViewItem(null)}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Confirm Voucher Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete reinvestment voucher{' '}
                <strong className="text-slate-800 font-mono">
                  {deleteConfirmation.refNum}
                </strong>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                >
                  Delete Voucher
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

