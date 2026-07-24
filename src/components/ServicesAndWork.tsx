import React from 'react';
import { Bot, Braces, Workflow, ArrowUpRight, Building2, ShieldCheck } from 'lucide-react';

const services = [
  { icon: Bot, title: 'AI Assistants', text: 'Secure, business-aware assistants for customer support, internal knowledge, documents, and team decisions.' },
  { icon: Workflow, title: 'Business Automation', text: 'Reliable workflows for leads, reporting, follow-ups, data collection, alerts, and repetitive operations.' },
  { icon: Braces, title: 'Custom Applications', text: 'Purpose-built CRM, portals, dashboards, integrations, and operational software designed around your team.' },
];

export default function ServicesAndWork() {
  return <>
    <section id="services" className="scroll-mt-24 space-y-6">
      <div><span className="text-xs font-bold uppercase tracking-[0.24em] text-blue-500">What we build</span><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">AI services built for real work.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">From the first workflow audit to deployment and monitoring, Shaai Lab turns practical business problems into dependable digital systems.</p></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{services.map(({icon: Icon,title,text}) => <article key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition hover:border-blue-500/40"><div className="mb-5 inline-flex rounded-xl border border-blue-500/20 bg-blue-500/10 p-3"><Icon className="h-5 w-5 text-blue-400" /></div><h3 className="text-lg font-bold text-zinc-50">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p></article>)}</div>
    </section>
    <section id="work" className="scroll-mt-24 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-blue-500/10 p-6 sm:p-9">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400"><Building2 className="h-4 w-4" /> Featured client solution</div><h2 className="text-3xl font-extrabold tracking-tight text-zinc-50">Smart Quote CRM</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">Shaai Lab supports Smart Quote with a secure real-estate operations platform covering contacts, follow-ups, DLD tenancy contracts, renewals, documents, team permissions, ledgers, and AI-assisted communication.</p><div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-300"><span className="rounded-full border border-zinc-700 px-3 py-1.5">CRM operations</span><span className="rounded-full border border-zinc-700 px-3 py-1.5">Contract automation</span><span className="rounded-full border border-zinc-700 px-3 py-1.5">24/7 monitoring</span><span className="rounded-full border border-zinc-700 px-3 py-1.5"><ShieldCheck className="mr-1 inline h-3 w-3" /> Secure access</span></div></div><a href="https://smartqoute.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400">Visit client platform <ArrowUpRight className="h-4 w-4" /></a></div>
    </section>
  </>;
}
