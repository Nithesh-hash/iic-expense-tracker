import React, { useState } from 'react';
import {
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('IIC-VIT');
  const [password, setPassword] = useState('IICVIT2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(username, password, rememberMe);
      setIsSubmitting(false);

      if (result.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(result.error);
      }
    }, 400);
  };

  const fillCredentials = (userValue, passValue) => {
    setUsername(userValue);
    setPassword(passValue);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-900 px-6 py-7 text-white text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-3 shadow-inner">
            <Building2 className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">IIC Expense Tracker</h2>
          <p className="text-xs text-blue-200 mt-1 font-medium">
            Institution's Innovation Council &bull; Vellore Institute of Technology
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Authorized Faculty & Admin Portal</span>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username or Official Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. IIC-VIT or iic-vit@vit.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Admin Passcode
                </label>
                <span className="text-[11px] text-slate-500">Encrypted</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Quick Credential Helper */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-medium">Remember session</span>
              </label>

              <button
                type="button"
                onClick={() => fillCredentials('IIC-VIT', 'IICVIT2025')}
                className="text-blue-700 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                Auto-fill credentials
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 hover:from-blue-950 hover:to-slate-900 shadow-md shadow-blue-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authenticate & Open Ledger</span>
                </>
              )}
            </button>
          </form>

          {/* Institutional Credentials Notice */}
          <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
            <div className="text-[11px] text-slate-500 leading-relaxed space-y-1">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Standard Mandated Credentials:
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">
                  User: IIC-VIT
                </span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">
                  Pass: IICVIT2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

