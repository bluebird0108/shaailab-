export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface AutomationTask {
  id: string;
  name: string;
  description: string;
  category: 'sync' | 'utility' | 'notification' | 'api';
  status: 'idle' | 'running' | 'success' | 'failed';
  lastRun?: string;
  frequency: string;
  logs: string[];
}

export interface PropertyCalcInput {
  purchasePrice: number;
  expectedRent: number;
  serviceCharges: number; // annual
  maintenanceFees: number; // annual
  agencyFees: number; // one-time
  transferFees: number; // one-time (usually 4% in Dubai)
}

export interface PropertyCalcResult {
  grossYield: number;
  netYield: number;
  totalInitialInvestment: number;
  annualExpenses: number;
  monthlyCashFlow: number;
}
