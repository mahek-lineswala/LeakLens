import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  LayoutGrid, 
  CreditCard, 
  UploadCloud, 
  Bell, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Mail, 
  ShieldAlert, 
  Plus, 
  ChevronRight, 
  FileCode, 
  Clock,
  Check,
  X,
  Share2,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    register, 
    logout, 
    checkSession,
    clearError 
  } = useAuthStore();

  // Page controller: 'landing' (public) | 'auth' (login/signup) | 'app' (dashboard console)
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<'insights' | 'dashboard' | 'expenses' | 'uploads' | 'alerts' | 'reports' | 'team' | 'settings'>('dashboard');
  
  // Auth Screen state toggles
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [formErr, setFormErr] = useState<string | null>(null);

  // Load active session on boot
  useEffect(() => {
    checkSession();
  }, []);

  // Sync route views based on backend auth states
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('app');
    } else if (currentPage === 'app') {
      setCurrentPage('landing');
    }
  }, [isAuthenticated]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr(null);
    clearError();

    if (!email || !password) {
      setFormErr('Email and Password are required.');
      return;
    }

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        if (!firstName || !lastName) {
          setFormErr('First and Last names are required.');
          return;
        }
        await register(email, password, firstName, lastName, orgName || undefined);
      }
    } catch (err: any) {
      setFormErr(err.message || 'Authentication failed.');
    }
  };

  // Mock initial transactions database matching dashboard (Screen 3)
  const [transactions] = useState([
    { id: 1, vendor: 'Amazon Web Services', amount: '$12,450.00', category: 'Infrastructure', status: 'Settled', risk: 'Low' },
    { id: 2, vendor: 'DigitalOcean', amount: '$450.00', category: 'Hosting', status: 'Pending', risk: 'High' },
    { id: 3, vendor: 'Slack Technologies', amount: '$2,100.00', category: 'Communication', status: 'Settled', risk: 'Med' },
    { id: 4, vendor: 'Figma Inc', amount: '$1,120.00', category: 'Software', status: 'Settled', risk: 'Low' }
  ]);

  // Mock uploads database matching Uploads (Screen 5)
  const [uploads, setUploads] = useState([
    { id: 1, name: 'Q4_SaaS_Audit_Draft.pdf', type: 'Invoice', date: 'Oct 24, 2024', confidence: 98, status: 'Verified' },
    { id: 2, name: 'Uber_Receipt_829.jpg', type: 'Receipt', date: 'Oct 22, 2024', confidence: 82, status: 'Reviewing' },
    { id: 3, name: 'Azure_Monthly_09.pdf', type: 'Invoice', date: 'Oct 21, 2024', confidence: 45, status: 'Low Confidence' }
  ]);

  // Mock file processing queue state (Screen 5)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Add newly uploaded file
          setUploads(prevUploads => [
            {
              id: Date.now(),
              name: 'invoice_Q3_aws_v2.pdf',
              type: 'Invoice',
              date: 'May 31, 2026',
              confidence: 94,
              status: 'Verified'
            },
            ...prevUploads
          ]);
          return 100;
        }
        return prev + 17;
      });
    }, 400);
  };

  // Guard loading states on initial session boot
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#5c8bf7] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Securing financial console...</p>
      </div>
    );
  }

  // --- SCREEN 6: LANDING PAGE VIEW ---
  if (currentPage === 'landing') {
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

          {/* Nav middle items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Product</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#company" className="hover:text-white transition-colors">Company</a>
          </nav>

          {/* Right actions */}
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
                onClick={() => { setAuthMode('login'); setCurrentPage('auth'); }}
                className="bg-[#5c8bf7] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/10"
              >
                Upgrade
              </button>
            )}
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          
          {/* Left Text Column */}
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
                onClick={() => { setAuthMode('signup'); setCurrentPage('auth'); }}
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

          {/* Right Visual Column (Mockup Illustration matching Screen exactly) */}
          <div className="relative flex justify-center items-center">
            {/* Background tablet container */}
            <div className="w-full max-w-md bg-[#111625] border border-border-glass rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden aspect-[4/3] flex flex-col justify-between">
              
              {/* Fake tablet header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Expense Audit Console</span>
              </div>

              {/* Styled Mockup Chart */}
              <div className="flex-1 flex items-end gap-3 px-4 pt-8 pb-2">
                <div className="flex-1 bg-slate-900 border border-border-glass rounded-t h-[40%]" />
                <div className="flex-1 bg-slate-900 border border-border-glass rounded-t h-[65%]" />
                <div className="flex-1 bg-slate-900 border border-border-glass rounded-t h-[50%]" />
                <div className="flex-1 bg-gradient-to-t from-blue-900/40 to-[#5c8bf7]/30 border border-[#5c8bf7]/40 rounded-t h-[80%] shadow-[0_0_10px_rgba(92,139,247,0.15)]" />
              </div>

              {/* Floating Alert Card: Duplicate SaaS subscription */}
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

              {/* Bottom Floater: Savings accumulation */}
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

        {/* FEATURES GRID SECTION */}
        <section id="features" className="bg-[#090d16] border-y border-[#161d30] py-20 z-10">
          <div className="max-w-7xl mx-auto px-8 space-y-12">
            
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Engineered for Financial Precision</h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Our AI engine scans every transaction across your entire enterprise stack to find the inefficiencies that humans miss.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="bg-[#111625] border border-border-glass rounded-xl p-6 relative hover:border-[#5c8bf7]/30 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-[#1c2438] border border-border-glass flex items-center justify-center text-[#5c8bf7] mb-4">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">AI Leak Detection</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Advanced neural networks identify billing anomalies, zombie subscriptions, and price creep before they impact your EBITDA.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#111625] border border-border-glass rounded-xl p-6 relative hover:border-[#5c8bf7]/30 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-[#1c2438] border border-border-glass flex items-center justify-center text-emerald-400 mb-4">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Real-time OCR</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Scan receipts and invoices with 99.9% accuracy. Data is extracted and mapped instantly to your ledger.
                </p>
              </div>

              {/* Feature 3 */}
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

        {/* PRICING PLANS SECTION */}
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
                onClick={() => { setAuthMode('signup'); setCurrentPage('auth'); }}
                className="w-full bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-300 font-bold py-2.5 rounded-lg text-xs transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Growth Plan - MOST POPULAR */}
            <div className="bg-[#111625] border-2 border-[#5c8bf7] rounded-2xl p-8 space-y-8 flex flex-col justify-between hover:border-blue-400 transition-all shadow-2xl relative">
              {/* Badge element */}
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
                onClick={() => { setAuthMode('signup'); setCurrentPage('auth'); }}
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

        {/* CTA BOTTOM BANNER SECTION */}
        <section id="cta" className="max-w-7xl mx-auto px-8 py-16 z-10 w-full">
          <div className="bg-gradient-to-r from-blue-950/20 to-slate-900 border border-border-glass rounded-2xl p-10 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[#5c8bf7]/5 blur-lg pointer-events-none" />
            <h3 className="text-2xl font-extrabold text-white">Ready to reclaim your budget?</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Join over 500+ finance teams saving an average of 14% on operational expenses within the first 30 days.
            </p>
            <button 
              onClick={() => { setAuthMode('signup'); setCurrentPage('auth'); }}
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

  // --- SCREEN 4: LOGIN / SIGNUP VIEW ---
  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-between select-none relative overflow-hidden">
        {/* Glow effect overlays */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#5c8bf7] opacity-[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-500 opacity-[0.03] rounded-full blur-[120px]" />

        {/* Back navigation button */}
        <div className="absolute top-6 left-8 z-20">
          <button 
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-1.5 text-xs text-[#5c8bf7] hover:underline"
          >
            ← Back to Landing Page
          </button>
        </div>

        <div />

        {/* Content Box */}
        <div className="w-full max-w-md mx-auto px-4 z-10 py-8">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-[#5c8bf7]" />
              LeakLens
            </h1>
            <p className="text-sm font-semibold tracking-wider text-[#5c8bf7] uppercase">
              Enterprise AI-Native Financial Precision
            </p>
          </div>

          {/* Form Box */}
          <div className="bg-[#111625] border border-border-glass rounded-2xl p-8 shadow-2xl relative">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-lg font-bold text-slate-100">
                {authMode === 'login' ? 'Welcome back' : 'Create corporate account'}
              </h2>
              <p className="text-xs text-slate-400">
                {authMode === 'login' 
                  ? 'Log in to manage your corporate treasury' 
                  : 'Start auditing spend leaks and invoice duplicates instantly'}
              </p>
            </div>

            {/* Error notifications */}
            {(formErr || error) && (
              <div className="mb-4 bg-red-955/40 border border-red-800 text-red-300 text-xs p-3 rounded-lg flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-[2px]" />
                <p>{formErr || error}</p>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#090d16] border border-border-glass rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#5c8bf7] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#090d16] border border-border-glass rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#5c8bf7] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-[10px] w-4 h-4 text-slate-500" />
                  <input 
                    type="email" 
                    placeholder="cfo@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090d16] border border-border-glass rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#5c8bf7] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  {authMode === 'login' && (
                    <a href="#" className="text-xs text-[#5c8bf7] hover:underline">Forgot password?</a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-[10px] w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#090d16] border border-border-glass rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#5c8bf7] transition-all"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Organization Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Acme Corp"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-[#090d16] border border-border-glass rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#5c8bf7] transition-all"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">Providing a company name provisions an isolated multi-tenant organization automatically.</p>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-[#5c8bf7] hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(92,139,247,0.3)] mt-2"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Auditing Room'}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <hr className="border-slate-800" />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111625] px-2 text-[10px] uppercase font-bold text-slate-500 tracking-widest">OR</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setFormErr('SSO Login requires configuration inside Settings.')}
                className="flex items-center justify-center gap-2 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-300 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
              >
                Google
              </button>
              <button 
                type="button"
                onClick={() => setFormErr('SSO Login requires configuration inside Settings.')}
                className="flex items-center justify-center gap-2 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-300 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                SSO
              </button>
            </div>

            <div className="text-center mt-6 text-xs text-slate-400">
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setAuthMode('signup'); setFormErr(null); }}
                    className="text-[#10b981] font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setAuthMode('login'); setFormErr(null); }}
                    className="text-[#5c8bf7] font-bold hover:underline"
                  >
                    Log In
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-slate-500 font-bold tracking-wider">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> SOC2 TYPE II</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> 256-BIT AES</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> GDPR COMPLIANT</span>
          </div>
        </div>

        <div className="border-t border-[#161d30] py-4 bg-[#090d16] text-[11px] text-slate-500 z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <p>© 2026 LeakLens AI. Precision Finance.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-400">Security</a>
              <a href="#" className="hover:text-slate-400">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400">Terms of Service</a>
              <a href="#" className="hover:text-slate-400">API Docs</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN LAYOUT (POST-AUTHENTICATED) ---
  return (
    <div className="min-h-screen bg-[#090d16] flex text-slate-200">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0b0f19] border-r border-[#161d30] flex flex-col justify-between shrink-0 select-none">
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#5c8bf7] to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-extrabold text-white leading-none">LeakLens</h2>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Enterprise AI</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('insights')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'insights' 
                  ? 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-l-2 border-[#5c8bf7] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'insights' ? 'text-[#5c8bf7]' : ''}`} />
              AI Insights
            </button>

            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-l-2 border-[#5c8bf7] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <LayoutGrid className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#5c8bf7]' : ''}`} />
              Dashboard
            </button>

            <button 
              onClick={() => setActiveTab('expenses')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'expenses' 
                  ? 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-l-2 border-[#5c8bf7] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${activeTab === 'expenses' ? 'text-[#5c8bf7]' : ''}`} />
              Expenses
            </button>

            <button 
              onClick={() => setActiveTab('uploads')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'uploads' 
                  ? 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-l-2 border-[#5c8bf7] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <UploadCloud className={`w-4 h-4 ${activeTab === 'uploads' ? 'text-[#5c8bf7]' : ''}`} />
              Uploads
            </button>

            <button 
              onClick={() => setActiveTab('alerts')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'alerts' 
                  ? 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-l-2 border-[#5c8bf7] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <div className="relative">
                <Bell className={`w-4 h-4 ${activeTab === 'alerts' ? 'text-[#5c8bf7]' : ''}`} />
                <span className="absolute top-[1px] right-[1px] w-1.5 h-1.5 bg-red-500 rounded-full" />
              </div>
              Alerts
            </button>

            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'reports' 
                  ? 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-l-2 border-[#5c8bf7] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === 'reports' ? 'text-[#5c8bf7]' : ''}`} />
              Reports
            </button>

            <button 
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'team' 
                  ? 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-l-2 border-[#5c8bf7] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'team' ? 'text-[#5c8bf7]' : ''}`} />
              Team
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-blue-950/40 to-slate-900 border-l-2 border-[#5c8bf7] text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#5c8bf7]' : ''}`} />
              Settings
            </button>
          </nav>
        </div>

        <div className="p-4 space-y-2 border-t border-[#161d30] bg-[#090d16]/30">
          <button 
            onClick={() => setActiveTab('uploads')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#5c8bf7]/20 to-[#5c8bf7]/30 hover:to-[#5c8bf7]/40 border border-[#5c8bf7]/40 text-[#a3c3ff] font-bold py-2 px-3 rounded-lg text-xs transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Analysis
          </button>

          <button 
            onClick={() => alert('LeakLens Help Center: contact support@leaklens.ai')}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/30 rounded-lg transition-all"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            Help Center
          </button>

          <button 
            onClick={() => { logout(); setCurrentPage('landing'); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400/80 hover:text-red-300 hover:bg-red-950/10 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4 text-red-500/70" />
            Logout
          </button>
        </div>
      </aside>

      {/* WORKSPACE APP PANELS CONTAINER */}
      <main className="flex-1 flex flex-col justify-between min-w-0">
        
        {/* GLOBAL HEADER BAR */}
        <header className="h-16 border-b border-[#161d30] bg-[#0b0f19] px-8 flex items-center justify-between shrink-0 select-none">
          <div className="relative w-80">
            <Search className="absolute left-3 top-[9px] w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search anomalies, vendors, or team members..." 
              className="w-full bg-[#111625] border border-border-glass rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#5c8bf7] transition-all"
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer text-slate-400 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-[1px] right-[1px] w-1.5 h-1.5 bg-red-500 rounded-full" />
            </div>

            <div className="w-8 h-8 rounded-lg bg-[#111625] border border-border-glass flex items-center justify-center cursor-pointer text-slate-400 hover:text-[#5c8bf7]">
              <Sparkles className="w-4 h-4" />
            </div>

            <button className="bg-gradient-to-r from-blue-900/30 to-[#5c8bf7]/20 border border-[#5c8bf7]/30 hover:border-[#5c8bf7]/50 text-[#82adff] text-[11px] font-bold px-3 py-1 rounded-lg transition-all shadow-sm">
              Upgrade
            </button>

            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="text-right leading-tight">
                <p className="text-xs font-bold text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'Alex Chen'}
                </p>
                <span className="text-[10px] font-medium text-slate-400">
                  {user?.role === 'BUSINESS_OWNER' ? 'CFO / Corporate Owner' : 'Accountant Auditor'}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#111625] border border-border-glass overflow-hidden flex items-center justify-center text-xs font-extrabold text-white bg-gradient-to-tr from-[#5c8bf7] to-indigo-600">
                {user ? user.firstName[0] : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT ROUTER */}
        <div className="flex-1 p-8 overflow-y-auto min-w-0">

          {/* SCREEN 1: AI INSIGHTS VIEW */}
          {activeTab === 'insights' && (
            <div className="space-y-8">
              
              <div className="bg-[#111625] border border-border-glass rounded-xl p-6 relative overflow-hidden flex gap-4 items-start shadow-xl">
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-[#5c8bf7] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-[14px] font-bold text-white">Financial Strategy Assistant</h3>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                      "Welcome back. I've analyzed 4,281 transactions from the last 24 hours. I've identified <span className="text-[#5c8bf7] font-bold">$12,450</span> in potential savings across four categories. Where should we start?"
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                    <button className="bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-300 px-3 py-1.5 rounded-lg transition-all">
                      Show me the top leaks
                    </button>
                    <button className="bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-300 px-3 py-1.5 rounded-lg transition-all">
                      Compare to Q3 budget
                    </button>
                    <button className="bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-300 px-3 py-1.5 rounded-lg transition-all">
                      Review team spending
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Duplicate Expenses */}
                <div className="bg-[#111625] border border-slate-800 rounded-xl p-6 flex flex-col justify-between relative hover:border-emerald-500/30 transition-all shadow-md group">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500 opacity-20" />
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-800 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-white">Duplicate Expenses</h4>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-full">Positive</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      AI detected 12 instances of double-billing from SaaS providers and travel vendors.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
                    <div className="leading-tight">
                      <span className="text-[10px] uppercase font-semibold text-slate-500">Impact</span>
                      <p className="text-sm font-extrabold text-[#5c8bf7]">$3,420.00</p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-200 text-xs font-bold py-1.5 px-3 rounded-lg transition-all">
                      Review Duplicates
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Suspicious Transactions */}
                <div className="bg-[#111625] border border-slate-800 rounded-xl p-6 flex flex-col justify-between relative hover:border-red-500/30 transition-all shadow-md group">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500 opacity-20" />
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-800 flex items-center justify-center text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-white">Suspicious Transactions</h4>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-red-950/60 border border-red-800 text-red-400 rounded-full">Critical</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Anomaly detection identified 3 out-of-pattern transfers to unverified international entities.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
                    <div className="leading-tight">
                      <span className="text-[10px] uppercase font-semibold text-slate-500">Impact</span>
                      <p className="text-sm font-extrabold text-[#f87171]">$6,150.00</p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all">
                      Freeze & Investigate
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spending Spikes */}
                <div className="bg-[#111625] border border-slate-800 rounded-xl p-6 flex flex-col justify-between relative hover:border-blue-500/30 transition-all shadow-md group">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-[#5c8bf7] opacity-20" />
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-900 flex items-center justify-center text-blue-400">
                          <TrendingUp className="w-4.5 h-4.5" />
                        </div>
                        <h4 className="text-sm font-bold text-white">Spending Spikes</h4>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-950/60 border border-blue-900 text-blue-400 rounded-full">Medium</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Cloud infrastructure costs are 24% higher than projected for this week.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
                    <div className="leading-tight">
                      <span className="text-[10px] uppercase font-semibold text-slate-500">Impact</span>
                      <p className="text-sm font-extrabold text-[#5c8bf7]">$1,880.00</p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-200 text-xs font-bold py-1.5 px-3 rounded-lg transition-all">
                      Analyze Cloud Costs
                    </button>
                  </div>
                </div>

                {/* Subscription Waste */}
                <div className="bg-[#111625] border border-slate-800 rounded-xl p-6 flex flex-col justify-between relative hover:border-slate-500/30 transition-all shadow-md group">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-500 opacity-20" />
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                          <FileText className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-white">Subscription Waste</h4>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-950/60 border border-slate-800 text-slate-400 rounded-full">Low</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Detected 8 accounts with no activity in 30 days across Enterprise tools.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
                    <div className="leading-tight">
                      <span className="text-[10px] uppercase font-semibold text-slate-500">Impact</span>
                      <p className="text-sm font-extrabold text-slate-200">$1,000.00</p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-200 text-xs font-bold py-1.5 px-3 rounded-lg transition-all">
                      View Inactive Seats
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SCREEN 3: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* AI Financial Health */}
                <div className="bg-[#111625] border border-border-glass rounded-xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      AI Financial Health
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-white">88</span>
                      <span className="text-slate-500 text-xs font-semibold">/100</span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-[#5c8bf7] w-[88%]" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-[#5c8bf7] border-r-[#5c8bf7] flex items-center justify-center relative shrink-0">
                    <span className="text-[10px] font-extrabold text-slate-400">88%</span>
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="bg-[#111625] border border-border-glass rounded-xl p-5 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      Total Expenses
                    </span>
                    <h3 className="text-2xl font-extrabold text-white">$42,500</h3>
                    <p className="text-[10px] text-[#ef4444] font-bold flex items-center gap-0.5 mt-1">
                      + 4.2% vs last month
                    </p>
                  </div>
                </div>

                {/* Saved by AI */}
                <div className="bg-[#111625] border border-border-glass rounded-xl p-5 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      Saved by AI
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#10b981]">$1,240</h3>
                    <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                      12 leaks prevented
                    </p>
                  </div>
                </div>

                {/* Active Alerts */}
                <div className="bg-[#111625] border border-border-glass rounded-xl p-5 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      Active Alerts
                    </span>
                    <h3 className="text-2xl font-extrabold text-white">3</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 leading-none">
                      Requires immediate review
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-950/30 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0">
                    <AlertTriangle className="w-4.5 h-4.5" />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Volatility Chart */}
                <div className="bg-[#111625] border border-border-glass rounded-xl p-6 lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">Expense Volatility</h4>
                      <p className="text-[11px] text-slate-400">Monthly spending patterns across all entities</p>
                    </div>
                    <select className="bg-[#0b0f19] border border-border-glass rounded-lg px-2 py-1 text-slate-300 text-xs focus:outline-none focus:border-[#5c8bf7]">
                      <option>Last 6 Months</option>
                      <option>Last 12 Months</option>
                    </select>
                  </div>

                  <div className="h-64 flex flex-col justify-between pt-4 relative select-none">
                    <div className="flex-1 flex justify-between items-end gap-4 px-4 border-b border-slate-800">
                      
                      <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-[#1c2438] hover:bg-slate-700/50 rounded-t-md transition-all h-[55%] relative">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1c2438] border border-border-glass text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$14,200</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">JAN</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-[#1c2438] hover:bg-slate-700/50 rounded-t-md transition-all h-[75%]">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1c2438] border border-border-glass text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$18,400</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">FEB</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-[#1c2438] hover:bg-slate-700/50 rounded-t-md transition-all h-[60%]">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1c2438] border border-border-glass text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$15,100</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">MAR</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-[#1c2438] hover:bg-slate-700/50 rounded-t-md transition-all h-[88%]">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1c2438] border border-border-glass text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$22,500</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">APR</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-[#1c2438] hover:bg-slate-700/50 rounded-t-md transition-all h-[70%]">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1c2438] border border-border-glass text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$17,900</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">MAY</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-[#82adff] hover:bg-blue-400 rounded-t-md transition-all h-[80%] relative shadow-[0_0_15px_rgba(130,173,255,0.2)]">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1c2438] border border-border-glass text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">$20,100</span>
                        </div>
                        <span className="text-[10px] font-bold text-white">JUN</span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* AI Insights list */}
                <div className="bg-[#111625] border border-border-glass rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5c8bf7]" />
                    <h4 className="text-sm font-bold text-white">AI Insights</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#0b0f19] border border-border-glass rounded-xl p-3.5 space-y-2 hover:border-[#5c8bf7]/30 transition-all cursor-pointer">
                      <div className="flex gap-2.5 items-start">
                        <div className="w-7 h-7 rounded-lg bg-red-950/20 border border-red-800/40 flex items-center justify-center text-red-400 shrink-0">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-[11px] font-bold text-white leading-tight">Possible duplicate payment detected ($450)</h5>
                          <p className="text-[10px] text-slate-400 leading-normal">Vendor: DigitalOcean. AI suggests reviewing transaction #8821.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0b0f19] border border-border-glass rounded-xl p-3.5 space-y-2 hover:border-[#5c8bf7]/30 transition-all cursor-pointer">
                      <div className="flex gap-2.5 items-start">
                        <div className="w-7 h-7 rounded-lg bg-blue-950/20 border border-blue-900/40 flex items-center justify-center text-[#5c8bf7] shrink-0">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-[11px] font-bold text-white leading-tight">AWS expenses increased 38%</h5>
                          <p className="text-[10px] text-slate-400 leading-normal">Deviation from 3-month baseline. Check Lambda concurrency.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0b0f19] border border-border-glass rounded-xl p-3.5 space-y-2 hover:border-[#5c8bf7]/30 transition-all cursor-pointer">
                      <div className="flex gap-2.5 items-start">
                        <div className="w-7 h-7 rounded-lg bg-emerald-950/20 border border-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-[11px] font-bold text-white leading-tight">Unused subscription: Zoom Pro</h5>
                          <p className="text-[10px] text-slate-400 leading-normal">No login activity for 45 days. Potential $14.99/mo saving.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('insights')}
                    className="w-full text-center text-xs text-[#5c8bf7] font-bold py-2 hover:underline"
                  >
                    View All Insights
                  </button>
                </div>

              </div>

              {/* Recent Transactions table */}
              <div className="bg-[#111625] border border-border-glass rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">Recent Transactions</h4>
                  <button className="flex items-center gap-1.5 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-200 text-xs font-bold py-1 px-3 rounded-lg transition-all">
                    Filter
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs select-none">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                        <th className="py-3 px-4">Vendor</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-900/30 transition-all">
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-[#1c2438] border border-border-glass flex items-center justify-center text-[10px] font-extrabold">
                              {tx.vendor[0]}
                            </div>
                            {tx.vendor}
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-100">{tx.amount}</td>
                          <td className="py-3.5 px-4">
                            <span className="bg-[#1c2438] text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold border border-border-glass">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                              tx.status === 'Settled' ? 'text-emerald-400' : 'text-[#5c8bf7]'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                tx.status === 'Settled' ? 'bg-emerald-400 animate-pulse' : 'bg-[#5c8bf7]'
                              }`} />
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              tx.risk === 'Low' 
                                ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400' 
                                : tx.risk === 'Med' 
                                ? 'bg-blue-950/40 border-blue-900/40 text-[#5c8bf7]' 
                                : 'bg-red-950/40 border-red-900/40 text-red-400'
                            }`}>
                              {tx.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div 
                  onClick={() => alert('Expense module will expand in Phase 8.')}
                  className="w-full text-center text-xs text-slate-500 font-semibold cursor-pointer py-2 hover:text-slate-400 transition-colors"
                >
                  View Complete Transaction History
                </div>
              </div>

            </div>
          )}

          {/* SCREEN 5: UPLOADS VIEW */}
          {activeTab === 'uploads' && (
            <div className="space-y-8">
              
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-white">Expense Ingestion</h3>
                <p className="text-xs text-slate-400 leading-normal max-w-2xl">
                  Upload invoices, receipts, or bank statements. Our neural OCR engine will extract line items and flag leaks automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="bg-[#111625] border border-border-glass rounded-xl p-8 lg:col-span-2 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group select-none min-h-[300px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#5c8bf7]/5 via-transparent to-transparent pointer-events-none" />

                  <div className="w-16 h-16 rounded-2xl bg-[#1c2438] border border-border-glass flex items-center justify-center text-slate-400 group-hover:text-[#5c8bf7] transition-colors relative">
                    <UploadCloud className="w-8 h-8" />
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <h4 className="text-sm font-bold text-slate-200">Drop files here to scan</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      PDF, PNG, JPG, or CSV supported. Max file size 50MB.
                    </p>
                  </div>

                  <button 
                    onClick={simulateUpload}
                    disabled={isUploading}
                    className="bg-[#82adff] hover:bg-blue-400 text-slate-900 font-extrabold py-2 px-5 rounded-lg text-xs transition-all shadow-md shadow-blue-500/10 disabled:opacity-50"
                  >
                    Select Files from Vault
                  </button>
                </div>

                <div className="bg-[#111625] border border-border-glass rounded-xl p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Processing</h4>
                    <span className="text-[9px] font-extrabold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      Active OCR
                    </span>
                  </div>

                  <div className="space-y-4">
                    
                    <div className="bg-[#0b0f19] border border-border-glass rounded-xl p-4 space-y-3 relative overflow-hidden">
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex justify-between items-baseline gap-2">
                            <h5 className="text-[11px] font-bold text-white truncate leading-none">
                              {isUploading ? 'invoice_Q3_aws_v2.pdf' : 'No active uploads'}
                            </h5>
                            <span className="text-[10px] font-extrabold text-[#5c8bf7]">
                              {isUploading ? `${uploadProgress}%` : '0%'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate leading-none">
                            {isUploading ? 'Extracting line items...' : 'Waiting for file selection...'}
                          </p>
                        </div>
                      </div>

                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-[#5c8bf7] transition-all duration-300"
                          style={{ width: `${isUploading ? uploadProgress : 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-[#0b0f19] border border-border-glass rounded-xl p-4 flex justify-between items-center hover:border-emerald-500/30 transition-all cursor-pointer">
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-[11px] font-bold text-white truncate">starbucks_receipt_0921.jpg</h5>
                          <span className="text-[10px] font-bold text-emerald-400 block">3 Leaks Detected</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </div>

                  </div>
                </div>

              </div>

              <div className="bg-[#111625] border border-border-glass rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">Recent Uploads</h4>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-200 text-xs font-bold py-1 px-3 rounded-lg transition-all">
                      Filter
                    </button>
                    <button 
                      onClick={() => alert('Ingestion audits log exported.')}
                      className="flex items-center gap-1.5 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-200 text-xs font-bold py-1 px-3 rounded-lg transition-all"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs select-none">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                        <th className="py-3 px-4">File Name</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Confidence</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300">
                      {uploads.map((file) => (
                        <tr key={file.id} className="hover:bg-slate-900/30 transition-all">
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            {file.name}
                          </td>
                          <td className="py-3.5 px-4">{file.type}</td>
                          <td className="py-3.5 px-4 text-slate-400">{file.date}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    file.confidence > 90 ? 'bg-emerald-400' : file.confidence > 60 ? 'bg-blue-400' : 'bg-red-400'
                                  }`}
                                  style={{ width: `${file.confidence}%` }}
                                />
                              </div>
                              <span className="font-extrabold text-[10px]">{file.confidence}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              file.status === 'Verified' 
                                ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400' 
                                : file.status === 'Reviewing' 
                                ? 'bg-blue-950/40 border-blue-900/40 text-[#5c8bf7]' 
                                : 'bg-red-950/40 border-red-900/40 text-red-400'
                            }`}>
                              {file.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* SCREEN 2: ALERTS & ANOMALIES VIEW */}
          {activeTab === 'alerts' && (
            <div className="space-y-8">
              
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-red-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  Live Surveillance Active
                </span>
                <h3 className="text-2xl font-extrabold text-white">Alerts & Anomalies</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  14 critical irregularities detected in the last 24 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Expenditure Matrix */}
                <div className="bg-[#111625] border border-border-glass rounded-xl p-6 lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">High-Risk Expenditure Matrix</h4>
                      <p className="text-[11px] text-slate-400">AI-ranked anomalies by fraud probability and financial impact.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    
                    <div className="bg-[#0b0f19] border border-border-glass rounded-xl p-4 flex justify-between items-center hover:border-red-500/20 transition-all cursor-pointer">
                      <div className="flex gap-3.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-red-950/20 border border-red-800/40 flex items-center justify-center text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-white">Duplicate SaaS Subscription</h5>
                          <span className="text-[10px] text-slate-400 flex items-center gap-2">
                            Salesforce Corp <Clock className="w-3.5 h-3.5 text-slate-500" /> 2h ago
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-red-400">-$14,200.00</p>
                        <span className="text-[10px] font-bold text-[#ef4444]">98% Fraud Prob</span>
                      </div>
                    </div>

                    <div className="bg-[#0b0f19] border border-border-glass rounded-xl p-4 flex justify-between items-center hover:border-blue-500/20 transition-all cursor-pointer">
                      <div className="flex gap-3.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-950/20 border border-blue-900/40 flex items-center justify-center text-[#5c8bf7]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-white">Out-of-Policy Travel Expense</h5>
                          <span className="text-[10px] text-slate-400 flex items-center gap-2">
                            Alex Rivera <Clock className="w-3.5 h-3.5 text-slate-500" /> 5h ago
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-slate-200">-$2,840.00</p>
                        <span className="text-[10px] font-bold text-[#5c8bf7]">74% Risk Score</span>
                      </div>
                    </div>

                    <div className="bg-[#0b0f19] border border-border-glass rounded-xl p-4 flex justify-between items-center hover:border-slate-500/20 transition-all cursor-pointer">
                      <div className="flex gap-3.5 items-center">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-white">Unrecognized Vendor Payment</h5>
                          <span className="text-[10px] text-slate-400 flex items-center gap-2">
                            Unknown ID: 0x44f <Clock className="w-3.5 h-3.5 text-slate-500" /> 8h ago
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-slate-200">-$8,122.50</p>
                        <span className="text-[10px] font-bold text-slate-400 font-extrabold">62% Anomalous</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="space-y-6">
                  
                  <div className="bg-[#111625] border border-border-glass rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Surveillance Score</h4>
                    
                    <div className="w-32 h-32 rounded-full border-8 border-slate-900 border-t-[#ef4444] border-r-[#ef4444] flex flex-col items-center justify-center relative shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                      <span className="text-3xl font-extrabold text-white">75</span>
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Elevated</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-normal">Surveillance engines indicate high volatile movements in travel accounts.</p>
                  </div>

                  <div className="bg-[#111625] border border-border-glass rounded-xl p-5 relative overflow-hidden flex gap-3.5 items-start">
                    <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
                    
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest block">AI Prediction</span>
                      <h4 className="text-xs font-bold text-white">Projected Savings: $42k</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">By resolving the detected duplicate subscriptions, LeakLens predicts rapid budget balances.</p>
                    </div>
                  </div>

                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="bg-[#111625] border border-border-glass rounded-xl p-6 lg:col-span-2 space-y-6">
                  <h4 className="text-sm font-bold text-white">Surveillance Activity Timeline</h4>

                  <div className="space-y-6 relative pl-6 border-l border-slate-800">
                    
                    <div className="relative">
                      <span className="absolute -left-[30px] top-[2px] w-4.5 h-4.5 bg-[#ef4444] border-4 border-slate-900 rounded-full" />
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h5 className="text-[11px] font-bold text-white">Multiple fast-succession charges detected</h5>
                          <p className="text-[10px] text-slate-400">Entity "Cloudflare" processed 8 payments in &lt; 2 seconds.</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-[#ef4444] hover:bg-red-600 text-white text-[10px] font-bold py-1 px-3 rounded-lg transition-all">Freeze Card</button>
                          <button className="bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-400 text-[10px] font-bold py-1 px-3 rounded-lg transition-all">Dismiss</button>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold block mt-1">14:22:15 GMT</span>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[30px] top-[2px] w-4.5 h-4.5 bg-[#5c8bf7] border-4 border-slate-900 rounded-full" />
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h5 className="text-[11px] font-bold text-white">Regional Policy Violation</h5>
                          <p className="text-[10px] text-slate-400">Expense submitted from non-approved business region: Eastern Europe.</p>
                        </div>
                        <button className="bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-200 text-[10px] font-bold py-1 px-3 rounded-lg transition-all shrink-0">View Map</button>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold block mt-1">11:05:42 GMT</span>
                    </div>

                  </div>
                </div>

                <div className="bg-[#111625] border border-border-glass rounded-xl p-6 space-y-4 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rapid Actions</h4>
                  
                  <div className="grid grid-cols-2 gap-3 flex-1 pt-2">
                    <button className="flex flex-col items-center justify-center gap-2 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass rounded-xl p-3 text-slate-200 transition-all select-none">
                      <Lock className="w-5 h-5 text-red-400" />
                      <span className="text-[10px] font-bold">Lock Cards</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass rounded-xl p-3 text-slate-200 transition-all select-none">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <span className="text-[10px] font-bold">Notify Team</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass rounded-xl p-3 text-slate-200 transition-all select-none">
                      <UploadCloud className="w-5 h-5 text-emerald-400" />
                      <span className="text-[10px] font-bold">Export Logs</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 bg-[#1c2438] hover:bg-[#252f49] border border-border-glass rounded-xl p-3 text-slate-200 transition-all select-none">
                      <Settings className="w-5 h-5 text-slate-400" />
                      <span className="text-[10px] font-bold">Adjust Sens.</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SKELETON VIEWS */}
          {['expenses', 'reports', 'team', 'settings'].includes(activeTab) && (
            <div className="min-h-[400px] bg-[#111625] border border-border-glass rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1c2438] border border-border-glass flex items-center justify-center text-[#5c8bf7]">
                <FileCode className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white capitalize">{activeTab} Console</h3>
                <p className="text-xs text-slate-400 leading-normal max-w-sm">
                  This feature module is scheduled for implementation in subsequent roadmap phases. Back-end models are fully whitelisted.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="bg-[#1c2438] hover:bg-[#252f49] border border-border-glass text-slate-200 text-xs font-bold py-2 px-4 rounded-lg transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          )}

        </div>

        <footer className="h-12 border-t border-[#161d30] bg-[#0b0f19] px-8 flex items-center justify-between text-[11px] text-slate-500 shrink-0 select-none">
          <p>© 2026 LeakLens AI. Precision Finance.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SOC2 Type II</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
