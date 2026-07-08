import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Terminal, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { Message } from '../types';

interface ChatWidgetProps {
  apiStatus: 'online' | 'offline' | 'checking';
  checkApiHealth: () => void;
}

export default function ChatWidget({ apiStatus, checkApiHealth }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      text: 'Salaam Faraz! I’m ShahAI, your personal lab assistant. Ask me about your UAE VPS backend, real estate ROI tools, automation crons, or code prototypes. How can I help you today? 👋',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What can ShahAI do?',
    'Explain the UAE VPS setup',
    'Calculate Dubai property yield',
    'Draft an Express.js API route',
  ];

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Add placeholder thinking message
    const thinkingId = 'thinking-' + Date.now();
    const thinkingMsg: Message = {
      id: thinkingId,
      role: 'bot',
      text: 'Thinking...',
      timestamp: '',
    };
    setMessages((prev) => [...prev, thinkingMsg]);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Replace thinking message with real reply
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? {
                ...m,
                text: data.reply || 'No response returned from assistant.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : m
        )
      );
    } catch (err) {
      console.error('Chat API Error:', err);
      // Fallback response with beautiful helpful details
      let fallbackText = 'I am currently running in offline fallback mode. Please ensure the backend server is fully initialized and your GEMINI_API_KEY is configured in the Secrets tab! However, I can still assist with standard template queries.';
      
      const query = trimmed.toLowerCase();
      if (query.includes('what can') || query.includes('feature') || query.includes('help')) {
        fallbackText = `Salaam! As your personal UAE-based assistant, I am designed to help with:
• **Real Estate Yields**: Analyze annual net yields, ROI, and transaction costs for Dubai and Abu Dhabi.
• **System Automation**: View, test, and control automated cron triggers on your private VPS.
• **Backend Prototyping**: Generate boilerplate code, configure microservices, and outline Docker files.

*(Note: Add your GEMINI_API_KEY in the Secrets tab to enable full AI-powered chat reasoning!)*`;
      } else if (query.includes('vps') || query.includes('server') || query.includes('setup') || query.includes('infra')) {
        fallbackText = `Your private VPS infrastructure is optimized for UAE workflows:
• **Core Host**: Runs on a secure private node with instant API request proxying.
• **Database Layer**: Integrated local key-value store and Firestore schemas.
• **Cron Engine**: Runs background automation tasks like scraping listings, backups, and alerts.
• **Secure Access**: All heavy computations and sensitive API key handling occur server-side.`;
      } else if (query.includes('calc') || query.includes('property') || query.includes('yield') || query.includes('dubai')) {
        fallbackText = `I can help you calculate property metrics! For example:
• **Gross Yield**: (Annual Rental Income / Property Purchase Price) * 100
• **Net Yield**: ((Annual Rent - Service Charges - Maintenance) / Total Investment) * 100
• **Initial Fees**: Dubai Land Department (4% DLD), Agency Commission (2%), Trustee Fees, and transfer costs.

Try adjusting the sliders in the **UAE Property Yield Calculator** tab right on this dashboard to see real-time calculations!`;
      } else if (query.includes('express') || query.includes('api') || query.includes('route') || query.includes('code') || query.includes('draft')) {
        fallbackText = `Here is a clean Express.js boilerplate for a private UAE API route:

\`\`\`javascript
import express from 'express';
const router = express.Router();

// Property Sync Endpoint
router.post('/sync-properties', async (req, res) => {
  try {
    console.log('[Cron] Starting UAE Property Sync...');
    // Fetch from DLD or real estate portals
    res.json({ success: true, synced: 42, duration: '1.2s' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
\`\`\`

You can copy this blueprint to start building your microservices!`;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? {
                ...m,
                text: fallbackText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Safe manual markdown renderer to support lists, bolding, code snippets, etc.
  const renderMessageContent = (text: string) => {
    // If it has code blocks
    if (text.includes('```')) {
      const parts = text.split('```');
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          // Inside a code block
          const lines = part.split('\n');
          const lang = lines[0].trim() || 'javascript';
          const code = lines.slice(1).join('\n').trim();
          return (
            <div key={i} className="my-3 overflow-hidden rounded-lg border border-cyan-500/20 bg-[#020710] font-mono text-xs text-sky-300">
              <div className="flex items-center justify-between bg-sky-950/40 px-4 py-1.5 text-[10px] uppercase tracking-wider text-sky-400">
                <span>{lang}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
              </div>
              <pre className="overflow-x-auto p-4 leading-relaxed"><code>{code}</code></pre>
            </div>
          );
        } else {
          return renderInlineMarkdown(part);
        }
      });
    }
    return renderInlineMarkdown(text);
  };

  const renderInlineMarkdown = (partText: string) => {
    const lines = partText.split('\n');
    return lines.map((line, lineIndex) => {
      // Bold text formatting
      let formattedLine: React.ReactNode = line;
      if (line.includes('**')) {
        const segments = line.split('**');
        formattedLine = segments.map((seg, segIndex) => 
          segIndex % 2 === 1 ? <strong key={segIndex} className="font-bold text-cyber-brand">{seg}</strong> : seg
        );
      }

      // Inline code highlights
      if (typeof formattedLine === 'string' && formattedLine.includes('`')) {
        const segments = formattedLine.split('`');
        formattedLine = segments.map((seg, segIndex) => 
          segIndex % 2 === 1 ? <code key={segIndex} className="rounded bg-sky-950/60 px-1 py-0.5 font-mono text-xs text-cyber-brand">{seg}</code> : seg
        );
      }

      // If it is a bullet point
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return (
          <li key={lineIndex} className="ml-4 list-disc py-0.5 text-sky-100/95 leading-relaxed">
            {content.includes('**') ? (
              content.split('**').map((seg, segIndex) => 
                segIndex % 2 === 1 ? <strong key={segIndex} className="font-bold text-cyber-brand">{seg}</strong> : seg
              )
            ) : content}
          </li>
        );
      }

      return (
        <p key={lineIndex} className="text-sky-100/95 leading-relaxed mb-1 min-h-[1.25rem]">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <section className="relative scroll-mt-20 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl overflow-hidden" id="chat">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl glow-orb" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 shadow-sm">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
          </div>
          <div>
            <h3 className="font-bold text-[#fafafa] text-sm sm:text-base">ShahAI Assistant</h3>
            <span className="text-xs text-zinc-500">Private UAE VPS Instance</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={checkApiHealth}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-zinc-300 transition-all hover:bg-zinc-700"
          >
            <RefreshCw className={`h-3 w-3 ${apiStatus === 'checking' ? 'animate-spin' : ''}`} />
            REFRESH STATUS
          </button>
          
          <div className="flex items-center gap-1.5 rounded-full bg-zinc-950 px-3 py-1 border border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              {apiStatus === 'online' ? 'Live' : 'Fallback'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[360px] overflow-y-auto px-6 py-5 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-all ${
              m.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'border border-zinc-800 bg-zinc-950/70 text-zinc-100 rounded-tl-none'
            }`}>
              {m.text === 'Thinking...' ? (
                <div className="flex items-center gap-2 text-zinc-400 py-1 font-medium">
                  <Terminal className="h-4 w-4 animate-pulse" />
                  <span className="animate-pulse">Analyzing telemetry...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {renderMessageContent(m.text)}
                </div>
              )}
              {m.timestamp && (
                <span className="mt-1.5 block text-right text-[10px] font-medium text-zinc-500">
                  {m.timestamp}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Quick Chips */}
      <div className="flex flex-wrap gap-2 px-6 pb-4">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="rounded-lg border border-zinc-800 bg-zinc-800/40 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="flex items-center gap-3 border-t border-zinc-850 px-6 py-4 bg-zinc-950/50"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask ShahAI (e.g. 'Dubai rental yield on 2M AED property')"
          className="h-11 flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-700 transition-all"
          maxLength={1000}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 font-bold text-white transition-all disabled:opacity-50 cursor-pointer text-sm"
        >
          <Send className="h-4.5 w-4.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </section>
  );
}
