import React from 'react';
import { Phone, Mail, Globe, Sparkles, Building2, ExternalLink } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="scroll-mt-20 border-t border-zinc-800 pt-10" id="contact">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-[#fafafa] sm:text-3xl">Get In Touch</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-2">
          Connect directly with Faraz (Shah) for custom app development, automation scripting, or investment inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Telephone Call Card */}
        <a 
          href="tel:0588116231" 
          className="group flex flex-col justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-blue-500/10 p-2.5 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <Phone className="h-5 w-5 text-blue-500" />
            </div>
            <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-1">CALL SECURE</span>
            <span className="font-mono text-base font-bold text-[#fafafa] tracking-wide block">058 811 6231</span>
            <span className="text-xs text-zinc-500 mt-1 block">Direct Mobile & WhatsApp (UAE)</span>
          </div>
        </a>

        {/* Email Card */}
        <a 
          href="mailto:faraz_kamzi333@hotmail.co.uk" 
          className="group flex flex-col justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-purple-500/10 p-2.5 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
              <Mail className="h-5 w-5 text-purple-400" />
            </div>
            <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-1">INBOX ENQUIRIES</span>
            <span className="font-mono text-sm font-bold text-[#fafafa] tracking-wide block truncate">faraz_kamzi333@hotmail.co.uk</span>
            <span className="text-xs text-zinc-500 mt-1 block">General & Technical Support</span>
          </div>
        </a>

        {/* Site Link Card */}
        <a 
          href="https://shaailab.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group flex flex-col justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              <Globe className="h-5 w-5 text-emerald-400" />
            </div>
            <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block mb-1">WEBSITE LINK</span>
            <span className="font-mono text-base font-bold text-[#fafafa] tracking-wide block">shaailab.com</span>
            <span className="text-xs text-zinc-500 mt-1 block">Live Domain & Gateway Portal</span>
          </div>
        </a>
      </div>
    </section>
  );
}
