import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API successfully initialized on server.");
  } catch (error) {
    console.error("Failed to initialize Gemini API Client:", error);
  }
} else {
  console.log("No GEMINI_API_KEY found. Server will run with rules-based fallbacks.");
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai });
});

// Plans static data structure for matching logic
const PLANS_DATA = [
  {
    id: "comprehensive",
    name: "Star Comprehensive Plus",
    category: "Family & Individual Protection",
    tagline: "The absolute gold standard in worry-free health cover for families.",
    premium: 1250,
    coverage: "5 Lakh - 1 Crore",
    waitingPeriod: "3 Years for Pre-Existing, Immediate for Accidents",
    claimRatio: "98.2%",
    coPay: "No Co-Pay (Zero out-of-pocket for network hospital treatments)",
    roomRent: "Single Private A/C Room included with absolutely no rent capping.",
    keyBenefits: [
      "No room rent cap - stay in comfortable single private rooms",
      "Maternity cover up to ₹1,00,000 with newborn baby protection",
      "Cashless claims approved across 14,000+ top Indian hospitals",
      "Automatic restoration of sum insured up to 100% on depletion"
    ],
    description: "Ideal for growing families wanting complete freedom. It covers everything from maternity, air ambulance, outpatient consultations, to modern treatments with zero room-rent cap."
  },
  {
    id: "diabetes",
    name: "Star Diabetes Safe Specialty",
    category: "Diabetes Relief",
    tagline: "Dedicated coverage for Diabetes patients starting from Day 1.",
    premium: 1100,
    coverage: "3 Lakh - 10 Lakh",
    waitingPeriod: "Immediate coverage for diabetes complications & insulin plans",
    claimRatio: "97.8%",
    coPay: "10% Co-Pay optional for lower premium",
    roomRent: "Private Room covered up to ₹5,000/day",
    keyBenefits: [
      "Zero waiting period for treatments related to Diabetes Safe clauses",
      "Covers insulin pumps, glucose monitoring, and clinical regular diagnostic visits",
      "Covers serious diabetic complications (cardiac, renal, ophthalmic, retinopathy)",
      "Wellness rewards & cashback up to 25% on maintaining normal HbA1c levels"
    ],
    description: "Designed for individuals living with Type 1 or Type 2 Diabetes. Skip the standard 3-4 year pre-existing waiting period; get specialized covers and regular health check-ups from day 1."
  },
  {
    id: "assure",
    name: "Star Senior Citizens Red Carpet",
    category: "Senior Citizen Care",
    tagline: "Eldercare security designed specifically for parents and grandparents (60-75).",
    premium: 1850,
    coverage: "5 Lakh - 25 Lakh",
    waitingPeriod: "1 Year for specified pre-existing diseases",
    claimRatio: "96.5%",
    coPay: "No pre-insurance check-up required, 30% co-pay on claims",
    roomRent: "Single Private Room covered up to ₹6,000 per day",
    keyBenefits: [
      "No medical tests needed before buying this policy",
      "Covers standard joint replacements, cataracts, and cardiac emergency treatments",
      "Subsidized outpatient specialist consultations and home physiotherapy support",
      "14,000+ network diagnostic & hospital partners with 2-hour cashless exit"
    ],
    description: "Specifically created for senior parents. Avoid pre-policy screening complications while securing access to pre-existing coverages after just 12 months with pre-defined co-payment structures."
  },
  {
    id: "family-delite",
    name: "Star Family Delite Budget",
    category: "Affordable Family Shield",
    tagline: "Smart health cover for young families looking for optimal cost protection.",
    premium: 650,
    coverage: "3 Lakh - 15 Lakh",
    waitingPeriod: "4 Years for Pre-Existing, Immediate for Accidents",
    claimRatio: "97.4%",
    coPay: "No co-pay unless chosen by the policyholder",
    roomRent: "Shared Room / Private Room capped at 1% of Sum Insured daily",
    keyBenefits: [
      "Most economical health shield targeting younger couples and kids",
      "Pre and post hospitalization costs covered up to 60 days",
      "No Claim Bonus raises your sum insured by 20% every claim-free year",
      "Covers alternative AYUSH treatments (Ayurvedic, Homeopathy, Unani)"
    ],
    description: "An incredibly budget-friendly policy for young working professionals and parents looking for reliable security without high premiums. Covers all essentials, day-care, and standard single-room stays."
  },
  {
    id: "critical",
    name: "Star Critical Illness Multipay",
    category: "Lumpsum Protection",
    tagline: "Instant single lumpsum payout on diagnosis of 37 critical conditions.",
    premium: 450,
    coverage: "5 Lakh - 50 Lakh",
    waitingPeriod: "90 Days initial waiting period",
    claimRatio: "98.8%",
    coPay: "Zero Co-Pay (Direct Cash Lumpsum payout)",
    roomRent: "Not applicable (Direct transfer to bank account)",
    keyBenefits: [
      "Instant lumpsum payout upon first-ever diagnosis of Cancer, Heart Attack, Stroke, etc.",
      "Ensures non-medical needs, home loans, educational costs, or international search is secured",
      "Multi-Pay: Payouts for multiple unrelated critical conditions in a lifetime",
      "Income tax exemption benefits under Section 80D"
    ],
    description: "A vital layer of supplement insurance. Instead of paying actual bills, you get a tax-free single cash drop to use however you wish on recovery, alternative treatments, travel, or paying family debt."
  }
];

// Helper rules engine to fall back on or supplement AI
function rulesBasedRecommend(profile: any) {
  const isDiabetes = profile.diabetes === true || String(profile.preExisting || "").toLowerCase().includes("diabet");
  const hasSenior = profile.members?.includes("parents") || Number(profile.age) >= 60;
  const isBudget = profile.budget === "modest" || profile.budget === "low";
  const hasPregnancy = profile.pregnancyPlan === true;

  if (isDiabetes) {
    return { plan: PLANS_DATA[1], savings: "₹1,85,000", cashlessCount: "13,800+" };
  }
  if (hasSenior && Number(profile.age) >= 60) {
    return { plan: PLANS_DATA[2], savings: "₹3,40,000", cashlessCount: "12,900+" };
  }
  if (hasPregnancy) {
    return { plan: PLANS_DATA[0], savings: "₹2,60,000", cashlessCount: "14,200+" };
  }
  if (isBudget) {
    return { plan: PLANS_DATA[3], savings: "₹1,20,000", cashlessCount: "11,500+" };
  }
  return { plan: PLANS_DATA[0], savings: "₹2,60,000", cashlessCount: "14,200+" };
}

// Interactive Advisor recommendation API
app.post("/api/recommend", async (req, res) => {
  try {
    const profile = req.body;
    console.log("Analyzing profile for recommendation:", profile);

    // Get rules-based matched plan
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

    if (ai) {
      try {
        const prompt = `
          You are "Star AI", a premium, friendly, and expert health insurance advisor representing Star Health Brand India.
          Analyze this user onboarding profile:
          - Age of Primary: ${profile.age}
          - Family Members: ${profile.members?.join(", ")}
          - City Classification: ${profile.city}
          - Budget Focus: ${profile.budget}
          - Pre-existing Diseases: ${profile.preExisting?.join(", ") || "None mentioned"}
          - Has Diabetes? ${profile.diabetes ? "Yes" : "No"}
          - Includes Parents? ${profile.parentsIncluded ? "Yes" : "No"}
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

          Output your response as structured JSON matching exactly this schema:
          {
            "whyExplanation": "Direct, clean, highly personalized advice sentence targeting their exact profile.",
            "savingsEstimate": "Estimated money saved on average hospitalization (format like: ₹X,XX,000)",
            "monthlyPremium": ${matchedPlan.premium},
            "highlightedBenefits": ["Benefit 1 custom to them", "Benefit 2 custom to them", "Benefit 3 custom to them"]
          }
          Ensure ONLY clean, parseable JSON is returned. Do not wraps it in markdown code blocks, return raw text.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const rawText = response.text ? response.text.trim() : "";
        console.log("Raw Gemini Advisor JSON Output:", rawText);

        const aiResponse = JSON.parse(rawText);
        responseJson = {
          ...responseJson,
          whyExplanation: aiResponse.whyExplanation || responseJson.whyExplanation,
          savingsEstimate: aiResponse.savingsEstimate || responseJson.savingsEstimate,
          highlightedBenefits: aiResponse.highlightedBenefits || responseJson.highlightedBenefits,
        };
      } catch (geminiError) {
        console.error("Gemini advisor call failed, preceding with default rule recommendation:", geminiError);
      }
    }

    res.json(responseJson);
  } catch (error: any) {
    console.error("AI Advisor error:", error);
    res.status(500).json({ error: "Could not generate insurance advice" });
  }
});

// Assistant Floating Chat API (ChatGPT like)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'user' | 'model', message: string }
    console.log("Chat assistant request received. Number of local history items:", messages?.length);

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Messages history is required." });
    }

    // Default expert advice fallback if AI is down
    let replyText = "I'm currently optimizing my response systems. Regarding Star Health Insurance, our Star Comprehensive Plus is an exceptional premium choice covering all cashless charges, maternity, and single-room costs without capping. Diabetes patients can enroll directly in the Star Diabetes Safe Specialty with immediate day-1 security cover. How can I help you check nearby hospital rates or cashless processing today?";

    if (ai) {
      try {
        // Construct chat context or send the whole conversation history
        const systemInstruction = `
          You are "Star AI", a world-class, premium, friendly health advisor representing Star Health Insurance India.
          Your tone is empathetic, clear, highly professional, warm, and trustworthy (like an Apple or Stripe design vibe).
          You use simple plain-English to explain complex insurance jargon.
          
          Our health plans are:
          1. Star Comprehensive Plus (Monthly sum equivalent to ₹1250 - covers complete maternity up to ₹1L, single A/C private room, no rent cap, cashless across 14,000+ centers, automatic 100% sum insured restoration).
          2. Star Diabetes Safe Speciality (Monthly sum: ₹1100 - immediate coverage for direct diabetes complications, glucose monitors, HbA1c clinics with wellness payouts, skip 3 years wait).
          3. Star Senior Citizens Red Carpet (Monthly sum: ₹1850 - tailored for parents 60+, quick 1-year wait on standard conditions, covers knee replacement/cataract, zero pre-insurance checkups required).
          4. Star Family Delite (Monthly sum: ₹650 - high savings, smart choice for young startup couples, shared rooms, basic surgical/AYUSH covers).
          5. Star Critical Illness Multipay (Monthly sum: ₹450 - direct cash payout on 37 critical ailments like cancer/strokes, no bills needed).

          Keep your answers concise, reassuring, and conversion-focused. Gently guide users to use our customized Onboarding Wizard ("Find My Best Plan") or use our "Premium Calculator" to calculate exact rates.
          Answer general queries about waiting periods, diabetes coverage, cashless claim approval (2 hours target!), and how cashless is better than reimbursement.
        `;

        // Format history according to Gemini Content object structure
        // Or create chats directly
        const formattedContents = messages.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content || m.message || "" }]
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        replyText = response.text || replyText;
      } catch (geminiError) {
        console.error("Gemini chat invocation failed, returning standard expert advisor response:", geminiError);
      }
    }

    res.json({ message: replyText });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to query chat advisor." });
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
    console.log(`Server successfully started and running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
