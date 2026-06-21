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
import AdminPortal from "./components/AdminPortal";
import { Plan, RecommendationResponse } from "./types";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
  };

  // Unified Plans List — sourced from actual Star Health policy documents
  const PLANS_DATA: Plan[] = [
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

  if (currentPath === "/admin") {
    return (
      <AdminPortal 
        onBackToSite={() => navigateTo("/")}
        plans={PLANS_DATA}
      />
    );
  }

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

          {/* Right action items */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo("/admin")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs transition uppercase tracking-widest cursor-pointer shadow-sm"
            >
              Control Room (Admin)
            </button>
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
