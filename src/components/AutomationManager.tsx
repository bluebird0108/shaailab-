import React, { useState, useEffect, useRef } from 'react';
import { Play, Terminal, Plus, Trash2, CheckCircle2, XCircle, Clock, Server, RefreshCw, Cpu, Database, Bell } from 'lucide-react';
import { AutomationTask } from '../types';

export default function AutomationManager() {
  const [tasks, setTasks] = useState<AutomationTask[]>([
    {
      id: '1',
      name: 'Dubai Land Dept Property Sync',
      description: 'Scrapes daily transaction logs and updates local valuation indexes.',
      category: 'sync',
      status: 'idle',
      frequency: 'Every 6 hours',
      logs: ['[System] Cron task registered: Dubai Land Dept Property Sync (0 */6 * * *)'],
    },
    {
      id: '2',
      name: 'Real Estate Lead Email Responder',
      description: 'Auto-checks inbound emails and drafts a reply using Gemini-3.5-Flash.',
      category: 'notification',
      status: 'idle',
      frequency: 'On Webhook Ingress',
      logs: ['[System] Webhook endpoint active: /api/webhooks/inbound-leads'],
    },
    {
      id: '3',
      name: 'Private Postgres DB encrypted S3 Backup',
      description: 'Compresses database cluster, encrypts using AES-256 and ships to secure object storage.',
      category: 'utility',
      status: 'idle',
      frequency: 'Daily at 02:00 AM',
      logs: ['[System] Postgres backup cron initialized (0 2 * * *)'],
    },
    {
      id: '4',
      name: 'Nginx SSL & UAE Server Certificate Monitor',
      description: 'Verifies Certbot SSL validity and triggers automated renewing scripts.',
      category: 'api',
      status: 'idle',
      frequency: 'Every Sunday',
      logs: ['[System] Certbot SSL validation schedule active'],
    },
  ]);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[System] Welcome to ShahAI Lab VPS Server Terminal',
    '[System] UAE Node: active-dxb-vps-1',
    '[System] Server Status: Online & Stable (Cores: 4 vCPU, RAM: 8GB)',
    '[System] Listening for incoming microservice tasks...',
  ]);

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskFreq, setNewTaskFreq] = useState('Every 12 hours');
  const [newTaskCat, setNewTaskCat] = useState<'sync' | 'utility' | 'notification' | 'api'>('sync');
  const [isAdding, setIsAdding] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Simulate running an automation task with live terminal logs printing progressively
  const runTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === 'running') return;

    // Update state to running
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'running' } : t))
    );

    const nowStr = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [
      ...prev,
      `\n[${nowStr}] [CMD] Executing automation job: "${task.name}"`,
    ]);

    // Simulated multi-stage logging script
    const scriptLogs = [
      `[${nowStr}] [Task] Loading microservice container environment...`,
      `[${nowStr}] [Task] Initializing VPS secure networking sockets...`,
      task.category === 'sync'
        ? `[${nowStr}] [Sync] Querying UAE Land Department listings API...`
        : task.category === 'notification'
        ? `[${nowStr}] [API] Checking webhook queue for unparsed listings...`
        : task.category === 'utility'
        ? `[${nowStr}] [Database] Archiving database table records & schemas...`
        : `[${nowStr}] [Security] Reading Certbot local key hashes...`,
      task.category === 'sync'
        ? `[${nowStr}] [Database] Upserted 47 transaction mappings into SQL database.`
        : task.category === 'notification'
        ? `[${nowStr}] [AI] Formulated response blueprints for 3 prospective UAE investors.`
        : task.category === 'utility'
        ? `[${nowStr}] [Cloud] Encrypting stream with AES-256. Payload shipped to secure UAE S3.`
        : `[${nowStr}] [Security] Certbot keys valid. SSL Certificate active for 89 more days.`,
      `[${nowStr}] [Task] Verification checklist passed. Closing microservice run.`,
      `[${nowStr}] [System] Success: "${task.name}" completed in 2.8s.`,
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < scriptLogs.length) {
        setTerminalLogs((prev) => [...prev, scriptLogs[logIdx]]);
        logIdx++;
      } else {
        clearInterval(interval);
        // Set task to success and log execution
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: 'success',
                  lastRun: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
              : t
          )
        );
      }
    }, 450);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const task: AutomationTask = {
      id: Date.now().toString(),
      name: newTaskName,
      description: newTaskDesc || 'No custom description provided.',
      category: newTaskCat,
      status: 'idle',
      frequency: newTaskFreq,
      logs: [`[System] Task created: ${newTaskName}`],
    };

    setTasks((prev) => [...prev, task]);
    setTerminalLogs((prev) => [
      ...prev,
      `[System] Registered custom background job: "${newTaskName}" (${newTaskFreq})`,
    ]);
    setNewTaskName('');
    setNewTaskDesc('');
    setIsAdding(false);
  };

  const deleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (task) {
      setTerminalLogs((prev) => [...prev, `[System] Deregistered background job: "${task.name}"`]);
    }
  };

  const clearLogs = () => {
    setTerminalLogs(['[System] Terminal logs cleared.', '[System] Awaiting instructions...']);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'sync':
        return <Database className="h-4 w-4 text-blue-500" />;
      case 'utility':
        return <Cpu className="h-4 w-4 text-purple-500" />;
      case 'notification':
        return <Bell className="h-4 w-4 text-emerald-500" />;
      default:
        return <Server className="h-4 w-4 text-pink-500" />;
    }
  };

  return (
    <section className="scroll-mt-20 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl relative" id="automations">
      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl glow-orb" />

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800">
            <Server className="h-5 w-5 text-blue-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#fafafa] tracking-tight">VPS Automation Control Room</h2>
            <p className="text-xs text-zinc-500">Simulate and check scheduled cron tasks and microservices</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? 'CANCEL' : 'ADD NEW TASK'}
        </button>
      </div>

      {/* Adding Box Form */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="mb-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4 animate-fadeIn">
          <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider">Configure Custom VPS Cron Job</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Task Name</label>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="e.g. Daily Property Valuation Sync"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-zinc-700"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Trigger Schedule</label>
              <input
                type="text"
                value={newTaskFreq}
                onChange={(e) => setNewTaskFreq(e.target.value)}
                placeholder="e.g. Every 12 hours, On Webhook Inbound"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-zinc-700"
                required
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs text-zinc-400">Task Description</label>
              <input
                type="text"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Brief summary of what this automated VPS script executes..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-zinc-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Module Category</label>
              <select
                value={newTaskCat}
                onChange={(e) => setNewTaskCat(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-zinc-700"
              >
                <option value="sync">Data Scraper / Sync</option>
                <option value="notification">AI Responder / Notification</option>
                <option value="utility">Database Backup / Utility</option>
                <option value="api">API Listener / SSL Check</option>
              </select>
            </div>
            <div className="flex items-end justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 text-xs font-bold transition-all cursor-pointer"
              >
                SAVE AND DEPLOY TO VPS
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main Grid: Tasks List & Shell terminal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Tasks List */}
        <div className="lg:col-span-7 space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="group rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 flex flex-wrap items-center justify-between gap-4 hover:border-zinc-700 hover:bg-zinc-950/80 transition-all">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-lg bg-zinc-900 p-2 border border-zinc-800">
                  {getCategoryIcon(task.category)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#fafafa] group-hover:text-blue-500 transition-colors flex items-center gap-2">
                    {task.name}
                    {task.status === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mt-0.5">{task.description}</p>
                  
                  {/* Footer status row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[10px] font-semibold text-zinc-500">
                    <span className="flex items-center gap-1 uppercase tracking-wider">
                      <Clock className="h-3 w-3 text-blue-500" /> {task.frequency}
                    </span>
                    {task.lastRun && (
                      <span className="text-emerald-500 uppercase tracking-wider">
                        Last Run: {task.lastRun}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => runTask(task.id)}
                  disabled={task.status === 'running'}
                  className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all cursor-pointer ${
                    task.status === 'running'
                      ? 'bg-blue-950/20 border border-blue-900/30 text-blue-400 animate-pulse'
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {task.status === 'running' ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      RUNNING
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      RUN TASK
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="rounded-lg bg-red-500/5 border border-red-500/10 p-2 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer"
                  title="Deregister Task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Terminal Emulator */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] text-zinc-300 shadow-inner overflow-hidden min-h-[300px] h-full">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-blue-500" />
              <span className="font-bold uppercase tracking-widest text-zinc-400">Terminal Emulator</span>
            </div>
            <button
              onClick={clearLogs}
              className="text-[9px] font-bold text-zinc-600 hover:text-red-400 transition-colors uppercase cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          {/* Terminal Logs Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 leading-relaxed bg-zinc-950">
            {terminalLogs.map((log, i) => {
              if (typeof log !== 'string') return null;
              const cleanLog = log.trim();
              return (
                <div key={i} className={`whitespace-pre-wrap ${
                  cleanLog.startsWith('[System]') 
                    ? 'text-zinc-500 font-semibold' 
                    : cleanLog.startsWith('[CMD]') 
                    ? 'text-blue-500 font-bold border-l border-blue-500 pl-1.5 my-1'
                    : cleanLog.includes('Success') 
                    ? 'text-emerald-500 font-semibold'
                    : 'text-zinc-400'
                }`}>
                  {log}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
