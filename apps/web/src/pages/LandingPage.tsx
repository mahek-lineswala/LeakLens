import React from 'react';
import { 
  Sparkles, 
  Bell, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  X, 
  Share2, 
  Settings,
  LayoutGrid,
  CreditCard,
  UploadCloud,
  FileText,
  Users
} from 'lucide-react';

interface LandingPageProps {
  setCurrentPage: (page: 'landing' | 'auth' | 'app') => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  isAuthenticated: boolean;
}

export default function LandingPage({ setCurrentPage, setAuthMode, isAuthenticated }: LandingPageProps) {
  const handleGetStarted = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden relative select-none">
      
      {/* Glow effect overlays */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5c8bf7] opacity-[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 opacity-[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* HEADER NAVIGATION */}
      <header className="h-20 border-b border-border-glass bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#5c8bf7] to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-[15px] font-extrabold text-white leading-none">LeakLens</h2>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Enterprise AI</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Product</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#company" className="hover:text-white transition-colors">Company</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer text-slate-400 hover:text-white">
            <Bell className="w-4 h-4" />
          </div>
          {isAuthenticated ? (
            <button 
              onClick={() => setCurrentPage('app')}
              className="bg-[#5c8bf7] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/10"
            >
              Launch Console
            </button>
          ) : (
            <button 
              onClick={() => handleGetStarted('login')}
              className="bg-[#5c8bf7] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/10"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#1c2438]/60 border border-emerald-800/40 rounded-full px-3 py-1 select-none">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">New: Anomaly Surveillance v2.0</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stop Losing Money <br />
            <span className="text-[#5c8bf7] italic font-semibold">Silently.</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
            AI-powered expense intelligence that detects leaks, stops wasteful subscriptions, and automates your finance operations. Built for modern CFOs who demand precision.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => handleGetStarted('signup')}
              className="bg-[#82adff] hover:bg-blue-400 text-slate-900 font-extrabold px-6 py-3 rounded-lg text-xs transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2"
            >
              Start Free <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => alert('Demo booking is scheduled under Contact Sales.')}
              className="bg-transparent hover:bg-slate-900/40 border border-slate-800 text-slate-300 font-bold px-6 py-3 rounded-lg text-xs transition-all"
            >
              Book Demo
            </button>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="w-full max-w-md bg-[#111625] border border-border-glass rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden aspect-[4/3] flex flex-col justify-between">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Expense Audit Console</span>
            </div>

            <div className="flex-1 flex items-end gap-3 px-4 pt-8 pb-2">
              <div className="flex-1 bg-slate-900 border border-border-glass rounded-t h-[40%]" />
              <div className="flex-1 bg-slate-900 border border-border-glass rounded-t h-[65%]" />
              <div className="flex-1 bg-slate-900 border border-border-glass rounded-t h-[50%]" />
              <div className="flex-1 bg-gradient-to-t from-blue-900/40 to-[#5c8bf7]/30 border border-[#5c8bf7]/40 rounded-t h-[80%] shadow-[0_0_10px_rgba(92,139,247,0.15)]" />
            </div>

            {/* Bouncing notification container */}
            <div className="absolute top-[25%] right-[-5%] w-72 bg-[#1c2438] border border-red-900/60 rounded-xl p-4 flex gap-3 shadow-2xl relative overflow-hidden animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-8 h-8 rounded-lg bg-red-950/20 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h5 className="text-[10px] font-extrabold text-white leading-none">AI Leak Detected!</h5>
                <p className="text-[9px] text-slate-400 leading-normal">
                  Duplicate subscription found at <span className="text-red-400 font-bold">$882/mo</span>
                </p>
                <div className="flex gap-2 pt-1 text-[9px] font-bold">
                  <span className="text-[#5c8bf7] hover:underline cursor-pointer">Resolve Here</span>
                  <span className="text-slate-500 cursor-pointer">Dismiss</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[8%] left-[8%] bg-[#0b0f19]/90 border border-emerald-800/40 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-2xl">
              <div className="w-6 h-6 rounded-full bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <span className="text-[8px] uppercase tracking-wider font-semibold text-slate-500 block">Accumulated Savings</span>
                <p className="text-xs font-black text-emerald-400">+$12,450.00</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="bg-[#090d16] border-y border-[#161d30] py-20 z-10">
        <div className="max-w-7xl mx-auto px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Engineered for Financial Precision</h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Our AI engine scans every transaction across your entire enterprise stack to find the inefficiencies that humans miss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#111625] border border-border-glass rounded-xl p-6 relative hover:border-[#5c8bf7]/30 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#1c2438] border border-border-glass flex items-center justify-center text-[#5c8bf7] mb-4">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">AI Leak Detection</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Advanced neural networks identify billing anomalies, zombie subscriptions, and price creep before they impact your EBITDA.
              </p>
            </div>

            <div className="bg-[#111625] border border-border-glass rounded-xl p-6 relative hover:border-[#5c8bf7]/30 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#1c2438] border border-border-glass flex items-center justify-center text-emerald-400 mb-4">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Real-time OCR</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Scan receipts and invoices with 99.9% accuracy. Data is extracted and mapped instantly to your ledger.
              </p>
            </div>

            <div className="bg-[#111625] border border-border-glass rounded-xl p-6 relative hover:border-[#5c8bf7]/30 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#1c2438] border border-border-glass flex items-center justify-center text-orange-400 mb-4">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Smart Categorization</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Automatic tax-compliant mapping using ML that learns your business context over time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="max-w-7xl mx-auto px-8 py-20 z-10 space-y-12">
        
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Pricing for Scale</h2>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Choose the plan that fits your growth trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Starter Plan */}
          <div className="bg-[#111625] border border-border-glass rounded-2xl p-8 space-y-8 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md relative overflow-hidden">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Starter</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                </div>
                <p className="text-xs text-slate-400 leading-none">Perfect for early stage startups.</p>
              </div>

              <div className="space-y-3 border-t border-slate-800/60 pt-6">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  AI Subscription Audit
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  50 OCR Scans/mo
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <X className="w-4 h-4 text-red-500 shrink-0" />
                  ERP Integration
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleGetStarted('signup')}
              className="w-full bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-300 font-bold py-2.5 rounded-lg text-xs transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Growth Plan - MOST POPULAR */}
          <div className="bg-[#111625] border-2 border-[#5c8bf7] rounded-2xl p-8 space-y-8 flex flex-col justify-between hover:border-blue-400 transition-all shadow-2xl relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#5c8bf7] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Most Popular
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#5c8bf7] uppercase tracking-widest">Growth</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$199</span>
                  <span className="text-slate-500 text-xs font-semibold">/mo</span>
                </div>
                <p className="text-xs text-slate-400 leading-none">For scale-ups needing visibility.</p>
              </div>

              <div className="space-y-3 border-t border-slate-800/60 pt-6">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Real-time Leak Alerts
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Unlimited OCR Scans
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Slack & ERP Integrations
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleGetStarted('signup')}
              className="w-full bg-[#5c8bf7] hover:bg-blue-600 text-white font-extrabold py-2.5 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(92,139,247,0.3)]"
            >
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#111625] border border-border-glass rounded-2xl p-8 space-y-8 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md relative overflow-hidden">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Enterprise</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">Custom</span>
                </div>
                <p className="text-xs text-slate-400 leading-none">Full automation for CFO teams.</p>
              </div>

              <div className="space-y-3 border-t border-slate-800/60 pt-6">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Custom ML Models
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Dedicated Finance Analyst
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Multi-entity Management
                </div>
              </div>
            </div>

            <button 
              onClick={() => alert('Contacting sales department...')}
              className="w-full bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-300 font-bold py-2.5 rounded-lg text-xs transition-all"
            >
              Contact Sales
            </button>
          </div>

        </div>
      </section>

      {/* CTA BOTTOM BANNER */}
      <section id="cta" className="max-w-7xl mx-auto px-8 py-16 z-10 w-full">
        <div className="bg-gradient-to-r from-blue-950/20 to-slate-900 border border-border-glass rounded-2xl p-10 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[#5c8bf7]/5 blur-lg pointer-events-none" />
          <h3 className="text-2xl font-extrabold text-white">Ready to reclaim your budget?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Join over 500+ finance teams saving an average of 14% on operational expenses within the first 30 days.
          </p>
          <button 
            onClick={() => handleGetStarted('signup')}
            className="bg-[#82adff] hover:bg-blue-400 text-slate-900 font-extrabold px-6 py-3 rounded-lg text-xs transition-all shadow-lg shadow-blue-500/10 inline-flex items-center gap-2"
          >
            Launch Free Analysis <Sparkles className="w-4.5 h-4.5" />
          </button>
        </div>
      </section>

      {/* GLOBAL CONSOLE FOOTER */}
      <footer id="company" className="border-t border-[#161d30] py-8 bg-[#090d16] text-[11px] text-slate-500 z-10 mt-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 max-w-xs">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-7 h-7 bg-[#1c2438] border border-border-glass rounded flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#5c8bf7]" />
              </div>
              <h4 className="text-[13px] font-extrabold text-white leading-none">LeakLens AI</h4>
            </div>
            <p className="text-[10px] text-slate-600 leading-normal">Precision finance for modern teams. Auditing every cent, protecting every margin.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Product</span>
              <a href="#" className="hover:text-slate-400">AI Detection</a>
              <a href="#pricing" className="hover:text-slate-400">Pricing</a>
              <a href="#" className="hover:text-slate-400">API Docs</a>
            </div>
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Legal</span>
              <a href="#" className="hover:text-slate-400">Security</a>
              <a href="#" className="hover:text-slate-400">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400">Terms of Service</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-[#1c2438] border border-border-glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#1c2438] border border-border-glass flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
