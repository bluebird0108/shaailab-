import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import ChatWidget from './components/ChatWidget';
import PropertyCalculator from './components/PropertyCalculator';
import ContactSection from './components/ContactSection';
import { AlertCircle, Terminal, Sparkles } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Trigger real health checks to our Express server
  const checkApiHealth = async () => {
    setApiStatus('checking');
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch (err) {
      console.warn('Backend is offline, using offline/fallback mode:', err);
      setApiStatus('offline');
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-x-hidden pb-16">
      {/* Scrollable Grid Overlay */}
      <div className="absolute inset-0 grid-background z-0 opacity-15 pointer-events-none" />

      {/* Glow Orbs in absolute backgrounds */}
      <div className="absolute top-20 left-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl glow-orb z-0" />
      <div className="absolute top-[40%] right-[-100px] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-3xl glow-orb z-0" />
      <div className="absolute bottom-10 left-[-150px] h-[550px] w-[550px] rounded-full bg-blue-500/5 blur-3xl glow-orb z-0" />

      {/* Navigation Header */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        
        {/* Module 1: Dashboard Analytics & Dubai localized widget */}
        <DashboardOverview />

        {/* Dynamic Column Split: Chat Assistant & Property yield tools */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* AI Chat assistant */}
          <div className="flex flex-col h-full">
            <ChatWidget apiStatus={apiStatus} checkApiHealth={checkApiHealth} />
          </div>

          {/* UAE Property analysis ROI calculator */}
          <div className="flex flex-col h-full justify-between">
            <PropertyCalculator />
          </div>
        </div>

        {/* Module 2: Communications & direct UAE channels */}
        <ContactSection />
      </main>

      {/* Bottom Legal footer */}
      <footer className="relative z-10 mt-16 border-t border-zinc-900 pt-8 text-center text-xs text-zinc-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© 2026 ShahAI Lab · shaailab.com · Designed and deployed privately on UAE VPS nodes.</p>
        </div>
      </footer>
    </div>
  );
}
