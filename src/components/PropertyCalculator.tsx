import React, { useState, useEffect } from 'react';
import { Calculator, Building2, TrendingUp, DollarSign, Info, Sparkles, Receipt } from 'lucide-react';
import { PropertyCalcInput, PropertyCalcResult } from '../types';

export default function PropertyCalculator() {
  // Setup state with standard Dubai Studio default
  const [inputs, setInputs] = useState<PropertyCalcInput>({
    purchasePrice: 950000, // AED
    expectedRent: 85000,   // AED/yr
    serviceCharges: 12000, // AED/yr
    maintenanceFees: 3000, // AED/yr
    agencyFees: 19000,     // 2% of price (calculated or custom)
    transferFees: 38000,   // 4% DLD fee (calculated or custom)
  });

  const [results, setResults] = useState<PropertyCalcResult>({
    grossYield: 0,
    netYield: 0,
    totalInitialInvestment: 0,
    annualExpenses: 0,
    monthlyCashFlow: 0,
  });

  // Automatically update calculated fees when purchase price changes
  const handlePriceChange = (val: number) => {
    setInputs(prev => ({
      ...prev,
      purchasePrice: val,
      agencyFees: Math.round(val * 0.02),
      transferFees: Math.round(val * 0.04)
    }));
  };

  // Preset investment profiles in Dubai/UAE
  const applyProfile = (profileName: string) => {
    switch (profileName) {
      case 'studio':
        setInputs({
          purchasePrice: 750000,
          expectedRent: 68000,
          serviceCharges: 9500,
          maintenanceFees: 2000,
          agencyFees: 15000,
          transferFees: 30000,
        });
        break;
      case 'luxury':
        setInputs({
          purchasePrice: 2200000,
          expectedRent: 175000,
          serviceCharges: 26000,
          maintenanceFees: 6000,
          agencyFees: 44000,
          transferFees: 88000,
        });
        break;
      case 'villa':
        setInputs({
          purchasePrice: 5500000,
          expectedRent: 380000,
          serviceCharges: 35000,
          maintenanceFees: 15000,
          agencyFees: 110000,
          transferFees: 220000,
        });
        break;
      default:
        break;
    }
  };

  // Perform financial ROI calculations
  useEffect(() => {
    const dldTrusteeReg = 4200; // Standard Dubai trustee registration & title deed fee
    const otherAdminCosts = 1500;
    
    const totalInitialInvestment = 
      inputs.purchasePrice + 
      inputs.transferFees + // DLD
      inputs.agencyFees + 
      dldTrusteeReg + 
      otherAdminCosts;

    const annualExpenses = inputs.serviceCharges + inputs.maintenanceFees;
    const netAnnualRent = inputs.expectedRent - annualExpenses;

    const grossYield = inputs.purchasePrice > 0 ? (inputs.expectedRent / inputs.purchasePrice) * 100 : 0;
    const netYield = totalInitialInvestment > 0 ? (netAnnualRent / totalInitialInvestment) * 100 : 0;
    const monthlyCashFlow = netAnnualRent / 12;

    setResults({
      grossYield: Number(grossYield.toFixed(2)),
      netYield: Number(netYield.toFixed(2)),
      totalInitialInvestment,
      annualExpenses,
      monthlyCashFlow: Math.max(0, Math.round(monthlyCashFlow)),
    });
  }, [inputs]);

  // Currency Formatter
  const formatAED = (val: number) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <section className="scroll-mt-20 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl relative overflow-hidden" id="calculator">
      <div className="absolute top-0 left-0 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl glow-orb" />
      
      {/* Title */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800">
            <Calculator className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#fafafa] tracking-tight">UAE Rental Yield & ROI Analyst</h2>
            <p className="text-xs text-zinc-500">Model DLD, agency, service fee expenses instantly</p>
          </div>
        </div>

        {/* Profiles */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase mr-1">PRESETS:</span>
          <button 
            onClick={() => applyProfile('studio')}
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 hover:border-zinc-500 hover:text-white transition-all cursor-pointer font-medium"
          >
            Studio (Marina)
          </button>
          <button 
            onClick={() => applyProfile('luxury')}
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 hover:border-zinc-500 hover:text-white transition-all cursor-pointer font-medium"
          >
            2-Bed (Downtown)
          </button>
          <button 
            onClick={() => applyProfile('villa')}
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 hover:border-zinc-500 hover:text-white transition-all cursor-pointer font-medium"
          >
            Villa (Palm)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Sliders and Inputs */}
        <div className="space-y-6 lg:col-span-7">
          {/* Purchase Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-semibold text-zinc-300">Property Purchase Price</label>
              <span className="font-mono font-bold text-blue-500">{formatAED(inputs.purchasePrice)}</span>
            </div>
            <input
              type="range"
              min={300000}
              max={10000000}
              step={50000}
              value={inputs.purchasePrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer rounded-lg bg-zinc-800 accent-blue-500"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono">AED 300K</span>
              <input
                type="number"
                value={inputs.purchasePrice}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="ml-auto w-36 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-right font-mono text-xs text-white outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {/* Expected Rent */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-semibold text-zinc-300">Expected Annual Rental Income</label>
              <span className="font-mono font-bold text-emerald-500">{formatAED(inputs.expectedRent)}</span>
            </div>
            <input
              type="range"
              min={25000}
              max={800000}
              step={5000}
              value={inputs.expectedRent}
              onChange={(e) => setInputs(prev => ({ ...prev, expectedRent: Number(e.target.value) }))}
              className="h-1.5 w-full cursor-pointer rounded-lg bg-zinc-800 accent-emerald-500"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono">AED 25K</span>
              <input
                type="number"
                value={inputs.expectedRent}
                onChange={(e) => setInputs(prev => ({ ...prev, expectedRent: Number(e.target.value) }))}
                className="ml-auto w-36 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-right font-mono text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Secondary Expenses Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Service Charges */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                Annual Service Charges (Property Care)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.serviceCharges}
                  onChange={(e) => setInputs(prev => ({ ...prev, serviceCharges: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-3 pr-10 font-mono text-sm text-white outline-none focus:border-zinc-700"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-bold text-zinc-600">AED</span>
              </div>
            </div>

            {/* Maintenance Fees */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">
                Annual Maintenance & Insurances
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.maintenanceFees}
                  onChange={(e) => setInputs(prev => ({ ...prev, maintenanceFees: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-3 pr-10 font-mono text-sm text-white outline-none focus:border-zinc-700"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-bold text-zinc-600">AED</span>
              </div>
            </div>

            {/* DLD Transfer Fee */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                Dubai Land Dept Fee (4%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.transferFees}
                  onChange={(e) => setInputs(prev => ({ ...prev, transferFees: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-3 pr-10 font-mono text-sm text-white outline-none focus:border-zinc-700"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-bold text-zinc-600">AED</span>
              </div>
            </div>

            {/* Agency Broker Commission */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                Broker Commission (2%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.agencyFees}
                  onChange={(e) => setInputs(prev => ({ ...prev, agencyFees: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-3 pr-10 font-mono text-sm text-white outline-none focus:border-zinc-700"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-bold text-zinc-600">AED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations Outputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Financial Analysis
            </h4>

            {/* Yield Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Gross Yield</span>
                <span className="text-2xl font-black text-[#fafafa] tracking-tight">{results.grossYield}%</span>
                <span className="text-[10px] text-zinc-600 block mt-1">Excl. operating expenses</span>
              </div>
              <div className="rounded-xl bg-emerald-500/5 p-3.5 border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-wider block mb-1">Net Rental Yield</span>
                <span className="text-2xl font-black text-emerald-400 tracking-tight">{results.netYield}%</span>
                <span className="text-[10px] text-emerald-400/40 block mt-1">Incl. fees & upkeep</span>
              </div>
            </div>

            {/* Investment Breakdown */}
            <div className="space-y-3 pt-2 text-xs border-t border-zinc-800">
              <div className="flex justify-between">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-blue-500" /> Original Property Cost
                </span>
                <span className="font-mono font-medium text-[#fafafa]">{formatAED(inputs.purchasePrice)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Receipt className="h-3 w-3 text-zinc-400" /> Government Transfer (DLD) + Broker
                </span>
                <span className="font-mono font-medium text-[#fafafa]">+{formatAED(inputs.transferFees + inputs.agencyFees)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Info className="h-3 w-3 text-zinc-500" /> Trustee & Admin Registration Fees
                </span>
                <span className="font-mono font-medium text-[#fafafa]">+AED 5,700</span>
              </div>

              <div className="flex justify-between border-t border-dashed border-zinc-800 pt-2.5">
                <span className="font-semibold text-zinc-300">Total Upfront Capital Required</span>
                <span className="font-mono font-black text-blue-500 text-sm">{formatAED(results.totalInitialInvestment)}</span>
              </div>
            </div>

            {/* Monthly Profitability */}
            <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Est. Net Monthly Cash Flow</span>
                <span className="text-[11px] text-zinc-600 mt-0.5 block">After deducting annual service & upkeep</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-lg text-emerald-400">{formatAED(results.monthlyCashFlow)}</span>
                <span className="text-[10px] text-emerald-400/60 block font-semibold">/ Month Net</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
