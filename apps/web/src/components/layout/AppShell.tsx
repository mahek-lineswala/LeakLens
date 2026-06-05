import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BrainCircuit, FileUp, LayoutDashboard, LogOut, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { cn } from '../../lib/cn';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/uploads', label: 'Uploads', icon: FileUp },
  { to: '/insights', label: 'AI Insights', icon: BrainCircuit },
];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-15%] top-[-8%] h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute bottom-[-18%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/8 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.08),transparent_30%)]" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden h-screen w-[280px] shrink-0 flex-col border-r border-white/6 bg-slate-950/70 px-6 py-7 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:self-start lg:overflow-y-auto">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_12px_30px_rgba(103,232,249,0.25)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-white">LeakLens</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">AI Finance OS</p>
            </div>
          </Link>

          <div className="mt-10 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                      isActive
                        ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-cyan-300/10 bg-cyan-300/5 p-5">
            <Badge className="border-cyan-300/20 bg-cyan-300/10 text-cyan-200">AI Watchtower</Badge>
            <p className="mt-4 text-base font-medium text-white">LeakLens monitor</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Upload invoices, receipts, or screenshots to populate risk monitoring, summaries, and anomaly detection.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Monitoring activates after ingestion
            </div>
          </div>

          <div className="mt-auto rounded-3xl border border-white/8 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Signed In</p>
            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 text-sm font-semibold">
                {user?.firstName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-medium text-white">
                  {user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown User'}
                </p>
                <p className="mt-1 truncate text-sm text-slate-400">{user?.email ?? 'No email available'}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{user?.role ?? 'User'}</p>
              </div>
            </div>
            <Button variant="secondary" className="mt-4 w-full gap-2" onClick={() => void logout()}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-30 border-b border-white/6 bg-slate-950/55 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Enterprise AI Financial Intelligence</p>
                <h1 className="mt-1 text-lg font-semibold tracking-tight text-white">
                  {location.pathname.startsWith('/uploads')
                    ? 'Document Ingestion Center'
                    : location.pathname.startsWith('/insights')
                    ? 'LeakLens Intelligence'
                    : 'Financial Command Center'}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-slate-400 md:flex">
                  <Search className="h-4 w-4" />
                  Search vendors, invoices, anomalies
                </div>
                <Badge className="hidden border-amber-400/20 bg-amber-400/10 text-amber-200 md:inline-flex">
                  Timeframe
                </Badge>
                <Button variant="secondary" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  No active alerts
                </Button>
              </div>
            </div>
          </header>

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 xl:px-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
