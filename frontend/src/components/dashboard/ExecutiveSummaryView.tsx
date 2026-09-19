import React from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Boxes, 
  Wallet, 
  MessageSquare, 
  AlertTriangle, 
  ArrowUpRight, 
  Zap, 
  Layers, 
  Sparkles,
  Sliders,
  CheckCircle2,
  Store,
  Clock,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { 
  AgentMetadata, 
  StrategicRecommendation, 
  AgentInsight, 
  SKUItem, 
  SalesRecord, 
  ExpenseRecord, 
  CustomerFeedback 
} from '../../lib/types';
import { AgentBadge } from '../ui/AgentBadge';
import { VyaparShelfSpaceCard } from './VyaparShelfSpaceCard';

interface ExecutiveSummaryViewProps {
  agents: AgentMetadata[];
  recommendations: StrategicRecommendation[];
  insights: AgentInsight[];
  skus: SKUItem[];
  sales: SalesRecord[];
  expenses: ExpenseRecord[];
  feedbacks: CustomerFeedback[];
  healthScore: number;
  storeMode?: 'vyapar' | 'apex';
  onExecuteAction: (actionType: string, payload: any) => void;
  onNavigateToTab: (tab: string) => void;
  onInspectAgent?: (agentId: string) => void;
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({
  agents,
  recommendations,
  insights,
  skus,
  sales,
  expenses,
  feedbacks,
  healthScore,
  storeMode = 'vyapar',
  onExecuteAction,
  onNavigateToTab,
  onInspectAgent
}) => {
  const latestSales = sales[sales.length - 1];
  const criticalSkus = skus.filter(s => s.status === 'critical');
  const overBudgetExp = expenses.filter(e => e.status === 'over_budget');
  const negFeedbacks = feedbacks.filter(f => f.sentiment === 'negative');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl border border-[#e6e4df] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-800 border border-amber-500/20">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">
              {storeMode === 'vyapar' ? 'Vyapar AI • Autonomous Shop Partner' : 'Executive Decision Console'}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            {storeMode === 'vyapar' 
              ? 'Rajesh Hardware & Electricals (Thane West) Operations' 
              : 'Virtual Executive Team Operations Overview'}
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
            {storeMode === 'vyapar'
              ? 'Autonomous intelligence loop (DETECT → DECIDE → ACT → LEARN) monitoring daily sales, supplier rates, khata collections, and stockout risks.'
              : 'Real-time synthesized operational intelligence across commercial revenue, inventory depletion, cash liquidity, and customer sentiment streams.'}
          </p>
        </div>

        {/* Quick Agent Roster */}
        <div className="glass-card p-3.5 rounded-xl border border-[#e6e4df] space-y-2 min-w-[260px] bg-[#f8f7f2]">
          <div className="flex items-center justify-between text-[11px] text-stone-600 font-mono font-bold">
            <span>{storeMode === 'vyapar' ? 'BUSINESS AGENTS' : 'VIRTUAL TEAM ROSTER'}</span>
            <span className="text-emerald-700 font-bold">6/6 ONLINE</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {agents.map((agent) => (
              <AgentBadge 
                key={agent.id} 
                agent={agent} 
                size="sm" 
                showRole={false}
                onClick={() => onInspectAgent ? onInspectAgent(agent.id) : onNavigateToTab(agent.id === 'orchestrator' ? 'executive' : agent.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Proactive Predictive Alert Banner for Vyapar Mode */}
      {storeMode === 'vyapar' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-stone-950 shrink-0">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-amber-900 uppercase">
                  Proactive Predictive Alert
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                  +38% Velocity Spike
                </span>
              </div>
              <p className="text-xs text-stone-800 font-medium">
                <strong>Finolex Copper Wire</strong> sales surged by <strong>38% in last 10 days</strong>. Stock exhausts in <strong>4 days</strong>. Order <strong>150 rolls</strong> to prevent <strong>₹45,000+</strong> lost sales.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onExecuteAction('vyapar_reorder_copper', { qty: 150, item: 'Finolex Copper Wire' })}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 shrink-0"
          >
            <span>Order 150 Rolls</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Primary Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {storeMode === 'vyapar' ? (
          <>
            {/* Yesterday Sales */}
            <div 
              onClick={() => onNavigateToTab('sales')}
              className="glass-card p-5 rounded-2xl border border-[#e6e4df] space-y-2 bg-white shadow-xs cursor-pointer hover:border-emerald-500 transition group"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-stone-600 group-hover:text-stone-900 transition">Yesterday&apos;s Sales</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-stone-900">₹48,750</span>
                <span className="text-xs font-bold text-emerald-700 font-mono">+₹11,430 Profit</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">38 transactions (Cash + UPI)</p>
            </div>

            {/* Today Forecast */}
            <div 
              onClick={() => onNavigateToTab('sales')}
              className="glass-card p-5 rounded-2xl border border-[#e6e4df] space-y-2 bg-white shadow-xs cursor-pointer hover:border-indigo-400 transition group"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-stone-600 group-hover:text-stone-900 transition">Today&apos;s Forecast</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-700">
                  <Clock className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-mono text-stone-900">₹52k – ₹58k</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Based on recent Thane velocity</p>
            </div>

            {/* Outstanding Udhar */}
            <div 
              onClick={() => onExecuteAction('vyapar_reminders', { total: 72500 })}
              className="glass-card p-5 rounded-2xl border border-[#e6e4df] space-y-2 bg-white shadow-xs cursor-pointer hover:border-rose-400 transition group"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-stone-600 group-hover:text-stone-900 transition">Outstanding Udhar</span>
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-700">
                  <Wallet className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-rose-900">₹72,500</span>
                <span className="text-xs text-rose-700 font-mono font-bold">3 Accounts</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Sharma Const. ₹32k (92% recovery)</p>
            </div>

            {/* Low Stock Reorder */}
            <div 
              onClick={() => onExecuteAction('vyapar_supplier_modal', { item: '1-inch PVC Pipe' })}
              className="glass-card p-5 rounded-2xl border border-[#e6e4df] space-y-2 bg-white shadow-xs cursor-pointer hover:border-amber-400 transition group"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-stone-600 group-hover:text-stone-900 transition">Critical Low Stock</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700">
                  <Boxes className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-mono text-amber-800">1-inch PVC</span>
                <span className="text-xs text-rose-700 font-mono font-bold">3 Days Left</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Mahesh Traders: ₹12,450 (Save ₹670)</p>
            </div>
          </>
        ) : (
          <>
            {/* Health Score */}
            <div 
              onClick={() => onInspectAgent ? onInspectAgent('orchestrator') : onNavigateToTab('executive')}
              className="glass-card p-5 rounded-2xl border border-[#e6e4df] space-y-2 bg-white shadow-xs cursor-pointer hover:border-emerald-500 transition group"
              title="Inspect Chief Operating Officer Orchestrator Agent"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-stone-600 group-hover:text-stone-900 transition">Business Health Score</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700">
                  <Zap className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-stone-900">{healthScore}</span>
                <span className="text-xs text-stone-500 font-bold">/ 100</span>
              </div>
              <div className="w-full bg-[#e8e6de] rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${healthScore}%` }}></div>
              </div>
              <p className="text-[10px] text-stone-500 font-medium pt-0.5">Click to inspect COO reasoning</p>
            </div>

            {/* Revenue */}
            <div 
              onClick={() => onNavigateToTab('sales')}
              className="glass-card p-5 rounded-2xl border border-[#e6e4df] space-y-2 bg-white shadow-xs cursor-pointer hover:border-emerald-500 transition group"
              title="Navigate to Sales Intelligence & Revenue Analytics"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-stone-600 group-hover:text-stone-900 transition">August Revenue</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-stone-900">
                  ₹{latestSales.revenue.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-rose-600 font-mono">-23.4%</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Target: ₹{latestSales.target.toLocaleString()}</p>
            </div>

            {/* Stockout Risk */}
            <div 
              onClick={() => onNavigateToTab('inventory')}
              className="glass-card p-5 rounded-2xl border border-[#e6e4df] space-y-2 bg-white shadow-xs cursor-pointer hover:border-amber-400 transition"
              title="Navigate to Inventory & Supply Chain Operations"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-stone-600">Critical Stockout Risk</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700">
                  <Boxes className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-amber-800">{criticalSkus.length} SKUs</span>
                <span className="text-xs text-amber-700 font-mono font-bold">&lt; 4 Days</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">SKU-884 (42 units left)</p>
            </div>

            {/* Cash Buffer */}
            <div 
              onClick={() => onNavigateToTab('finance')}
              className="glass-card p-5 rounded-2xl border border-[#e6e4df] space-y-2 bg-white shadow-xs cursor-pointer hover:border-indigo-400 transition"
              title="Navigate to Finance & Liquidity Control"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-stone-600">Net Cash Buffer</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-700">
                  <Wallet className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-stone-900">₹11.36L</span>
                <span className="text-xs text-stone-500 font-medium">Safe</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">OpEx Loss: -₹18,02,912</p>
            </div>
          </>
        )}
      </div>

      {/* Shelf Space vs Margin Card (Rendered for Vyapar mode) */}
      {storeMode === 'vyapar' && (
        <VyaparShelfSpaceCard 
          onExecuteRecommendation={() => onExecuteAction('vyapar_reallocate_shelf', { profitTarget: 24000 })}
        />
      )}

      {/* Recommendations & Agent Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-700" />
              <span>Prioritized Strategic Action Feed (COO Agent)</span>
            </h3>
            <span className="text-xs text-stone-500 font-mono font-bold">{recommendations.length} Decisions Pending</span>
          </div>

          {recommendations.map((rec) => {
            const isCritical = rec.priority === 'CRITICAL';
            return (
              <div 
                key={rec.id}
                className={`glass-card p-5 rounded-2xl space-y-4 border transition-all bg-white shadow-xs ${
                  isCritical ? 'border-rose-300' : 'border-[#e6e4df]'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        rec.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        rec.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        {rec.priority}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono font-bold">Confidence: {rec.confidenceScore}%</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-stone-900">{rec.title}</h4>
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-medium">{rec.executiveSummary}</p>

                {rec.crossFunctionalConflictResolved && (
                  <div className="p-3 rounded-xl bg-[#f3f2ec] border border-[#e5e3dc] text-xs space-y-1">
                    <span className="text-amber-800 font-mono text-[10px] font-bold block">COO CONFLICT RESOLUTION SYNTHESIS:</span>
                    <p className="text-stone-800 font-medium">{rec.crossFunctionalConflictResolved}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#e6e4df]">
                  <div className="text-xs space-y-0.5 font-mono">
                    <span className="text-stone-500 block text-[10px]">FINANCIAL BENEFIT:</span>
                    <span className="font-bold text-emerald-800">{rec.impactEstimate.financial}</span>
                  </div>

                  <button
                    onClick={() => onExecuteAction(rec.primaryAction.actionType, rec.primaryAction.payload)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-[#d97757] hover:bg-[#c25e3f] text-white transition shadow-xs"
                  >
                    <span>{rec.primaryAction.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (1 col): Insights */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-700" />
            <span>Specialized Domain Insights</span>
          </h3>

          <div className="space-y-3">
            {insights.map((ins) => {
              const agent = agents.find(a => a.id === ins.agentId);
              return (
                <div key={ins.id} className="glass-card p-4 rounded-xl space-y-2 border border-[#e6e4df] bg-white shadow-xs">
                  <div className="flex items-center justify-between">
                    {agent && <AgentBadge agent={agent} size="sm" showRole={false} />}
                    <span className="text-[10px] text-stone-500 font-mono">{ins.timestamp}</span>
                  </div>
                  <h5 className="text-xs font-bold text-stone-900">{ins.title}</h5>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-medium">{ins.summary}</p>
                  {ins.suggestedAction && (
                    <button
                      onClick={() => onExecuteAction(ins.suggestedAction!.actionType, ins.suggestedAction!.payload)}
                      className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Action: {ins.suggestedAction.label}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
