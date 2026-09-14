'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  MapPin, 
  Search, 
  Bell, 
  UserCheck, 
  PlusCircle, 
  Sparkles, 
  ChevronDown, 
  FileText,
  Activity,
  Layers,
  ArrowUpRight,
  LogOut
} from 'lucide-react';
import { AuthUser, DEMO_USERS, getStoredUser, setStoredUser, loginWithCredentials, logoutUser } from '@/lib/auth';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser>(DEMO_USERS['nodal@pravah.demo']);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(4);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    const handleAuthChange = () => setCurrentUser(getStoredUser());
    window.addEventListener('pravah-auth-change', handleAuthChange);
    return () => window.removeEventListener('pravah-auth-change', handleAuthChange);
  }, []);

  const handleRoleSelect = async (email: string) => {
    try {
      await loginWithCredentials(email, 'demoPassword123!');
    } catch {}
    const user = DEMO_USERS[email];
    if (user) {
      setStoredUser(user);
      setCurrentUser(user);
      setRoleDropdownOpen(false);
      if (user.role === 'CITIZEN' && !pathname.startsWith('/citizen')) {
        router.push('/citizen/grievances');
      } else if (user.role !== 'CITIZEN' && pathname.startsWith('/citizen')) {
        router.push('/dashboard');
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/grievances?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'DASHBOARD', href: '/dashboard' },
    { label: 'MAP GIS', href: '/dashboard/map' },
    { label: 'GRIEVANCES', href: '/dashboard/grievances' },
    { label: 'AI INTELLIGENCE', href: '/dashboard/intelligence/risk' },
    { label: 'REPORTS', href: '/dashboard/reports' },
    { label: 'ADMIN', href: '/dashboard/admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-950/95 border-b border-dark-750 backdrop-blur-md">
      {/* Top Banner / Ticker */}
      <div className="bg-dark-900 border-b border-dark-800 text-[11px] py-1 px-4 text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-gold-400 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping"></span>
            LIVE INTELLIGENCE STREAM
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="truncate hidden md:inline">
            Alert: High SLA breach probability detected on <strong className="text-white">GRV-2026-0001</strong> (84% Risk, 3 transfers across 2 depts)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hidden sm:inline">Engine: <span className="text-emerald-400 font-medium">TreeSHAP + Tarjan SCC</span></span>
          <span className="hidden sm:inline">Gov Decision Support Tier-1</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center font-display font-black text-black text-lg shadow-gold-glow">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1">
                PRAVAH<span className="text-gold-400 font-normal">.AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
                Grievance Intelligence
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-bold tracking-wider rounded transition-all ${
                    isActive
                      ? 'text-gold-400 bg-gold-500/10 border border-gold-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Center Global Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search grievance ID, ward, department, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-900 border border-dark-750 text-xs text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-gold-500 placeholder:text-slate-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        {/* Right Actions & Persona Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Submit Grievance Button */}
          <a
            href="/citizen/grievances/new"
            className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-gold-glow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">File Grievance</span>
          </a>

          {/* Notification Center */}
          <a
            href="/dashboard/notifications"
            className="relative p-2 rounded-lg bg-dark-900 border border-dark-750 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </a>

          {/* Interactive Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2.5 bg-dark-900 border border-dark-750 hover:border-gold-500/50 p-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all text-left"
            >
              <div className="w-7 h-7 rounded-full bg-dark-800 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                  {currentUser.name.split(' ')[0]}
                  <span className="text-[10px] font-mono px-1 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">
                    {currentUser.role}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser.designation || currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu for Switch Persona */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-dark-900 border border-dark-700 rounded-xl shadow-card-dark p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-dark-800 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                    Quick Persona Switcher (RBAC Demo)
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Switch roles instantly to inspect role-specific controls & permissions.
                  </p>
                </div>
                <div className="space-y-1">
                  {Object.values(DEMO_USERS).map((user) => (
                    <button
                      key={user.email}
                      onClick={() => handleRoleSelect(user.email)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all ${
                        currentUser.email === user.email
                          ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30'
                          : 'text-slate-300 hover:bg-dark-800 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{user.name}</span>
                        <span className="text-[10px] text-slate-400">{user.designation || user.email}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700">
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-dark-800 mt-1.5 space-y-1">
                  <button
                    onClick={async () => {
                      await logoutUser();
                      setRoleDropdownOpen(false);
                      router.push('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                  <div className="flex justify-between items-center px-2 text-[10px] text-slate-500 pt-1">
                    <span>Session Secured (JWT)</span>
                    <a href="/login" className="text-gold-400 hover:underline">Full Login Page</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
