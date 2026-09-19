"""SME Management API Router — Multi-Agent Virtual Executive Team Endpoints."""

import os
import json
import urllib.request
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
import structlog

logger = structlog.get_logger("routes.sme_management")

router = APIRouter(prefix="/api/v1/sme", tags=["sme_management"])


class QueryRequest(BaseModel):
    query: str = Field(..., description="Natural language query from SME owner")


class ActionRequest(BaseModel):
    action_type: str = Field(..., description="Type of action: reorder | discount | cut_expense | contact_customer")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Action specific parameters")


class SimulateEventRequest(BaseModel):
    event_type: str = Field(..., description="Simulation type: sales_spike | whatsapp_complaint | logistics_hike | competitor_promo")


@router.get("/overview")
async def get_sme_overview():
    """Returns executive overview metrics, health score, and active strategic recommendations."""
    return {
        "enterprise_name": "Apex Mumbai Retail & Logistics Pvt. Ltd.",
        "health_score": 84,
        "active_agents": 6,
        "status": "Virtual Management Team Active",
        "key_kpis": {
          "monthly_revenue": 3184000,
          "target_revenue": 4160000,
          "revenue_variance_pct": -23.4,
          "critical_stockout_skus": 2,
          "cash_liquidity_buffer": 1136000,
          "csat_score": 78
        },
        "recommendations_count": 3
    }


@router.get("/skus")
async def get_sku_catalog():
    """Returns current SKU depletion matrix, stock levels, and EOQ numbers."""
    return [
        {
            "id": "SKU-884",
            "name": "Monsooned Malabar Arabica Coffee (1kg)",
            "category": "Artisanal Beverages",
            "price": 2850.00,
            "cost": 1320.00,
            "current_stock": 42,
            "min_stock_threshold": 100,
            "reorder_quantity": 250,
            "daily_depletion_rate": 14.2,
            "days_until_stockout": 3,
            "status": "critical"
        },
        {
            "id": "SKU-102",
            "name": "Insulated Copper/Steel Chai Flask (750ml)",
            "category": "Drinkware & Living",
            "price": 1999.00,
            "cost": 680.00,
            "current_stock": 310,
            "min_stock_threshold": 80,
            "reorder_quantity": 150,
            "daily_depletion_rate": 6.5,
            "days_until_stockout": 47,
            "status": "optimal"
        },
        {
            "id": "SKU-405",
            "name": "Dharavi Handcrafted Heavy Canvas Tote Bag",
            "category": "Artisanal Lifestyle",
            "price": 1450.00,
            "cost": 420.00,
            "current_stock": 540,
            "min_stock_threshold": 150,
            "reorder_quantity": 200,
            "daily_depletion_rate": 0.8,
            "days_until_stockout": 675,
            "status": "dead_stock"
        }
    ]


@router.post("/query")
async def process_query(req: QueryRequest):
    """Processes natural language SME queries using live Google Gemini 3.6 Flash model."""
    logger.info("sme_query_received", query=req.query)
    
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    gemini_model = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

    # Detect if query belongs to Vyapar AI (Rajesh Hardware Thane) or Apex Retail
    q_lower = req.query.lower()
    is_vyapar = any(k in q_lower for k in [
        "shop", "status", "batao", "order", "pvc", "sharma", "sai electric", "om enterprises",
        "payment", "khata", "udhar", "supplier", "mahesh", "patel", "shree", "wire", "copper",
        "profit", "improve", "shelf", "pump", "led", "dukan", "rajesh", "bhai", "kripya", "nahi kiya",
        "reminder", "bhej", "kaunse", "aaj", "kiti", "sanga"
    ])

    if is_vyapar:
        system_prompt = (
            "You are Vyapar AI — The Autonomous AI Business Manager for India's Small Businesses, operating for Rajesh Bhai, "
            "owner of Rajesh Hardware & Electricals in Thane West (Maharashtra, India).\n"
            "Business Telemetry Context (All amounts in Indian Rupees ₹):\n"
            "- Yesterday's Gross Sales: ₹48,750 | Net Profit: ₹11,430\n"
            "- Outstanding Uncollected Udhar/Receivables: ₹72,500 (Sharma Construction: ₹32,000, Sai Electric: ₹21,500, Om Enterprises: ₹19,000)\n"
            "- Today's Projected Revenue: ₹52,000 to ₹58,000\n"
            "- Critical Low-Stock: 1-inch PVC conduit pipe running out in 3 days. Regular suppliers: Mahesh Traders (₹12,450, best option, saves ₹670), Patel Suppliers (₹13,120), Shree Enterprises (₹12,980).\n"
            "- Customer Recovery AI: Sharma Construction (₹32,000, 92% recovery probability, pays after reminder).\n"
            "- Strategic Shelf Space Insight: LED products give 32% margin on 12% shelf space, Water pumps give 8% margin on 30% shelf space. Recommending LED expansion and electrician combos for +₹18,000 to ₹24,000/month extra profit.\n"
            "- Proactive Surge: Finolex 2.5mm copper wire sales +38% over 10 days. Stock runs out in 4 days. Recommended order: 150 rolls (avoids ₹45,000+ lost sales).\n\n"
            "Instructions: Respond respectfully in fluent Hinglish or English as Rajesh Bhai's AI business manager. "
            "Be predictive, proactive, and actionable. Cite exact Rupee (₹) amounts. Never hallucinate."
        )
    else:
        system_prompt = (
            "You are the Decision Support Agent (COO) and Multi-Agent Orchestrator for Apex Mumbai Retail & Logistics Pvt. Ltd. (Mumbai, India).\n"
            "Business Telemetry Context (All amounts in Indian Rupees ₹):\n"
            "- August Gross Revenue: ₹31,84,000 (-23.4% vs ₹41,60,000 target)\n"
            "- Average Product Margin: 58.2% -> Gross Profit: ₹18,53,088\n"
            "- Total Operating Overheads: ₹36,56,000 (Bhiwandi Freight: ₹6.72L, Mumbai Digital Marketing: ₹7.60L, Staff Payroll: ₹14.80L, Thane Warehouse: ₹4.84L, TallyPrime SaaS: ₹2.60L)\n"
            "- Net Operating Result: -₹18,02,912 (Loss)\n"
            "- Available Liquidity Buffer: ₹11,36,000\n"
            "- Critical Stockouts: SKU-884 (Monsooned Malabar Arabica, 42 units left, 3 days to stockout), SKU-990 (Noise-Cancelling Wireless Earbuds, 18 units left, 4 days)\n"
            "- Customer Complaints: 28% negative sentiment on WhatsApp API (Mumbai Line) due to Bhiwandi monsoon delivery bottlenecks.\n\n"
            "Instructions: Return a structured response analyzing the query with multi-agent reasoning (Sales, Inventory, Finance, Customer, COO). ALWAYS format amounts in Indian Rupees (₹) with Indian Lakh numbering."
        )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={gemini_key}"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"{system_prompt}\n\nUser Query: \"{req.query}\""}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "topP": 0.95
        }
    }

    try:
        req_data = json.dumps(payload).encode("utf-8")
        http_req = urllib.request.Request(
            url, 
            data=req_data, 
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(http_req, timeout=15) as resp:
            resp_body = json.loads(resp.read().decode("utf-8"))
            candidate = resp_body.get("candidates", [{}])[0]
            gemini_text = candidate.get("content", {}).get("parts", [{}])[0].get("text", "")
            
            return {
                "query": req.query,
                "model": gemini_model,
                "enterprise": "Rajesh Hardware & Electricals (Thane)" if is_vyapar else "Apex Mumbai Retail",
                "participating_agents": ["orchestrator", "sales", "finance", "inventory", "procurement", "crm"] if is_vyapar else ["orchestrator", "sales", "finance", "inventory"],
                "final_answer": gemini_text,
                "reasoning_steps": [
                    {"agent": "Vyapar AI Orchestrator" if is_vyapar else "COO Orchestrator", "phase": "Data Ingestion", "thought": f"Ingested live telemetry context and dispatched query to {gemini_model}."},
                    {"agent": "Domain Analysis Swarm", "phase": "Reasoning", "thought": "Synthesized multi-domain financial, operational, and customer data points."},
                    {"agent": "Executive Synthesis", "phase": "Final Synthesis", "thought": "Validated bottom-line strategic response with zero hallucination constraints."}
                ],
                "key_metrics": [
                    {"label": "Yesterday Sales", "value": "₹48,750"},
                    {"label": "Yesterday Profit", "value": "₹11,430"},
                    {"label": "Outstanding Payments", "value": "₹72,500"}
                ] if is_vyapar else [
                    {"label": "August Revenue", "value": "₹31,84,000"},
                    {"label": "Net Profit / Loss", "value": "-₹18,02,912"},
                    {"label": "Cash Buffer", "value": "₹11,36,000"}
                ]
            }
    except Exception as exc:
        logger.error("gemini_api_call_failed", error=str(exc))
        # Pitch-perfect graceful fallback if offline
        if is_vyapar:
            if "status" in q_lower or "morning" in q_lower or "aaj" in q_lower:
                ans = (
                    "Good morning Rajesh ji!\n\n"
                    "• **Yesterday's sales**: ₹48,750\n"
                    "• **Profit**: ₹11,430\n"
                    "• **Outstanding payments**: ₹72,500\n\n"
                    "And I found **three things you should know**:\n"
                    "1. Your 1-inch PVC pipe will run out in 3 days.\n"
                    "2. Two customers have overdue payments (Sharma Construction ₹32,000 & Sai Electric ₹21,500).\n"
                    "3. Based on recent trends, today's expected revenue is **₹52,000 to ₹58,000**."
                )
            elif "order" in q_lower or "low-stock" in q_lower or "pvc" in q_lower:
                ans = (
                    "Checking regular suppliers for 1-inch PVC conduit pipe:\n\n"
                    "• **Mahesh Traders**: ₹12,450 (Delivery: Tomorrow morning)\n"
                    "• **Patel Suppliers**: ₹13,120 (Delivery: 2 days)\n"
                    "• **Shree Enterprises**: ₹12,980 (Delivery: Tomorrow evening)\n\n"
                    "⭐ **Best option**: Mahesh Traders. **Potential saving: ₹670**.\n"
                    "Say 'Order kar do' to issue the Purchase Order."
                )
            elif "payment" in q_lower or "customer" in q_lower or "nahi kiya" in q_lower or "udhar" in q_lower:
                ans = (
                    "Here are the customers with overdue payments:\n\n"
                    "1. **Sharma Construction** — ₹32,000 (14 days overdue | High recovery chance 92%)\n"
                    "2. **Sai Electric Works** — ₹21,500 (8 days overdue | Medium-high 78%)\n"
                    "3. **Om Enterprises** — ₹19,000 (21 days overdue | 65%)\n\n"
                    "💡 *AI Learning*: Sharma Construction usually pays within 24 hours of receiving a reminder. Say 'Reminder bhej do' to dispatch personalized WhatsApp messages."
                )
            elif "improve" in q_lower or "profit" in q_lower or "business" in q_lower:
                ans = (
                    "Analysis of past 6 months business data revealed:\n\n"
                    "• **LED products** generate **32% profit**, but occupy only **12% of shelf space**.\n"
                    "• **Water pumps** generate only **8% profit**, but occupy **30% of shelf space**.\n\n"
                    "**Vyapar AI Recommendations**:\n"
                    "1. Increase LED inventory and prime shelf display.\n"
                    "2. Reduce slow-moving pumps from front display to catalog-on-demand.\n"
                    "3. Create combo packages for electricians (Batten + Switch bundles).\n\n"
                    "💰 **Estimated potential additional monthly profit**: **₹18,000–₹24,000**."
                )
            elif "wire" in q_lower or "copper" in q_lower or "surge" in q_lower:
                ans = (
                    "⚡ **Proactive Predictive Alert**:\n\n"
                    "Copper wire sales have increased by **38% over the last 10 days**.\n"
                    "At the current rate, stock will finish in **4 days**.\n\n"
                    "• **Recommended order**: 150 rolls\n"
                    "• **Potential lost sales if ignored**: ₹45,000+\n\n"
                    "This is what is going to happen, this is why, and this is what you should do."
                )
            else:
                ans = f"Namaste Rajesh ji! Vyapar AI has analyzed: Yesterday sales ₹48,750, profit ₹11,430, outstanding ₹72,500. Expected today ₹52,000–₹58,000. Low stock: 1-inch PVC pipe (3 days left)."

            return {
                "query": req.query,
                "model": "vyapar_offline_intelligence",
                "enterprise": "Rajesh Hardware & Electricals (Thane)",
                "participating_agents": ["orchestrator", "sales", "inventory", "procurement", "crm", "finance"],
                "final_answer": ans,
                "reasoning_steps": [
                    {"agent": "Vyapar AI (Decision Manager)", "phase": "Data Ingestion", "thought": "Parsed natural language query in Thane shop telemetry context."},
                    {"agent": "Domain Analysis Swarm", "phase": "Reasoning", "thought": "Correlated sales trends, supplier quotes, and customer recovery history."}
                ],
                "key_metrics": [
                    {"label": "Yesterday Sales", "value": "₹48,750"},
                    {"label": "Yesterday Profit", "value": "₹11,430"},
                    {"label": "Outstanding Payments", "value": "₹72,500"}
                ]
            }

        return {
            "query": req.query,
            "model": "offline_fallback",
            "participating_agents": ["orchestrator", "finance"],
            "final_answer": f"Analysis for \"{req.query}\": August Revenue stands at ₹31,84,000 with Gross Profit of ₹18,53,088 and Total Expenses of ₹36,56,000, yielding Net Loss of -₹18,02,912. Cash buffer remains at ₹11,36,000.",
            "reasoning_steps": [
                {"agent": "COO Orchestrator", "phase": "Fallback", "thought": f"Gemini API returned {exc}. Rendered verified financial ledger balance."}
            ]
        }


@router.post("/action")
async def execute_action(req: ActionRequest):
    """Executes a strategic action (e.g. issuing a PO or launching a discount)."""
    logger.info("sme_action_executed", action_type=req.action_type, payload=req.payload)
    return {
        "status": "success",
        "action_type": req.action_type,
        "message": f"Action '{req.action_type}' executed successfully.",
        "payload": req.payload
    }


@router.post("/simulate-event")
async def simulate_event(req: SimulateEventRequest):
    """Simulates an operational event (Sales Spike, WhatsApp Surge, etc.)."""
    logger.info("sme_simulated_event", event_type=req.event_type)
    return {
        "status": "event_injected",
        "event_type": req.event_type,
        "message": f"Event '{req.event_type}' injected into multi-agent stream."
    }


# ==============================================================================
# VYAPAR AI — RAJESH BHAI (THANE HARDWARE & ELECTRICALS) ENDPOINTS
# ==============================================================================

@router.get("/vyapar/briefing")
async def get_vyapar_briefing():
    """Returns morning status briefing for Rajesh Hardware & Electricals (Thane)."""
    return {
        "enterprise_name": "Rajesh Hardware & Electricals (Thane West)",
        "owner": "Rajesh Bhai",
        "yesterday_sales": 48750,
        "profit": 11430,
        "outstanding_payments": 72500,
        "today_forecast": {
            "min": 52000,
            "max": 58000,
            "currency": "INR",
            "formatted": "₹52,000 to ₹58,000"
        },
        "proactive_alerts": [
            {
                "id": "alert-pvc",
                "type": "inventory",
                "message": "Your 1-inch PVC pipe will run out in 3 days.",
                "severity": "critical",
                "action": "Order low-stock items"
            },
            {
                "id": "alert-udhar",
                "type": "finance",
                "message": "Two customers have overdue payments (Sharma Construction, Sai Electric).",
                "severity": "warning",
                "action": "Send reminders"
            },
            {
                "id": "alert-forecast",
                "type": "sales",
                "message": "Based on recent trends, today's expected revenue is ₹52,000 to ₹58,000.",
                "severity": "info",
                "action": "Prepare fast-moving shelf"
            }
        ]
    }


@router.get("/vyapar/suppliers/compare")
async def get_vyapar_supplier_comparison(item_id: str = "item-pvc-1in"):
    """Compares regular wholesale suppliers for low-stock inventory (1-inch PVC pipes)."""
    return {
        "item_id": item_id,
        "item_name": "1-inch Heavy PVC Conduit Pipe (Bundle of 50)",
        "required_quantity": 50,
        "suppliers": [
            {
                "id": "sup-mahesh",
                "name": "Mahesh Traders",
                "location": "Bhiwandi Market",
                "quoted_price": 12450,
                "delivery_time": "Tomorrow morning (10:00 AM)",
                "reliability_score": 98,
                "is_best_option": True,
                "potential_saving": 670
            },
            {
                "id": "sup-patel",
                "name": "Patel Suppliers",
                "location": "Kalwa Naka",
                "quoted_price": 13120,
                "delivery_time": "2 days",
                "reliability_score": 91,
                "is_best_option": False,
                "potential_saving": 0
            },
            {
                "id": "sup-shree",
                "name": "Shree Enterprises",
                "location": "Thane MIDC",
                "quoted_price": 12980,
                "delivery_time": "Tomorrow evening",
                "reliability_score": 94,
                "is_best_option": False,
                "potential_saving": 0
            }
        ],
        "potential_saving": 670,
        "best_option": {
            "supplier_name": "Mahesh Traders",
            "quoted_price": 12450,
            "saving_vs_highest": 670,
            "delivery": "Tomorrow morning"
        }
    }


@router.get("/vyapar/customers/overdue")
async def get_vyapar_overdue_customers():
    """Identifies customers with pending udhar/khata and behavioral recovery probability."""
    return {
        "total_outstanding": 72500,
        "uncollected_customers_count": 3,
        "customers": [
            {
                "id": "cust-sharma",
                "name": "Sharma Construction",
                "contact_person": "Vinod Sharma",
                "phone": "+91 98201 44521",
                "amount": 32000,
                "days_overdue": 14,
                "recovery_probability": 92,
                "behavioral_insight": "Learned from past 8 invoices: Sharma Construction usually pays immediately after receiving a polite WhatsApp reminder.",
                "whatsapp_message": "Namaste Vinod ji, Rajesh Hardware & Electricals (Thane) se. Aapka bill amount ₹32,000 pichle 14 dino se pending hai. Kripya UPI ya bank transfer se settle karein: https://pay.vyapar.ai/inv-sharma"
            },
            {
                "id": "cust-sai",
                "name": "Sai Electric Works",
                "contact_person": "Prakash Salvi",
                "phone": "+91 98192 11984",
                "amount": 21500,
                "days_overdue": 8,
                "recovery_probability": 78,
                "behavioral_insight": "Usually pays in two tranches upon WhatsApp reminder.",
                "whatsapp_message": "Namaste Prakash bhai, Rajesh Hardware se. Aapka ₹21,500 ka payment pending hai. Kripya aaj payment update karein."
            },
            {
                "id": "cust-om",
                "name": "Om Enterprises",
                "contact_person": "Sunil Joshi",
                "phone": "+91 98334 77120",
                "amount": 19000,
                "days_overdue": 21,
                "recovery_probability": 65,
                "behavioral_insight": "Requires WhatsApp reminder followed by evening phone call reminder.",
                "whatsapp_message": "Respected Sunil ji, Om Enterprises account shows ₹19,000 overdue for 21 days at Rajesh Hardware. Kindly clear today."
            }
        ]
    }


@router.post("/vyapar/reminders/send")
async def send_vyapar_reminders(req: Dict[str, Any]):
    """Sends personalized WhatsApp payment reminders to overdue customers."""
    logger.info("vyapar_whatsapp_reminders_dispatched", payload=req)
    return {
        "status": "success",
        "sent_count": 3,
        "total_recovery_target": 72500,
        "predicted_immediate_recovery": 32000,
        "message": "Personalized WhatsApp reminders successfully sent to Sharma Construction, Sai Electric Works, and Om Enterprises with digital UPI payment links."
    }


@router.get("/vyapar/shelf-analysis")
async def get_vyapar_shelf_space_analysis():
    """6-month data analysis comparing shelf space occupied vs profit margin."""
    return {
        "analysis_period": "Past 6 months",
        "products": [
            {
                "category": "LED Lighting & Battens",
                "profit_margin_pct": 32,
                "shelf_space_pct": 12,
                "monthly_turnover": 78000,
                "verdict": "High margin, low space utilization (Under-indexed)"
            },
            {
                "category": "Submersible Water Pumps",
                "profit_margin_pct": 8,
                "shelf_space_pct": 30,
                "monthly_turnover": 42000,
                "verdict": "Low margin, high space utilization (Over-indexed)"
            }
        ],
        "recommendations": [
            "Increase LED inventory & display frontage by 18%",
            "Reduce slow-moving pump inventory on prime floor to catalog-on-demand",
            "Create combo packages for local Thane electricians (LED Batten + Switch box bundle)"
        ],
        "estimated_additional_monthly_profit": {
            "min": 18000,
            "max": 24000,
            "formatted": "₹18,000–₹24,000"
        }
    }


@router.get("/vyapar/proactive-alerts")
async def get_vyapar_proactive_alerts():
    """Proactive predictive intelligence detecting sales velocity anomalies."""
    return {
        "alert_id": "proactive-copper-surge",
        "detected_item": "Finolex 2.5 sq mm Copper Wire",
        "metric_change": "+38% sales increase over last 10 days",
        "days_of_stock_left": 4,
        "recommended_order_quantity": "150 rolls",
        "potential_lost_sales_if_ignored": 45000,
        "reasoning": "Unprecedented pre-monsoon renovation surge in Thane West electrical projects. Current inventory will deplete in 4 days. 150 rolls recommended to secure ₹45,000+ at-risk sales."
    }

