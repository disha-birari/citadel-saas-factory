import { 
  AgentId, 
  SKUItem, 
  SalesRecord, 
  ExpenseRecord, 
  CustomerFeedback, 
  MarketSignal,
  AgentInsight,
  StrategicRecommendation,
  MultiAgentReasoningStep,
  ChatMessage
} from './types';

export function calculateBusinessHealthScore(
  skus: SKUItem[], 
  sales: SalesRecord[], 
  expenses: ExpenseRecord[], 
  feedbacks: CustomerFeedback[]
): number {
  let score = 100;
  
  // Stockout penalty
  const criticalSkus = skus.filter(s => s.status === 'critical').length;
  score -= criticalSkus * 8;

  // Sales target penalty
  const currentMonthSales = sales[sales.length - 1];
  if (currentMonthSales && currentMonthSales.revenue < currentMonthSales.target) {
    const deficitRatio = (currentMonthSales.target - currentMonthSales.revenue) / currentMonthSales.target;
    score -= Math.round(deficitRatio * 25);
  }

  // Expense overrun penalty
  const overBudgetExpenses = expenses.filter(e => e.status === 'over_budget').length;
  score -= overBudgetExpenses * 6;

  // Negative customer feedback penalty
  const negativeFeedbacks = feedbacks.filter(f => f.sentiment === 'negative').length;
  score -= negativeFeedbacks * 4;

  return Math.max(30, Math.min(99, score));
}

export function generateAgentInsights(
  skus: SKUItem[],
  sales: SalesRecord[],
  expenses: ExpenseRecord[],
  feedbacks: CustomerFeedback[],
  signals: MarketSignal[]
): AgentInsight[] {
  const insights: AgentInsight[] = [];

  // 1. Sales Agent Insight
  const latestSales = sales[sales.length - 1];
  insights.push({
    id: 'ins-sales-1',
    agentId: 'sales',
    title: 'Monthly Revenue Target Variance (-23.4%)',
    summary: `August revenue (₹31,84,000) missed target (₹41,60,000) primarily due to stock depletion in top revenue driver SKU-884 and competitor price undercutting in Mumbai.`,
    detailedAnalysis: `Sales volume fell by 28% in the last 10 days of the month. Monsooned Malabar Arabica (SKU-884) accounts for 42% of revenue shortfall.`,
    severity: 'high',
    timestamp: '10 mins ago',
    metrics: [
      { label: 'August Revenue', value: '₹31,84,000', change: '-23.4% vs target' },
      { label: 'Orders Processed', value: '1,040', change: '-18.1% MoM' },
      { label: 'Avg Order Value', value: '₹3,061.54', change: '+2.5%' }
    ],
    suggestedAction: {
      label: 'Run 10% Loyalty Flash Campaign on Chai Flasks',
      actionType: 'discount',
      payload: { targetCategory: 'Drinkware & Living' }
    }
  });

  // 2. Inventory Agent Insight
  const criticalCount = skus.filter(s => s.status === 'critical').length;
  insights.push({
    id: 'ins-inv-1',
    agentId: 'inventory',
    title: `Critical Stockout Alert (${criticalCount} SKUs < 4 Days Stock)`,
    summary: `SKU-884 (42 units left, 3 days) & SKU-990 (18 units left, 4 days) are on track to completely exhaust inventory before next scheduled restock from Western Ghats and Lamington Road.`,
    detailedAnalysis: `Daily depletion rate of SKU-884 surged to 14.2 units/day. Reorder lead time is 36 hours via Mumbai air cargo or 5 days via road transport.`,
    severity: 'critical',
    timestamp: 'Just now',
    metrics: [
      { label: 'Stockout Risk SKUs', value: `${criticalCount} Items`, change: 'Action Required' },
      { label: 'Working Capital Locked in Dead Stock', value: '₹2,26,800', change: '540 units SKU-405' },
      { label: 'Optimal EOQ Reorder', value: '250 units', change: 'SKU-884' }
    ],
    suggestedAction: {
      label: 'Execute Emergency Air-Cargo Reorder',
      actionType: 'reorder',
      payload: { skuId: 'SKU-884', qty: 250 }
    }
  });

  // 3. Finance Agent Insight
  insights.push({
    id: 'ins-fin-1',
    agentId: 'finance',
    title: 'Bhiwandi Freight Expense Variance (+86.7% Over Budget)',
    summary: `Logistics expenses reached ₹6,72,000 against a ₹3,60,000 budget due to uncoordinated monsoon air cargo orders and courier surcharge hikes.`,
    detailedAnalysis: `Operating margin compressed to 18.2% (down from 26.5% in July). Net cash flow remains positive at ₹11,36,000, but liquidity buffer narrowed.`,
    severity: 'medium',
    timestamp: '25 mins ago',
    metrics: [
      { label: 'Logistics Cost Variance', value: '+₹3,12,000', change: '+86.7% Over' },
      { label: '30-Day Liquidity Buffer', value: '₹11,36,000', change: 'Safe (>₹8L min)' },
      { label: 'Gross Profit Margin', value: '41.8%', change: '-4.2%' }
    ],
    suggestedAction: {
      label: 'Consolidate Carrier SLA',
      actionType: 'cut_expense',
      payload: { expId: 'exp-101' }
    }
  });

  // 4. Customer Experience Agent Insight
  const negCount = feedbacks.filter(f => f.sentiment === 'negative').length;
  insights.push({
    id: 'ins-cust-1',
    agentId: 'customer',
    title: `WhatsApp Complaint Spike (${negCount} Unresolved Incidents)`,
    summary: `Negative sentiment reached 28% in WhatsApp conversations. Primary drivers are monsoon shipping delays along the Bhiwandi corridor and courier fee jumps.`,
    detailedAnalysis: `Key keyphrases extracted: "delayed shipment", "out of stock", "delivery fee jump". 3 VIP wholesale café clients in South Bombay flagged high churn risk.`,
    severity: 'high',
    timestamp: '1 hour ago',
    metrics: [
      { label: 'CSAT Score', value: '78 / 100', change: '-8 pts' },
      { label: 'WhatsApp Negative Sentiment', value: '28%', change: '+12%' },
      { label: 'High Risk VIP Accounts', value: '3 Clients', change: 'Alert' }
    ],
    suggestedAction: {
      label: 'Send Priority Stock Guarantee to VIP Clients',
      actionType: 'contact_customer',
      payload: { clientIds: ['Café Mondegar', 'Irani Café'] }
    }
  });

  // 5. Market Research Agent Insight
  insights.push({
    id: 'ins-mkt-1',
    agentId: 'market',
    title: 'Competitor Price Cut Detected (Blue Tokai -20%)',
    summary: `Main competitor Blue Tokai launched a promotional rate of ₹2,280/kg on roasted coffee beans, undercutting our ₹2,850 listing across Mumbai outlets.`,
    detailedAnalysis: `Web crawler detected promotion running through Sept 10. Raw Arabica commodity futures at Karnataka auctions also rose +14% due to Western Ghats monsoon disruptions.`,
    severity: 'medium',
    timestamp: '3 hours ago',
    metrics: [
      { label: 'Competitor Promo Price', value: '₹2,280 / kg', change: '-20% Flash' },
      { label: 'Raw Commodity Index', value: 'Arabica +14%', change: 'Cost Pressure' },
      { label: 'Office Category Demand', value: '+28%', change: 'Positive Tailwind' }
    ],
    suggestedAction: {
      label: 'Match Promo with Value Bundle',
      actionType: 'adjust_price',
      payload: { category: 'Coffee' }
    }
  });

  return insights;
}

export async function queryLiveGeminiAgent(
  query: string,
  skus: SKUItem[],
  sales: SalesRecord[],
  expenses: ExpenseRecord[],
  feedbacks: CustomerFeedback[],
  signals: MarketSignal[],
  targetAgentId?: string | null
): Promise<ChatMessage> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, skus, sales, expenses, feedbacks, signals, targetAgentId })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.finalAnswer) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Live Gemini API query failed, falling back to local multi-agent synthesis:', err);
  }

  return processNaturalLanguageQuery(query, skus, sales, expenses, feedbacks, signals);
}

export function processNaturalLanguageQuery(
  query: string,
  skus: SKUItem[],
  sales: SalesRecord[],
  expenses: ExpenseRecord[],
  feedbacks: CustomerFeedback[],
  signals: MarketSignal[]
): ChatMessage {
  const normalized = query.toLowerCase();
  const reasoningSteps: MultiAgentReasoningStep[] = [];
  let finalAnswer = "";
  let participatingAgents: AgentId[] = [];
  let keyDataPoints: { label: string; value: string }[] = [];
  let suggestedActions: { label: string; actionType: string; payload: Record<string, any> }[] = [];

  // Timestamp format helper
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ============================================================================
  // VYAPAR AI: RAJESH BHAI (THANE HARDWARE) SCRIPT MILESTONES & HINGLISH QUERIES
  // ============================================================================

  // 1. Morning Briefing: "Aaj shop ka status batao" / "Good morning"
  if (
    normalized.includes('status') && (normalized.includes('aaj') || normalized.includes('shop') || normalized.includes('morning') || normalized.includes('dukan') || normalized.includes('sthiti')) ||
    normalized.includes('shop ka status') ||
    normalized.includes('aaj shop')
  ) {
    participatingAgents = ['orchestrator', 'sales', 'inventory', 'finance'];

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Vyapar AI (Decision Manager)',
      phase: 'data_ingestion',
      thought: 'Ingested shop telemetry for Rajesh Hardware & Electricals (Thane West). Aggregating POS cash/UPI bills, stockout risks, and overdue khata ledger.',
      dataCited: ['Store: Rajesh Hardware (Thane)', 'Sales: ₹48,750', 'Profit: ₹11,430', 'Udhar: ₹72,500'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'sales',
      agentName: 'Sales Agent',
      phase: 'domain_analysis',
      thought: 'Analyzed yesterday transaction volume: 38 customer transactions across counter cash and QR UPI. Projected today forecast is ₹52,000–₹58,000 based on local Thane electrical work orders.',
      dataCited: ['Yesterday Sales: ₹48,750', 'Net Margin: ₹11,430 (23.4%)', 'Today Forecast: ₹52,000–₹58,000'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'inventory',
      agentName: 'Inventory Agent',
      phase: 'domain_analysis',
      thought: 'Stock-out prediction model detected 1-inch Heavy PVC conduit pipe reaching zero inventory within 3 days. Safety threshold is breached.',
      dataCited: ['1-inch PVC Pipe: 4 bundles left', 'Depletion: 1.3 bundles/day', 'Days Remaining: 3'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'finance',
      agentName: 'Finance Agent',
      phase: 'final_synthesis',
      thought: 'Receivables audit flags ₹72,500 locked in customer udhar. 2 accounts (Sharma Construction ₹32,000 and Sai Electric ₹21,500) are overdue.',
      dataCited: ['Pending Receivables: ₹72,500', 'Overdue Debtors: 2'],
      timestamp: nowStr
    });

    finalAnswer = `### 🌅 Good morning Rajesh ji!

Here is your shop status for **Rajesh Hardware & Electricals (Thane West)**:

| Metric | Amount (₹) | Key Highlight |
| :--- | :--- | :--- |
| **Yesterday's Sales** | **₹48,750** | 38 transactions (Cash + BharatPe UPI) |
| **Estimated Net Profit** | **₹11,430** | 23.4% net margin |
| **Outstanding Payments (Udhar)** | **₹72,500** | 3 customer trade accounts |
| **Today's Expected Revenue** | **₹52,000 – ₹58,000** | Based on recent Thane project velocity |

---

### ⚡ I found three things you should know:
1. **📦 Low Stock**: Your **1-inch PVC pipe** will run out in **3 days**.
2. **💸 Overdue Payments**: **Two customers** have overdue payments (**Sharma Construction ₹32,000** & **Sai Electric ₹21,500**).
3. **📈 Revenue Forecast**: Based on recent trends, today's expected revenue is **₹52,000 to ₹58,000**.`;

    keyDataPoints = [
      { label: "Yesterday's Sales", value: "₹48,750" },
      { label: "Net Profit", value: "₹11,430" },
      { label: "Outstanding Udhar", value: "₹72,500" },
      { label: "Today's Forecast", value: "₹52k–₹58k" }
    ];

    suggestedActions = [
      { label: "Haan, low-stock item order kar do", actionType: "vyapar_supplier_modal", payload: { item: "1-inch PVC Pipe" } },
      { label: "Kaunse customers ne payment nahi kiya?", actionType: "query", payload: { query: "Kaunse customers ne payment nahi kiya?" } }
    ];

    return {
      id: `msg-${Date.now()}`,
      sender: 'coo',
      queryText: query,
      fileName: 'morning-shop-briefing.md',
      participatingAgents,
      reasoningSteps,
      finalAnswer,
      keyDataPoints,
      suggestedActions,
      timestamp: nowStr
    };
  }

  // 2. Low-Stock Reorder & 3-Supplier Comparison: "Haan, low-stock item order kar do"
  if (
    normalized.includes('order') && (normalized.includes('low') || normalized.includes('stock') || normalized.includes('pvc') || normalized.includes('kar do') || normalized.includes('haan')) ||
    normalized.includes('supplier') && (normalized.includes('price') || normalized.includes('rate') || normalized.includes('best') || normalized.includes('compare'))
  ) {
    participatingAgents = ['procurement', 'inventory', 'orchestrator'];

    reasoningSteps.push({
      agentId: 'inventory',
      agentName: 'Inventory Agent',
      phase: 'data_ingestion',
      thought: 'Calculated optimal replenishment for 1-inch Heavy PVC Conduit Pipe. Current stock: 4 bundles. Target EOQ: 50 bundles (covers 38 days demand).',
      dataCited: ['SKU-PVC-1IN: 4 bundles', 'Required Replenishment: 50 bundles'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'procurement',
      agentName: 'Procurement Agent',
      phase: 'domain_analysis',
      thought: 'Queried 3 regular wholesale suppliers in Bhiwandi and Thane. Mahesh Traders: ₹12,450, Patel Suppliers: ₹13,120, Shree Enterprises: ₹12,980. Identified ₹670 potential margin savings.',
      dataCited: ['Mahesh Traders: ₹12,450', 'Patel: ₹13,120', 'Shree: ₹12,980', 'Saving: ₹670'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Vyapar AI (Decision Manager)',
      phase: 'final_synthesis',
      thought: 'Selecting Mahesh Traders as the recommended vendor due to verified lowest net price (₹12,450) and guaranteed morning delivery (10:00 AM) to Thane West shop.',
      dataCited: ['Best Vendor: Mahesh Traders', 'Potential Saving: ₹670', 'Delivery: Tomorrow 10:00 AM'],
      timestamp: nowStr
    });

    finalAnswer = `Checking regular suppliers for **1-inch PVC conduit pipe (50 bundles)**:

| Supplier | Location | Quoted Price | Delivery Time | Reliability | Status / Saving |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **⭐ Mahesh Traders** | **Bhiwandi Market** | **₹12,450** | **Tomorrow 10:00 AM** | **98%** | **Best Option (Save ₹670)** |
| Patel Suppliers | Kalwa Naka | ₹13,120 | 2 Days | 91% | +₹670 higher |
| Shree Enterprises | Thane MIDC | ₹12,980 | Tomorrow 6:00 PM | 94% | +₹530 higher |

---

⭐ **Best option**: **Mahesh Traders**  
💰 **Potential saving**: **₹670**  
🚚 **Delivery**: Tomorrow morning before shop opens.

Purchase order is ready. Click below or say *"Order kar do"* to confirm.`;

    keyDataPoints = [
      { label: "Best Supplier", value: "Mahesh Traders" },
      { label: "Best Price", value: "₹12,450" },
      { label: "Direct Savings", value: "₹670" },
      { label: "Expected Delivery", value: "Tomorrow 10 AM" }
    ];

    suggestedActions = [
      { label: "Order kar do (Create PO - ₹12,450)", actionType: "vyapar_create_po", payload: { supplier: "Mahesh Traders", amount: 12450, item: "1-inch PVC Pipe" } }
    ];

    return {
      id: `msg-${Date.now()}`,
      sender: 'coo',
      queryText: query,
      fileName: 'supplier-rate-comparison.md',
      participatingAgents,
      reasoningSteps,
      finalAnswer,
      keyDataPoints,
      suggestedActions,
      timestamp: nowStr
    };
  }

  // 3. Customer Outstanding Khata: "Kaunse customers ne payment nahi kiya?"
  if (
    normalized.includes('payment') && (normalized.includes('nahi kiya') || normalized.includes('kaunse') || normalized.includes('baki') || normalized.includes('pending') || normalized.includes('who')) ||
    normalized.includes('customer') && (normalized.includes('unpaid') || normalized.includes('khata') || normalized.includes('udhar'))
  ) {
    participatingAgents = ['crm', 'finance', 'orchestrator'];

    reasoningSteps.push({
      agentId: 'crm',
      agentName: 'CRM & Khata Agent',
      phase: 'data_ingestion',
      thought: 'Auditing uncollected credit balances across all active trade accounts in Thane. Total outstanding udhar: ₹72,500 across 3 construction accounts.',
      dataCited: ['Total Udhar: ₹72,500', 'Sharma: ₹32,000', 'Sai Electric: ₹21,500', 'Om: ₹19,000'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'crm',
      agentName: 'CRM & Khata Agent',
      phase: 'domain_analysis',
      thought: 'Evaluating payment behavior history: Sharma Construction has 92% recovery probability within 24h of WhatsApp notification. Sai Electric clears in 2 installments (78% probability).',
      dataCited: ['Sharma Recovery Prob: 92%', 'Sai Recovery Prob: 78%', 'Om Recovery Prob: 65%'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Vyapar AI (Decision Manager)',
      phase: 'final_synthesis',
      thought: 'Prioritizing cash recovery dispatch. Vyapar AI drafts respectful, automated WhatsApp payment messages with instant UPI payment links for Rajesh Bhai.',
      dataCited: ['Cash Recovery Actionable', 'Immediate Target: ₹32,000 Sharma Construction'],
      timestamp: nowStr
    });

    finalAnswer = `Here are the customers with overdue payments (Total Outstanding: **₹72,500**):

| Customer Name | Amount Stuck (₹) | Overdue | AI Recovery Likelihood | Behavioral Learning |
| :--- | :--- | :--- | :--- | :--- |
| **Sharma Construction** | **₹32,000** | 14 Days | **92% (High)** | Usually pays right after receiving a polite WhatsApp reminder |
| **Sai Electric Works** | **₹21,500** | 8 Days | **78% (Medium)** | Pays in 2 split installments after reminder |
| **Om Enterprises** | **₹19,000** | 21 Days | **65% (Attention)** | Requires WhatsApp notice + follow-up call |

---

💡 **Vyapar AI Learning**:
The AI doesn't just send a plain message — it learns from your business history. It knows **Sharma Construction** usually pays after receiving a reminder, so it prioritises this customer to recover cash immediately.

Say *"Reminder bhej do"* to send personalised WhatsApp messages with instant UPI links.`;

    keyDataPoints = [
      { label: "Total Outstanding", value: "₹72,500" },
      { label: "Sharma Construction", value: "₹32,000 (92% prob)" },
      { label: "Sai Electric Works", value: "₹21,500 (78% prob)" },
      { label: "Om Enterprises", value: "₹19,000 (65% prob)" }
    ];

    suggestedActions = [
      { label: "Reminder bhej do (Send WhatsApp Reminders)", actionType: "vyapar_send_reminders", payload: { total: 72500 } }
    ];

    return {
      id: `msg-${Date.now()}`,
      sender: 'coo',
      queryText: query,
      fileName: 'overdue-customers-recovery.md',
      participatingAgents,
      reasoningSteps,
      finalAnswer,
      keyDataPoints,
      suggestedActions,
      timestamp: nowStr
    };
  }

  // 3b. Send Reminders Confirmation: "Reminder bhej do"
  if (
    normalized.includes('reminder') && (normalized.includes('bhej') || normalized.includes('send') || normalized.includes('do'))
  ) {
    participatingAgents = ['crm', 'orchestrator'];

    reasoningSteps.push({
      agentId: 'crm',
      agentName: 'CRM & Khata Agent',
      phase: 'domain_analysis',
      thought: 'Generated personalized WhatsApp payment reminders in Hinglish for Sharma Construction (₹32,000), Sai Electric Works (₹21,500), and Om Enterprises (₹19,000) with UPI deep-links.',
      dataCited: ['3 Messages Prepared', 'Deep-link generated', 'Total Target: ₹72,500'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Vyapar AI (Decision Manager)',
      phase: 'final_synthesis',
      thought: 'Dispatched 3 WhatsApp reminders. Learned behavioral prediction expects ₹32,000 recovery from Sharma Construction within 24 hours.',
      dataCited: ['WhatsApp API Dispatched', 'Expected Inflow: ₹32,000 today'],
      timestamp: nowStr
    });

    finalAnswer = `✅ **Personalised WhatsApp reminders successfully prepared and dispatched!**

1. **Sharma Construction (₹32,000)**:
   > *"Namaste Vinod ji, Rajesh Hardware & Electricals (Thane) se. Aapka ₹32,000 ka bill 14 dino se pending hai. Kripya UPI link se clear karein: https://pay.vyapar.ai/inv-sharma"*
   - 🎯 **Expected Recovery**: ₹32,000 within 24 hours (92% probability based on past history).

2. **Sai Electric Works (₹21,500)**:
   > *"Namaste Prakash bhai, Rajesh Hardware se. Aapka ₹21,500 ka ledger balance baki hai. Kripya payment update karein: https://pay.vyapar.ai/inv-sai"*

3. **Om Enterprises (₹19,000)**:
   > *"Respected Sunil ji, Om Enterprises account shows ₹19,000 overdue for 21 days at Rajesh Hardware. Kindly clear today: https://pay.vyapar.ai/inv-om"*

Vyapar AI is actively monitoring your BharatPe/Bank account for incoming settlements and will notify you when payment lands!`;

    keyDataPoints = [
      { label: "Reminders Sent", value: "3 Customers" },
      { label: "Target Recovery", value: "₹72,500" },
      { label: "Expected Today", value: "₹32,000 (Sharma)" }
    ];

    suggestedActions = [
      { label: "Business improve kaise kar sakte hai?", actionType: "query", payload: { query: "Business improve kaise kar sakte hai?" } }
    ];

    return {
      id: `msg-${Date.now()}`,
      sender: 'coo',
      queryText: query,
      fileName: 'whatsapp-reminders-dispatched.md',
      participatingAgents,
      reasoningSteps,
      finalAnswer,
      keyDataPoints,
      suggestedActions,
      timestamp: nowStr
    };
  }

  // 4. Strategic Profit & Shelf Space: "Business improve kaise kar sakte hai?"
  if (
    normalized.includes('improve') ||
    normalized.includes('shelf') ||
    normalized.includes('business improve') ||
    (normalized.includes('profit') && (normalized.includes('increase') || normalized.includes('more') || normalized.includes('kaise')))
  ) {
    participatingAgents = ['finance', 'sales', 'inventory', 'orchestrator'];

    reasoningSteps.push({
      agentId: 'finance',
      agentName: 'Finance Agent',
      phase: 'data_ingestion',
      thought: 'Audited 6 months of historical SKU turnover and product category gross margins. Comparing shelf space allocation vs profit contribution.',
      dataCited: ['Data Period: 6 Months', 'Categories: LED vs Pumps vs Wire'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'sales',
      agentName: 'Sales Agent',
      phase: 'domain_analysis',
      thought: 'Found critical product mix asymmetry: LED products generate 32% net margin but occupy only 12% of shelf space. Water pumps generate only 8% margin while hogging 30% of prime shop floor.',
      dataCited: ['LED Margin: 32% (12% space)', 'Pump Margin: 8% (30% space)'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Vyapar AI (Decision Manager)',
      phase: 'final_synthesis',
      thought: 'Formulated 3-point business optimization plan: Increase LED inventory display, reduce showroom pump space to on-demand catalog, and introduce contractor bundles for local Thane electricians.',
      dataCited: ['Additional Profit: ₹18,000–₹24,000/month'],
      timestamp: nowStr
    });

    finalAnswer = `Vyapar AI analyzed **six months of your business data**, and found something you might not have noticed:

### 📊 Shelf Space vs Profit Margin Analysis:
| Product Category | Profit Margin (%) | Shelf Space Occupied (%) | Monthly Sales | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **💡 LED Lighting & Battens** | **32%** | **12%** | ₹78,000 | **High Profit, Low Space** (Under-indexed) |
| **🚰 Submersible Water Pumps** | **8%** | **30%** | ₹42,000 | **Low Profit, High Space** (Over-indexed) |

---

### 🚀 3 Clear Strategic Recommendations:
1. **Increase LED Inventory & Frontage**: Give LEDs more visible counter display to drive high-margin impulse sales.
2. **Reduce Slow-Moving Pumps**: Keep 2 display units only and sell the rest on-demand from distributor, freeing up 18% floor space.
3. **Create Combo Packages for Electricians**: Bundle 20W LED batten + switch box + insulation tape for Thane contractors at ₹499 combo.

💰 **Estimated Potential Additional Monthly Profit**: **₹18,000 – ₹24,000 / month**

> *That's not a dashboard. That's a business decision.*`;

    keyDataPoints = [
      { label: "LED Profit Margin", value: "32% (12% space)" },
      { label: "Water Pump Margin", value: "8% (30% space)" },
      { label: "Added Monthly Profit", value: "+₹18k – ₹24k" }
    ];

    suggestedActions = [
      { label: "Reallocate Shelf Space & Order LED Combos", actionType: "vyapar_reallocate_shelf", payload: { profitTarget: 24000 } },
      { label: "Check Proactive Wire Alerts", actionType: "query", payload: { query: "Copper wire stock status batao." } }
    ];

    return {
      id: `msg-${Date.now()}`,
      sender: 'coo',
      queryText: query,
      fileName: 'strategic-shelf-space-profit.md',
      participatingAgents,
      reasoningSteps,
      finalAnswer,
      keyDataPoints,
      suggestedActions,
      timestamp: nowStr
    };
  }

  // 5. Proactive Wire Spike Prediction: "Copper wire stock status" / "predictive alert"
  if (
    normalized.includes('copper') ||
    normalized.includes('wire') ||
    normalized.includes('predict') ||
    (normalized.includes('stock') && normalized.includes('finish'))
  ) {
    participatingAgents = ['sales', 'inventory', 'orchestrator'];

    reasoningSteps.push({
      agentId: 'sales',
      agentName: 'Sales Agent',
      phase: 'data_ingestion',
      thought: 'Detected rapid acceleration in copper wire sales: +38% increase in unit velocity over last 10 days driven by Thane pre-monsoon renovation projects.',
      dataCited: ['Copper Wire Velocity: +38%', 'Window: Last 10 Days'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'inventory',
      agentName: 'Inventory Agent',
      phase: 'domain_analysis',
      thought: 'At current depletion rate of 3.0 rolls/day, remaining 12 rolls of Finolex 2.5 sq mm copper wire will completely exhaust in 4 days.',
      dataCited: ['Current Stock: 12 rolls', 'Days Remaining: 4', 'Recommended Reorder: 150 rolls'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Vyapar AI (Decision Manager)',
      phase: 'final_synthesis',
      thought: 'Quantified at-risk commercial revenue: A stockout will cause forfeit of ₹45,000+ in sales to nearby competitors on Gokhale Road.',
      dataCited: ['At-Risk Sales: ₹45,000+', 'Action: Order 150 rolls'],
      timestamp: nowStr
    });

    finalAnswer = `⚡ **Proactive Predictive AI Alert: Copper Wire Demand Spike**

Vyapar AI doesn't wait for you to ask. It proactively detected:

- **Sales Velocity**: Copper wire sales have increased by **38% over the last 10 days**.
- **Stock Depletion Risk**: At the current rate, stock will finish in **four days** (12 rolls left).
- **Recommended Order**: **150 rolls** of Finolex 2.5 sq mm FR wire.
- **Potential Lost Sales if Ignored**: **₹45,000+**.

---

> **The Power of Predictive AI**:  
> Instead of telling you *"Your inventory is low,"*  
> We tell you: *"This is what is going to happen, this is why, and this is what you should do."*`;

    keyDataPoints = [
      { label: "Sales Spike", value: "+38% (10 days)" },
      { label: "Stock Exhaustion", value: "In 4 Days" },
      { label: "Recommended Order", value: "150 Rolls" },
      { label: "At-Risk Sales", value: "₹45,000+" }
    ];

    suggestedActions = [
      { label: "Order 150 Rolls Copper Wire", actionType: "vyapar_reorder_copper", payload: { qty: 150, item: "Finolex Copper Wire" } }
    ];

    return {
      id: `msg-${Date.now()}`,
      sender: 'coo',
      queryText: query,
      fileName: 'predictive-wire-surge-alert.md',
      participatingAgents,
      reasoningSteps,
      finalAnswer,
      keyDataPoints,
      suggestedActions,
      timestamp: nowStr
    };
  }

  // ============================================================================
  // EXISTING APEX RETAIL QUERY HANDLERS (MAINTAINED)
  // ============================================================================
  if (normalized.includes('sales') && (normalized.includes('drop') || normalized.includes('fell') || normalized.includes('why') || normalized.includes('month'))) {

    participatingAgents = ['sales', 'inventory', 'market', 'orchestrator'];

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Arthur Pendelton (COO)',
      phase: 'data_ingestion',
      thought: 'Query received regarding August sales contraction (₹31.84L vs ₹41.60L target). Decomposing query into Commercial Sales Analytics, Inventory Availability, and Mumbai Competitor Pricing.',
      dataCited: ['August Revenue: ₹31,84,000', 'Target: ₹41,60,000', 'Deficit: -₹9,76,000'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'sales',
      agentName: 'Sarah Jenkins (VP of Sales)',
      phase: 'domain_analysis',
      thought: 'Analyzed transaction logs. Monsooned Malabar Arabica (SKU-884) experienced a 44% drop in weekly order volume during the final 10 days of August, causing 68% of total revenue shortfall.',
      dataCited: ['SKU-884 Orders: -44%', 'AOV: ₹3,061.54', 'Channel POS: -22%'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'inventory',
      agentName: 'Marcus Vance (Supply Chain Director)',
      phase: 'domain_analysis',
      thought: 'Sarah\'s right. We only have 42 units left in the warehouse right now—that\'s barely 3 days of inventory. Customers are abandoning carts because we\'re out of stock.',
      dataCited: ['SKU-884 Current Stock: 42 units', 'Depletion: 14.2 units/day', 'Stockout Date: 3 Days'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'market',
      agentName: 'David Sterling (Chief Market Officer)',
      phase: 'domain_analysis',
      thought: 'Scanned competitor positioning. Direct rival Blue Tokai introduced a 20% flash discount (₹2,280/kg) across Mumbai outlets on Aug 24, diverting price-sensitive wholesale cafes.',
      dataCited: ['Competitor Price: ₹2,280', 'Our Price: ₹2,850', 'Market Share Drag: ~8%'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Arthur Pendelton (COO)',
      phase: 'final_synthesis',
      thought: 'Synthesized multi-agent inputs. Primary root cause of sales drop is a combination of inventory stockouts for SKU-884 (+68% impact) and competitor price undercut (+32% impact). Resolving by recommending an emergency air-cargo reorder coupled with a Mumbai loyalty customer outreach.',
      dataCited: ['Combined Deficit Root Cause Identified', 'Action Plan Generated'],
      timestamp: nowStr
    });

    finalAnswer = `Sales dropped in August primarily due to a **₹9,76,000 deficit against target**, driven by two converging factors:\n\n1. **Stockout in Top Revenue Driver (SKU-884)**: Monsooned Malabar Arabica stock fell to 42 units (only 3 days left), causing a 44% drop in order completion during the last 10 days of August.\n2. **Competitor Flash Discount**: Rival brand Blue Tokai launched a 20% price promotion (₹2,280/kg vs our ₹2,850/kg), capturing price-sensitive commercial accounts across Mumbai.\n\n**Recommended Strategic Response**:\n- Issue emergency expedited air-cargo PO for 250 units of SKU-884 from Western Ghats.\n- Launch a targeted 10% bundle incentive for wholesale subscribers in South Bombay.`;

    keyDataPoints = [
      { label: 'August Revenue', value: '₹31,84,000 (-23.4%)' },
      { label: 'SKU-884 Stock Remaining', value: '42 Units (3 Days)' },
      { label: 'Competitor Price Difference', value: '+₹570 / kg' }
    ];

    suggestedActions = [
      { label: 'Issue Expedited Reorder PO (₹3,30,000)', actionType: 'reorder', payload: { skuId: 'SKU-884', qty: 250 } },
      { label: 'Launch Wholesale Loyalty Offer', actionType: 'discount', payload: { targetCategory: 'Artisanal Beverages' } }
    ];
  } 
  else if (normalized.includes('stockout') || (normalized.includes('stock') && (normalized.includes('out') || normalized.includes('next week') || normalized.includes('deplet')))) {
    participatingAgents = ['inventory', 'sales', 'finance', 'orchestrator'];

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'data_ingestion',
      thought: 'Evaluating 7-day SKU stock depletion models and supplier lead time constraints across all active SKUs in Bhiwandi and Mumbai warehouses.',
      dataCited: ['Active SKUs Analyzed: 6', 'Depletion Window: 7 Days'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'inventory',
      agentName: 'Inventory Operations Agent',
      phase: 'domain_analysis',
      thought: 'Predictive algorithm flagged 2 SKUs reaching zero balance within 7 days: SKU-884 (Monsooned Malabar Arabica, 3 days left) and SKU-990 (Noise-Cancelling Wireless Earbuds, 4 days left). SKU-771 (Sheesham Wood Laptop Stand) is also at low safety stock level (16 days left).',
      dataCited: ['SKU-884: 3 Days Stock', 'SKU-990: 4 Days Stock', 'SKU-771: 16 Days Stock'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'sales',
      agentName: 'Sales Intelligence Agent',
      phase: 'domain_analysis',
      thought: 'Cross-checked demand velocity. SKU-884 accounts for ₹40,470 daily revenue. A stockout over 7 days will result in ₹2,83,290 in forfeited sales.',
      dataCited: ['SKU-884 Daily Revenue: ₹40,470', 'SKU-990 Daily Revenue: ₹26,562'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'finance',
      agentName: 'Finance & Liquidity Agent',
      phase: 'domain_analysis',
      thought: 'Checked liquidity balance. Cash buffer of ₹11,36,000 is available to cover combined PO expenditures of ₹5,94,000 for SKU-884 and SKU-990 without breaching minimum cash safety threshold (₹8,00,000).',
      dataCited: ['Available Liquidity: ₹11,36,000', 'Required PO Cash: ₹5,94,000', 'Post-PO Buffer: ₹5,42,000'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'final_synthesis',
      thought: 'Synthesized Inventory risk with Sales revenue impact and Finance liquidity. Prioritizing immediate PO release for SKU-884 and SKU-990.',
      dataCited: ['Reorder Authorization Ready', 'Zero Cash Bottleneck'],
      timestamp: nowStr
    });

    finalAnswer = `Based on predictive depletion analysis, **2 key products are guaranteed to go out of stock next week** if no purchase order is issued immediately:\n\n1. **Monsooned Malabar Arabica Coffee (SKU-884)**:\n   - Current Stock: **42 units** | Depletion Rate: **14.2 units/day**\n   - Estimated Stockout Date: **3 Days (Thursday)**\n   - Projected Revenue At Risk: **₹2,83,290** over next 7 days.\n\n2. **Noise-Cancelling Wireless Earbuds (SKU-990)**:\n   - Current Stock: **18 units** | Depletion Rate: **3.8 units/day**\n   - Estimated Stockout Date: **4 Days (Friday)**\n   - Projected Revenue At Risk: **₹1,06,248**.\n\n**Executive Action Plan**:\n- Release Purchase Order PO-2026-884 (₹3,30,000) for 250 coffee units to Western Ghats.\n- Release Purchase Order PO-2026-990 (₹2,64,000) for 80 earbud units to Lamington Road Hub.`;

    keyDataPoints = [
      { label: 'Critical Stockout SKUs', value: '2 Items (SKU-884 & 990)' },
      { label: 'Combined Revenue at Risk', value: '₹3,89,538' },
      { label: 'Required Reorder Capital', value: '₹5,94,000' }
    ];

    suggestedActions = [
      { label: 'Issue Dual PO (Coffee & Earbuds)', actionType: 'reorder', payload: { skus: ['SKU-884', 'SKU-990'] } },
      { label: 'View Inventory Depletion Matrix', actionType: 'navigate', payload: { tab: 'inventory' } }
    ];
  }
  else if (normalized.includes('profit') || normalized.includes('margin') || normalized.includes('net') || normalized.includes('ebitda') || normalized.includes('p&l') || normalized.includes('income')) {
    participatingAgents = ['finance', 'sales', 'inventory', 'orchestrator'];

    const latestSales = sales[sales.length - 1];
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const avgMarginPct = (skus.reduce((acc, s) => acc + (s.price - s.cost) / s.price, 0) / skus.length);
    const grossProfit = Math.round(latestSales.revenue * avgMarginPct);
    const netProfit = grossProfit - totalExpenses;
    const overBudgetExp = expenses.filter(e => e.amount > e.budget);
    const totalOverrun = overBudgetExp.reduce((acc, curr) => acc + (curr.amount - curr.budget), 0);

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'data_ingestion',
      thought: `Parsing profitability query: "${query}". Reconciling August sales ledger (₹${latestSales.revenue.toLocaleString()}), SKU-level gross margin weights, and expense cost centers (₹${totalExpenses.toLocaleString()}).`,
      dataCited: [`Revenue: ₹${latestSales.revenue.toLocaleString()}`, `Total Overheads: ₹${totalExpenses.toLocaleString()}`, `Avg Margin: ${(avgMarginPct * 100).toFixed(1)}%`],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'sales',
      agentName: 'Sales Intelligence Agent',
      phase: 'domain_analysis',
      thought: `Commercial revenue closed at ₹${latestSales.revenue.toLocaleString()} across ${latestSales.orders.toLocaleString()} orders. At an aggregate product margin of ${(avgMarginPct * 100).toFixed(1)}%, top-line revenue generated ₹${grossProfit.toLocaleString()} in gross profit contribution.`,
      dataCited: [`Gross Profit: ₹${grossProfit.toLocaleString()}`, `AOV: ₹${latestSales.avgOrderValue.toFixed(2)}`],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'finance',
      agentName: 'Finance & Liquidity Agent',
      phase: 'domain_analysis',
      thought: `Audited 5 operational cost centers totaling ₹${totalExpenses.toLocaleString()} (+₹${totalOverrun.toLocaleString()} over budgeted limits). Major cost drag stems from Bhiwandi express freight (₹6,72,000) and performance marketing (₹7,60,000). Subtracting operating expenses (₹${totalExpenses.toLocaleString()}) from gross profit (₹${grossProfit.toLocaleString()}) results in a net operating position of ₹${netProfit.toLocaleString()}.`,
      dataCited: [`Operating Expenses: ₹${totalExpenses.toLocaleString()}`, `Net Position: ₹${netProfit.toLocaleString()}`, `Overruns: +₹${totalOverrun.toLocaleString()}`],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'final_synthesis',
      thought: `Synthesized Net Profit root cause: The net deficit is driven by an August revenue shortfall (₹9.76L below target) combined with ₹5,12,000 in compressible non-core expense overruns. Liquidity remains protected by a ₹11,36,000 cash reserve. Recommending immediate budget capping and high-margin SKU restock.`,
      dataCited: [`Net Loss Identified: ₹${Math.abs(netProfit).toLocaleString()}`, `Safe Buffer: ₹11,36,000`],
      timestamp: nowStr
    });

    const isNegative = netProfit < 0;
    finalAnswer = `Based on financial ledger analysis for August 2026, your business recorded a **${isNegative ? 'Net Operating Loss' : 'Net Operating Profit'} of ${isNegative ? `-₹${Math.abs(netProfit).toLocaleString()}` : `₹${netProfit.toLocaleString()}`}**:\n\n### 1. Revenue & Gross Margin\n- **August Gross Revenue**: **₹${latestSales.revenue.toLocaleString()}** (-23.4% vs ₹${latestSales.target.toLocaleString()} target)\n- **Average Product Margin**: **${(avgMarginPct * 100).toFixed(1)}%**\n- **Gross Profit**: **₹${grossProfit.toLocaleString()}**\n\n### 2. Operating Overheads Ledger\n${expenses.map(e => `- **${e.category}**: **₹${e.amount.toLocaleString()}** ${e.amount > e.budget ? `(+₹${(e.amount - e.budget).toLocaleString()} over budget)` : '(On budget)'}`).join('\n')}\n- **Total Operating Expenses**: **₹${totalExpenses.toLocaleString()}**\n\n### 3. Bottom-Line Summary\n- **Net Profit / (Loss)**: **${isNegative ? `-₹${Math.abs(netProfit).toLocaleString()}` : `₹${netProfit.toLocaleString()}`}**\n- **Current Cash Buffer**: **₹11,36,000** (Positive liquidity reserve)\n\n**COO Recommended Action to Restore Net Profitability**:\n- Compress **₹5,12,000 in overruns** by capping monsoon air-cargo and trimming cold PPC ad sets.\n- Expedite reorder of top revenue driver **SKU-884** to reclaim ~₹2,83,290 in lost monthly sales.`;

    keyDataPoints = [
      { label: 'August Revenue', value: `₹${latestSales.revenue.toLocaleString()}` },
      { label: 'Gross Profit', value: `₹${grossProfit.toLocaleString()} (${(avgMarginPct * 100).toFixed(1)}%)` },
      { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}` },
      { label: 'Net Profit / Loss', value: isNegative ? `-₹${Math.abs(netProfit).toLocaleString()}` : `₹${netProfit.toLocaleString()}` }
    ];

    suggestedActions = [
      { label: 'Review Expense Reduction Plan', actionType: 'cut_expense', payload: { expenseId: 'exp-101' } },
      { label: 'Restock High-Margin Coffee (SKU-884)', actionType: 'reorder', payload: { skuId: 'SKU-884', qty: 250 } }
    ];
  }
  else if (normalized.includes('expense') || normalized.includes('cost') || normalized.includes('reduce') || normalized.includes('liquidity')) {
    participatingAgents = ['finance', 'inventory', 'customer', 'orchestrator'];

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'data_ingestion',
      thought: 'Analyzing August expense ledgers, cost center variances, and tied-up working capital across all Mumbai business units.',
      dataCited: ['Total August Overhead: ₹36,56,000', 'Budget Target: ₹31,36,000', 'Variance: +₹5,20,000'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'finance',
      agentName: 'Finance & Liquidity Agent',
      phase: 'domain_analysis',
      thought: 'Identified 2 primary areas of compressible expense overruns: Bhiwandi Freight Surcharges (+₹3,12,000 over budget) and Digital Marketing Performance Campaigns (+₹2,00,000 over budget with lower ROAS).',
      dataCited: ['Freight Surcharge: ₹6,72,000 spent vs ₹3,60,000 budget', 'PPC Spend: ₹7,60,000 spent vs ₹5,60,000 budget'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'inventory',
      agentName: 'Inventory Operations Agent',
      phase: 'domain_analysis',
      thought: 'Highlighted non-operating tied-up capital. 540 units of dead stock SKU-405 (Dharavi Canvas Tote Bags) are holding ₹2,26,800 in stagnant inventory value with zero turnover for 140 days.',
      dataCited: ['SKU-405 Stagnant Capital: ₹2,26,800', 'Bhiwandi Storage Holding Cost: ₹34,000/mo'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'final_synthesis',
      thought: 'Synthesized cost reduction plan yielding up to ₹7,38,800 in immediate cash flow recovery without impacting core revenue generation.',
      dataCited: ['Combined Recoverable Capital: ₹7,38,800'],
      timestamp: nowStr
    });

    finalAnswer = `The virtual management team identified **3 immediate cost optimization opportunities** to recover up to **₹7,38,800 in liquidity**:\n\n1. **Renegotiate Bhiwandi Logistics Carriers (-₹3,12,000/month)**:\n   - Freight cost reached ₹6,72,000 (+₹3,12,000 over budget) due to ad-hoc monsoon cargo shipments.\n   - Action: Shift non-urgent restocking to consolidated scheduled ground transport.\n\n2. **Optimize Performance Marketing Ad Spend (-₹2,00,000/month)**:\n   - Ad spend reached ₹7,60,000 with diminishing ROAS on cold audience campaigns.\n   - Action: Pause broad Meta ad sets and redirect focus to Mumbai VIP retargeting.\n\n3. **Liquidate Dead Stock SKU-405 (Reclaim ₹2,26,800 Cash)**:\n   - 540 Dharavi Handcrafted Tote Bags have been stagnant for 140+ days.\n   - Action: Run a 50% flash clearance bundle with popular Chai Flask items.`;

    keyDataPoints = [
      { label: 'Total Recoverable Capital', value: '₹7,38,800' },
      { label: 'Logistics Cost Overrun', value: '+₹3,12,000 (+86.7%)' },
      { label: 'Stagnant Working Capital', value: '₹2,26,800 (540 units)' }
    ];

    suggestedActions = [
      { label: 'Cap Freight Surcharge Budget', actionType: 'cut_expense', payload: { expenseId: 'exp-101' } },
      { label: 'Launch Dead Stock Flash Bundle', actionType: 'discount', payload: { skuId: 'SKU-405' } }
    ];
  }
  else if (normalized.includes('whatsapp') || normalized.includes('complaint') || normalized.includes('customer') || normalized.includes('feedback')) {
    participatingAgents = ['customer', 'sales', 'inventory', 'orchestrator'];

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'data_ingestion',
      thought: 'Parsing unstructured customer message logs from WhatsApp Business API (Mumbai Line), email tickets, and Google Reviews.',
      dataCited: ['Parsed Messages: 1,240', 'Negative Feedback Ratio: 28%', 'Unresolved Alerts: 5'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'customer',
      agentName: 'Customer Experience Agent',
      phase: 'domain_analysis',
      thought: 'NLP Sentiment model extracted top recurring complaint clusters: 54% relate to delayed shipping deliveries from Bhiwandi, 31% relate to stockout cancellations on coffee orders, and 15% relate to delivery fee increases.',
      dataCited: ['Shipping Delays Cluster: 54%', 'Stockout Cancellations: 31%', 'Price Surprises: 15%'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'inventory',
      agentName: 'Inventory Operations Agent',
      phase: 'domain_analysis',
      thought: 'Correlated complaint timestamps with inventory log. 80% of WhatsApp complaints occurred between Aug 25-28, coinciding directly with the stockout of SKU-884.',
      dataCited: ['Correlation Factor: 0.92', 'Impacted VIP Accounts: 3 Commercial Clients'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'final_synthesis',
      thought: 'Root cause confirmed: WhatsApp complaints are not caused by product quality issues, but rather operational stockouts and monsoon road transport bottlenecks. Recommending direct account manager outreach.',
      dataCited: ['Operational Root Cause Verified', 'Outreach Strategy Formulated'],
      timestamp: nowStr
    });

    finalAnswer = `Analysis of **1,240 customer interactions** reveals that the recent spike in WhatsApp complaints is driven by **operational fulfillment bottlenecks** rather than product defects:\n\n1. **Stockout Delivery Delays (54% of complaints)**:\n   - Wholesale accounts (including *Café Mondegar* in Colaba and *Irani Café & Bakers* in Marine Lines) reported unexpected 3-day delivery delays due to SKU-884 stockouts.\n\n2. **Courier Delivery Fee Surprises (31% of complaints)**:\n   - Customers noted delivery fees jumping from ₹950 to ₹2,240 without prior checkout disclosure.\n\n3. **Unfulfilled Web Reorders (15% of complaints)**:\n   - Out-of-stock messages triggered back-and-forth WhatsApp inquiries.\n\n**Action Plan to Restore Customer Retention**:\n- Send personalized apology & status updates to 3 flagged commercial clients with a 15% credit voucher on their next order.\n- Enable automated WhatsApp tracking notifications for dispatched consignments.`;

    keyDataPoints = [
      { label: 'Primary Complaint Driver', value: 'Fulfillment Delays (54%)' },
      { label: 'WhatsApp Negative Sentiment', value: '28% (+12% MoM)' },
      { label: 'Impacted Key Accounts', value: '3 Commercial Clients' }
    ];

    suggestedActions = [
      { label: 'Dispatch VIP Apology & Voucher', actionType: 'contact_customer', payload: { clientIds: ['Café Mondegar', 'Irani Café'] } },
      { label: 'View Customer Feedback Stream', actionType: 'navigate', payload: { tab: 'customer' } }
    ];
  }
  else if (normalized.includes('profit') || normalized.includes('margin') || normalized.includes('price') || normalized.includes('product') || normalized.includes('sku')) {
    participatingAgents = ['sales', 'inventory', 'market', 'orchestrator'];
    const highestMarginSku = [...skus].sort((a, b) => (b.price - b.cost) - (a.price - a.cost))[0];
    const lowestMarginSku = [...skus].sort((a, b) => (a.price - a.cost) - (b.price - b.cost))[0];

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'data_ingestion',
      thought: `Parsing query regarding product catalog profitability and margin distribution across ${skus.length} active SKUs.`,
      dataCited: [`Active SKUs: ${skus.length}`, 'Price/Cost Catalog Ingested'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'sales',
      agentName: 'Sales Intelligence Agent',
      phase: 'domain_analysis',
      thought: 'Scanned commercial database. Revenue stands at ₹31,84,000 with 1,040 orders processed. Top category is Artisanal Beverages (48% share).',
      dataCited: ['Revenue: ₹31,84,000', 'Top Category: Artisanal Beverages'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'inventory',
      agentName: 'Inventory Operations Agent',
      phase: 'domain_analysis',
      thought: 'Evaluated stock health. 2 critical SKUs identified (SKU-884, SKU-990). Dead stock working capital stands at ₹2,26,800.',
      dataCited: ['Critical SKUs: 2', 'Dead Stock: ₹2,26,800'],
      timestamp: nowStr
    });

    reasoningSteps.push({
      agentId: 'orchestrator',
      agentName: 'Decision Support Agent (COO)',
      phase: 'final_synthesis',
      thought: 'Synthesized catalog pricing analysis with promotional liquidation recommendations.',
      dataCited: ['Product Margin Spectrum Evaluated'],
      timestamp: nowStr
    });

    finalAnswer = `Here is the multi-agent analysis for your query: **"${query}"**\n\n- **Commercial Health**: August revenue is **₹31,84,000** (-23.4% vs target), with Artisanal Beverages holding the highest category market share in Mumbai.\n- **Operational Constraints**: SKU-884 (Monsooned Malabar Arabica) has only **3 days of stock remaining** (42 units).\n- **Financial Position**: Liquidity buffer is healthy at **₹11,36,000**, though Bhiwandi freight expenses ran **+₹3,12,000 over budget**.\n- **Customer Sentiment**: WhatsApp complaints stand at **28% negative**, primarily due to monsoon shipping delay inquiries.\n\n*Would you like me to issue a specific reorder PO or run an expense reduction plan?*`;

    keyDataPoints = [
      { label: 'Current Revenue', value: '₹31,84,000' },
      { label: 'Stockout Risk SKUs', value: '2 Items' },
      { label: 'Available Cash', value: '₹11,36,000' }
    ];

    suggestedActions = [
      { label: 'Issue Reorder PO (₹3,30,000)', actionType: 'reorder', payload: { skuId: 'SKU-884', qty: 250 } },
      { label: 'Review Executive Recommendations', actionType: 'navigate', payload: { tab: 'executive' } }
    ];
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'coo',
    queryText: query,
    fileName: query ? `${query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32)}.md` : 'executive-forecast.md',
    reasoningSteps,
    finalAnswer,
    participatingAgents,
    keyDataPoints,
    suggestedActions,
    timestamp: nowStr
  };
}
