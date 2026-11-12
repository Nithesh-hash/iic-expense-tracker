import React from 'react';
import { Building2, ShieldCheck, Heart, Award } from 'lucide-react';

export default function Footer({ onOpenLogin, isAuthenticated }) {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-amber-400 font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-base tracking-tight">
                Institution's Innovation Council &bull; VIT
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Established under the aegis of Ministry of Education (MoE) Innovation Cell &amp; AICTE. Dedicated to fostering innovation, design thinking, entrepreneurship, and patent commercialization at Vellore Institute of Technology.
            </p>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-[11px]">
              <Award className="w-4 h-4" />
              <span>Ranked 5-Star Highest Rating by Ministry of Education, Govt. of India</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Mandated Activities
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>Expert Talks &amp; Seminars</li>
              <li>Mentoring Sessions</li>
              <li>Boot Camps &amp; Accelerators</li>
              <li>Demo Days &amp; Tech Expos</li>
              <li>Idea Competitions</li>
              <li>Tech Fests &amp; Hackathons</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Confidential Ledger
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
              Reinvestment accounts are isolated for statutory internal audits and compliance submissions.
            </p>
            {!isAuthenticated ? (
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[11px] flex items-center gap-1.5 border border-slate-700"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Sign In</span>
              </button>
            ) : (
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure Session Active</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Institution's Innovation Council, Vellore Institute of Technology. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Confidential Reinvestment Portal</span>
            <span>&bull;</span>
            <span>Collection: iic_reinvestments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

