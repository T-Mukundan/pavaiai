'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DEMO_USERS, 
  loginWithCredentials, 
  loginWithOtp, 
  sendOtpToPhone, 
  registerUser, 
  setStoredUser 
} from '@/lib/auth';
import { 
  Users, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  Phone, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'PUBLIC' | 'AUTHORITY'>('PUBLIC');

  // Citizen Modes: 'LOGIN' | 'OTP' | 'REGISTER'
  const [citizenMode, setCitizenMode] = useState<'LOGIN' | 'OTP' | 'REGISTER'>('LOGIN');

  // Citizen Login Form State
  const [citizenEmail, setCitizenEmail] = useState('citizen@pravah.demo');
  const [citizenPassword, setCitizenPassword] = useState('demoPassword123!');

  // Citizen OTP State
  const [citizenPhone, setCitizenPhone] = useState('+91 98765 43210');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');

  // Citizen Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Tracking ID State
  const [trackingId, setTrackingId] = useState('');

  // Authority State
  const [officialEmail, setOfficialEmail] = useState('nodal@pravah.demo');
  const [officialPassword, setOfficialPassword] = useState('demoPassword123!');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Clear messages on tab/mode switch
  const handleTabSwitch = (tab: 'PUBLIC' | 'AUTHORITY') => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCitizenModeSwitch = (mode: 'LOGIN' | 'OTP' | 'REGISTER') => {
    setCitizenMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
    setOtpSent(false);
  };

  // 1. Citizen Password Login
  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await loginWithCredentials(citizenEmail, citizenPassword);
      setSuccessMessage(`Authenticated as ${user.name}`);
      setTimeout(() => router.push('/citizen/grievances'), 300);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Send Citizen OTP
  const handleSendOtp = async () => {
    if (!citizenPhone.trim()) {
      setErrorMessage('Please enter your mobile number.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await sendOtpToPhone(citizenPhone);
      setOtpSent(true);
      setOtpNotice(res.message);
      if (res.demoOtp) {
        setOtpCode(res.demoOtp); // prefill for testing convenience
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify Citizen OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await loginWithOtp(citizenPhone, otpCode);
      setSuccessMessage(`Welcome, ${user.name}! Redirecting...`);
      setTimeout(() => router.push('/citizen/grievances'), 300);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Citizen Registration
  const handleCitizenRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        role: 'CITIZEN',
      });
      setSuccessMessage(`Account created for ${user.name}! Logging in...`);
      setTimeout(() => router.push('/citizen/grievances'), 300);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Authority Login
  const handleAuthorityLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await loginWithCredentials(officialEmail, officialPassword);
      setSuccessMessage(`Welcome, ${user.name} (${user.designation || user.role})`);
      setTimeout(() => router.push('/dashboard'), 300);
    } catch (err: any) {
      setErrorMessage(err.message || 'Official credentials verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Fast Persona One-Click Access
  const handleQuickPersona = async (email: string) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await loginWithCredentials(email, 'demoPassword123!');
      if (user.role === 'CITIZEN') {
        router.push('/citizen/grievances');
      } else {
        router.push('/dashboard');
      }
    } catch {
      // Fallback
      const fallback = DEMO_USERS[email];
      if (fallback) {
        setStoredUser(fallback);
        if (fallback.role === 'CITIZEN') {
          router.push('/citizen/grievances');
        } else {
          router.push('/dashboard');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // 7. Track Grievance
  const handleTrackComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      const cleanId = trackingId.trim().toUpperCase();
      router.push(`/grievances/${cleanId}`);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center p-4 selection:bg-gold-500 selection:text-black">
      {/* Brand Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center font-display font-black text-black text-xl shadow-gold-glow">
            P
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-white">
            PRAVAH<span className="text-gold-400 font-normal">.AI</span>
          </span>
        </div>
        <h1 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
          Public Grievance Intelligence & Decision Support Platform
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Predictive Resolution & Anomaly Vector Analysis for Civic Grievances
        </p>
      </div>

      {/* Dual Portal Container */}
      <div className="w-full max-w-xl bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-card-dark">
        {/* Top Portal Switcher Tabs */}
        <div className="grid grid-cols-2 border-b border-dark-800 bg-dark-950 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => handleTabSwitch('PUBLIC')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'PUBLIC'
                ? 'bg-gold-500 text-black shadow-gold-glow'
                : 'text-slate-400 hover:text-white hover:bg-dark-850'
            }`}
          >
            <Users className="w-4 h-4" />
            <div className="text-left">
              <span className="block leading-tight">Public / Citizen Portal</span>
              <span className="text-[10px] font-normal opacity-80 block">नागरिक सेवा केंद्र</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('AUTHORITY')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'AUTHORITY'
                ? 'bg-gold-500 text-black shadow-gold-glow'
                : 'text-slate-400 hover:text-white hover:bg-dark-850'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <div className="text-left">
              <span className="block leading-tight">Government Authorities</span>
              <span className="text-[10px] font-normal opacity-80 block">प्रशासनिक अधिकारी केंद्र</span>
            </div>
          </button>
        </div>

        {/* Global Error or Success Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-500/15 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: PUBLIC / CITIZEN PORTAL */}
        {activeTab === 'PUBLIC' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-200">
            {/* Quick Action Strip */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-dark-950 border border-dark-800 rounded-xl">
              <a
                href="/citizen/grievances/new"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold transition group"
              >
                <PlusCircle className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                <span>File Grievance Now</span>
              </a>

              <button
                type="button"
                onClick={() => handleQuickPersona('citizen@pravah.demo')}
                disabled={loading}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 text-slate-300 text-xs font-bold transition text-left"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="block text-white">1-Click Citizen</span>
                  <span className="text-[10px] text-slate-400 font-normal">Priya Sharma</span>
                </div>
              </button>
            </div>

            {/* Sub-navigation for Citizen Auth */}
            <div className="flex border-b border-dark-800 text-xs font-semibold text-slate-400 gap-4">
              <button
                type="button"
                onClick={() => handleCitizenModeSwitch('LOGIN')}
                className={`pb-2 transition ${citizenMode === 'LOGIN' ? 'text-gold-400 border-b-2 border-gold-400 font-bold' : 'hover:text-white'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleCitizenModeSwitch('OTP')}
                className={`pb-2 transition ${citizenMode === 'OTP' ? 'text-gold-400 border-b-2 border-gold-400 font-bold' : 'hover:text-white'}`}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => handleCitizenModeSwitch('REGISTER')}
                className={`pb-2 transition ${citizenMode === 'REGISTER' ? 'text-gold-400 border-b-2 border-gold-400 font-bold' : 'hover:text-white'}`}
              >
                New Registration
              </button>
            </div>

            {/* Mode 1: Password Login */}
            {citizenMode === 'LOGIN' && (
              <form onSubmit={handleCitizenLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Registered Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="citizen@pravah.demo"
                      className="w-full bg-dark-950 border border-dark-750 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600 transition"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={citizenPassword}
                      onChange={(e) => setCitizenPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-dark-950 border border-dark-750 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600 transition"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow transition active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>Sign In to Citizen Dashboard</span>
                </button>
              </form>
            )}

            {/* Mode 2: Mobile OTP Login */}
            {citizenMode === 'OTP' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Indian Mobile Number (+91)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={citizenPhone}
                        onChange={(e) => setCitizenPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-dark-950 border border-dark-750 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600 transition font-mono"
                      />
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="px-4 py-2.5 bg-dark-800 hover:bg-dark-750 border border-dark-700 text-gold-400 rounded-xl text-xs font-bold whitespace-nowrap transition disabled:opacity-50"
                    >
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>
                  {otpNotice && (
                    <p className="text-[11px] text-emerald-400 mt-1 font-mono">{otpNotice}</p>
                  )}
                </div>

                {otpSent && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                        Enter 6-Digit OTP Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          className="w-full bg-dark-950 border border-dark-750 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600 font-mono tracking-widest text-center text-sm font-bold"
                        />
                        <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow transition active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Verify Code & Sign In</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Mode 3: Citizen Registration */}
            {citizenMode === 'REGISTER' && (
              <form onSubmit={handleCitizenRegister} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className="w-full bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">
                    Create Password (min 6 characters) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-dark-950 border border-dark-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow transition active:scale-[0.99] disabled:opacity-50 mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>Register Citizen Account</span>
                </button>
              </form>
            )}

            {/* Quick Track Grievance Bar */}
            <div className="pt-4 border-t border-dark-800">
              <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                Track Existing Complaint (No Login Required)
              </span>
              <form onSubmit={handleTrackComplaint} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. GRV-2026-0001)"
                    className="w-full bg-dark-950 border border-dark-750 rounded-xl px-4 py-2 pl-10 text-xs text-white font-mono uppercase focus:outline-none focus:border-gold-500 placeholder:text-slate-600"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-700 text-gold-400 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: GOVERNMENT AUTHORITIES PORTAL */}
        {activeTab === 'AUTHORITY' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-200">
            <form onSubmit={handleAuthorityLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Official Email / Gov ID
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    placeholder="nodal@pravah.demo"
                    className="w-full bg-dark-950 border border-dark-750 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600 transition"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Authority Passkey / Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={officialPassword}
                    onChange={(e) => setOfficialPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-dark-950 border border-dark-750 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600 transition"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                  Jurisdiction Scope
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-750 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-gold-500 transition"
                >
                  <option value="ALL">All Departments (Executive / Super Admin Oversight)</option>
                  <option value="ROADS_HWY">Roads & Highways Department</option>
                  <option value="DRAINAGE">Drainage & Stormwater Department</option>
                  <option value="WATER_SUPPLY">Water Supply & Sewerage Board</option>
                  <option value="ELECTRICITY">Electricity Distribution Co.</option>
                  <option value="SOLID_WASTE">Solid Waste Management</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-gold-glow transition active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Authenticate into Command Center</span>
              </button>
            </form>

            {/* 1-Click Fast Passkeys for Official Personas */}
            <div className="pt-4 border-t border-dark-800 space-y-2.5">
              <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block">
                1-Click Official Passkeys (Role-Based Access Control Demo)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPersona('nodal@pravah.demo')}
                  disabled={loading}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-950 hover:bg-dark-850 border border-dark-750 text-left transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                    SR
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-gold-400 transition-colors">
                      Dr. Sunita Rao, IAS
                    </span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">Nodal Officer (Principal Secretary)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersona('officer@pravah.demo')}
                  disabled={loading}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-950 hover:bg-dark-850 border border-dark-750 text-left transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                    VM
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      Vikram Malhotra
                    </span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">Senior Executive Engineer (Roads)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersona('analyst@pravah.demo')}
                  disabled={loading}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-950 hover:bg-dark-850 border border-dark-750 text-left transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                    AS
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Aditya Sen
                    </span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">Chief Intelligence Data Analyst</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersona('admin@pravah.demo')}
                  disabled={loading}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-950 hover:bg-dark-850 border border-dark-750 text-left transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                    SA
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                      Super Admin
                    </span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">System Governance & Audits</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Security Notice */}
      <div className="text-center mt-6 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Secured by SHA-256 JWT sessions & immutable cryptographic audit logs</span>
      </div>
    </div>
  );
}
