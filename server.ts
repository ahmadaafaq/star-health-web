import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

// URL of the Python RAG backend
const RAG_API_URL = process.env.RAG_API_URL || "http://localhost:8000";

const app = express();
const PORT = 3001;

app.use(express.json());

// Initialize Groq client (same model as the RAG pipeline: llama-3.3-70b-versatile)
const groqApiKey = process.env.GROQ_API_KEY;
let groq: Groq | null = null;
if (groqApiKey) {
  try {
    groq = new Groq({ apiKey: groqApiKey });
    console.log("Groq API successfully initialized on server.");
  } catch (error) {
    console.error("Failed to initialize Groq API Client:", error);
  }
} else {
  console.log("No GROQ_API_KEY found. Server will run with rules-based fallbacks.");
}


// Health check endpoint — also probes the Python RAG service
app.get("/api/health", async (req, res) => {
  let ragReady = false;
  try {
    const ragRes = await fetch(`${RAG_API_URL}/health`);
    if (ragRes.ok) {
      ragReady = true;
    }
  } catch (_) {
    // RAG service not reachable
  }
  res.json({ status: "ok", aiEnabled: ragReady, ragEnabled: ragReady });
});

// Plans static data structure for matching logic
const PLANS_DATA = [
  {
    id: "family-health-optima",
    name: "Family Health Optima",
    category: "Family Floater Plan",
    tagline: "All-in-one family floater with automatic restoration and newborn baby cover.",
    premium: 1199,
    coverage: "₹5 Lakh – ₹25 Lakh",
    waitingPeriod: "36 months for Pre-Existing Diseases; Immediate for accidents",
    claimRatio: "98.2%",
    coPay: "No Co-Pay for network hospital treatments",
    roomRent: "Single Private Room (no capping)",
    keyBenefits: [
      "Automatic restoration of sum insured whenever exhausted",
      "Additional SI for road traffic accident injuries",
      "Newborn baby covered from day 1 of birth",
      "Loyalty bonus accumulation up to 100% of sum insured",
      "Covers modern treatments: immunotherapy, stem cell therapy & more"
    ],
    description: "A comprehensive family floater covering adults (18–65 years) and dependent children (16 days–25 years) with ₹5L–₹25L options. Offers automatic restoration, newborn cover, 100% loyalty bonus and modern treatment support. Available in 1 or 2 year tenure."
  },
  {
    id: "arogya-sanjeevani",
    name: "Arogya Sanjeevani",
    category: "Standard Health Plan",
    tagline: "IRDAI's standardised policy with sum insured up to ₹2 Crore.",
    premium: 799,
    coverage: "₹5 Lakh – ₹2 Crore",
    waitingPeriod: "30-day initial waiting; 36 months for Pre-Existing Diseases",
    claimRatio: "97.5%",
    coPay: "5% co-pay on all claims",
    roomRent: "Up to 2% of Sum Insured per day",
    keyBenefits: [
      "Cumulative bonus: 5% increase per claim-free year (max 50%)",
      "AYUSH treatments fully covered up to sum insured",
      "All day-care procedures covered",
      "Cataract: up to 25% of SI or ₹40,000 per eye (whichever is lower)",
      "ICU charges: up to 5% of SI per day (max ₹10,000/day)"
    ],
    description: "IRDAI's standard health policy offering wide coverage from ₹5L to ₹2Cr for individuals up to 65 years. Earns cumulative bonus every claim-free year, covers AYUSH, day-care, cataract and ICU expenses at reasonable premiums."
  },
  {
    id: "medi-classic",
    name: "Medi Classic (Individual)",
    category: "Individual Health Plan",
    tagline: "Classic individual health plan with lifelong renewal and long-term premium discounts.",
    premium: 899,
    coverage: "₹5 Lakh – ₹15 Lakh",
    waitingPeriod: "30-day initial waiting; 36 months for Pre-Existing Diseases",
    claimRatio: "97.8%",
    coPay: "No Co-Pay",
    roomRent: "Single Private Room",
    keyBenefits: [
      "Pre-hospitalization expenses: up to 30 days before admission",
      "Post-hospitalization expenses: up to 60 days after discharge",
      "Road ambulance: ₹750 per hospitalisation",
      "Long-term discount: 10% on 2nd year premium, 12.5% on 3rd year",
      "Instalment facility: monthly, quarterly or half-yearly payments"
    ],
    description: "An individual indemnity plan with ₹5L–₹15L coverage and lifelong renewability. Covers pre and post hospitalisation expenses, ambulance charges, and offers significant discounts for multi-year commitments with flexible payment instalments."
  },
  {
    id: "star-assure",
    name: "Star Health Assure",
    category: "Comprehensive Floater Plan",
    tagline: "Unlimited restoration, wellness rewards up to 20% discount — for up to 9 family members.",
    premium: 1499,
    coverage: "₹5 Lakh – ₹2 Crore",
    waitingPeriod: "36 months for Pre-Existing Diseases; Immediate for accidents",
    claimRatio: "98.0%",
    coPay: "No Co-Pay",
    roomRent: "Single Private Room (no capping)",
    keyBenefits: [
      "Unlimited automatic restoration of sum insured in a policy year",
      "Wellness discount up to 20% on premium for healthy lifestyle",
      "Up to 9 family members covered under one floater",
      "40% floater discount when 2 adults are covered together",
      "5% early entry discount for insured aged ≤45 years at first purchase"
    ],
    description: "A comprehensive plan for adults (18–75 years) and dependent children (16 days–25 years) offering ₹5L to ₹2Cr coverage. Unique for its unlimited restoration, wellness discount, early entry benefit and 1/2/3 year tenure options."
  },
  {
    id: "star-premier",
    name: "Star Health Premier",
    category: "Premium Wellness Plan",
    tagline: "Wellness-integrated plan for 50+ with home care, AYUSH & modern treatment cover.",
    premium: 1899,
    coverage: "₹10 Lakh – ₹1 Crore",
    waitingPeriod: "36 months for Pre-Existing Diseases",
    claimRatio: "98.5%",
    coPay: "No Co-Pay",
    roomRent: "Single Private Room (no capping)",
    keyBenefits: [
      "Designed for individuals aged 50+ with no upper age limit",
      "No pre-acceptance medical screening required",
      "Home care treatment and AYUSH treatment fully covered",
      "Modern treatments including stem cell therapy & immunotherapy",
      "Wellness points program: earn discounts through healthy activities"
    ],
    description: "A premium indemnity plan for individuals aged 50 and above with sum insured options from ₹10L to ₹1Cr. No pre-policy medical tests, covers home care, AYUSH, modern treatments and a wellness rewards program for premium discounts."
  },
  {
    id: "young-star",
    name: "Young Star Insurance",
    category: "Plan for Young Individuals",
    tagline: "Unlimited restoration and wellness rewards tailored for young adults and families.",
    premium: 699,
    coverage: "₹5 Lakh – ₹1 Crore",
    waitingPeriod: "36 months for Pre-Existing Diseases; Immediate for accidents",
    claimRatio: "97.6%",
    coPay: "No Co-Pay",
    roomRent: "Single Private Room",
    keyBenefits: [
      "Available on individual and floater basis (Silver & Gold plans)",
      "Unlimited automatic restoration of sum insured in a policy year",
      "Wellness discount up to 20% on premium",
      "Up to 9 family members under family floater",
      "Covers day-care treatments, in-patient and nursing expenses"
    ],
    description: "Specifically designed for young adults and families (up to 75 years; children from 91 days). Offers unlimited sum insured restoration, wellness discounts up to 20%, and up to 9 family members under one floater in Silver or Gold variants."
  },
  {
    id: "super-star",
    name: "Super Star",
    category: "Super-Comprehensive Plan",
    tagline: "Star Health's most comprehensive plan — top-tier coverage with no compromises.",
    premium: 2299,
    coverage: "₹5 Lakh – ₹5 Crore",
    waitingPeriod: "36 months for Pre-Existing Diseases; Immediate for accidents",
    claimRatio: "98.8%",
    coPay: "No Co-Pay",
    roomRent: "Single Private Room (no capping)",
    keyBenefits: [
      "Widest sum insured range — up to ₹5 Crore coverage",
      "AYUSH and modern advanced treatment fully covered",
      "Home care and day-care treatments covered",
      "Unlimited restoration of sum insured",
      "All day-care procedures and modern surgical interventions"
    ],
    description: "Star Health's flagship super-comprehensive plan offering the broadest coverage range. No compromises on room rent, modern treatments, restoration or AYUSH. Ideal for individuals and families seeking the absolute best health protection."
  },
  {
    id: "star-comprehensive",
    name: "Star Comprehensive Insurance Policy",
    category: "All-Round Individual & Floater",
    tagline: "OPD cover, maternity benefit, worldwide emergency cover — complete protection in one plan.",
    premium: 1099,
    coverage: "₹5 Lakh – ₹1 Crore",
    waitingPeriod: "36 months for Pre-Existing Diseases; Immediate for accidents",
    claimRatio: "98.1%",
    coPay: "No Co-Pay",
    roomRent: "Single Private Room (no capping)",
    keyBenefits: [
      "OPD consultations and pharmacy expenses covered",
      "Maternity benefit with newborn baby cover from day 1",
      "Worldwide emergency hospitalisation cover",
      "Personal accident cover included in the base plan",
      "No room rent capping — single private room without sub-limits"
    ],
    description: "A holistic individual and floater plan covering ₹5L to ₹1Cr. Uniquely includes OPD cover, maternity benefits, personal accident cover and worldwide emergency hospitalisation. No co-pay, no room rent capping — designed for complete, worry-free protection."
  }
];

// Helper rules engine to fall back on or supplement AI
function rulesBasedRecommend(profile: any) {
  const hasSenior = profile.members?.includes("parents") || Number(profile.age) >= 50;
  const isYoung = Number(profile.age) < 36;
  const isBudget = profile.budget === "modest" || profile.budget === "low";
  const hasPregnancy = profile.pregnancyPlan === true;
  const wantsOpdOrComprehensive = profile.budget === "high" || profile.budget === "premium";

  if (hasSenior) {
    const plan = PLANS_DATA.find(p => p.id === "star-premier") || PLANS_DATA[4];
    return { plan, savings: "₹3,40,000", cashlessCount: "13,900+" };
  }
  if (hasPregnancy && wantsOpdOrComprehensive) {
    // Star Comprehensive has OPD + maternity + worldwide cover
    const plan = PLANS_DATA.find(p => p.id === "star-comprehensive") || PLANS_DATA[0];
    return { plan, savings: "₹2,80,000", cashlessCount: "14,100+" };
  }
  if (hasPregnancy) {
    const plan = PLANS_DATA.find(p => p.id === "family-health-optima") || PLANS_DATA[0];
    return { plan, savings: "₹2,60,000", cashlessCount: "14,200+" };
  }
  if (isYoung && !profile.members?.includes("parents")) {
    const plan = PLANS_DATA.find(p => p.id === "young-star") || PLANS_DATA[5];
    return { plan, savings: "₹1,80,000", cashlessCount: "14,000+" };
  }
  if (isBudget) {
    const plan = PLANS_DATA.find(p => p.id === "arogya-sanjeevani") || PLANS_DATA[1];
    return { plan, savings: "₹1,20,000", cashlessCount: "12,500+" };
  }
  // Default: Star Assure for general family/comprehensive needs
  const plan = PLANS_DATA.find(p => p.id === "star-assure") || PLANS_DATA[3];
  return { plan, savings: "₹2,60,000", cashlessCount: "14,200+" };
}

// Interactive Advisor recommendation API
app.post("/api/recommend", async (req, res) => {
  try {
    const profile = req.body;
    console.log("Analyzing profile for recommendation:", profile);

    // ── Step 1: Try RAG Python backend first ──────────────────────────────────
    try {
      console.log(`Calling RAG backend for structured recommendation: ${RAG_API_URL}/api/recommend_plan`);
      const ragRes = await fetch(`${RAG_API_URL}/api/recommend_plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
        signal: AbortSignal.timeout(8000) // 8 second timeout
      });

      if (ragRes.ok) {
        const ragData = await ragRes.json();
        console.log("RAG recommendation returned:", ragData?.recommendedPlanId, "confidence:", ragData?.confidence);
        // Return the RAG recommendation directly — it includes all required fields
        return res.json(ragData);
      } else {
        const errText = await ragRes.text();
        console.warn(`RAG backend returned non-OK status ${ragRes.status}: ${errText}. Falling back to local engine.`);
      }
    } catch (ragError: any) {
      console.warn(`RAG backend unreachable (${ragError?.message || ragError}). Falling back to local rule engine.`);
    }

    // ── Step 2: Local rules-based fallback ────────────────────────────────────
    console.log("Using local rules-based recommendation engine as fallback.");
    const ruleMatch = rulesBasedRecommend(profile);
    const matchedPlan = ruleMatch.plan;

    let responseJson = {
      recommendedPlanId: matchedPlan.id,
      confidence: 95,
      whyExplanation: `Based on your family setup of ${profile.members?.join(", ") || "yourself"} and your priority on coverage, the ${matchedPlan.name} is the ideal fit. It features a custom room limit bypass, specialized pre-existing timelines, and direct cash clearances.`,
      savingsEstimate: ruleMatch.savings,
      cashlessCount: ruleMatch.cashlessCount,
      monthlyPremium: matchedPlan.premium,
      highlightedBenefits: matchedPlan.keyBenefits
    };

    // ── Step 3: Optionally enhance with Groq for better text ─────────────────
    if (groq) {
      try {
        const prompt = `You are "Star AI", a premium, friendly, and expert health insurance advisor representing Star Health Brand India.
Analyze this user onboarding profile:
- Age of Primary: ${profile.age}
- Family Members: ${profile.members?.join(", ")}
- City Classification: ${profile.city}
- Budget Focus: ${profile.budget}
- Pre-existing Diseases: ${profile.preExisting?.join(", ") || "None mentioned"}
- Has Diabetes? ${profile.diabetes ? "Yes" : "No"}
- Includes Parents? ${profile.parentsIncluded ? "Yes" : "No"}
- My Parents Covered: ${profile.myParentsCount ?? 0}
- Spouse's Parents / Parent-in-Laws Covered: ${profile.spouseParentsCount ?? 0}
- Has Employer Insurance? ${profile.employerInsurance ? "Yes" : "No"}
- Planning pregnancy? ${profile.pregnancyPlan ? "Yes" : "No"}
- Preferred Hospitals: ${profile.preferredHospital || "Any cashless center"}

The system has matched this user to the following plan template:
- Plan ID: ${matchedPlan.id}
- Plan Name: ${matchedPlan.name}
- Base Monthly Premium: ₹${matchedPlan.premium}

Tasks:
1. Construct a brief, empathetic, professional explanation (under 3-4 clear sentences) explaining why this specific plan is the perfect choice for them. Mention their medical notes or budget constraint elegantly. Don't use developer jargon.
2. Come up with a realistic estimated Indian family hospitalization savings (e.g., "₹2,40,000" or similar based on their city and members).
3. List 3 specific bullet benefits customized to their profile.

Return ONLY a raw JSON object (no markdown), exactly:
{
  "whyExplanation": "...",
  "savingsEstimate": "₹X,XX,000",
  "monthlyPremium": ${matchedPlan.premium},
  "highlightedBenefits": ["Benefit 1", "Benefit 2", "Benefit 3"]
}`;

        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 800,
          response_format: { type: "json_object" }
        });

        const rawText = response.choices[0].message.content?.trim() || "";
        console.log("Groq Advisor JSON Output:", rawText);

        const aiResponse = JSON.parse(rawText);
        responseJson = {
          ...responseJson,
          whyExplanation: aiResponse.whyExplanation || responseJson.whyExplanation,
          savingsEstimate: aiResponse.savingsEstimate || responseJson.savingsEstimate,
          highlightedBenefits: aiResponse.highlightedBenefits || responseJson.highlightedBenefits,
        };
      } catch (groqError) {
        console.error("Groq advisor call failed, using rule-based recommendation text:", groqError);
      }
    }

    res.json(responseJson);
  } catch (error: any) {
    console.error("AI Advisor error:", error);
    res.status(500).json({ error: "Could not generate insurance advice" });
  }
});



// Assistant Floating Chat API — proxies to Python RAG backend
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'user' | 'assistant', content: string }
    console.log("Chat request received. Messages in history:", messages?.length);

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Messages history is required." });
    }

    // Forward to the Python RAG API
    const ragResponse = await fetch(`${RAG_API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!ragResponse.ok) {
      const errText = await ragResponse.text();
      console.error("RAG API responded with error:", ragResponse.status, errText);
      throw new Error(`RAG API error: ${ragResponse.status}`);
    }

    const data = await ragResponse.json() as { message: string };
    console.log("RAG answer received, length:", data.message?.length);
    res.json({ message: data.message });

  } catch (error) {
    console.error("Chat proxy error — RAG service may be down:", error);
    res.json({
      message:
        "I'm having trouble reaching the knowledge base right now. Please ensure the Star Health RAG API is running (`python api.py` in the star-health-rag folder). Meanwhile, feel free to explore our plans or use the advisor wizard above!",
    });
  }
});

// Supabase Lead Management Integration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://efsgbittghkwjoklhqfk.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_sVxAizYJoQGhe_ysQYvIBQ_EXqB0Xpj";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// API to submit a new lead and run AI conversion ranking
app.post("/api/submit-lead", async (req, res) => {
  try {
    const lead = req.body;
    console.log("Processing lead submission for:", lead.name);

    // Compute AI Conversion Score (0-100), Classification ('hot'|'warm'|'cold'), and explanation
    let aiScore = 70;
    let aiType = "warm";
    let aiExplanation = "Lead shows standard interest, recommended plan selected.";

    if (groq) {
      try {
        const prompt = `You are an expert health insurance lead conversion analyst.
Analyze this customer onboarding profile:
- Name: ${lead.name}
- Age: ${lead.age}
- Members: ${lead.members?.join(", ") || "Self"}
- City: ${lead.city || "Not specified"}
- Budget: ${lead.budget || "Not specified"}
- Pre-existing Diseases: ${lead.preExistingDiseases?.join(", ") || "None"}
- Has Diabetes: ${lead.diabetes ? "Yes" : "No"}
- Parents Included: ${lead.parentsIncluded ? "Yes" : "No"}
- My Parents Covered: ${lead.myParentsCount ?? 0}
- Spouse's Parents / Parent-in-Laws Covered: ${lead.spouseParentsCount ?? 0}
- Employer Insurance: ${lead.employerInsurance ? "Yes" : "No"}
- Pregnancy Plan: ${lead.pregnancyPlan ? "Yes" : "No"}
- Preferred Hospital: ${lead.preferredHospital || "None"}
- Recommended Plan ID: ${lead.recommendedPlanId || "None"}

Evaluate their likelihood to purchase a plan on a scale of 0 to 100.
Determine lead category:
- 'hot' (Score >= 80): High intent, e.g., planning pregnancy, including elderly parents, no employer coverage, or specific hospital needs.
- 'warm' (Score 40-79): Moderate intent, e.g., has employer coverage (lower urgency) or budget constraints but active interest.
- 'cold' (Score < 40): Low intent, e.g., minimal details filled, or very low budget.

Return ONLY a raw JSON object (no markdown):
{
  "score": 85,
  "type": "hot",
  "rationale": "Explanation of the score based on their profile metrics."
}`;
        const response = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 400,
          response_format: { type: "json_object" }
        });
        const rawText = response.choices[0].message.content?.trim() || "";
        console.log("Groq Lead Scorer Output:", rawText);
        const aiRank = JSON.parse(rawText);
        aiScore = aiRank.score ?? aiScore;
        aiType = aiRank.type ?? aiType;
        aiExplanation = aiRank.rationale ?? aiExplanation;
      } catch (e) {
        console.error("Groq lead scorer failed, using rules-based fallback:", e);
        // Rules-based fallback
        let score = 60;
        if (lead.pregnancyPlan) score += 15;
        if (lead.parentsIncluded) score += 10;
        if (lead.employerInsurance) score -= 20;
        if (lead.preExistingDiseases && lead.preExistingDiseases.length > 0) score += 5;
        if (lead.preferredHospital) score += 10;
        if (score > 100) score = 100;
        if (score < 0) score = 0;

        aiScore = score;
        aiType = score >= 80 ? "hot" : score < 40 ? "cold" : "warm";
        aiExplanation = `Rules-based assessment: Intent is ${aiType} because of family coverage setup and ${lead.employerInsurance ? 'existing corporate cover' : 'no active corporate cover'}.`;
      }
    } else {
      // Rules-based score when Groq is not configured
      let score = 60;
      if (lead.pregnancyPlan) score += 15;
      if (lead.parentsIncluded) score += 10;
      if (lead.employerInsurance) score -= 20;
      if (lead.preExistingDiseases && lead.preExistingDiseases.length > 0) score += 5;
      if (lead.preferredHospital) score += 10;
      if (score > 100) score = 100;
      if (score < 0) score = 0;

      aiScore = score;
      aiType = score >= 80 ? "hot" : score < 40 ? "cold" : "warm";
      aiExplanation = `Rules-based evaluation: Conversion likelihood scored ${score} based on age, family size, and employer backup status.`;
    }

    // Insert or update lead in Supabase
    let data, error;
    if (lead.id) {
      console.log("Updating existing lead in Supabase:", lead.id);
      const response = await supabaseClient
        .from('leads')
        .update({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          gender: lead.gender || null,
          whatsapp_consent: lead.whatsapp_consent || false,
          scheduled_call_at: lead.scheduledCallAt ? new Date(lead.scheduledCallAt).toISOString() : null,
          call_status: lead.scheduledCallAt ? 'scheduled' : undefined,
          ai_rank_score: aiScore,
          profile_score: aiScore,
          ai_rank_explanation: aiExplanation,
          lead_type: aiType
        })
        .eq('id', lead.id)
        .select();
      data = response.data;
      error = response.error;
    } else {
      console.log("Inserting new lead in Supabase");
      const response = await supabaseClient
        .from('leads')
        .insert([
          {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            gender: lead.gender || null,
            whatsapp_consent: lead.whatsapp_consent || false,
            scheduled_call_at: lead.scheduledCallAt ? new Date(lead.scheduledCallAt).toISOString() : null,
            age: lead.age ? parseInt(lead.age) : null,
            members: lead.members || [],
            city: lead.city,
            budget: lead.budget,
            pre_existing_diseases: lead.preExistingDiseases || [],
            diabetes: lead.diabetes || false,
            parents_included: lead.parentsIncluded || false,
            employer_insurance: lead.employerInsurance || false,
            pregnancy_plan: lead.pregnancyPlan || false,
            preferred_hospital: lead.preferredHospital,
            recommended_plan_id: lead.recommendedPlanId,
            ai_rank_score: aiScore,
            profile_score: aiScore,
            ai_rank_explanation: aiExplanation,
            lead_type: aiType,
            lead_status: lead.scheduledCallAt ? 'callback' : 'new'
          }
        ])
        .select();
      data = response.data;
      error = response.error;
    }

    if (error) {
      console.error("Error inserting/updating lead in Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    // Trigger sending the WhatsApp welcome greeting asynchronously if phone is provided
    const insertedLead = data[0];
    if (insertedLead && insertedLead.phone && insertedLead.name && insertedLead.whatsapp_consent) {
      const targetPhone = insertedLead.phone;
      const targetName = insertedLead.name;
      const targetId = insertedLead.id;

      // Use the plan ID from the request body as primary source (most reliable),
      // fall back to whatever Supabase returned in the insert response
      const planId: string = lead.recommendedPlanId || insertedLead.recommended_plan_id || "";

      console.log(`Triggering WhatsApp welcome message for ${targetName} (${targetPhone}), plan: ${planId}`);

      // Make asynchronous request to Python backend
      fetch(`${RAG_API_URL}/send-welcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: targetPhone,
          name: targetName,
          lead_id: targetId,
          recommended_plan_id: planId || null
        })
      }).then(async (response) => {
        if (response.ok) {
          const resJson = await response.json();
          console.log(`Welcome message response status:`, resJson);
        } else {
          console.error(`Failed to send welcome message:`, response.statusText);
        }
      }).catch((err) => {
        console.error("Error calling send-welcome endpoint:", err);
      });
    }

    res.json({ success: true, lead: data[0] });
  } catch (error: any) {
    console.error("Lead submission endpoint error:", error);
    res.status(500).json({ error: "Could not submit lead" });
  }
});

// Endpoint to explicitly send policy details via WhatsApp
app.post("/api/send-whatsapp", async (req, res) => {
  try {
    const { lead_id, phone, name, recommended_plan_id } = req.body;
    if (!phone || !name) {
      return res.status(400).json({ error: "Missing phone or name" });
    }

    // Optionally update the DB status to indicate it was sent
    if (lead_id) {
      await supabaseClient
        .from('leads')
        .update({ whatsapp_consent: true })
        .eq('id', lead_id);
    } else {
      const cleanPhone = phone.replace(/\D/g, "");
      await supabaseClient
        .from('leads')
        .update({ whatsapp_consent: true })
        .or(`phone.eq.${phone},phone.eq.+${cleanPhone},phone.eq.${cleanPhone},phone.ilike.%${cleanPhone}`);
    }

    // Make asynchronous request to Python backend
    const response = await fetch(`${RAG_API_URL}/send-welcome`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone,
        name: name,
        lead_id: lead_id,
        recommended_plan_id: recommended_plan_id || null
      })
    });

    if (response.ok) {
      res.json({ success: true, message: "WhatsApp message triggered" });
    } else {
      res.status(500).json({ error: "Failed to send WhatsApp message" });
    }
  } catch (error: any) {
    console.error("Send WhatsApp endpoint error:", error);
    res.status(500).json({ error: "Could not trigger WhatsApp message" });
  }
});

// Endpoint to fetch LiveKit token for browser WebRTC VOIP calls
app.get("/api/livekit-token", async (req, res) => {
  try {
    const leadId = req.query.leadId;
    const voiceAgentUrl = process.env.VOICE_AGENT_URL || "http://localhost:4000";
    console.log(`Generating LiveKit WebRTC token for lead: ${leadId}`);
    
    const response = await fetch(`${voiceAgentUrl}/api/voice/token?leadId=${leadId || ""}`);
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Voice agent token error: ${response.status} ${errText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("LiveKit token proxy error:", error);
    res.status(500).json({ error: error.message || "Failed to generate LiveKit token" });
  }
});


// Endpoint to request a secure signed URL from ElevenLabs for browser VOIP calls
app.get("/api/signed-url", async (req, res) => {
  try {
    const agentId = process.env.ELEVENLABS_AGENT_ID || "agent_9101kvjj8g1cecatsrr130tgv6rn";
    const apiKey = process.env.ELEVENLABS_API_KEY;

    // Check if the developer API key is not configured, or is the default invalid key
    if (!apiKey || apiKey === "cc4abdcf882f697f4c7ec8c991e863d626c6b0f55033c466abcc39d8ba753535" || apiKey.trim() === "" || req.query.public === "true") {
      console.log(`[ElevenLabs] API key is missing, invalid, or client requested public access. Directing client to connect directly to public agent: ${agentId}`);
      return res.json({ usePublicAgent: true, agentId });
    }

    console.log("Requesting ElevenLabs signed URL for agent:", agentId);

    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs signed URL error:", response.status, errText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Signed URL endpoint error:", error);
    res.status(500).json({ error: "Could not generate session token" });
  }
});

// Endpoint to link conversation ID with lead ID in Supabase
app.post("/api/register-conversation", async (req, res) => {
  try {
    const { leadId, conversationId } = req.body;
    if (!leadId || !conversationId) {
      return res.status(400).json({ error: "Missing leadId or conversationId" });
    }

    console.log(`Registering conversation ${conversationId} for lead ${leadId}`);

    const { data, error } = await supabaseClient
      .from('leads')
      .update({ conversation_id: conversationId })
      .eq('id', leadId)
      .select();

    if (error) {
      console.error("Error updating lead conversation ID in Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, lead: data[0] });
  } catch (error: any) {
    console.error("Register conversation error:", error);
    res.status(500).json({ error: "Could not register conversation" });
  }
});

// API to fetch all leads (for Kanban admin dashboard)
app.get("/api/leads", async (req, res) => {
  try {
    const { data, error } = await supabaseClient
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching leads from Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Fetch leads endpoint error:", error);
    res.status(500).json({ error: "Could not fetch leads" });
  }
});

// API to update lead lifecycle status
app.patch("/api/update-lead-status", async (req, res) => {
  try {
    const { id, lead_status, call_status, scheduled_call_at } = req.body;
    console.log(`Updating lead ${id} - lead_status: ${lead_status}, call_status: ${call_status}`);

    const updateData: any = {};
    if (lead_status) updateData.lead_status = lead_status;
    if (call_status) updateData.call_status = call_status;
    if (scheduled_call_at) {
      updateData.scheduled_call_at = new Date(scheduled_call_at).toISOString();
    }

    const { data, error } = await supabaseClient
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating lead status in Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, lead: data[0] });
  } catch (error) {
    console.error("Update lead status endpoint error:", error);
    res.status(500).json({ error: "Could not update lead status" });
  }
});

// Proxy call summary score updates to the Python backend
app.post("/api/update-score-from-call", async (req, res) => {
  try {
    const { lead_id, call_summary } = req.body;
    console.log(`Forwarding call summary update for lead ${lead_id} to Python API`);

    const response = await fetch(`${RAG_API_URL}/api/update-score-from-call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id, call_summary })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Python API responded with error:", response.status, errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Proxy call summary error:", error);
    res.status(500).json({ error: "Failed to communicate with RAG API server" });
  }
});


// GET WhatsApp message history for all leads (directly from Supabase)
app.get("/api/messages", async (req, res) => {
  try {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching messages from Supabase:", error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    console.error("Messages list endpoint error:", error);
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

// GET WhatsApp message history for a single phone number (from Python RAG backend)
app.get("/api/messages/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    const response = await fetch(`${RAG_API_URL}/conversation/${encodeURIComponent(phone)}`);
    if (!response.ok) {
      const errText = await response.text();
      console.error("RAG API responded with error:", response.status, errText);
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy messages error:", error);
    res.status(500).json({ error: "Failed to communicate with RAG API server" });
  }
});

// GET WhatsApp message history for a single lead ID (from Python RAG backend)
app.get("/api/messages/lead/:leadId", async (req, res) => {
  try {
    const leadId = req.params.leadId;
    const response = await fetch(`${RAG_API_URL}/conversation/lead/${encodeURIComponent(leadId)}`);
    if (!response.ok) {
      const errText = await response.text();
      console.error("RAG API responded with error:", response.status, errText);
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy messages by lead ID error:", error);
    res.status(500).json({ error: "Failed to communicate with RAG API server" });
  }
});

// POST send manual WhatsApp custom reply (via Python RAG backend)
app.post("/api/send-custom-whatsapp", async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ error: "phone and message are required" });
    }
    console.log(`Forwarding manual WhatsApp custom reply to RAG backend for phone: ${phone}`);
    const response = await fetch(`${RAG_API_URL}/send-reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, message })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("RAG API responded with error:", response.status, errText);
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy send-reply error:", error);
    res.status(500).json({ error: "Failed to communicate with RAG API server" });
  }
});

// POST bulk import leads into Supabase
app.post("/api/bulk-import-leads", async (req, res) => {
  try {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ error: "Leads must be a non-empty array" });
    }

    console.log(`Bulk importing ${leads.length} leads...`);

    const formattedLeads = leads.map(l => ({
      name: l.name || null,
      phone: l.phone || null,
      email: l.email || null,
      age: l.age ? parseInt(l.age, 10) : null,
      gender: l.gender || null,
      policy: l.policy || l.recommended_plan_id || null,
      recommended_plan_id: l.recommended_plan_id || l.policy || null,
      city: l.city || null,
      budget: l.budget || null,
      pre_existing_diseases: Array.isArray(l.pre_existing_diseases) ? l.pre_existing_diseases : [],
      campaign_name: l.campaign_name || 'Manual Import',
      lead_status: l.lead_status || 'new',
      call_status: l.call_status || 'pending',
      scheduled_call_at: l.scheduled_call_at ? new Date(l.scheduled_call_at).toISOString() : null
    }));

    const { data, error } = await supabaseClient
      .from('leads')
      .insert(formattedLeads)
      .select();

    if (error) {
      console.error("Error bulk inserting leads to Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, count: data.length, data });
  } catch (error: any) {
    console.error("Bulk import leads error:", error);
    res.status(500).json({ error: "Could not import leads" });
  }
});

// POST proxy trigger outbound call to the voice agent server
app.post("/api/trigger-outbound-call", async (req, res) => {
  try {
    const { leadId } = req.body;
    if (!leadId) {
      return res.status(400).json({ error: "leadId is required" });
    }

    const voiceAgentUrl = process.env.VOICE_AGENT_URL || "http://localhost:4000";
    console.log(`Requesting voice agent server at ${voiceAgentUrl} to call lead: ${leadId}`);

    const response = await fetch(`${voiceAgentUrl}/api/voice/trigger-outbound`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Voice agent trigger responded with error:", response.status, errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Trigger outbound call proxy error:", error);
    res.status(500).json({ error: "Failed to connect to voice agent server" });
  }
});


// Setup Vite Dev server or Serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0" },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Production serving static files folder bound.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and running on http://localhost:${PORT}`);
  });
}

startServer();
