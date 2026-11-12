import React from 'react';
import {
  ShieldCheck,
  LogOut,
  LogIn,
  FileSpreadsheet,
  PlusCircle,
  Database,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../services/firebase';

export default function Navbar({ onOpenLogin, onOpenAddModal, onOpenConfigModal, activeTab, setActiveTab }) {
  const { isAuthenticated, user, logout } = useAuth();
  const hasFirebase = isFirebaseConfigured();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Institution Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-950/20 ring-1 ring-white/20">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  IIC Expense Tracker
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  VIT Vellore
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Institution's Innovation Council &bull; Ministry of Education (MoE) Initiative
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'landing'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              About IIC
            </button>

            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}

            {/* Firebase Connection Status Indicator */}
            <button
              onClick={onOpenConfigModal}
              title={hasFirebase ? 'Connected to Firebase Firestore' : 'Running in Local Encrypted Sandbox Mode (Click to connect Firebase)'}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                hasFirebase
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${hasFirebase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <Database className="w-3.5 h-3.5" />
              <span>{hasFirebase ? 'Firestore Live' : 'Firebase Setup'}</span>
            </button>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={onOpenAddModal}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Reinvestment</span>
                </button>

                <div className="hidden lg:flex flex-col text-right pr-1">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.username}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3 h-3" />
                    Authorized Admin
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  title="Logout session"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-900 hover:bg-blue-950 active:scale-95 transition-all shadow-md shadow-blue-950/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

