import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface AuthPageProps {
  setCurrentPage: (page: 'landing' | 'auth' | 'app') => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
}

export default function AuthPage({ setCurrentPage, authMode, setAuthMode }: AuthPageProps) {
  const { login, register, error, clearError } = useAuthStore();
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [formErr, setFormErr] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-between select-none relative overflow-hidden">
      {/* Glow effect overlays */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#5c8bf7] opacity-[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-500 opacity-[0.03] rounded-full blur-[120px]" />

      {/* Back navigation button */}
      <div className="absolute top-6 left-8 z-20">
        <button 
          onClick={() => { clearError(); setCurrentPage('landing'); }}
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
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-400 mt-[2px]" />
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
