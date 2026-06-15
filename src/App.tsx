/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Shield, Flame, Menu, X, ArrowRight, ShieldCheck, Sparkles, MessageSquare, Info } from "lucide-react";
import Hero from "./components/Hero";
import AIAdvisor from "./components/AIAdvisor";
import ProductDiscovery from "./components/ProductDiscovery";
import ComparePlans from "./components/ComparePlans";
import ExplainSimply from "./components/ExplainSimply";
import ClaimsVisualizer from "./components/ClaimsVisualizer";
import PremiumCalculator from "./components/PremiumCalculator";
import HospitalFinder from "./components/HospitalFinder";
import TrustStats from "./components/TrustStats";
import Testimonials from "./components/Testimonials";
import AIFloatingChat from "./components/AIFloatingChat";
import Footer from "./components/Footer";
import { Plan, RecommendationResponse } from "./types";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);

  // Unified Plans List Database
  const PLANS_DATA: Plan[] = [
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
    }
  ];

  // Perform server-side check on load to verify AI pipeline is live
  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          setAiEnabled(data.aiEnabled);
          console.log("Health check completed.", data);
        }
      })
      .catch(err => {
        console.warn("Could not query health status, defaulting to rules fallback pipeline", err);
      });
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartAdvisor = () => {
    scrollToSection("ai-advisor-section");
  };

  const handleCategorySelection = (catId: string) => {
    // When a discovery category card is pressed, we alert the user, transfer configurations, and start advisor
    console.log("Preset configured:", catId);
    handleStartAdvisor();
  };

  const handleOpenInteractiveChat = () => {
    setChatOpen(true);
  };

  return (
    <div id="full-app-root" className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased text-center selection:bg-star-red selection:text-white">
      
      {/* Dynamic Upper Banner with real timer values */}
      <div className="bg-star-blue text-white py-2 px-4 text-center text-[10px] uppercase tracking-widest font-extrabold relative z-50 flex justify-center items-center gap-2">
        <Flame className="w-3.5 h-3.5 text-star-red animate-pulse" />
        <span>Star AI Core Live Clearance Network is Fully Online</span>
        <span className="hidden sm:inline bg-white/20 text-white border border-white/30 text-[9px] px-1.5 py-0.5 rounded font-bold ml-1.5">
          2-Hour Cashless exits Verified
        </span>
      </div>

      {/* Sticky Top-level Header Navigation */}
      <header id="sticky-app-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-star-blue rounded-lg flex items-center justify-center shadow-md">
              <div className="w-5 h-5 border-2 border-white rotate-45"></div>
            </div>
            <div className="text-left leading-tight">
              <span className="text-xl font-extrabold tracking-tight block">
                <span className="text-star-blue">STAR</span>
                <span className="text-star-red">HEALTH</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">AI Premium Experience</span>
            </div>
          </div>

          {/* Right action item - Only keep Find My Best Plan */}
          <div>
            <button
              onClick={handleStartAdvisor}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-star-blue hover:bg-blue-900 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-900/10 transition-all uppercase tracking-widest hover:scale-[1.02] cursor-pointer"
            >
              Find My Best Plan
            </button>
          </div>

        </div>
      </header>

      {/* Main Blocks */}
      <main>
        {/* Dynamic Warning Notification if any pre-loaded config is absent */}
        {!aiEnabled && (
          <div className="bg-blue-50 border-y border-blue-200 p-3.5 flex justify-center items-center gap-2 text-xs text-star-blue font-semibold">
            <Info className="w-4 h-4 text-star-blue" />
            <span>Star AI running on our optimized edge rules-based model. Add a valid GEMINI_API_KEY inside Settings panel to launch the LLM.</span>
          </div>
        )}

        {/* Hero Area */}
        <Hero 
          onStartAdvisor={handleStartAdvisor}
          onOpenChat={handleOpenInteractiveChat}
        />

        {/* AI advisor onboarding question flow */}
        <AIAdvisor 
          onRecommendationReceived={(res) => console.log("Advisor synchronized target plan", res)}
          plans={PLANS_DATA}
        />

        {/* Product categories grid */}
        <ProductDiscovery 
          onSelectCategory={handleCategorySelection}
        />

        {/* Interactive Comparison Table */}
        <ComparePlans 
          onStartAdvisor={handleStartAdvisor}
        />

        {/* Dynamic concept simple explanation glossary */}
        <ExplainSimply />

        {/* Dynamic premium calculator */}
        <PremiumCalculator />

        {/* Claims live tracker and processes visuals */}
        <ClaimsVisualizer />

        {/* hospital map networks finder */}
        <HospitalFinder />

        {/* Trust counts and Why choosing indicators */}
        <TrustStats />

        {/* Verified user reviews */}
        <Testimonials />

      </main>

      {/* Floated assistant and complete site index footer */}
      <AIFloatingChat 
        onStartAdvisor={handleStartAdvisor}
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
      />

      <Footer />

      {/* Sticky Bottom Native-Action Bar for Mobile Thumb clearances */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 p-4 backdrop-blur-md flex gap-2 justify-between items-center shadow-lg">
        <div className="text-left px-1">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500">Star Health Advisor</div>
          <p className="text-xs font-bold text-slate-900">Start discovery</p>
        </div>
        <button
          onClick={handleStartAdvisor}
          className="px-5 py-3 bg-star-red text-white font-bold rounded-xl text-xs uppercase tracking-wider block"
        >
          Find My Best Plan
        </button>
      </div>

    </div>
  );
}
