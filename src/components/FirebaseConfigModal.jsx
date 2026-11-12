import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Save,
  Trash2,
  RefreshCw,
  Code,
  ShieldCheck,
} from 'lucide-react';
import {
  isFirebaseConfigured,
  getActiveFirebaseConfig,
  saveCustomFirebaseConfig,
  clearCustomFirebaseConfig,
} from '../services/firebase';
import { seedSampleDataToFirestore } from '../services/expenseService';

export default function FirebaseConfigModal({ isOpen, onClose, onRefreshData }) {
  const [config, setConfig] = useState(() => getActiveFirebaseConfig());
  const [isSeeding, setIsSeeding] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const isConfigured = isFirebaseConfigured();

  const handleSave = (e) => {
    e.preventDefault();
    const result = saveCustomFirebaseConfig(config);
    if (result.success) {
      setStatusMsg('Configuration saved! Reconnecting...');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } else {
      setStatusMsg(`Error: ${result.error}`);
    }
  };

  const handleReset = () => {
    clearCustomFirebaseConfig();
    setStatusMsg('Reset to environment variables. Refreshing...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setStatusMsg('');
    try {
      const res = await seedSampleDataToFirestore();
      setStatusMsg(`Successfully seeded ${res.count} records into ${res.target}!`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      setStatusMsg(`Failed to seed: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const copyRules = () => {
    const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /iic_reinvestments/{document=**} {
      allow read, write: if true;
    }
  }
}`;
    navigator.clipboard.writeText(rules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Firebase Firestore Setup &amp; Status</h3>
              <p className="text-xs text-slate-300">
                Official Collection: <code className="text-amber-300 font-mono">iic_reinvestments</code>
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

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status Badge Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
              isConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold text-sm">
                {isConfigured
                  ? `Connected to Firestore Project: ${config.projectId}`
                  : 'Running in Local Encrypted Sandbox Mode'}
              </div>
              <p className="mt-1 leading-relaxed">
                {isConfigured
                  ? 'All reinvestment data is reading and writing live to Google Cloud Firestore with real-time auditability.'
                  : 'Firebase credentials are currently using sample offline storage. You can provide your Firebase keys below or create a .env file to enable live cloud synchronization.'}
              </p>
            </div>
          </div>

          {statusMsg && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold">
              {statusMsg}
            </div>
          )}

          {/* Quick Firestore Seeder */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-slate-900">
                Seed Standard 8-Track Sample Reinvestments
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Populates 8 realistic VIT IIC events (Hackathon, Mentoring, Expo, Tech Fest, etc.)
              </div>
            </div>
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-xs shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSeeding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{isSeeding ? 'Seeding...' : 'Seed Sample Data'}</span>
            </button>
          </div>

          {/* Live Configuration Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Firebase Web App Config (SDK v9+ Modular)
              </label>
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">API Key</label>
                <input
                  type="text"
                  value={config.apiKey || ''}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Project ID</label>
                <input
                  type="text"
                  value={config.projectId || ''}
                  onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                  placeholder="iic-vit-expense-tracker"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={config.authDomain || ''}
                  onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                  placeholder="iic-vit.firebaseapp.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Storage Bucket</label>
                <input
                  type="text"
                  value={config.storageBucket || ''}
                  onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
                  placeholder="iic-vit.appspot.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Messaging Sender ID</label>
                <input
                  type="text"
                  value={config.messagingSenderId || ''}
                  onChange={(e) => setConfig({ ...config, messagingSenderId: e.target.value })}
                  placeholder="123456789"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">App ID</label>
                <input
                  type="text"
                  value={config.appId || ''}
                  onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                  placeholder="1:12345:web:abcdef"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs hover:bg-blue-950 flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save &amp; Connect Firestore</span>
              </button>
            </div>
          </form>

          {/* Firestore Rules Helper */}
          <div className="p-4 bg-slate-900 rounded-xl text-slate-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <Code className="w-4 h-4" />
                Firestore Security Rules for collection `iic_reinvestments`
              </span>
              <button
                onClick={copyRules}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] text-slate-300 p-2.5 bg-slate-950 rounded-lg overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /iic_reinvestments/{document=**} {
      allow read, write: if true;
    }
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

