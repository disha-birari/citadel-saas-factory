import { 
  AgentMetadata, 
  SKUItem, 
  SalesRecord, 
  ExpenseRecord, 
  CustomerFeedback, 
  MarketSignal, 
  DataSourceStatus,
  StrategicRecommendation,
  AgentInsight
} from './types';

export const INITIAL_AGENTS: AgentMetadata[] = [
  {
    id: 'orchestrator',
    name: 'Decision Support Agent (COO)',
    role: 'Chief Operating Officer & Orchestrator',
    avatar: '🤖',
    color: 'from-cyan-500 to-indigo-600',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    status: 'active',
    description: 'Synthesizes multi-agent signals, resolves cross-functional conflicts, and prioritizes strategic executive decisions.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'sales',
    name: 'Sales Intelligence Agent',
    role: 'Head of Commercial Analytics',
    avatar: '📈',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    status: 'active',
    description: 'Tracks revenue velocity across channels, predicts demand spikes, and evaluates SKU profitability.',
    iconName: 'TrendingUp'
  },
  {
    id: 'inventory',
    name: 'Inventory Operations Agent',
    role: 'Supply Chain Controller',
    avatar: '📦',
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    status: 'warning',
    description: 'Calculates stock depletion dates, computes Economic Order Quantities (EOQ), and flags dead working capital.',
    iconName: 'Boxes'
  },
  {
    id: 'finance',
    name: 'Finance & Liquidity Agent',
    role: 'Chief Financial Analyst',
    avatar: '💰',
    color: 'from-indigo-500 to-purple-600',
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    status: 'active',
    description: 'Monitors expense variance against budget, analyzes product margins, and projects 30-day liquidity risks.',
    iconName: 'Wallet'
  },
  {
    id: 'customer',
    name: 'Customer Experience Agent',
    role: 'Customer Success & Retention Lead',
    avatar: '💬',
    color: 'from-purple-500 to-pink-600',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    status: 'warning',
    description: 'Parses unstructured WhatsApp/Email sentiment, categorizes complaints, and alerts on customer churn risks.',
    iconName: 'MessageSquare'
  },
  {
    id: 'market',
    name: 'Market Intelligence Agent',
    role: 'Strategic Market Analyst',
    avatar: '🌐',
    color: 'from-blue-500 to-cyan-600',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    status: 'active',
    description: 'Monitors competitor pricing, tracking external demand signals and macroeconomic category trends.',
    iconName: 'Globe'
  }
];

export const INITIAL_DATA_SOURCES: DataSourceStatus[] = [
  { id: 'ds-pos', name: 'Pine Labs & BharatPe POS Ledger', type: 'pos', status: 'connected', lastSync: '2 mins ago', recordCount: 14200, unstructured: false },
  { id: 'ds-inv', name: 'Bhiwandi Central WMS Inventory DB', type: 'inventory_db', status: 'connected', lastSync: '1 min ago', recordCount: 450, unstructured: false },
  { id: 'ds-acc', name: 'TallyPrime & GST Compliance Ledger', type: 'accounting', status: 'connected', lastSync: '15 mins ago', recordCount: 3890, unstructured: false },
  { id: 'ds-wa', name: 'WhatsApp Business API (Mumbai Line)', type: 'whatsapp', status: 'syncing', lastSync: 'Just now', recordCount: 1240, unstructured: true },
  { id: 'ds-email', name: 'Zendesk Mumbai Support Desk', type: 'email', status: 'connected', lastSync: '5 mins ago', recordCount: 890, unstructured: true },
  { id: 'ds-ecom', name: 'Shopify India & ONDC Connector', type: 'ecommerce', status: 'connected', lastSync: '3 mins ago', recordCount: 8750, unstructured: false }
];

export const INITIAL_SKUS: SKUItem[] = [
  {
    id: 'SKU-884',
    name: 'Monsooned Malabar Arabica Coffee (1kg)',
    category: 'Artisanal Beverages',
    price: 2850.00,
    cost: 1320.00,
    currentStock: 42,
    minStockThreshold: 100,
    reorderQuantity: 250,
    dailyDepletionRate: 14.2,
    daysUntilStockout: 3,
    status: 'critical',
    supplier: 'Western Ghats Agro Estates (Vashi APMC)',
    lastRestockDate: '2026-08-12',
    workingCapitalLocked: 55440
  },
  {
    id: 'SKU-102',
    name: 'Insulated Copper & Steel Chai Flask (750ml)',
    category: 'Drinkware & Living',
    price: 1999.00,
    cost: 680.00,
    currentStock: 310,
    minStockThreshold: 80,
    reorderQuantity: 150,
    dailyDepletionRate: 6.5,
    daysUntilStockout: 47,
    status: 'optimal',
    supplier: 'Taloja Metalcraft Works, Navi Mumbai',
    lastRestockDate: '2026-08-20',
    workingCapitalLocked: 210800
  },
  {
    id: 'SKU-405',
    name: 'Dharavi Handcrafted Canvas & Jute Tote Bag',
    category: 'Apparel & Living',
    price: 1450.00,
    cost: 420.00,
    currentStock: 540,
    minStockThreshold: 150,
    reorderQuantity: 200,
    dailyDepletionRate: 0.8,
    daysUntilStockout: 675,
    status: 'dead_stock',
    supplier: 'Dharavi Artisans Guild & Weavers Society',
    lastRestockDate: '2026-04-10',
    workingCapitalLocked: 226800
  },
  {
    id: 'SKU-771',
    name: 'Sheesham Wood Ergonomic Laptop Stand',
    category: 'Office & Workspace',
    price: 5499.00,
    cost: 2200.00,
    currentStock: 68,
    minStockThreshold: 50,
    reorderQuantity: 100,
    dailyDepletionRate: 4.1,
    daysUntilStockout: 16,
    status: 'low_stock',
    supplier: 'Kurla Woodcrafts & Heritage Furniture Co.',
    lastRestockDate: '2026-08-01',
    workingCapitalLocked: 149600
  },
  {
    id: 'SKU-312',
    name: 'Royal Darjeeling First Flush Muscatel Tea (100s)',
    category: 'Artisanal Beverages',
    price: 1150.00,
    cost: 380.00,
    currentStock: 195,
    minStockThreshold: 60,
    reorderQuantity: 150,
    dailyDepletionRate: 8.4,
    daysUntilStockout: 23,
    status: 'optimal',
    supplier: 'Makaibari & Nilgiri Planters Syndicate',
    lastRestockDate: '2026-08-18',
    workingCapitalLocked: 74100
  },
  {
    id: 'SKU-990',
    name: 'Noise-Cancelling Wireless Earbuds (Pro ANC)',
    category: 'Electronics & Audio',
    price: 6990.00,
    cost: 3300.00,
    currentStock: 18,
    minStockThreshold: 40,
    reorderQuantity: 80,
    dailyDepletionRate: 3.8,
    daysUntilStockout: 4,
    status: 'critical',
    supplier: 'Lamington Road Electronics Hub, Grant Road',
    lastRestockDate: '2026-07-25',
    workingCapitalLocked: 59400
  }
];

export const MONTHLY_SALES_HISTORY: SalesRecord[] = [
  { date: '2026-03', revenue: 3400000, target: 3200000, forecast: 3280000, orders: 1120, avgOrderValue: 3035.71, topSKUId: 'SKU-884' },
  { date: '2026-04', revenue: 3912000, target: 3360000, forecast: 3600000, orders: 1290, avgOrderValue: 3032.55, topSKUId: 'SKU-884' },
  { date: '2026-05', revenue: 4096000, target: 3600000, forecast: 3920000, orders: 1380, avgOrderValue: 2968.12, topSKUId: 'SKU-771' },
  { date: '2026-06', revenue: 3744000, target: 3840000, forecast: 4000000, orders: 1210, avgOrderValue: 3094.21, topSKUId: 'SKU-102' },
  { date: '2026-07', revenue: 4328000, target: 4000000, forecast: 4160000, orders: 1450, avgOrderValue: 2984.83, topSKUId: 'SKU-884' },
  { date: '2026-08', revenue: 3184000, target: 4160000, forecast: 4400000, orders: 1040, avgOrderValue: 3061.54, topSKUId: 'SKU-884' },
];

export const EXPENSE_LEDGER: ExpenseRecord[] = [
  { id: 'exp-101', category: 'Bhiwandi Freight & Logistics', description: 'Monsoon highway surcharges & emergency Chikmagalur air cargo', amount: 672000, budget: 360000, date: '2026-08-25', isRecurring: false, status: 'over_budget' },
  { id: 'exp-102', category: 'Warehousing & Storage (Thane Hub)', description: 'Monthly space rental at Bhiwandi Central Logistics Park', amount: 496000, budget: 496000, date: '2026-08-01', isRecurring: true, status: 'normal' },
  { id: 'exp-103', category: 'Digital Marketing (Meta/Google)', description: 'Performance campaigns targeting South Bombay & Western Suburbs', amount: 760000, budget: 560000, date: '2026-08-15', isRecurring: true, status: 'compressible' },
  { id: 'exp-104', category: 'SaaS & Enterprise Tech Stack', description: 'TallyPrime Server, Shopify India, WhatsApp Cloud API & ERP', amount: 248000, budget: 240000, date: '2026-08-05', isRecurring: true, status: 'normal' },
  { id: 'exp-105', category: 'Staff Payroll & Store Teams', description: 'Mumbai retail store managers & warehouse staff salaries', amount: 1480000, budget: 1480000, date: '2026-08-28', isRecurring: true, status: 'normal' },
];

export const CUSTOMER_FEEDBACK_FEED: CustomerFeedback[] = [
  {
    id: 'fb-301',
    channel: 'whatsapp',
    customerName: 'Rajesh Kothari (Café Mondegar, Colaba)',
    date: '2026-08-30 14:22',
    message: 'Hey team, our wholesale order for Monsooned Malabar Arabica (SKU-884) was delayed by 3 days due to Bhiwandi highway waterlogging, and 2 sacks arrived damaged. We are running dry before the weekend rush in Colaba!',
    sentiment: 'negative',
    category: 'shipping',
    resolutionStatus: 'flagged'
  },
  {
    id: 'fb-302',
    channel: 'email',
    customerName: 'Dr. Ananya Sen (Pali Hill, Bandra West)',
    date: '2026-08-29 11:05',
    message: 'The Sheesham Wood Laptop Stand arrived at my clinic in Bandra in pristine condition. Incredible Indian craftsmanship! Will recommend to fellow doctors.',
    sentiment: 'positive',
    category: 'product_quality',
    resolutionStatus: 'resolved'
  },
  {
    id: 'fb-303',
    channel: 'whatsapp',
    customerName: 'Farhan Merchant (Crawford Market Traders)',
    date: '2026-08-28 17:45',
    message: 'Why did shipping delivery charges jump from ₹950 to ₹2,240 on our Fort consignment? If courier charges stay this steep we will buy from local Crawford wholesale.',
    sentiment: 'negative',
    category: 'pricing',
    resolutionStatus: 'open'
  },
  {
    id: 'fb-304',
    channel: 'google_review',
    customerName: 'Priya Sharma (Lower Parel)',
    date: '2026-08-27 09:12',
    message: 'Great customer service rep resolved my order delivery address near Phoenix Palladium within 10 minutes on WhatsApp.',
    sentiment: 'positive',
    category: 'support',
    resolutionStatus: 'resolved'
  },
  {
    id: 'fb-305',
    channel: 'whatsapp',
    customerName: 'Irani Café & Heritage Bakers (Marine Lines)',
    date: '2026-08-26 19:30',
    message: 'Tried to reorder SKU-884 for our South Bombay tearoom but your portal says Out of Stock. When will fresh stock reach the Mumbai depot?',
    sentiment: 'negative',
    category: 'shipping',
    resolutionStatus: 'flagged'
  }
];

export const MARKET_SIGNALS: MarketSignal[] = [
  {
    id: 'sig-801',
    source: 'MCX Commodity Monitor & Coffee Board of India',
    topic: 'Green Arabica Wholesale Rates',
    title: 'Arabica raw coffee futures rise 14% at Karnataka auctions due to Western Ghats monsoon rains',
    impactScore: -4,
    date: '2026-08-28',
    category: 'supplier_cost',
    summary: 'Supplier procurement cost for SKU-884 is projected to increase by ₹190/kg starting next month. Margin reduction expected if retail price remains static.'
  },
  {
    id: 'sig-802',
    source: 'Competitor Web Crawler (Blue Tokai / Third Wave Direct)',
    topic: 'Competitor Price Promotion',
    title: 'Blue Tokai launched 20% flash promotion on 1kg roasted coffee beans across Mumbai',
    impactScore: -3,
    date: '2026-08-29',
    category: 'competitor_pricing',
    summary: 'Competitor is undercutting our price point (₹2,280 vs our ₹2,850), causing temporary sales volume slowdown across Mumbai cafes this week.'
  },
  {
    id: 'sig-803',
    source: 'Mumbai Retail Confederation Q3 Trends',
    topic: 'Sustainable Home & Office Decor',
    title: 'Surge of +28% demand for artisanal wooden workplace accessories in BKC & Lower Parel',
    impactScore: +4,
    date: '2026-08-24',
    category: 'macro_demand',
    summary: 'Favorable tailwind for Sheesham Laptop Stand (SKU-771). Strong corporate buying expected from BKC financial institutions.'
  }
];

export const INITIAL_STRATEGIC_RECOMMENDATIONS: StrategicRecommendation[] = [
  {
    id: 'rec-001',
    title: 'CRITICAL: Expedite Emergency Reorder for Monsooned Malabar Arabica (SKU-884)',
    executiveSummary: 'Sales Agent predicts +34% demand surge across Mumbai accounts, while Inventory Agent flags only 3 days of stock remaining (42 units). Meanwhile, Customer Experience Agent notes 3 heritage café accounts complaining of potential stockouts.',
    priority: 'CRITICAL',
    confidenceScore: 96,
    participatingAgents: ['sales', 'inventory', 'customer', 'orchestrator'],
    crossFunctionalConflictResolved: 'Conflict between Finance (holding cash) and Sales (demanding stock) resolved by recommending a split reorder of 250 units with 50% deposit terms.',
    actionPlan: [
      'Issue PO-2026-884 to Western Ghats Agro for 250 units (₹3,30,000 value).',
      'Select expedited Mumbai air-cargo batch (50 units) arriving in 36 hours.',
      'Send automated WhatsApp updates to Café Mondegar & Marine Lines partners promising delivery by Thursday.'
    ],
    primaryAction: {
      label: 'Approve & Issue Reorder PO (₹3,30,000)',
      actionType: 'reorder',
      payload: { skuId: 'SKU-884', quantity: 250, supplier: 'Western Ghats Agro Estates' }
    },
    impactEstimate: {
      financial: 'Prevents ₹3,86,400 lost revenue over next 14 days.',
      timeframe: '24-48 Hours execution',
      riskReduction: 'Eliminates 85% risk of major account churn.'
    }
  },
  {
    id: 'rec-002',
    title: 'HIGH: Liquidate Dead Stock (SKU-405) to Reclaim ₹2,26,800 Working Capital',
    executiveSummary: 'Inventory Agent identified 540 units of Dharavi Canvas Tote Bags stagnant for 140+ days. Finance Agent notes cash flow pressure from Bhiwandi freight surcharges.',
    priority: 'HIGH',
    confidenceScore: 89,
    participatingAgents: ['inventory', 'finance', 'sales', 'orchestrator'],
    crossFunctionalConflictResolved: 'Sales favored holding for full retail price (₹1,450), but Finance & COO prioritized cash liquidity to cover upcoming Mumbai payroll.',
    actionPlan: [
      'Bundle SKU-405 as a ₹399 add-on purchase with Insulated Chai Flask (SKU-102).',
      'Offer 50% bulk discount to corporate gifting partners across BKC.',
      'Reinvest freed capital (₹2,26,800) into high-turnover inventory.'
    ],
    primaryAction: {
      label: 'Launch 50% Flash Clearance Bundle',
      actionType: 'discount',
      payload: { skuId: 'SKU-405', discountPercent: 50, bundleTargetSku: 'SKU-102' }
    },
    impactEstimate: {
      financial: 'Reclaims ~₹1,68,000 cash within 15 days.',
      timeframe: 'Immediate rollout',
      riskReduction: 'Frees 12% warehouse shelf footprint in Bhiwandi.'
    }
  },
  {
    id: 'rec-003',
    title: 'MEDIUM: Renegotiate Bhiwandi Logistics SLA to Reduce Freight Surcharge',
    executiveSummary: 'Finance Agent flags 86% cost overrun in freight (₹6,72,000 spent vs ₹3,60,000 budget), while Customer Experience Agent notes rising customer complaints about steep delivery fees.',
    priority: 'MEDIUM',
    confidenceScore: 91,
    participatingAgents: ['finance', 'customer', 'market', 'orchestrator'],
    actionPlan: [
      'Consolidate Thane-Bhiwandi fulfillment with Western Express Logistics.',
      'Implement dynamic shipping fee cap at checkout (₹299 max within MMR).',
      'Shift non-urgent wholesale consignments to scheduled ground carrier.'
    ],
    primaryAction: {
      label: 'Review & Optimize Logistics SLA',
      actionType: 'cut_expense',
      payload: { expenseId: 'exp-101', targetReduction: 312000 }
    },
    impactEstimate: {
      financial: 'Saves ~₹3,12,000/month in freight overhead.',
      timeframe: '7 Days',
      riskReduction: 'Improves customer CSAT by +14 points.'
    }
  }
];

export const PRESET_EXECUTIVE_QUERIES = [
  {
    query: "Why have sales dropped this month?",
    shortLabel: "Why sales dropped this month",
    iconName: "TrendingDown"
  },
  {
    query: "Which products are likely to go out of stock next week?",
    shortLabel: "Stockout predictions next week",
    iconName: "AlertTriangle"
  },
  {
    query: "What expenses can be reduced to improve liquidity?",
    shortLabel: "Expense reduction & cash flow",
    iconName: "IndianRupee"
  },
  {
    query: "What is my net profit and operating margins for August?",
    shortLabel: "Net profit & operating margins",
    iconName: "Wallet"
  },
  {
    query: "What is causing the increase in customer complaints on WhatsApp?",
    shortLabel: "WhatsApp complaint root cause",
    iconName: "MessageCircle"
  }
];

// ==============================================================================
// VYAPAR AI — RAJESH BHAI (THANE HARDWARE & ELECTRICALS) MOCK DATASET
// ==============================================================================

import { 
  SupplierComparisonQuote, 
  CustomerKhataDebtor, 
  ShelfSpaceMarginMetric, 
  VyaparBriefingData,
  ProactiveAlertItem 
} from './types';

export const VYAPAR_AGENTS: AgentMetadata[] = [
  {
    id: 'orchestrator',
    name: 'Vyapar AI (Decision Manager)',
    role: '24/7 Autonomous Business Partner',
    avatar: '⚡',
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    status: 'active',
    description: 'Autonomous loop: DETECT → DECIDE → ACT → LEARN. Understands Hinglish, Hindi, Marathi & English.',
    iconName: 'Sparkles'
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    role: 'Revenue & Velocity Intelligence',
    avatar: '📈',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    status: 'active',
    description: 'Tracks daily cash/UPI sales (₹48,750), today forecast (₹52k-₹58k), and detects copper wire spike (+38%).',
    iconName: 'TrendingUp'
  },
  {
    id: 'inventory',
    name: 'Inventory Agent',
    role: 'Stock-Out Predictor',
    avatar: '📦',
    color: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
    status: 'warning',
    description: 'Predicts stockouts before they happen: 1-inch PVC pipe (3 days left) & Copper wire (4 days left).',
    iconName: 'Boxes'
  },
  {
    id: 'procurement',
    name: 'Procurement Agent',
    role: 'Supplier Rate Negotiator',
    avatar: '🏷️',
    color: 'from-purple-500 to-violet-600',
    badgeBg: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
    status: 'active',
    description: 'Compares regular wholesale suppliers (Mahesh vs Patel vs Shree) to maximize purchase margin.',
    iconName: 'Tags'
  },
  {
    id: 'crm',
    name: 'CRM & Khata Agent',
    role: 'Receivables & Cash Recovery Lead',
    avatar: '👥',
    color: 'from-rose-500 to-pink-600',
    badgeBg: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
    status: 'warning',
    description: 'Manages ₹72,500 pending udhar, drafts personalized WhatsApp reminders, and scores payment recovery likelihood.',
    iconName: 'Users'
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    role: 'Cash Flow & Profit Analyst',
    avatar: '💰',
    color: 'from-amber-600 to-yellow-600',
    badgeBg: 'bg-amber-600/10 text-amber-800 border-amber-600/30',
    status: 'active',
    description: 'Analyzes net daily profit (₹11,430) and 6-month shelf space yield (LEDs 32% margin vs Pumps 8%).',
    iconName: 'Wallet'
  }
];

export const VYAPAR_STORE_DATA: VyaparBriefingData = {
  enterpriseName: "Rajesh Hardware & Electricals",
  owner: "Rajesh Bhai",
  yesterdaySales: 48750,
  yesterdayProfit: 11430,
  outstandingPayments: 72500,
  expectedTodayMin: 52000,
  expectedTodayMax: 58000,
  alerts: [
    {
      id: "alert-pvc",
      type: "inventory",
      message: "Your 1-inch PVC pipe will run out in 3 days.",
      severity: "critical"
    },
    {
      id: "alert-udhar",
      type: "finance",
      message: "Two customers have overdue payments (Sharma Construction ₹32k & Sai Electric ₹21.5k).",
      severity: "warning"
    },
    {
      id: "alert-forecast",
      type: "sales",
      message: "Based on recent trends, today's expected revenue is ₹52,000 to ₹58,000.",
      severity: "info"
    }
  ]
};

export const VYAPAR_SKUS: SKUItem[] = [
  {
    id: 'SKU-PVC-1IN',
    name: '1-inch Heavy PVC Conduit Pipe (50m Bundle)',
    category: 'Pipes & Plumbing',
    price: 320.00,
    cost: 249.00,
    currentStock: 4,
    minStockThreshold: 20,
    reorderQuantity: 50,
    dailyDepletionRate: 1.3,
    daysUntilStockout: 3,
    status: 'critical',
    supplier: 'Mahesh Traders',
    lastRestockDate: '2 weeks ago',
    workingCapitalLocked: 996
  },
  {
    id: 'SKU-COPPER-25',
    name: 'Finolex 2.5 sq mm FR Copper Wire (90m Roll)',
    category: 'Electricals & Wiring',
    price: 1850.00,
    cost: 1420.00,
    currentStock: 12,
    minStockThreshold: 35,
    reorderQuantity: 150,
    dailyDepletionRate: 3.0,
    daysUntilStockout: 4,
    status: 'low_stock',
    supplier: 'Havells / Finolex Dist.',
    lastRestockDate: '10 days ago',
    workingCapitalLocked: 17040
  },
  {
    id: 'SKU-LED-BATTEN',
    name: 'Philips & Havells 20W LED Batten / 9W Bulbs',
    category: 'Lighting & Fixtures',
    price: 240.00,
    cost: 163.20,
    currentStock: 85,
    minStockThreshold: 40,
    reorderQuantity: 100,
    dailyDepletionRate: 8.5,
    daysUntilStockout: 10,
    status: 'optimal',
    supplier: 'Shree Enterprises',
    lastRestockDate: '4 days ago',
    workingCapitalLocked: 13872
  },
  {
    id: 'SKU-WATER-PUMP',
    name: 'Crompton 1.0 HP Submersible Water Pump',
    category: 'Heavy Machinery & Motors',
    price: 10800.00,
    cost: 9936.00,
    currentStock: 14,
    minStockThreshold: 3,
    reorderQuantity: 5,
    dailyDepletionRate: 0.1,
    daysUntilStockout: 140,
    status: 'dead_stock',
    supplier: 'Patel Suppliers',
    lastRestockDate: '3 months ago',
    workingCapitalLocked: 139104
  }
];

export const VYAPAR_SUPPLIERS: SupplierComparisonQuote[] = [
  {
    id: 'sup-mahesh',
    name: 'Mahesh Traders',
    location: 'Bhiwandi Market',
    quotedPrice: 12450,
    deliveryTime: 'Tomorrow morning (10:00 AM)',
    reliabilityScore: 98,
    isBestOption: true,
    potentialSaving: 670
  },
  {
    id: 'sup-patel',
    name: 'Patel Suppliers',
    location: 'Kalwa Naka',
    quotedPrice: 13120,
    deliveryTime: '2 days',
    reliabilityScore: 91,
    isBestOption: false,
    potentialSaving: 0
  },
  {
    id: 'sup-shree',
    name: 'Shree Enterprises',
    location: 'Thane MIDC',
    quotedPrice: 12980,
    deliveryTime: 'Tomorrow evening (6:00 PM)',
    reliabilityScore: 94,
    isBestOption: false,
    potentialSaving: 0
  }
];

export const VYAPAR_DEBTORS: CustomerKhataDebtor[] = [
  {
    id: 'cust-sharma',
    name: 'Sharma Construction',
    contactPerson: 'Vinod Sharma',
    phone: '+91 98201 44521',
    amount: 32000,
    daysOverdue: 14,
    recoveryProbability: 92,
    behavioralInsight: 'Usually pays within 24 hours of receiving a reminder. High probability of recovery.',
    whatsappMessage: 'Namaste Vinod ji, Rajesh Hardware Thane se namaskar. Aapka ₹32,000 ka bill 14 dino se pending hai. Kripya UPI/NEFT link se settlement karein: https://pay.vyapar.ai/inv-sharma',
    status: 'pending'
  },
  {
    id: 'cust-sai',
    name: 'Sai Electric Works',
    contactPerson: 'Prakash Salvi',
    phone: '+91 98192 11984',
    amount: 21500,
    daysOverdue: 8,
    recoveryProbability: 78,
    behavioralInsight: 'Pays in 2 split installments after reminder.',
    whatsappMessage: 'Namaste Prakash bhai, Rajesh Hardware se. Aapka ₹21,500 ka ledger balance baki hai. Kripya payment clear karein: https://pay.vyapar.ai/inv-sai',
    status: 'pending'
  },
  {
    id: 'cust-om',
    name: 'Om Enterprises',
    contactPerson: 'Sunil Joshi',
    phone: '+91 98334 77120',
    amount: 19000,
    daysOverdue: 21,
    recoveryProbability: 65,
    behavioralInsight: 'Requires WhatsApp reminder followed by evening phone call.',
    whatsappMessage: 'Respected Sunil ji, Om Enterprises account shows ₹19,000 overdue for 21 days at Rajesh Hardware. Kindly clear today: https://pay.vyapar.ai/inv-om',
    status: 'pending'
  }
];

export const VYAPAR_SHELF_METRICS: ShelfSpaceMarginMetric[] = [
  {
    category: 'LED Lighting & Bulbs',
    profitMarginPct: 32,
    shelfSpacePct: 12,
    monthlyTurnover: 78000,
    verdict: 'High margin, minimal floor space (Top Performer)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    category: 'Submersible Water Pumps',
    profitMarginPct: 8,
    shelfSpacePct: 30,
    monthlyTurnover: 42000,
    verdict: 'Low margin, blocks 30% of prime shop floor (Dead Space)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  }
];

export const VYAPAR_PROACTIVE_ALERT: ProactiveAlertItem = {
  id: 'proactive-copper',
  title: 'Copper Wire Demand Surge (+38%)',
  item: 'Finolex 2.5 sq mm Copper Wire',
  metricChange: '+38% velocity in last 10 days',
  daysLeft: 4,
  recommendedOrder: '150 rolls',
  atRiskRevenue: 45000,
  description: 'At current sales rate, stock will exhaust in 4 days. Reordering 150 rolls now prevents ₹45,000+ in lost sales.'
};

export const VYAPAR_PITCH_STEPS = [
  {
    stepNumber: 1,
    timestamp: '1:20',
    title: 'Morning Briefing',
    hindiPrompt: 'Aaj shop ka status batao.',
    englishLabel: 'Shop Status Briefing',
    description: "Yesterday sales ₹48,750, profit ₹11,430, outstanding ₹72,500, and 3 key proactive alerts."
  },
  {
    stepNumber: 2,
    timestamp: '1:50',
    title: 'Supplier Compare & PO',
    hindiPrompt: 'Haan, low-stock item order kar do.',
    englishLabel: 'Smart Reorder & 3-Quote Compare',
    description: "Compares Mahesh Traders (₹12,450, best, save ₹670) vs Patel vs Shree, and creates PO."
  },
  {
    stepNumber: 3,
    timestamp: '2:20',
    title: 'Cash Recovery (Khata)',
    hindiPrompt: 'Kaunse customers ne payment nahi kiya?',
    englishLabel: 'Overdue Khata & WhatsApp AI',
    description: "Sharma Construction ₹32k, Sai Electric ₹21.5k, Om ₹19k. 1-click WhatsApp recovery."
  },
  {
    stepNumber: 4,
    timestamp: '2:50',
    title: 'Profit & Shelf Space',
    hindiPrompt: 'Business improve kaise kar sakte hai?',
    englishLabel: 'Shelf Space vs Margin Strategy',
    description: "LED 32% margin on 12% space vs Pumps 8% on 30% space. +₹18k-24k profit recommendation."
  },
  {
    stepNumber: 5,
    timestamp: '3:15',
    title: 'Predictive Surge Alert',
    hindiPrompt: 'Copper wire stock status batao.',
    englishLabel: 'Proactive Demand Spike (+38%)',
    description: "Copper wire surge +38%, out in 4 days, 150 rolls reorder to save ₹45,000+ at-risk sales."
  }
];

