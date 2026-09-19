'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Sparkles, ArrowRight, CheckCircle2, Layers, Lightbulb, Check } from 'lucide-react';
import { VYAPAR_SHELF_METRICS } from '../../lib/mockData';

interface VyaparShelfSpaceCardProps {
  onExecuteRecommendation?: () => void;
}

export const VyaparShelfSpaceCard: React.FC<VyaparShelfSpaceCardProps> = ({
  onExecuteRecommendation
}) => {
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    setIsApplied(true);
    if (onExecuteRecommendation) onExecuteRecommendation();
    setTimeout(() => setIsApplied(false), 3000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#e6e4df] bg-white shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-800 border border-amber-500/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
              Strategic Decision Engine
            </div>
            <h4 className="text-base font-extrabold text-stone-900 tracking-tight">
              Shelf Space vs Profit Margin Audit (6 Months)
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          <span>Potential: +₹18k – ₹24k / month</span>
        </div>
      </div>

      {/* Comparison Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* LED Products */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-stone-900 text-sm">💡 LED Lighting & Battens</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] font-mono border border-emerald-300">
              High Margin Winner
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-600">Profit Margin:</span>
              <span className="font-black text-emerald-700">32%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '32%' }} />
            </div>

            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-600">Shelf Space Occupied:</span>
              <span className="font-black text-stone-800">12%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div className="bg-stone-500 h-2 rounded-full" style={{ width: '12%' }} />
            </div>
          </div>

          <p className="text-[11px] text-emerald-900 pt-1 border-t border-emerald-200/60 font-medium">
            Generating 32% profit while occupying only 12% of shelf space. Under-indexed.
          </p>
        </div>

        {/* Submersible Pumps */}
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-stone-900 text-sm">🚰 Submersible Water Pumps</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] font-mono border border-rose-300">
              Slow Moving Space Hog
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-600">Profit Margin:</span>
              <span className="font-black text-rose-700">8%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div className="bg-rose-500 h-2 rounded-full" style={{ width: '8%' }} />
            </div>

            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-600">Shelf Space Occupied:</span>
              <span className="font-black text-stone-800">30%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div className="bg-stone-500 h-2 rounded-full" style={{ width: '30%' }} />
            </div>
          </div>

          <p className="text-[11px] text-rose-900 pt-1 border-t border-rose-200/60 font-medium">
            Generating only 8% profit while hogging 30% of prime counter floor. Over-indexed.
          </p>
        </div>
      </div>

      {/* Recommended 3-Step Action Plan */}
      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Vyapar AI 3-Point Business Decision:</span>
        </div>
        <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
          <li><strong>Increase LED Inventory & Frontage</strong>: Expand front display by 18%.</li>
          <li><strong>Reallocate Pump Space</strong>: Keep 2 floor samples only; fulfill rest on-demand.</li>
          <li><strong>Electrician Combos</strong>: Bundle LED Batten + Switch Box + Tape for Thane contractors.</li>
        </ul>
      </div>

      {/* Action footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <span className="text-xs font-mono text-stone-500 italic">
          &ldquo;That&apos;s not a dashboard. That&apos;s a business decision.&rdquo;
        </span>

        <button
          type="button"
          onClick={handleApply}
          disabled={isApplied}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 disabled:opacity-75"
        >
          {isApplied ? (
            <>
              <Check className="h-3.5 w-3.5 text-stone-950" />
              <span>Floor Space Optimized!</span>
            </>
          ) : (
            <>
              <span>Reallocate Shelf Space (+₹24,000/mo)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
