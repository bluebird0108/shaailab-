import React from 'react';
import { Sparkles, Activity } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'chat', label: 'AI Assistant' },
    { id: 'calculator', label: 'UAE Property Tool' },
    { id: 'automations', label: 'Automation Lab' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#dashboard" onClick={() => setActiveSection('dashboard')} className="group flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 transition-all group-hover:border-zinc-600">
            <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#fafafa]">
            Shah<span className="text-blue-500">AI</span>
            <span className="ml-2 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">LAB</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 outline-none ${
                activeSection === item.id
                  ? 'bg-zinc-800 text-[#fafafa] border border-zinc-700 shadow-md'
                  : 'text-zinc-400 hover:text-[#fafafa] hover:bg-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
