'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { ExecutiveSummaryView } from '../../components/dashboard/ExecutiveSummaryView';
import { SalesAgentView } from '../../components/dashboard/SalesAgentView';
import { InventoryAgentView } from '../../components/dashboard/InventoryAgentView';
import { FinanceAgentView } from '../../components/dashboard/FinanceAgentView';
import { CustomerAgentView } from '../../components/dashboard/CustomerAgentView';
import { MarketAgentView } from '../../components/dashboard/MarketAgentView';
import { MultiAgentChatConsole } from '../../components/dashboard/MultiAgentChatConsole';
import { DataIntegrationHub } from '../../components/dashboard/DataIntegrationHub';
import { ActionConfirmationModal } from '../../components/dashboard/ActionConfirmationModal';
import { AgentInspectorDrawer } from '../../components/dashboard/AgentInspectorDrawer';

import { 
  INITIAL_AGENTS, 
  INITIAL_DATA_SOURCES, 
  INITIAL_SKUS, 
  MONTHLY_SALES_HISTORY, 
  EXPENSE_LEDGER, 
  CUSTOMER_FEEDBACK_FEED, 
  MARKET_SIGNALS, 
  INITIAL_STRATEGIC_RECOMMENDATIONS,
  VYAPAR_AGENTS,
  VYAPAR_SKUS,
  VYAPAR_STORE_DATA,
  VYAPAR_PITCH_STEPS
} from '../../lib/mockData';
import { 
  calculateBusinessHealthScore, 
  generateAgentInsights, 
  processNaturalLanguageQuery,
  queryLiveGeminiAgent 
} from '../../lib/agentEngine';
import { 
  SKUItem, 
  SalesRecord, 
  ExpenseRecord, 
  CustomerFeedback, 
  MarketSignal, 
  ChatMessage, 
  StrategicRecommendation,
  AgentMetadata,
  LanguageMode,
  SupplierComparisonQuote
} from '../../lib/types';
import { VyaparPitchDemoBanner } from '../../components/dashboard/VyaparPitchDemoBanner';
import { VyaparSupplierModal } from '../../components/dashboard/VyaparSupplierModal';
import { VyaparCustomerRecoveryModal } from '../../components/dashboard/VyaparCustomerRecoveryModal';
import { CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const [storeMode, setStoreMode] = useState<'vyapar' | 'apex'>('vyapar');
  const [activeTab, setActiveTab] = useState('executive');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pitch Stepper & Voice States
  const [pitchStepIndex, setPitchStepIndex] = useState(0);
  const [language, setLanguage] = useState<LanguageMode>('hinglish');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [activeLoopPhase, setActiveLoopPhase] = useState<'DETECT' | 'DECIDE' | 'ACT' | 'LEARN'>('DETECT');

  // Modals & Drawers State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVyaparSupplierModalOpen, setIsVyaparSupplierModalOpen] = useState(false);
  const [isVyaparRecoveryModalOpen, setIsVyaparRecoveryModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalActionType, setModalActionType] = useState('');
  const [modalPayload, setModalPayload] = useState<Record<string, any>>({});

  const [inspectingAgent, setInspectingAgent] = useState<AgentMetadata | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Dynamic Datasets
  const [skus, setSkus] = useState<SKUItem[]>(VYAPAR_SKUS);
  const [salesHistory, setSalesHistory] = useState<SalesRecord[]>(MONTHLY_SALES_HISTORY);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(EXPENSE_LEDGER);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>(CUSTOMER_FEEDBACK_FEED);
  const [signals, setSignals] = useState<MarketSignal[]>(MARKET_SIGNALS);
  const [dataSources, setDataSources] = useState(INITIAL_DATA_SOURCES);
  const [recommendations, setRecommendations] = useState<StrategicRecommendation[]>(INITIAL_STRATEGIC_RECOMMENDATIONS);

  // Active Agents based on store mode
  const currentAgents = storeMode === 'vyapar' ? VYAPAR_AGENTS : INITIAL_AGENTS;

  // Initial Welcome Chat Message for Vyapar AI
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'vyapar-welcome-1',
      sender: 'coo',
      finalAnswer: `### 🌅 Good morning Rajesh ji!

Welcome to **Vyapar AI** — your 24/7 Autonomous AI Business Partner for **Rajesh Hardware & Electricals (Thane West)**.

| Yesterday's Sales | Estimated Net Profit | Outstanding Udhar | Today's Expected Forecast |
| :--- | :--- | :--- | :--- |
| **₹48,750** | **₹11,430** (23.4%) | **₹72,500** (3 Customer Accounts) | **₹52,000 – ₹58,000** |

---

### ⚡ 3 Proactive Alerts You Should Know:
1. **📦 Low Stock Alert**: Your **1-inch PVC conduit pipe** will run out in **3 days** (4 bundles left).
2. **💸 Overdue Payments**: **Two customers** have overdue payments (**Sharma Construction ₹32,000** & **Sai Electric ₹21,500**).
3. **📈 Revenue Forecast**: Based on recent Thane construction demand, today's counter revenue is expected between **₹52,000 to ₹58,000**.

*Ask anything below (or speak in Hinglish/Marathi/English), or click through the 5-step Pitch Demo bar above!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'Haan, low-stock item order kar do', actionType: 'vyapar_supplier_modal', payload: { item: '1-inch PVC Pipe' } },
        { label: 'Kaunse customers ne payment nahi kiya?', actionType: 'query', payload: { query: 'Kaunse customers ne payment nahi kiya?' } },
        { label: 'Business improve kaise kar sakte hai?', actionType: 'query', payload: { query: 'Business improve kaise kar sakte hai?' } }
      ]
    }
  ]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);

  // Health score calculation
  const healthScore = calculateBusinessHealthScore(skus, salesHistory, expenses, feedbacks);
  const activeInsights = generateAgentInsights(skus, salesHistory, expenses, feedbacks, signals);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/login';
  };

  // Periodic subtle live simulation ping
  useEffect(() => {
    if (!isLiveSimulating) return;
    const interval = setInterval(() => {
      setSkus(prev => prev.map(s => {
        if (s.id === 'SKU-884' && s.currentStock > 10) {
          const nextStock = s.currentStock - 1;
          return { ...s, currentStock: nextStock, daysUntilStockout: Math.max(1, Math.round(nextStock / s.dailyDepletionRate)) };
        }
        return s;
      }));
    }, 25000);
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  const handleInspectAgent = (agentId: string) => {
    const found = INITIAL_AGENTS.find(a => a.id === agentId);
    if (found) {
      setInspectingAgent(found);
      setIsDrawerOpen(true);
    }
  };

  const handlePitchStepSelect = (stepIdx: number, promptText: string) => {
    setPitchStepIndex(stepIdx);
    if (stepIdx === 0) setActiveLoopPhase('DETECT');
    else if (stepIdx === 1) setActiveLoopPhase('DECIDE');
    else if (stepIdx === 2) setActiveLoopPhase('ACT');
    else if (stepIdx === 3) setActiveLoopPhase('DECIDE');
    else if (stepIdx === 4) setActiveLoopPhase('DETECT');

    handleSendMessage(promptText);
  };

  const handleSpeechVoiceReadout = (text?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_\[\]()|]/g, ' ').replace(/\s+/g, ' ').slice(0, 350);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSupplierOrderConfirm = (supplier: SupplierComparisonQuote) => {
    setSkus(prev => prev.map(s => s.id === 'SKU-PVC-1IN' ? { ...s, currentStock: s.currentStock + 50, daysUntilStockout: 41, status: 'optimal' } : s));
    showToast(`Purchase Order PO-2026-PVC101 created with ${supplier.name} for ₹${supplier.quotedPrice.toLocaleString('en-IN')}. Delivery ${supplier.deliveryTime}.`);
    setActiveLoopPhase('LEARN');

    const poConfirmationMsg: ChatMessage = {
      id: `po-${Date.now()}`,
      sender: 'coo',
      fileName: 'purchase-order-po-2026-pvc101.md',
      finalAnswer: `### ✅ Purchase Order PO-2026-PVC101 Created!

- **Vendor**: ${supplier.name} (${supplier.location})
- **Item**: 1-inch Heavy PVC Conduit Pipe (50 bundles)
- **Agreed Net Price**: ₹${supplier.quotedPrice.toLocaleString('en-IN')} (Saved ₹${supplier.potentialSaving || 670})
- **Expected Delivery**: ${supplier.deliveryTime}

Delivery status will be tracked automatically upon shop arrival tomorrow morning.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      keyDataPoints: [
        { label: 'Vendor', value: supplier.name },
        { label: 'PO Total', value: `₹${supplier.quotedPrice.toLocaleString('en-IN')}` },
        { label: 'Delivery', value: supplier.deliveryTime }
      ]
    };
    setMessages(prev => [...prev, poConfirmationMsg]);
  };

  const handleRecoveryRemindersSent = (sentCount: number, recoveredAmount: number) => {
    showToast(`WhatsApp payment reminders sent to ${sentCount} trade debtors! Expected recovery ₹${recoveredAmount.toLocaleString('en-IN')}.`);
    setActiveLoopPhase('LEARN');

    const waConfirmationMsg: ChatMessage = {
      id: `wa-${Date.now()}`,
      sender: 'coo',
      fileName: 'whatsapp-recovery-dispatched.md',
      finalAnswer: `### 📱 WhatsApp Payment Reminders Dispatched!

- **Recipients**: Sharma Construction (₹32,000), Sai Electric Works (₹21,500), Om Enterprises (₹19,000)
- **Total Recovery Target**: ₹${recoveredAmount.toLocaleString('en-IN')}
- **UPI Deep-Link**: Integrated BharatPe dynamic settlement URL
- **Behavioral Learning**: Sharma Construction historically clears payment within 24 hours of WhatsApp notification.

Incoming bank/UPI settlements will be reconciled against the khata ledger automatically.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      keyDataPoints: [
        { label: 'Reminders Sent', value: `${sentCount} Accounts` },
        { label: 'Total Inflow Target', value: `₹${recoveredAmount.toLocaleString('en-IN')}` },
        { label: 'Expected Today', value: '₹32,000 (Sharma)' }
      ]
    };
    setMessages(prev => [...prev, waConfirmationMsg]);
  };

  const handleActionClick = (actionType: string, payload: any) => {
    if (actionType === 'navigate') {
      if (payload.tab) setActiveTab(payload.tab);
      return;
    }
    if (actionType === 'query') {
      if (payload.query) {
        handleSendMessage(payload.query);
        setActiveTab('chat');
      }
      return;
    }
    if (actionType === 'vyapar_supplier_modal') {
      setIsVyaparSupplierModalOpen(true);
      return;
    }
    if (actionType === 'vyapar_reminders' || actionType === 'vyapar_send_reminders') {
      setIsVyaparRecoveryModalOpen(true);
      return;
    }
    if (actionType === 'vyapar_create_po') {
      const supplier = payload.supplier || 'Mahesh Traders';
      const amount = payload.amount || 12450;
      setSkus(prev => prev.map(s => s.id === 'SKU-PVC-1IN' ? { ...s, currentStock: s.currentStock + 50, daysUntilStockout: 41, status: 'optimal' } : s));
      showToast(`Purchase Order PO-2026-PVC101 created for ${supplier} (₹${amount.toLocaleString('en-IN')}). Delivery tomorrow morning!`);
      setActiveLoopPhase('ACT');
      return;
    }
    if (actionType === 'vyapar_reallocate_shelf') {
      showToast('Floor space reallocated: LED frontage +18%, Pumps to catalog. Projected profit +₹24,000/mo!');
      setActiveLoopPhase('ACT');
      return;
    }
    if (actionType === 'vyapar_reorder_copper') {
      setSkus(prev => prev.map(s => s.id === 'SKU-COPPER-25' ? { ...s, currentStock: s.currentStock + 150, daysUntilStockout: 54, status: 'optimal' } : s));
      showToast('Purchase Order for 150 rolls of Finolex copper wire issued. Protected ₹45,000+ in sales!');
      setActiveLoopPhase('ACT');
      return;
    }

    const titleMap: Record<string, string> = {
      reorder: `Issue Emergency Purchase Order for ${payload.skuId || 'SKU-884'}`,
      discount: `Activate 50% Flash Clearance Bundle on ${payload.skuId || 'SKU-405'}`,
      cut_expense: `Renegotiate Carrier SLA & Cap Express Freight Budget`,
      contact_customer: `Dispatch Priority Apology & Voucher to Wholesale Accounts`,
      adjust_price: `Launch Value Bundle to Neutralize Competitor Price Cut`
    };

    setModalTitle(titleMap[actionType] || `Execute Strategic Action: ${actionType}`);
    setModalActionType(actionType);
    setModalPayload(payload || {});
    setIsModalOpen(true);
  };

  const handleConfirmExecuteAction = () => {
    const actionType = modalActionType;
    const payload = modalPayload;

    if (actionType === 'reorder') {
      const skuId = payload.skuId || 'SKU-884';
      const qty = payload.qty || 250;
      setSkus(prev => prev.map(s => s.id === skuId ? { ...s, currentStock: s.currentStock + qty, daysUntilStockout: Math.round((s.currentStock + qty) / s.dailyDepletionRate), status: 'optimal' } : s));
      setRecommendations(prev => prev.filter(r => r.id !== 'rec-001'));
      showToast(`Purchase Order issued! +${qty} units restocked for ${skuId}.`);
    } 
    else if (actionType === 'discount') {
      const skuId = payload.skuId || 'SKU-405';
      setSkus(prev => prev.map(s => s.id === skuId ? { ...s, workingCapitalLocked: Math.round(s.workingCapitalLocked * 0.3), status: 'optimal' } : s));
      setRecommendations(prev => prev.filter(r => r.id !== 'rec-002'));
      showToast(`Flash discount activated! Stagnant stock liquidated.`);
    }
    else if (actionType === 'cut_expense') {
      setExpenses(prev => prev.map(e => e.id === 'exp-101' ? { ...e, amount: 360000, status: 'normal' } : e));
      setRecommendations(prev => prev.filter(r => r.id !== 'rec-003'));
      showToast(`Carrier SLA updated. Bhiwandi freight capped at ₹3,60,000.`);
    }
    else if (actionType === 'contact_customer') {
      setFeedbacks(prev => prev.map(f => ({ ...f, resolutionStatus: 'resolved' })));
      showToast(`Apology vouchers dispatched to wholesale clients via WhatsApp API.`);
    }
    else if (actionType === 'adjust_price') {
      setSignals(prev => prev.map(s => s.category === 'competitor_pricing' ? { ...s, impactScore: 0 } : s));
      showToast(`Dynamic pricing bundle activated. Competitor undercutting neutralized.`);
    }
    else {
      showToast(`Strategic decision "${actionType}" authorized & executed.`);
    }
  };

  const handleSendMessage = async (queryText: string, targetAgentId?: string | null) => {
    if (activeTab !== 'chat') setActiveTab('chat');
    setIsAgentThinking(true);

    try {
      const response = await queryLiveGeminiAgent(
        queryText,
        skus,
        salesHistory,
        expenses,
        feedbacks,
        signals,
        targetAgentId
      );
      setMessages(prev => [...prev, response]);

      if (isVoiceEnabled && response.finalAnswer) {
        handleSpeechVoiceReadout(response.finalAnswer);
      }
    } catch (err) {
      console.error('Gemini query error:', err);
      showToast('Live Gemini API error. Please verify network connection.');
    } finally {
      setIsAgentThinking(false);
    }
  };

  const handleTriggerSimulatedEvent = (eventType: string) => {
    if (eventType === 'sales_spike') {
      setSkus(prev => prev.map(s => s.id === 'SKU-884' ? { ...s, currentStock: Math.max(2, s.currentStock - 30), daysUntilStockout: 1, status: 'critical' } : s));
      showToast(`POS Event: +50 orders processed for SKU-884! Stock depleted.`);
    } 
    else if (eventType === 'whatsapp_complaint') {
      const newFb: CustomerFeedback = { id: `fb-${Date.now()}`, channel: 'whatsapp', customerName: 'Juhu Heritage Lounge', date: 'Just now', message: 'Where is our delivery consignment?', sentiment: 'negative', category: 'shipping', resolutionStatus: 'open' };
      setFeedbacks(prev => [newFb, ...prev]);
      showToast(`Event: Urgent WhatsApp complaint received from Juhu client.`);
    } 
    else if (eventType === 'logistics_hike') {
      setExpenses(prev => prev.map(e => e.id === 'exp-101' ? { ...e, amount: e.amount + 180000, status: 'over_budget' } : e));
      showToast(`Event: Express freight surcharge +₹1,80,000 logged.`);
    }
    else if (eventType === 'competitor_promo') {
      const newSig: MarketSignal = { id: `sig-${Date.now()}`, source: 'Crawler Alert', topic: 'Competitor Promo', title: 'Blue Tokai slashed coffee price by 25%', impactScore: -4, date: 'Today', category: 'competitor_pricing', summary: 'Under-cutting SKU-884 at ₹2,150/kg across Mumbai.' };
      setSignals(prev => [newSig, ...prev]);
      showToast(`Event: Market crawler detected 25% competitor price cut.`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-amber-500/20 selection:text-amber-900">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-card px-4 py-3 rounded-xl border border-amber-600 bg-white shadow-2xl text-xs font-bold text-amber-950 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-amber-700" />
          <span>{toastMessage}</span>
        </div>
      )}


      {/* Action Confirmation Modal */}
      <ActionConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmExecuteAction}
        actionTitle={modalTitle}
        actionType={modalActionType}
        payload={modalPayload}
      />

      {/* Vyapar Supplier Reorder Modal */}
      <VyaparSupplierModal 
        isOpen={isVyaparSupplierModalOpen}
        onClose={() => setIsVyaparSupplierModalOpen(false)}
        onConfirmOrder={handleSupplierOrderConfirm}
      />

      {/* Vyapar Customer WhatsApp Recovery Modal */}
      <VyaparCustomerRecoveryModal 
        isOpen={isVyaparRecoveryModalOpen}
        onClose={() => setIsVyaparRecoveryModalOpen(false)}
        onSendReminders={handleRecoveryRemindersSent}
      />

      {/* Agent Inspector Drawer */}
      <AgentInspectorDrawer 
        agent={inspectingAgent}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Enterprise Collapsible Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        agents={currentAgents}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        healthScore={healthScore}
        onShowToast={showToast}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          agents={currentAgents}
          isLiveSimulating={isLiveSimulating}
          setIsLiveSimulating={setIsLiveSimulating}
          healthScore={healthScore}
          storeMode={storeMode}
          onToggleStoreMode={(mode) => {
            setStoreMode(mode);
            if (mode === 'vyapar') {
              setSkus(VYAPAR_SKUS);
            } else {
              setSkus(INITIAL_SKUS);
            }
          }}
          onSignOut={handleSignOut}
          onShowToast={showToast}
        />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Judges Pitch Stepper Banner */}
          <VyaparPitchDemoBanner 
            currentStepIndex={pitchStepIndex}
            onSelectStep={handlePitchStepSelect}
            language={language}
            onLanguageChange={(lang) => {
              setLanguage(lang);
              showToast(`Language switched to ${lang.toUpperCase()}`);
            }}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => {
              const next = !isVoiceEnabled;
              setIsVoiceEnabled(next);
              showToast(next ? 'AI Voice Readout Active' : 'AI Voice Readout Muted');
            }}
            onTriggerMic={() => {
              setActiveTab('chat');
              showToast('Microphone active. Talk to Vyapar AI in Hinglish/Marathi/English!');
            }}
            activeLoopPhase={activeLoopPhase}
          />

          {activeTab === 'executive' && (
            <ExecutiveSummaryView 
              agents={currentAgents}
              recommendations={recommendations}
              insights={activeInsights}
              skus={skus}
              sales={salesHistory}
              expenses={expenses}
              feedbacks={feedbacks}
              healthScore={healthScore}
              storeMode={storeMode}
              onExecuteAction={handleActionClick}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onInspectAgent={handleInspectAgent}
            />
          )}

          {activeTab === 'sales' && (
            <SalesAgentView 
              salesHistory={salesHistory}
              skus={skus}
              onExecuteAction={handleActionClick}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryAgentView 
              skus={skus}
              onExecuteAction={handleActionClick}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceAgentView 
              expenses={expenses}
              onExecuteAction={handleActionClick}
            />
          )}

          {activeTab === 'customer' && (
            <CustomerAgentView 
              feedbacks={feedbacks}
              onExecuteAction={handleActionClick}
            />
          )}

          {activeTab === 'market' && (
            <MarketAgentView 
              signals={signals}
            />
          )}

          {activeTab === 'chat' && (
            <MultiAgentChatConsole 
              messages={messages}
              agents={currentAgents}
              isLoading={isAgentThinking}
              storeMode={storeMode}
              onSendMessage={handleSendMessage}
              onExecuteAction={handleActionClick}
            />
          )}

          {activeTab === 'integrations' && (
            <DataIntegrationHub 
              dataSources={dataSources}
              onTriggerSimulatedEvent={handleTriggerSimulatedEvent}
            />
          )}
        </main>
      </div>
    </div>
  );
}
