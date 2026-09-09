import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.7-flash';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, skus = [], sales = [], expenses = [], feedbacks = [], signals = [] } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const targetAgentId = body.targetAgentId || null;
    const isVyaparMode = body.storeMode === 'vyapar' || [
      'shop', 'status', 'pvc', 'sharma', 'sai electric', 'om enterprises', 'payment', 'khata', 'udhar',
      'mahesh', 'patel', 'shree', 'copper', 'wire', 'shelf', 'pump', 'led', 'rajesh', 'batao', 'kar do',
      'bhej do', 'kaunse'
    ].some(k => query.toLowerCase().includes(k));

    // System prompt grounding the Gemini model in live SME enterprise context
    const enterpriseContext = isVyaparMode ? `You are Vyapar AI — The AI Business Manager for India's Small Businesses (DETECT → DECIDE → ACT → LEARN).
You manage Rajesh Hardware & Electricals (Thane West, Maharashtra) owned by Rajesh Bhai.
The system has 6 specialized collaborating agents:
1. orchestrator: Vyapar AI (Decision Manager & Autonomous Shop Partner)
2. sales: Sales Agent (Daily sales ₹48,750, profit ₹11,430, today forecast ₹52k-₹58k, copper wire velocity +38%)
3. inventory: Inventory Agent (Stock-out predictor: 1-inch PVC pipe out in 3 days, copper wire out in 4 days)
4. procurement: Procurement Agent (Checks regular suppliers: Mahesh Traders ₹12,450 [saves ₹670], Patel ₹13,120, Shree ₹12,980)
5. crm: CRM & Khata Agent (Overdue udhar ₹72,500: Sharma Construction ₹32k [92% recovery probability, pays on reminder], Sai Electric ₹21.5k, Om ₹19k)
6. finance: Finance Agent (6-month shelf space vs margin audit: LEDs 32% margin on 12% space vs Water pumps 8% margin on 30% space -> +₹18k-₹24k monthly profit decision)

${targetAgentId ? `USER HAS DIRECTLY TARGETED: [${targetAgentId}]. This agent must respond with domain expertise.` : 'Default to Vyapar AI Swarm Orchestration.'}

LIVE TELEMETRY:
- Yesterday's Counter Sales: ₹48,750 | Net Profit: ₹11,430
- Uncollected Receivables (Udhar): ₹72,500
- Low-Stock Critical: 1-inch Heavy PVC Conduit Pipe (4 bundles left, exhausts in 3 days)
- Best Supplier Quote: Mahesh Traders (₹12,450 vs Patel ₹13,120 vs Shree ₹12,980, saves ₹670)
- Overdue Debtors: Sharma Construction (₹32,000, 14 days, 92% recovery probability), Sai Electric (₹21,500), Om Enterprises (₹19,000)
- Proactive Anomaly: Copper wire +38% sales in last 10 days, 4 days stock remaining, 150 rolls recommended to prevent ₹45,000+ lost sales
- Shelf Space Audit: LED 32% margin / 12% shelf vs Water pumps 8% margin / 30% shelf -> Recommending LED expansion and electrician combos for +₹18,000 to ₹24,000/month extra profit.` 
: `You are an Autonomous Multi-Agent Swarm for Apex Mumbai Retail Pvt. Ltd. (Mumbai, India), behaving like an AI pair-programming & executive reasoning IDE (Antigravity IDE architecture).
The Swarm has 6 specialized collaborating agents:
1. orchestrator: Decision Support Agent (COO) - Swarm Leader, orchestrates turns and final synthesis
2. sales: Sales Intelligence Agent (revenue, unit volume, AOV, conversion drop-offs)
3. inventory: Inventory Operations Agent (stockouts, EOQ POs, dead stock, safety stocks)
4. finance: Finance & Liquidity Agent (cash buffer, OpEx overruns, Net Profit, gross margin, unit economics)
5. customer: Customer Experience Agent (WhatsApp ticket sentiment, delivery friction, satisfaction)
6. market: Market Intelligence Agent (competitor pricing, promotions, positioning)

${targetAgentId ? `USER HAS DIRECTLY TARGETED / SWITCHED CONTEXT TO: [${targetAgentId}]. This agent must lead the discussion, respond directly in first-person, and debate with the orchestrator and other relevant domain agents.` : 'Default to Swarm Orchestration led by Decision Support Agent (COO).'}

LIVE ENTERPRISE BUSINESS CONTEXT (ALL AMOUNTS IN INDIAN RUPEES ₹):
- Monthly Sales History: ${JSON.stringify(sales)}
- Inventory SKU Matrix: ${JSON.stringify(skus.map((s: any) => ({ id: s.id, name: s.name, currentStock: s.currentStock, depletionRate: s.dailyDepletionRate, daysLeft: s.daysUntilStockout, margin: Math.round(((s.price - s.cost) / s.price) * 100) + '%' })))}
- Expense Ledger: ${JSON.stringify(expenses)}
- Customer Feedback Stream: ${JSON.stringify(feedbacks)}
- Competitor Signals: ${JSON.stringify(signals)}`;

    const systemInstruction = `${enterpriseContext}

RESPONSE INSTRUCTIONS (CRISP & CLEAR EXECUTIVE STANDARD - INDIAN RUPEE ₹ ONLY):
1. Crisp, High-Signal Style: Deliver a concise, mathematically grounded, executive-ready response. Avoid repetitive fluff, wordiness, or unnecessary filler.
2. Lead with Bottom-Line: Open the finalAnswer immediately with the primary bottom-line finding (e.g., exact Net Profit rupee figure (₹) and margin).
3. Currency Standard: ALWAYS use Indian Rupee (₹) symbol and Indian numbering format where appropriate (e.g. ₹31,84,000 or ₹31.84L). NEVER use dollar signs ($).
4. Live Debate Turns (3-4 Turns Max): Generate 3 to 4 sharp, distinct turns among relevant agents (max 2-3 sentences per turn). Each agent must challenge or validate assumptions citing exact data points.
5. Markdown Document (.md View): Format "finalAnswer" as a clean executive markdown document with:
   - Header with clear document title
   - Concise bottom-line summary box / bullet points
   - Clean Markdown Table comparing status quo vs optimized projections
   - Actionable 3-point Execution Plan with exact rupee targets (₹)
6. Return valid JSON adhering strictly to this schema:
{
  "fileName": "kebab-case-document-name.md",
  "participatingAgents": ["orchestrator", "sales", "finance", "inventory"],
  "reasoningSteps": [
    {
      "agentId": "orchestrator",
      "agentName": "Display Name",
      "phase": "data_ingestion",
      "thought": "Sharp 2-sentence conversational argument or analysis...",
      "dataCited": ["Data Point 1", "Data Point 2"]
    }
  ],
  "finalAnswer": "Crisp executive markdown document with Indian Rupees (₹). Use bolding, tables, bullet points, and headers (###). Be exact, quantitative, and scannable.",
  "keyDataPoints": [
    { "label": "Key Metric", "value": "₹XX,XXX" }
  ],
  "suggestedActions": [
    { "label": "Action Button Label", "actionType": "reorder", "payload": {} }
  ]
}
IMPORTANT: Return ONLY the JSON object, with no markdown fences around it if possible, or within \`\`\`json.`;

    const userPrompt = `Executive User Query: "${query}"\nProvide a crisp, clear, and highly quantitative executive analysis in .md document format following the multi-agent discussion schema.`;

    const candidateModels = [
      GEMINI_MODEL,
      'gemini-3.7-flash',
      'gemini-flash-latest',
      'gemini-3.6-flash'
    ].filter((v, i, a) => a.indexOf(v) === i);

    let lastError = null;
    let data: any = null;
    let successfulModel = GEMINI_MODEL;

    for (const model of candidateModels) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemInstruction}\n\n${userPrompt}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              topP: 0.95,
            }
          })
        });

        if (response.ok) {
          data = await response.json();
          successfulModel = model;
          break;
        } else {
          const errText = await response.text();
          console.warn(`Gemini model ${model} failed (${response.status}):`, errText);
          lastError = `${model}: ${response.statusText}`;
        }
      } catch (reqErr: any) {
        lastError = reqErr.message;
      }
    }

    if (!data) {
      return NextResponse.json({ error: `All Gemini latest models failed: ${lastError}` }, { status: 502 });
    }
    const candidate = data.candidates?.[0];
    const rawText = candidate?.content?.parts?.[0]?.text || '';

    // Parse JSON from model output
    let parsedResult;
    try {
      // Clean markdown code fence if present
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('Failed to parse strict JSON from Gemini, falling back to raw markdown response');
      parsedResult = {
        finalAnswer: rawText,
        reasoningSteps: [
          {
            agentId: 'orchestrator',
            agentName: 'Decision Support Agent (COO)',
            phase: 'data_ingestion',
            thought: `Processed query: "${query}" with Gemini 3.6 Flash.`,
            dataCited: ['Live Gemini Engine Active']
          },
          {
            agentId: 'orchestrator',
            agentName: 'Decision Support Agent (COO)',
            phase: 'final_synthesis',
            thought: 'Synthesized live AI response.',
            dataCited: ['Gemini 3.6 Flash Inference Complete']
          }
        ],
        participatingAgents: ['orchestrator'],
        keyDataPoints: [],
        suggestedActions: []
      };
    }

    return NextResponse.json({
      id: `msg-${Date.now()}`,
      sender: 'coo',
      queryText: query,
      model: GEMINI_MODEL,
      fileName: parsedResult.fileName || (query ? `${query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32)}.md` : 'executive-forecast.md'),
      ...parsedResult,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

  } catch (err: any) {
    console.error('API /api/chat error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
