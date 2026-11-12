import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import AppHeader from './components/AppHeader';
import EntryView from './components/EntryView';
import HistoryView from './components/HistoryView';
import Toast from './components/Toast';
import { fetchReinvestments, createReinvestment } from './services/expenseService';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState('entry'); // 'entry' or 'history'
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchReinvestments();
      setRecords(res.data || []);
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  const handleCreateRecord = async (formData) => {
    const newRecord = await createReinvestment(formData);
    setRecords((prev) => [newRecord, ...prev]);
    showToast({
      type: 'success',
      title: 'Saved Successfully',
      message: `Voucher ${newRecord.reinvestmentNumber} recorded into Firestore.`,
    });
  };

  // If not logged in, show login page directly
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Once authenticated, show App with the 2 tabs: Entry and History
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans text-slate-800">
      <AppHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      <main className="flex-1 pb-16">
        {currentTab === 'entry' ? (
          <EntryView
            existingRecords={records}
            onSubmitSuccess={handleCreateRecord}
          />
        ) : (
          <HistoryView
            records={records}
            onRefresh={loadData}
            isLoading={isLoading}
            showToast={showToast}
          />
        )}
      </main>

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
