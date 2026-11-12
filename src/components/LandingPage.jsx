import React from 'react';
import {
  Building2,
  Award,
  TrendingUp,
  FileCheck2,
  Users,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Download,
  Search,
} from 'lucide-react';
import { EVENT_CATEGORIES, CATEGORY_COLORS } from '../utils/constants';

export default function LandingPage({ onOpenLogin, onGoToDashboard, isAuthenticated }) {
  const categoryDescriptions = {
    'Expert Talk': 'Sessions led by seasoned industry executives, innovators, and researchers sharing state-of-the-art technological breakthroughs and market trends.',
    'Mentoring Session': 'Dedicated 1-on-1 and cohort advisory sessions for startup validation, patent drafting, financial structuring, and business viability.',
    'Workshop / Seminar': 'Hands-on experiential learning labs on IoT, GenAI, robotics, embedded systems, and deep-tech prototyping.',
    'Boot Camp': 'Intensive multi-day founder acceleration programs focusing on MVP development, pitch practice, and customer discovery.',
    'Expo / Demo Day': 'Annual institutional showcase for student and faculty prototypes, inviting venture capitalists, angel networks, and industry partners.',
    'Competition': 'Idea pitching, design sprints, and technical problem-solving contests to foster healthy collegiate competitive innovation.',
    'Technical Fest (Tech Fest)': 'Large-scale multi-departmental symposiums and technical festivals celebrating student engineering ingenuity (e.g. gravVITas).',
    'Hackathon / Ideathon': '36 to 48-hour continuous product engineering hackathons solving national challenges under Smart India Hackathon guidelines.',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* National Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-400/30 text-blue-300 mb-6 backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ministry of Education (MoE) Innovation Cell &bull; AICTE Mandate</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
              Institutional Financial Governance &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                Reinvestment Tracker
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              The official centralized expenditure and reinvestment ledger for{' '}
              <strong className="text-white font-semibold">
                Institution's Innovation Council (IIC) at Vellore Institute of Technology
              </strong>
              . Seamlessly recording, verifying, and exporting confidential reinvestment disbursements across all 8 mandated innovation activities.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={onGoToDashboard}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 group active:scale-95"
                >
                  <span>Open Active Reinvestment Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 group active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorized Portal Access &bull; Login</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <a
                href="#event-categories"
                className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-blue-300" />
                <span>Explore 8 Event Mandates</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">MoE Rating</span>
              </div>
              <div className="text-2xl font-black text-white">5-Star Council</div>
              <p className="text-[11px] text-slate-400 mt-1">Consecutive top national rank</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Annual Fund</span>
              </div>
              <div className="text-2xl font-black text-white">&#8377;1.50+ Crore</div>
              <p className="text-[11px] text-slate-400 mt-1">Earmarked innovation budget</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-sky-400 mb-1">
                <FileCheck2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Audit Security</span>
              </div>
              <div className="text-2xl font-black text-white">100% Verified</div>
              <p className="text-[11px] text-slate-400 mt-1">Tamper-evident Firestore store</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-violet-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Beneficiaries</span>
              </div>
              <div className="text-2xl font-black text-white">25,000+</div>
              <p className="text-[11px] text-slate-400 mt-1">Students &amp; faculty researchers</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 8 MANDATED EVENT CATEGORIES */}
      <section id="event-categories" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 mb-3">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Prescribed Innovation Framework</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            The 8 Predefined IIC Event Categories
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Per Ministry of Education Innovation Cell guidelines, every single reinvestment must be classified under one of these standardized tracks to ensure institutional compliance and quarterly star rating audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENT_CATEGORIES.map((category, idx) => {
            const colors = CATEGORY_COLORS[category] || {
              badge: 'bg-slate-100 text-slate-800',
              accent: '#3b82f6',
            };

            return (
              <div
                key={category}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      TRACK 0{idx + 1}
                    </span>
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full`}
                      style={{ backgroundColor: colors.accent }}
                    />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2.5">
                    {category}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {categoryDescriptions[category]}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Eligible for Reinvestment</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. REINVESTMENT GOVERNANCE & PDF AUDIT WORKFLOW */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Confidentiality &amp; Regulatory Rigor</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Strict Isolation, Audit-Proof Ledger, &amp; Automated PDF Generation
              </h2>
              <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                Reinvestment vouchers involve sensitive financial disbursements allocated to external resource dignitaries, prize pools, and incubation prototyping. The IIC Expense Tracker ensures end-to-end data integrity:
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Restricted Authentication Guard</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Only authorized faculty conveners with verified institutional credentials (<code className="text-amber-300">IIC-VIT</code>) can read, search, or disburse funds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Secure PDF Export with Currency-in-Words</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Produces formal landscape reports with Indian Currency (INR) summation translated into legal words (e.g., <em>"Forty-Five Thousand Five Hundred Rupees Only"</em>) ready for internal auditor signatures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400 shrink-0">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Multi-Dimensional Real-Time Search</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Instantly filter by date horizons, event tracks, faculty leads, or specific speaker resource persons in milliseconds.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={isAuthenticated ? onGoToDashboard : onOpenLogin}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span>{isAuthenticated ? 'Enter Reinvestment Workspace' : 'Sign In To Access Ledger'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Voucher Card Graphic */}
            <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                    IIC
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Reinvestment Voucher Sample</div>
                    <div className="text-[11px] text-slate-400">VIT/IIC/2026/AUDIT-SPEC</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED AUDIT
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                  <span className="text-slate-400">Reinvestment ID</span>
                  <span className="font-mono font-bold text-white">IIC-REV-2026-006</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                  <span className="text-slate-400">Event Title</span>
                  <span className="font-semibold text-white">Smart India Campus Ideathon</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                  <span className="text-slate-400">Category</span>
                  <span className="px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 font-semibold">
                    Hackathon / Ideathon
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                  <span className="text-slate-400">Faculty Coordinator</span>
                  <span className="text-white">Dr. Suresh Kumar</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                  <span className="text-slate-400">Disbursed Amount</span>
                  <span className="text-base font-bold text-emerald-400">&#8377; 87,500.00</span>
                </div>
                <div className="pt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-700/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Amount in Words (Statutory Format)
                  </span>
                  <span className="text-xs font-serif italic text-amber-200">
                    "Eighty-Seven Thousand Five Hundred Rupees Only"
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

