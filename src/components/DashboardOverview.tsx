import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, Activity, Clock, ShieldCheck, Database, Building2 } from 'lucide-react';

export default function DashboardOverview() {
  const [currentTime, setCurrentTime] = useState('');
  const [uptimeDays, setUptimeDays] = useState(142);
  const [vCPU, setvCPU] = useState(12); // simulated usage %
  const [ram, setRAM] = useState(58); // simulated usage %

  // Update real-time Dubai (UAE) localized clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(now.toLocaleTimeString('en-AE', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Soft random jitter on system load metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setvCPU(prev => Math.min(Math.max(prev + (Math.random() * 6 - 3), 5), 35));
      setRAM(prev => Math.min(Math.max(prev + (Math.random() * 2 - 1), 54), 62));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="scroll-mt-20 space-y-6" id="dashboard">
      {/* Visual Header / Banner Card */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-8 shadow-xl overflow-hidden">
        {/* Background ambient orbs */}
        <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl glow-orb" />
        <div className="absolute top-1/2 right-10 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl glow-orb" />

        {/* Content Row */}
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SYSTEM STATUS: ONLINE
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#fafafa] sm:text-4xl lg:text-5xl">
              ShahAI Lab Dashboard
            </h1>
            <p className="max-w-xl text-sm text-zinc-400 leading-relaxed">
              Welcome back, Faraz. Monitor background data collection, analyze real estate investment opportunities, 
              and draft application microservices powered by secure UAE VPS hosting.
            </p>
          </div>

          {/* Localized UAE Widget */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 min-w-[210px] text-center md:text-right flex flex-col items-center md:items-end justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Dubai Standard Time</span>
            <span className="text-3xl font-black font-mono text-[#fafafa] tracking-tight mt-1">{currentTime || '12:00:00 PM'}</span>
            <span className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-wide">Uptime: {uptimeDays} days 14h</span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Status Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">vCPU Node Load</span>
            <div className="rounded-lg bg-zinc-800 p-1.5 border border-zinc-700">
              <Cpu className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold font-mono text-[#fafafa] tracking-tight">{vCPU.toFixed(1)}%</span>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${vCPU}%` }}></div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Memory Allocation</span>
            <div className="rounded-lg bg-zinc-800 p-1.5 border border-zinc-700">
              <Activity className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold font-mono text-[#fafafa] tracking-tight">{ram.toFixed(1)}%</span>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${ram}%` }}></div>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">API Latency (UAE)</span>
            <div className="rounded-lg bg-zinc-800 p-1.5 border border-zinc-700">
              <Wifi className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">42 ms</span>
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Optimal routing active</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Automation Engine</span>
            <div className="rounded-lg bg-zinc-800 p-1.5 border border-zinc-700">
              <ShieldCheck className="h-4 w-4 text-pink-500" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold text-[#fafafa] tracking-tight">Active</span>
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-zinc-500">
              <span>Cron services running</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
