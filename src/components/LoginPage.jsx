import React, { useState } from 'react';
import HeaderLogos from './HeaderLogos';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = login(username, password, true);
      setIsSubmitting(false);

      if (!result.success) {
        setError('Invalid confidential credentials. Please enter authorized institutional access.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col justify-between text-slate-800">
      {/* Top Institutional Header */}
      <div className="pt-6 sm:pt-8 text-center px-4">
        <HeaderLogos />
        <p className="text-xs sm:text-sm text-slate-600 font-medium tracking-tight mt-1">
          Office of Innovation, Startup and Technology Transfer (VIT-IST)
        </p>
        <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-950 uppercase mt-2 font-sans">
          IIC EXPENSE TRACKER
        </h1>
      </div>

      {/* Center Login Box (Matching Pic 1) */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 p-8 sm:p-9 transition-all">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 mb-6 tracking-tight">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username / Email"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#180c4c] focus:ring-1 focus:ring-[#180c4c] transition-all"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#180c4c] focus:ring-1 focus:ring-[#180c4c] transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-white bg-[#180c4c] hover:bg-[#12073d] active:scale-[0.99] transition-all disabled:opacity-75 shadow-sm mt-2"
            >
              {isSubmitting ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Institution's Innovation Council &bull; Vellore Institute of Technology
      </div>
    </div>
  );
}

