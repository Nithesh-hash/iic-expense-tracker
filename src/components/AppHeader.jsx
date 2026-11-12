import React from 'react';
import HeaderLogos from './HeaderLogos';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function AppHeader({ currentTab, setCurrentTab }) {
  const { logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Institutional Branding */}
        <div className="relative pt-3 pb-2 text-center">
          <HeaderLogos />
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-tight">
            Office of Innovation, Startup and Technology Transfer (VIT-IST)
          </p>
          <h1 className="text-lg sm:text-xl font-black tracking-wider text-slate-950 uppercase mt-0.5">
            IIC EXPENSE TRACKER
          </h1>

          {/* Top Right Controls: Logout */}
          <div className="absolute right-0 top-3 flex items-center">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* The 2 Core Navigation Tabs: Entry & History */}
        <div className="flex items-center justify-center gap-2 pt-3 pb-1">
          <button
            onClick={() => setCurrentTab('entry')}
            className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${
              currentTab === 'entry'
                ? 'bg-[#180c4c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Entry
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${
              currentTab === 'history'
                ? 'bg-[#180c4c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            History
          </button>
        </div>
      </div>
    </header>
  );
}
