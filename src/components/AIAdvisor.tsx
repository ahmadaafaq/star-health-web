import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, ArrowLeft, Loader2, Play, Sparkles, CheckCircle,
  Baby, AlertOctagon, HelpCircle, Heart, Shield, Activity, DollarSign, CloudLightning,
  Check, Info, Award, Scale, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2,
  Calendar, MessageCircle, Phone, PhoneOff, Mic, Volume2
} from "lucide-react";
import { Room, RoomEvent } from "livekit-client";
import { RecommendationRequest, RecommendationResponse, Plan } from "../types";

const COMMON_AILMENTS_LIST = [
  "Diabetes",
  "Arthritis",
  "Cancer",
  "Kidney Disease / Renal Issues",
  "COPD / Emphysema",
  "Allergies",
  "High Cholesterol",
  "Liver Disease / Fatty Liver",
  "Migraine",
  "Depression / Anxiety",
  "Gastrointestinal Issues / GERD",
  "Spinal Issues / Back Pain",
  "Epilepsy / Seizures",
  "Tuberculosis",
  "Sleep Apnea",
  "Cataract",
  "Varicose Veins",
  "Piles / Fistula",
  "Hernia",
  "Sinusitis"
];

const TRUST_CAROUSEL_ITEMS = [
  {
    title: "14,200+ Cashless Hospitals",
    desc: "India's largest network for direct cashless admissions without personal deposit worries."
  },
  {
    title: "Average 2-Hour Claim Settlements",
    desc: "Claim authorization requests processed in under 2 hours directly at hospital desks."
  },
  {
    title: "No TPA (Third Party Administrator)",
    desc: "Direct in-house claims department with dedicated doctors means zero processing friction."
  },
  {
    title: "1.5 Crore+ Indian Families Protected",
    desc: "Over 15 million citizens trust Star Health as their primary safeguard in medical emergencies."
  },
  {
    title: "99.9% Cashless Network Approvals",
    desc: "Direct tie-ups assure seamless approval rates for emergency and planned hospitalizations."
  }
];

const LOADER_STEPS = [
  "Analyzing family profile and medical histories...",
  "Searching RAG vector databases for matching policy rules...",
  "Calibrating network hospital cashless lists & waiting limits...",
  "Optimizing premium configurations for maximum savings..."
];

// ── Compact policy catalog injected at session start (eliminates per-turn KB lookup) ──
const STAR_HEALTH_PLANS_CONTEXT = `Star Health Insurance Plans:
1. Arogya Sanjeevani — IRDAI standard plan. Sum insured ₹5L–₹2Cr. 5% co-pay. Cumulative bonus up to 50%. Affordable entry-level option.
2. Family Health Optima (FHO) — Family floater. Sum insured ₹5L–₹25L. Automatic restoration. Newborn cover from day 1. Loyalty bonus up to 100%. Ideal for multi-generation families.
3. Medi Classic (Individual) — Individual plan. Sum insured ₹5L–₹15L. No co-pay. Pre/post hospitalisation covered. Long-term discounts available. Good for single adults.
4. Star Health Assure — Comprehensive floater for up to 9 members. Unlimited restoration. Wellness discount up to 20%. Best for large families or those wanting premium coverage.
5. Star Health Premier — Designed for 50+ age group. No upper age limit. Home care covered. AYUSH covered. Wellness program included. Best for seniors and parents.
6. Young Star Insurance — For young adults and families. Unlimited sum insured restoration. Wellness rewards. Silver and Gold variants. Best for young couples and individuals under 35.
7. Super Star — Star Health flagship plan. Sum insured ₹5L–₹5Cr. No co-pay. Broadest coverage available. Best for those wanting maximum protection.
8. Star Comprehensive — All-round plan. Sum insured ₹5L–₹1Cr. No co-pay. OPD cover. Maternity benefit. Worldwide emergency cover. No room rent cap. Best for maternity or OPD needs.`.trim();

interface AIAdvisorProps {
  onRecommendationReceived: (response: RecommendationResponse) => void;
  plans: Plan[];
}

export default function AIAdvisor({ onRecommendationReceived, plans }: AIAdvisorProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RecommendationRequest>({
    age: "35",
    members: ["myself"],
    city: "tier-1", // Metro
    budget: "moderate",
    preExisting: [],
    diabetes: false,
    parentsIncluded: false,
    employerInsurance: false,
    pregnancyPlan: false,
    preferredHospital: ""
  });

  const [myselfSelected, setMyselfSelected] = useState<boolean>(true);
  const [spouseSelected, setSpouseSelected] = useState<boolean>(false);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [myParentsCount, setMyParentsCount] = useState<number>(0);
  const [spouseParentsCount, setSpouseParentsCount] = useState<number>(0);

  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [selectedCompareId, setSelectedCompareId] = useState<string>("");
  const [analysisOpen, setAnalysisOpen] = useState<boolean>(false);

  // Supabase Lead Management & Admin Kanban Board state variables
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState<boolean>(false);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);
  const [submittingLead, setSubmittingLead] = useState<boolean>(false);
  const [leadForm, setLeadForm] = useState<{
    name: string;
    email: string;
    phone: string;
    gender?: string;
    scheduledCallAt?: string;
  }>({ name: "", email: "", phone: "", gender: "" });
  const [submittedLeadData, setSubmittedLeadData] = useState<any>(null);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
  const [customAilmentInput, setCustomAilmentInput] = useState<string>("");
  const [showAilmentSuggestions, setShowAilmentSuggestions] = useState<boolean>(false);

  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number>(0);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  useEffect(() => {
    let carouselInterval: any;
    let stepInterval: any;

    if (loading) {
      setActiveCarouselIndex(0);
      setLoadingStep(0);

      carouselInterval = setInterval(() => {
        setActiveCarouselIndex(prev => (prev + 1) % TRUST_CAROUSEL_ITEMS.length);
      }, 1250);

      stepInterval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < LOADER_STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 900);
    } else {
      setActiveCarouselIndex(0);
      setLoadingStep(0);
    }

    return () => {
      clearInterval(carouselInterval);
      clearInterval(stepInterval);
    };
  }, [loading]);

  const addCustomAilment = (ailment: string) => {
    const trimmed = ailment.trim();
    if (!trimmed) return;
    setFormData(prev => {
      const current = prev.preExisting.filter(a => a !== "none");
      if (current.includes(trimmed)) return prev;
      return {
        ...prev,
        preExisting: [...current, trimmed]
      };
    });
    setCustomAilmentInput("");
    setShowAilmentSuggestions(false);
  };

  const removeCustomAilment = (ailment: string) => {
    setFormData(prev => ({
      ...prev,
      preExisting: prev.preExisting.filter(a => a !== ailment)
    }));
  };

  const KANBAN_COLUMNS = [
    { id: "open", title: "Open Leads", color: "bg-slate-100/70 border-slate-350" },
    { id: "in_progress", title: "In Progress", color: "bg-blue-50/50 border-blue-200" },
    { id: "communication", title: "Communication", color: "bg-amber-50/50 border-amber-200" },
    { id: "won", title: "Won (Insured)", color: "bg-emerald-50/50 border-emerald-200" },
    { id: "lost", title: "Lost", color: "bg-rose-50/50 border-rose-200" }
  ];

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error("Failed to fetch leads:", e);
    } finally {
      setLeadsLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/update-lead-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, lead_status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, lead_status: newStatus } : l));
      }
    } catch (e) {
      console.error("Failed to update lead status:", e);
    }
  };

  const renderKanban = () => {
    if (leadsLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#00338D]" />
          <p className="text-sm text-slate-500 font-bold">Retrieving leads database...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">Lead Management Control Board</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Drag or use status dropdowns to transition customer leads through columns.</p>
          </div>
          <button
            onClick={fetchLeads}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-250 border border-slate-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            🔄 Refresh Leads
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map(col => {
            const colLeads = leads.filter(l => l.lead_status === col.id);
            return (
              <div key={col.id} className={`rounded-2xl border p-4 min-w-[220px] min-h-[420px] flex flex-col space-y-3 bg-slate-50/50 ${col.color}`}>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">{col.title}</span>
                  <span className="text-xs font-black bg-slate-200/80 px-2 py-0.5 rounded-full text-slate-800">{colLeads.length}</span>
                </div>

                <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px]">
                  {colLeads.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200/80 rounded-xl p-4 text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">No leads in column</span>
                    </div>
                  ) : (
                    colLeads.map(lead => {
                      const planName = plans.find(p => p.id === lead.recommended_plan_id)?.name || lead.recommended_plan_id || "Unspecified";
                      return (
                        <div key={lead.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow transition space-y-2 text-left">
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-extrabold text-xs text-slate-900 block truncate max-w-[120px]" title={lead.name}>{lead.name}</span>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${lead.lead_type === 'hot' ? 'bg-red-50 text-red-700 border border-red-150' :
                              lead.lead_type === 'warm' ? 'bg-amber-50 text-amber-700 border border-amber-150' :
                                'bg-blue-50 text-blue-700 border border-blue-155'
                              }`}>
                              {lead.lead_type === 'hot' ? '🔥 Hot' : lead.lead_type === 'warm' ? '⚡ Warm' : '❄️ Cold'}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-500 font-medium space-y-0.5">
                            <div className="truncate" title={lead.email}>📧 {lead.email}</div>
                            <div>📞 {lead.phone}</div>
                            <div>🎂 Age: {lead.age || "N/A"} | 🌆 {lead.city || "N/A"}</div>
                            <div className="bg-blue-50/50 text-[#00338D] px-2 py-1 rounded font-bold text-[9px] w-fit mt-1">
                              📋 {planName.replace("Star ", "")}
                            </div>
                          </div>

                          {lead.ai_rank_explanation && (
                            <div className="text-[9px] bg-slate-50 border border-slate-150 p-1.5 rounded text-slate-600 leading-normal max-h-[60px] overflow-y-auto">
                              <strong>AI:</strong> {lead.ai_rank_explanation}
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Move Status:</label>
                            <select
                              value={lead.lead_status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-bold text-slate-700 cursor-pointer"
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="communication">Communication</option>
                              <option value="won">Won (Insured)</option>
                              <option value="lost">Lost</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Hardcoded list of common pre-existing conditions
  const PRE_EXISTED_OPTIONS = [
    { value: "hypertension", label: "Hypertension / BP" },
    { value: "asthma", label: "Astma / Respiratory" },
    { value: "thyroid", label: "Thyroid" },
    { value: "heart-condition", label: "Cardiac Issues" },
    { value: "none", label: "None of these / Perfectly Healthy" }
  ];

  const updateMembersListState = (
    myself: boolean,
    spouse: boolean,
    children: number,
    myParents: number,
    spouseParents: number
  ) => {
    const list: string[] = [];
    if (myself) list.push("myself");
    if (spouse) list.push("spouse");
    if (children > 0) list.push("children");
    if (myParents > 0 || spouseParents > 0) list.push("parents");

    setFormData(prev => ({
      ...prev,
      members: list,
      parentsIncluded: myParents > 0 || spouseParents > 0,
      myParentsCount: myParents,
      spouseParentsCount: spouseParents
    }));
  };

  const totalMembers = (myselfSelected ? 1 : 0) + (spouseSelected ? 1 : 0) + childrenCount + myParentsCount + spouseParentsCount;

  const toggleMyself = () => {
    const nextVal = !myselfSelected;
    const projectTotal = (nextVal ? 1 : 0) + (spouseSelected ? 1 : 0) + childrenCount + myParentsCount + spouseParentsCount;
    if (projectTotal === 0) return; // Prevent completely empty select
    if (nextVal && totalMembers >= 9) return;

    setMyselfSelected(nextVal);
    updateMembersListState(nextVal, spouseSelected, childrenCount, myParentsCount, spouseParentsCount);
  };

  const toggleSpouse = () => {
    const nextVal = !spouseSelected;
    const projectTotal = (myselfSelected ? 1 : 0) + (nextVal ? 1 : 0) + childrenCount + myParentsCount + spouseParentsCount;
    if (projectTotal === 0) return;
    if (nextVal && totalMembers >= 9) return;

    setSpouseSelected(nextVal);
    updateMembersListState(myselfSelected, nextVal, childrenCount, myParentsCount, spouseParentsCount);
  };

  const incrementChildren = () => {
    if (childrenCount >= 3) return;
    if (totalMembers >= 9) return;
    const nextVal = childrenCount + 1;
    setChildrenCount(nextVal);
    updateMembersListState(myselfSelected, spouseSelected, nextVal, myParentsCount, spouseParentsCount);
  };

  const decrementChildren = () => {
    if (childrenCount <= 0) return;
    const nextVal = childrenCount - 1;
    setChildrenCount(nextVal);
    updateMembersListState(myselfSelected, spouseSelected, nextVal, myParentsCount, spouseParentsCount);
  };

  const incrementMyParents = () => {
    if (myParentsCount >= 2) return;
    if (totalMembers >= 9) return;
    const nextVal = myParentsCount + 1;
    setMyParentsCount(nextVal);
    updateMembersListState(myselfSelected, spouseSelected, childrenCount, nextVal, spouseParentsCount);
  };

  const decrementMyParents = () => {
    if (myParentsCount <= 0) return;
    const nextVal = myParentsCount - 1;
    setMyParentsCount(nextVal);
    updateMembersListState(myselfSelected, spouseSelected, childrenCount, nextVal, spouseParentsCount);
  };

  const incrementSpouseParents = () => {
    if (spouseParentsCount >= 2) return;
    if (totalMembers >= 9) return;
    const nextVal = spouseParentsCount + 1;
    setSpouseParentsCount(nextVal);
    updateMembersListState(myselfSelected, spouseSelected, childrenCount, myParentsCount, nextVal);
  };

  const decrementSpouseParents = () => {
    if (spouseParentsCount <= 0) return;
    const nextVal = spouseParentsCount - 1;
    setSpouseParentsCount(nextVal);
    updateMembersListState(myselfSelected, spouseSelected, childrenCount, myParentsCount, nextVal);
  };

  const handleDiseasesToggle = (disease: string) => {
    if (disease === "none") {
      setFormData(prev => ({ ...prev, preExisting: ["none"], diabetes: false }));
      return;
    }
    let current = [...formData.preExisting].filter(d => d !== "none");
    if (current.includes(disease)) {
      current = current.filter(d => d !== disease);
    } else {
      current.push(disease);
    }
    setFormData(prev => ({
      ...prev,
      preExisting: current
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const runRecommendation = async () => {
    // Validate required fields (Name, Phone, and Gender) and consent checkbox
    if (!leadForm.name.trim() || !leadForm.phone.trim() || !leadForm.gender || !consentChecked) {
      setShowValidationErrors(true);
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    let matchedPlanId = "";
    let mockData: RecommendationResponse | null = null;

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data: RecommendationResponse = await response.json();
        matchedPlanId = data.recommendedPlanId;
        mockData = data;
      } else {
        throw new Error("API Recommend call failed");
      }
    } catch (e) {
      console.warn("Falling back to client-side recommendation engine");
      const hasSenior = formData.members.includes("parents") || Number(formData.age) >= 50;
      const isYoung = Number(formData.age) < 36;
      const isBudget = formData.budget === "low" || formData.budget === "modest";
      const hasPregnancy = formData.pregnancyPlan;

      let matchPlan = plans[0];
      let savings = "₹2,60,000";
      let count = "14,200+";

      if (hasSenior) {
        matchPlan = plans.find(p => p.id === "star-premier") || plans[0];
        savings = "₹3,40,000";
        count = "13,900+";
      } else if (hasPregnancy) {
        matchPlan = plans.find(p => p.id === "family-health-optima") || plans[0];
        savings = "₹2,60,000";
        count = "14,200+";
      } else if (isYoung && !formData.members.includes("parents")) {
        matchPlan = plans.find(p => p.id === "young-star") || plans[0];
        savings = "₹1,80,000";
        count = "14,000+";
      } else if (isBudget) {
        matchPlan = plans.find(p => p.id === "arogya-sanjeevani") || plans[0];
        savings = "₹1,20,000";
        count = "12,500+";
      } else {
        matchPlan = plans.find(p => p.id === "star-assure") || plans[0];
      }

      matchedPlanId = matchPlan.id;
      mockData = {
        recommendedPlanId: matchPlan.id,
        confidence: 96,
        whyExplanation: `Based on your family setup of ${formData.members.join(", ")} and your priority on coverage, the ${matchPlan.name} is the ideal fit. It avoids heavy room renting limitations, locks in affordable rates, and settles claims instantly within 2 hours of exit.`,
        savingsEstimate: savings,
        cashlessCount: count,
        monthlyPremium: matchPlan.premium,
        highlightedBenefits: matchPlan.keyBenefits
      };
    }

    // Submit lead in all cases to register lead in Supabase automatically
    try {
      const isContactFilled = !!(leadForm.name || leadForm.email || leadForm.phone);
      const leadRes = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadForm,
          age: formData.age,
          members: formData.members,
          city: formData.city,
          budget: formData.budget,
          preExistingDiseases: formData.preExisting,
          diabetes: formData.diabetes,
          parentsIncluded: formData.parentsIncluded,
          employerInsurance: formData.employerInsurance,
          pregnancyPlan: formData.pregnancyPlan,
          preferredHospital: formData.preferredHospital,
          recommendedPlanId: matchedPlanId
        })
      });
      if (leadRes.ok) {
        const leadData = await leadRes.json();
        if (isContactFilled) {
          setLeadSubmitted(true);
        }
        setSubmittedLeadData(leadData.lead);
      }
    } catch (e) {
      console.error("Autosave lead failed:", e);
    }

    const elapsed = Date.now() - startTime;
    const remainingTime = 3800 - elapsed;
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }

    if (mockData) {
      setRecommendation(mockData);
      const alternative = plans.find(p => p.id !== matchedPlanId);
      if (alternative) setSelectedCompareId(alternative.id);
      onRecommendationReceived(mockData);
    }
    setLoading(false);
  };

  const getMatchedPlan = (): Plan | undefined => {
    if (!recommendation) return undefined;
    return plans.find(p => p.id === recommendation.recommendedPlanId) || plans[0];
  };

  const matchedPlan = getMatchedPlan();

  const [callScheduledConfirmed, setCallScheduledConfirmed] = useState(false);

  const confirmScheduleCall = async () => {
    if (!submittedLeadData || !submittedLeadData.id || !leadForm.scheduledCallAt) return;
    try {
      const res = await fetch("/api/update-lead-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: submittedLeadData.id,
          call_status: 'scheduled',
          scheduled_call_at: leadForm.scheduledCallAt
        })
      });
      if (res.ok) {
        setCallScheduledConfirmed(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [whatsappSent, setWhatsappSent] = useState(false);
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false);

  const handleSendWhatsapp = async () => {
    if (!submittedLeadData || !submittedLeadData.id) return;
    setSendingWhatsapp(true);
    try {
      const res = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: submittedLeadData.id,
          phone: leadForm.phone,
          name: leadForm.name || "Customer",
          recommended_plan_id: recommendation?.recommendedPlanId || plans[0].id
        })
      });
      if (res.ok) {
        setWhatsappSent(true);
      }
    } catch (e) {
      console.error(e);
    }
    setSendingWhatsapp(false);
  };

  // VOIP State Variables
  const [voipActive, setVoipActive] = useState(false);
  const [voipStatus, setVoipStatus] = useState<"idle" | "connecting" | "connected" | "speaking" | "listening">("idle");
  const [conversationId, setConversationId] = useState("");
  const [conversationInstance, setConversationInstance] = useState<any>(null);

  const handleStartVoipCall = async () => {
    if (voipActive) return;

    if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Microphone access is disabled. Please ensure you are accessing the page via 'http://localhost:3000' or 'http://127.0.0.1:3000' (browsers restrict microphone access to localhost or HTTPS).");
      return;
    }

    setVoipStatus("connecting");
    setVoipActive(true);

    try {
      // 1. Fetch the LiveKit WebRTC credentials from our web backend
      let token: string | null = null;
      let roomName: string | null = null;
      let livekitUrl: string | null = null;

      try {
        const leadId = submittedLeadData?.id || "";
        const res = await fetch(`/api/livekit-token?leadId=${encodeURIComponent(leadId)}`);
        if (res.ok) {
          const data = await res.json();
          token = data.token;
          roomName = data.roomName;
          livekitUrl = data.livekitUrl;
        } else {
          throw new Error("Failed to fetch LiveKit token from backend");
        }
      } catch (err: any) {
        console.error("Error fetching LiveKit token:", err);
        alert("Failed to initiate voice session: " + err.message);
        setVoipStatus("idle");
        setVoipActive(false);
        return;
      }

      if (!token || !livekitUrl) {
        alert("Failed to retrieve valid WebRTC credentials");
        setVoipStatus("idle");
        setVoipActive(false);
        return;
      }

      // 2. Initialize the LiveKit Room session
      console.log(`Connecting to LiveKit Room: ${roomName} at url ${livekitUrl}`);
      
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Handle connection success
      room.on(RoomEvent.Connected, () => {
        console.log("VOIP call connected to LiveKit Cloud!");
        setVoipStatus("connected");
        // Also register the conversation ID if possible
        setConversationId(roomName || "livekit-room");
      });

      // Handle connection disconnected
      room.on(RoomEvent.Disconnected, () => {
        console.log("VOIP call disconnected");
        setVoipStatus("idle");
        setVoipActive(false);
        setConversationInstance(null);
      });

      // Detect active speakers to animate speaking/listening status
      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const agentIsSpeaking = speakers.some(s => !s.isLocal);
        setVoipStatus(agentIsSpeaking ? "speaking" : "listening");
      });

      // Connect to the LiveKit room
      await room.connect(livekitUrl, token);
      
      // Request microphone permissions and publish microphone audio track
      await room.localParticipant.enableCameraAndMicrophonePlayback();
      await room.localParticipant.setMicrophoneEnabled(true);
      
      setConversationInstance(room);
    } catch (err: any) {
      console.error("Error starting VOIP session:", err);
      alert("Error starting VOIP session: " + (err.message || err));
      setVoipStatus("idle");
      setVoipActive(false);
    }
  };

  const handleEndVoipCall = async () => {
    if (conversationInstance) {
      try {
        await conversationInstance.disconnect();
      } catch (err) {
        console.error("Error ending VOIP session:", err);
      }
    }
    setVoipStatus("idle");
    setVoipActive(false);
    setConversationInstance(null);
  };

  return (
    <div id="ai-advisor-section" className="py-12 lg:py-20 border-t border-slate-200 bg-blue-50/30 text-slate-900 relative">
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className={`mx-auto px-4 sm:px-6 transition-all duration-500 ${recommendation ? "max-w-7xl" : "max-w-5xl"} relative`}>



        {/* Header Block */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-star-red text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Star Insurance Advisor Smart Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Conversational Insurance Discovery
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed font-medium">
            Tired of corporate jargon? Tell us who you wish to protect and Star AI will engineer the precise coverage configuration.
          </p>
        </div>

        {/* Wizard Card Body */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">

          {/* Confetti effect when recommendation is ready */}
          {recommendation && <Confetti />}

          {/* Premium Loader Overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col items-center justify-center p-6 md:p-8 text-center"
              >
                {/* Background decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Choice Completed Badge */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                  className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-4.5 py-2 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Choice Completed</span>
                </motion.div>

                {/* Congratulations Narration */}
                <motion.h3
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl font-serif italic text-slate-100 font-extrabold max-w-2xl leading-relaxed mt-4"
                >
                  "Congratulations. You've made a responsible choice that strengthens your family's security and peace of mind."
                </motion.h3>

                {/* Split Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mt-8 pt-8 border-t border-white/10 items-stretch">
                  {/* Left Column: Autoplay trust carousel */}
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[160px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCarouselIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 my-auto text-center w-full"
                      >
                        <h4 className="text-sm font-extrabold text-slate-200 tracking-wider uppercase">
                          {TRUST_CAROUSEL_ITEMS[activeCarouselIndex].title}
                        </h4>
                        <p className="text-xs text-slate-450 font-medium leading-relaxed max-w-xs mx-auto">
                          {TRUST_CAROUSEL_ITEMS[activeCarouselIndex].desc}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Dots */}
                    <div className="flex gap-1.5 mt-4">
                      {TRUST_CAROUSEL_ITEMS.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === activeCarouselIndex ? "bg-emerald-400 w-3.5" : "bg-white/20"
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Progress steps checker */}
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center space-y-3.5 text-left">
                    {LOADER_STEPS.map((stepText, idx) => {
                      const isCompleted = loadingStep > idx;
                      const isActive = loadingStep === idx;
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                            {isCompleted ? (
                              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                            ) : isActive ? (
                              <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                            )}
                          </div>
                          <span
                            className={`text-xs font-bold leading-none transition-colors duration-300 ${isCompleted
                              ? "text-emerald-400/90 line-through decoration-emerald-500/40"
                              : isActive
                                ? "text-amber-400 font-extrabold"
                                : "text-slate-500"
                              }`}
                          >
                            {stepText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isAdminView ? renderKanban() : (
            <AnimatePresence mode="wait">
              {!recommendation ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                  {/* Left Column: Moral Narrative Panel */}
                  <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-lg min-h-[350px]">
                    {/* Background decoration glow */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="my-auto text-left">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`narration-side-${step}`}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-6"
                        >
                          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-500 shadow-md shrink-0 animate-pulse">
                            {step === 1 && <Heart className="w-6 h-6 fill-red-500/20" />}
                            {step === 2 && <Shield className="w-6 h-6" />}
                            {step === 3 && <Activity className="w-6 h-6" />}
                            {step === 4 && <DollarSign className="w-6 h-6" />}
                            {step === 5 && <Sparkles className="w-6 h-6 text-amber-400" />}
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                              {step === 1 && "Protecting Loved Ones"}
                              {step === 2 && "Health Shield"}
                              {step === 3 && "Location & Cost"}
                              {step === 4 && "Existing Buffer"}
                              {step === 5 && "Securing Details"}
                            </h4>
                            <p className="text-base font-medium leading-relaxed">
                              {step === 1 && "Every dream you have begins with the people you love—and today, you're helping protect those dreams."}
                              {step === 2 && "Choosing health insurance is one of the most thoughtful decisions you can make for your family's future."}
                              {step === 3 && "Healthcare costs continue to rise, making preparation more valuable than ever."}
                              {step === 4 && "By planning ahead today, you're helping shield your loved ones from unexpected financial stress tomorrow."}
                              {step === 5 && "Take pride in this moment—you're building a safety net for the people who matter most."}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right Column: Question Content */}
                  <div className="lg:col-span-8 flex flex-col justify-between">
                    <motion.div key="questions" exit={{ opacity: 0, x: -50 }} className="space-y-6 h-full flex flex-col justify-between">

                      {/* Progress Indicators */}
                      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-550">Question {step} of 5</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <div
                              key={s}
                              className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-star-red' : 'w-2 bg-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Question Switch */}
                      {step === 1 && (
                        <div className="space-y-4 text-left">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                            <span>Who would you like to insure today?</span>
                          </h3>
                          <p className="text-slate-500 text-sm">Select all family members you want covered in this policy plan.</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {/* Myself (Self) */}
                            <button
                              type="button"
                              onClick={toggleMyself}
                              className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${myselfSelected
                                ? 'bg-blue-50/80 border-star-blue text-star-blue shadow-md'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-705'
                                }`}
                            >
                              <span className="text-2xl block mb-2">👤</span>
                              <div className="flex justify-between items-center">
                                <div className="font-bold text-sm text-slate-900">Myself (Self)</div>
                                {myselfSelected && <span className="text-emerald-600 text-xs font-black">✓ Selected</span>}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1">Primary policy member (1 covered)</div>
                            </button>

                            {/* Spouse (Partner) */}
                            <button
                              type="button"
                              onClick={toggleSpouse}
                              className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${spouseSelected
                                ? 'bg-blue-50/80 border-star-blue text-star-blue shadow-md'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-705'
                                }`}
                            >
                              <span className="text-2xl block mb-2">👩</span>
                              <div className="flex justify-between items-center">
                                <div className="font-bold text-sm text-slate-900">Spouse (Partner)</div>
                                {spouseSelected && <span className="text-emerald-600 text-xs font-black">✓ Selected</span>}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1">Husband / Wife protection (1 covered)</div>
                            </button>

                            {/* Children Counter Card */}
                            <div
                              className={`p-4 rounded-2xl text-left border transition-all duration-200 ${childrenCount > 0
                                ? 'bg-blue-50/80 border-star-blue text-star-blue shadow-md'
                                : 'bg-slate-50 border-slate-200 text-slate-705'
                                }`}
                            >
                              <span className="text-2xl block mb-2">👶</span>
                              <div className="flex justify-between items-center">
                                <div className="font-bold text-sm text-slate-900">Children (Kids)</div>
                                <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-2 py-1 rounded-xl">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); decrementChildren(); }}
                                    disabled={childrenCount === 0}
                                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-slate-850 flex items-center justify-center text-xs transition cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="font-black text-xs text-slate-905 w-3 text-center">{childrenCount}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); incrementChildren(); }}
                                    disabled={childrenCount >= 3 || totalMembers >= 8}
                                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-slate-850 flex items-center justify-center text-xs transition cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between font-semibold">
                                <span>Max 3 children allowed</span>
                                <span className="font-bold text-slate-700">{childrenCount} covered</span>
                              </div>
                            </div>

                            {/* My Parents Counter Card */}
                            <div
                              className={`p-4 rounded-2xl text-left border transition-all duration-200 ${myParentsCount > 0
                                ? 'bg-blue-50/80 border-star-blue text-star-blue shadow-md'
                                : 'bg-slate-50 border-slate-200 text-slate-705'
                                }`}
                            >
                              <span className="text-2xl block mb-2">👵</span>
                              <div className="flex justify-between items-center">
                                <div className="font-bold text-sm text-slate-900">My Parents</div>
                                <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-2 py-1 rounded-xl">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); decrementMyParents(); }}
                                    disabled={myParentsCount === 0}
                                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-slate-850 flex items-center justify-center text-xs transition cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="font-black text-xs text-slate-905 w-3 text-center">{myParentsCount}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); incrementMyParents(); }}
                                    disabled={myParentsCount >= 2 || totalMembers >= 9}
                                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-slate-850 flex items-center justify-center text-xs transition cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between font-semibold">
                                <span>Mother and/or Father (Max 2)</span>
                                {myParentsCount > 0 && <span className="font-bold text-slate-700">{myParentsCount} covered</span>}
                              </div>
                            </div>

                            {/* Spouse's Parents Counter Card */}
                            <div
                              className={`p-4 rounded-2xl text-left border transition-all duration-200 ${spouseParentsCount > 0
                                ? 'bg-blue-50/80 border-star-blue text-star-blue shadow-md'
                                : 'bg-slate-50 border-slate-200 text-slate-705'
                                }`}
                            >
                              <span className="text-2xl block mb-2">👴</span>
                              <div className="flex justify-between items-center">
                                <div className="font-bold text-sm text-slate-900">Spouse's Parents</div>
                                <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-2 py-1 rounded-xl">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); decrementSpouseParents(); }}
                                    disabled={spouseParentsCount === 0}
                                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-slate-850 flex items-center justify-center text-xs transition cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="font-black text-xs text-slate-905 w-3 text-center">{spouseParentsCount}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); incrementSpouseParents(); }}
                                    disabled={spouseParentsCount >= 2 || totalMembers >= 9}
                                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-slate-850 flex items-center justify-center text-xs transition cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between font-semibold">
                                <span>In-laws support (Max 2)</span>
                                {spouseParentsCount > 0 && <span className="font-bold text-slate-700">{spouseParentsCount} covered</span>}
                              </div>
                            </div>

                          </div>

                          {/* Member Limit Alert Indicator */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2.5">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-650 text-left">
                              <Info className="w-4 h-4 text-star-blue shrink-0" />
                              <span>Regulatory limit: Max 9 members are allowed per policy. You can choose at most 3 children, and parents and parents-in-law can be clubbed together.</span>
                            </div>
                            <div className="shrink-0 font-extrabold text-xs text-slate-800 bg-white border border-slate-2 weight-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <span>Total Selected:</span>
                              <span className={`text-sm font-black ${totalMembers >= 9 ? "text-star-red animate-pulse" : "text-[#00338D]"}`}>
                                {totalMembers}
                              </span>
                              <span>/ 9</span>
                            </div>
                          </div>

                          <div className="pt-4 space-y-3">
                            <label className="block text-sm font-bold text-slate-700">Enter Your Current Age (Primary Person):</label>
                            <input
                              type="number"
                              min="18"
                              max="100"
                              value={formData.age}
                              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 focus:border-star-blue focus:ring-1 focus:ring-star-blue/40 focus:outline-none rounded-xl px-4 py-3 text-slate-900 font-semibold"
                            />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-4 text-left">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Medical Notes & Pre-Existing Health Profile</h3>
                          <p className="text-slate-500 text-sm">Providing accurate details helps us customize the pre-existing disease (PED) waiting periods correctly.</p>

                          <div className="space-y-4">
                            {/* Diabetes Quick Capping */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                  <span className="w-2.5 h-2.5 rounded-full bg-star-red animate-pulse" />
                                  <span>Does anyone to be insured have Pre-Existing Diabetes?</span>
                                </div>
                                <p className="text-xs text-slate-500">We offer specialized plans with complete diabetic consultations and zero setup barriers.</p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => setFormData({ ...formData, diabetes: true })}
                                  className={`px-4 py-2 text-xs font-bold rounded-lg ${formData.diabetes ? 'bg-star-red text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setFormData({ ...formData, diabetes: false })}
                                  className={`px-4 py-2 text-xs font-bold rounded-lg ${!formData.diabetes ? 'bg-star-blue text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                                >
                                  No
                                </button>
                              </div>
                            </div>

                            {/* Pregnancy Quick Options */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                  <Baby className="w-4 h-4 text-rose-500" />
                                  <span>Are you planning to grow your family (Pregnancy Support)?</span>
                                </div>
                                <p className="text-xs text-slate-500">Matches maternity packages, vaccination schedules, and immediate newborn protection.</p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => setFormData({ ...formData, pregnancyPlan: true })}
                                  className={`px-4 py-2 text-xs font-bold rounded-lg ${formData.pregnancyPlan ? 'bg-rose-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setFormData({ ...formData, pregnancyPlan: false })}
                                  className={`px-4 py-2 text-xs font-bold rounded-lg ${!formData.pregnancyPlan ? 'bg-star-blue text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                                >
                                  No
                                </button>
                              </div>
                            </div>

                            {/* Search & Add diagnosed conditions manually */}
                            <div className="space-y-2 relative">
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest text-left">
                                🔍 Search & Add diagnosed conditions manually:
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="e.g. Asthma, Thyroid, Migraine..."
                                  value={customAilmentInput}
                                  onChange={(e) => {
                                    setCustomAilmentInput(e.target.value);
                                    setShowAilmentSuggestions(true);
                                  }}
                                  onFocus={() => setShowAilmentSuggestions(true)}
                                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-star-blue focus:outline-none rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-905"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addCustomAilment(customAilmentInput);
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => addCustomAilment(customAilmentInput)}
                                  className="px-4 py-2.5 bg-star-blue hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                                >
                                  Add
                                </button>
                              </div>

                              {/* Suggestions Dropdown */}
                              {showAilmentSuggestions && customAilmentInput.trim() && (
                                <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
                                  {COMMON_AILMENTS_LIST.filter(a =>
                                    a.toLowerCase().includes(customAilmentInput.toLowerCase()) &&
                                    !formData.preExisting.includes(a.toLowerCase())
                                  ).map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => addCustomAilment(s)}
                                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-xs font-bold text-slate-700 transition cursor-pointer"
                                    >
                                      {s}
                                    </button>
                                  ))}
                                  {COMMON_AILMENTS_LIST.filter(a =>
                                    a.toLowerCase().includes(customAilmentInput.toLowerCase()) &&
                                    !formData.preExisting.includes(a.toLowerCase())
                                  ).length === 0 && (
                                      <div className="px-4 py-2.5 text-xs text-slate-400 font-medium italic text-left">
                                        Click "Add" or press Enter to add "{customAilmentInput}"
                                      </div>
                                    )}
                                </div>
                              )}

                              {/* Selected tags list */}
                              {formData.preExisting.filter(d => d !== "none").length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1 text-left">
                                  {formData.preExisting.filter(d => d !== "none").map(tag => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center gap-1 bg-blue-50 border border-star-blue text-star-blue text-[11px] font-bold px-2.5 py-1 rounded-full uppercase"
                                    >
                                      <span>{tag}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeCustomAilment(tag)}
                                        className="w-3.5 h-3.5 hover:bg-blue-100 rounded-full flex items-center justify-center font-extrabold text-[9px] cursor-pointer"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Other pre-existing select list */}
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Common diagnosed conditions:</label>
                              <div className="grid grid-cols-2 gap-2">
                                {PRE_EXISTED_OPTIONS.map(opt => {
                                  const isChosen = formData.preExisting.includes(opt.value);
                                  return (
                                    <button
                                      key={opt.value}
                                      onClick={() => handleDiseasesToggle(opt.value)}
                                      className={`text-left text-xs font-bold px-4 py-2.5 border rounded-lg transition-colors cursor-pointer ${isChosen
                                        ? 'bg-blue-50 border-star-blue text-star-blue'
                                        : 'bg-white border-slate-200 text-slate-705 hover:bg-slate-50'
                                        }`}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-4 text-left">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Location & Budget Profile</h3>
                          <p className="text-slate-500 text-sm">Health care costs vary across Indian cities. We calibrate cashless rates based on location tier.</p>

                          <div className="space-y-4">
                            {/* City Selection */}
                            <div className="space-y-2">
                              <label className="block text-sm font-bold text-slate-700">Where do you reside currently?</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                  { value: "tier-1", label: "Tier 1 Metros", desc: "Delhi, Mumbai, Bengaluru" },
                                  { value: "tier-2", label: "Tier 2 Cities", desc: "Jaipur, Lucknow, Kochi" },
                                  { value: "tier-3", label: "Tier 3 Towns", desc: "Rural / Non-metro hubs" }
                                ].map(c => (
                                  <button
                                    key={c.value}
                                    onClick={() => setFormData({ ...formData, city: c.value })}
                                    className={`w-full p-3 text-left border rounded-xl cursor-pointer ${formData.city === c.value ? 'bg-blue-50 border-star-blue text-star-blue font-bold' : 'bg-white text-slate-600 border-slate-200'}`}
                                  >
                                    <div className="font-bold text-xs">{c.label}</div>
                                    <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">{c.desc}</div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Budget Preference */}
                            <div className="space-y-2 pt-2">
                              <label className="block text-sm font-bold text-slate-700">What is your premium expectation range?</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                  { value: "low", label: "Highly Budget Friendly", desc: "Covers base essentials, shared rooms", icon: "💎" },
                                  { value: "moderate", label: "Balanced Safety & Comfort", desc: "Private room, standard sum insureds", icon: "⚖️" },
                                  { value: "premium", label: "Complete Unlimited Coverage", desc: "Immediate premium benefits, no co-pay", icon: "🏆" }
                                ].map(bg => (
                                  <button
                                    key={bg.value}
                                    onClick={() => setFormData({ ...formData, budget: bg.value })}
                                    className={`w-full p-3 text-left border rounded-xl flex gap-3 items-center cursor-pointer ${formData.budget === bg.value ? 'bg-blue-50 border-star-blue text-star-blue font-bold' : 'bg-white text-slate-600 border-slate-200'}`}
                                  >
                                    <span className="text-xl shrink-0">{bg.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-xs text-slate-900 leading-tight">{bg.label}</div>
                                      <div className="text-[9px] text-slate-500 mt-0.5 leading-normal">{bg.desc}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-4 text-left">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Employer & Hospital Support</h3>
                          <p className="text-slate-500 text-sm">Final step: calibrate your existing insurance buffer and specify any hospital alignments.</p>

                          <div className="space-y-4">
                            {/* Employer Insurance */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                              <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-850 block">Do you have existing Corporate/Employer health insurance?</label>
                                <p className="text-xs text-slate-500">If yes, we can recommend highly-effective Super Top-Up plans for ultra savings.</p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => setFormData({ ...formData, employerInsurance: true })}
                                  className={`px-4 py-2 text-xs font-bold rounded-lg ${formData.employerInsurance ? 'bg-star-blue text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setFormData({ ...formData, employerInsurance: false })}
                                  className={`px-4 py-2 text-xs font-bold rounded-lg ${!formData.employerInsurance ? 'bg-star-blue text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                                >
                                  No
                                </button>
                              </div>
                            </div>
                            {/* Preferred hospital notes */}
                            <div className="space-y-2">
                              <label className="block text-sm font-bold text-slate-700">Any specific hospital alignment or landmark preference?</label>
                              <input
                                type="text"
                                placeholder="e.g. Apollo Hospital, Fortis, Nanavati Mumbai"
                                value={formData.preferredHospital}
                                onChange={(e) => setFormData({ ...formData, preferredHospital: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-star-blue focus:outline-none rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 font-bold text-sm"
                              />
                              <p className="text-[10px] text-slate-500">We cross-reference this to verify cashless network availability immediately in the next step.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 5 && (
                        <div className="space-y-4 text-left animate-fadeIn">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-[#00338D] flex items-center gap-2">
                            <span>Secure Your Quote & Recommendation</span>
                          </h3>
                          <p className="text-slate-500 text-sm">Provide your details to register this quote as a lead and obtain your AI-powered purchase priority rank.</p>

                          <div className="space-y-4 pt-2">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-650 block">Your Full Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                placeholder="e.g. Naman"
                                value={leadForm.name}
                                onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full bg-slate-50 border focus:ring-1 focus:outline-none rounded-xl px-4 py-3 placeholder-slate-400 text-slate-905 font-bold text-sm ${showValidationErrors && !leadForm.name.trim()
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                                  : 'border-slate-200 focus:border-star-blue focus:ring-star-blue/40'
                                  }`}
                              />
                              {showValidationErrors && !leadForm.name.trim() && (
                                <p className="text-[10px] text-red-600 font-bold mt-1">Please enter your full name.</p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-650 block">Email Address</label>
                              <input
                                type="email"
                                placeholder="e.g. naman@example.com"
                                value={leadForm.email}
                                onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-star-blue focus:outline-none rounded-xl px-4 py-3 placeholder-slate-400 text-slate-905 font-bold text-sm"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-650 block">Phone Number <span className="text-red-500">*</span></label>
                              <input
                                type="tel"
                                placeholder="e.g. 9876543210"
                                value={leadForm.phone}
                                onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                                className={`w-full bg-slate-50 border focus:ring-1 focus:outline-none rounded-xl px-4 py-3 placeholder-slate-400 text-slate-905 font-bold text-sm ${showValidationErrors && !leadForm.phone.trim()
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                                  : 'border-slate-200 focus:border-star-blue focus:ring-star-blue/40'
                                  }`}
                              />
                              {showValidationErrors && !leadForm.phone.trim() && (
                                <p className="text-[10px] text-red-600 font-bold mt-1">Please enter your 10-digit mobile number.</p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-650 block">Gender <span className="text-red-500">*</span></label>
                              <div className="flex gap-4">
                                <button
                                  type="button"
                                  onClick={() => setLeadForm(prev => ({ ...prev, gender: "male" }))}
                                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${leadForm.gender === "male"
                                      ? "border-[#00338D] bg-blue-50/50 text-[#00338D]"
                                      : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                                    }`}
                                >
                                  <span>Male</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLeadForm(prev => ({ ...prev, gender: "female" }))}
                                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${leadForm.gender === "female"
                                      ? "border-[#00338D] bg-blue-50/50 text-[#00338D]"
                                      : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                                    }`}
                                >
                                  <span>Female</span>
                                </button>
                              </div>
                              {showValidationErrors && !leadForm.gender && (
                                <p className="text-[10px] text-red-600 font-bold mt-1">Please select your gender.</p>
                              )}
                            </div>

                            {/* DPDP Privacy compliance Notice */}
                            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl text-left space-y-1.5 shadow-sm">
                              <div className="flex items-center gap-1.5 text-slate-800 text-xs font-black">
                                <ShieldCheck className="w-4 h-4 text-star-blue" />
                                <span>Digital Personal Data Protection (DPDP) Act 2023 Compliance Notice</span>
                              </div>
                              <p className="text-[10px] text-slate-505 leading-normal font-semibold">
                                Your information is processed in strict accordance with the DPDP Act 2023 guidelines. We enforce bank-grade transport encryptions and restrict access exclusively to verified underwriters.
                              </p>
                            </div>

                            {/* Consent Checkbox */}
                            <div className={`p-4 rounded-xl border transition-all duration-200 ${showValidationErrors && !consentChecked
                              ? 'border-red-500 bg-red-50/20'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-350'
                              }`}>
                              <label className="flex items-start gap-3 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={consentChecked}
                                  onChange={(e) => setConsentChecked(e.target.checked)}
                                  className="mt-1 rounded border-slate-350 text-star-blue focus:ring-star-blue/40"
                                />
                                <div className="text-xs text-slate-700 leading-normal font-semibold">
                                  I consent to receive updates and customized insurance quotes via calls, SMS, and WhatsApp on my registered number.
                                </div>
                              </label>
                              {showValidationErrors && !consentChecked && (
                                <p className="text-[10px] text-red-600 font-bold mt-1.5">You must check the consent box to proceed.</p>
                              )}
                            </div>

                          </div>
                        </div>
                      )}

                      {/* Operations Row */}
                      <div className="flex justify-between pt-4 border-t border-slate-200">
                        {step > 1 ? (
                          <button
                            onClick={prevStep}
                            className="px-5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-xs font-bold text-slate-600 flex items-center gap-2 cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                          </button>
                        ) : <div />}

                        {step < 5 ? (
                          <button
                            onClick={nextStep}
                            className="px-6 py-3 bg-star-blue hover:bg-blue-900 text-white rounded-xl transition text-xs font-bold flex items-center gap-2 cursor-pointer"
                          >
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={runRecommendation}
                            disabled={loading}
                            className="px-8 py-3 bg-star-red hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/10 transition flex items-center gap-2 text-xs cursor-pointer"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Generating Advice...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 text-amber-300" />
                                <span>
                                  {leadForm.name || leadForm.email || leadForm.phone
                                    ? "🚀 Get Recommendations & Secure Quote"
                                    : "Skip & Get Plan Recommendations"}
                                </span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                    </motion.div>
                  </div>
                </div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-left">

                  {/* Result Title & Switcher */}
                  <div className="pb-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div className="space-y-1 md:text-left">
                      <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        <span>AI Engineered Portfolio for You</span>
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your Optimal Protection Recommendation</h3>
                      <p className="text-xs text-slate-500 font-medium">We calculated this optimal core portfolio based on your family profile and local diagnostic network tier.</p>
                    </div>
                    <button
                      onClick={() => {
                        setStep(1);
                        setRecommendation(null);
                      }}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Redo Questions</span>
                    </button>
                  </div>

                  {/* Match Summary Cards Grid split */}
                  {matchedPlan && (
                    <div className="space-y-6">
                      {/* Interactive Selector Header & Alternatives Toggles placed above the comparison cards */}
                      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                        {/* Interactive Selector Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-left">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 bg-[#00338D]/10 text-[#00338D] text-[10px] px-2.5 py-1 rounded font-extrabold uppercase tracking-wider">
                              <Scale className="w-3.5 h-3.5 text-[#00338D]" />
                              <span>Interactive Multi-Plan Side-By-Side</span>
                            </span>
                            <h4 className="text-sm font-black text-slate-800">Choose any other plan to inspect & compare side-by-side:</h4>
                          </div>
                        </div>

                        {/* Alternatives Toggles */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          {plans
                            .filter(p => p.id !== matchedPlan.id)
                            .map(op => {
                              const isComparing = selectedCompareId === op.id;
                              return (
                                <button
                                  key={op.id}
                                  onClick={() => setSelectedCompareId(op.id)}
                                  className={`px-2 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all border cursor-pointer text-center leading-tight ${isComparing
                                    ? "bg-star-red text-white border-red-600 shadow-md scale-[1.02]"
                                    : "bg-white border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                  {op.name.replace("Star ", "")}
                                </button>
                              );
                            })}
                        </div>
                      </div>

                      {/* Match Summary Cards Grid split */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                        {/* RECOMMENDED CHOICE (Left Column) */}
                        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-md relative overflow-hidden space-y-6">
                          {/* Top ribbon */}
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />

                          <div className="flex justify-between items-start">
                            <div className="w-full text-left">
                              <span className="inline-flex items-center bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest mb-2.5">
                                🌟 YOUR RECOMMENDED BEST MATCH
                              </span>

                              <div className="flex justify-between items-start w-full gap-4">
                                <h4 className="text-2xl font-extrabold text-[#00338D] tracking-tight">{matchedPlan.name}</h4>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={handleSendWhatsapp}
                                    disabled={sendingWhatsapp || whatsappSent || !leadForm.phone}
                                    className={`p-2 rounded-full transition cursor-pointer disabled:opacity-50 ${whatsappSent ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                    title="Send details to WhatsApp"
                                  >
                                    {whatsappSent ? <CheckCircle2 className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                                  </button>
                                  <div className="relative group/scheduler">
                                    <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition cursor-pointer" title="Schedule Call">
                                      <Calendar className="w-5 h-5" />
                                    </button>
                                    <div className="absolute top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl p-4 shadow-xl z-20 hidden group-hover/scheduler:block focus-within:block right-0">
                                      <div className="text-[11px] font-bold text-slate-700 mb-3 uppercase tracking-wider text-left">Schedule AI Advisor Call</div>
                                      {!callScheduledConfirmed ? (
                                        <div className="flex flex-col gap-2 text-left">
                                          <input
                                            type="datetime-local"
                                            value={leadForm.scheduledCallAt || ""}
                                            onChange={(e) => setLeadForm(prev => ({ ...prev, scheduledCallAt: e.target.value }))}
                                            className="text-xs border border-slate-200 rounded p-1.5 w-full bg-slate-50 focus:outline-none focus:border-blue-500 font-medium"
                                          />
                                          <button
                                            onClick={confirmScheduleCall}
                                            disabled={!leadForm.scheduledCallAt}
                                            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px] transition duration-150 cursor-pointer disabled:opacity-50"
                                          >
                                            Confirm Slot
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="text-left">
                                          <div className="text-[10px] font-bold text-emerald-700 mb-2 flex items-center gap-1">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>Slot Scheduled!</span>
                                          </div>
                                          <a
                                            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Star+Health+Insurance+Consultation&details=Discussing+your+health+insurance+needs+and+the+${matchedPlan?.name}+plan.&dates=${leadForm.scheduledCallAt ? new Date(leadForm.scheduledCallAt).toISOString().replace(/-|:|\.\d\d\d/g, "") : ""}/${leadForm.scheduledCallAt ? new Date(new Date(leadForm.scheduledCallAt).getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "") : ""}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded text-[9px] font-extrabold text-blue-700 hover:bg-blue-100 transition cursor-pointer shadow-sm w-full"
                                          >
                                            📅 Add to Calendar
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-slate-505 font-bold italic mt-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/30">
                                " {recommendation.whyExplanation} "
                              </p>
                            </div>
                          </div>

                          {/* Premium details block */}
                          <div className="bg-emerald-50/40 border border-emerald-100 p-4.5 rounded-xl flex justify-between items-center">
                            <div className="text-left">
                              <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider block">Estimated Base Premium</span>
                              <span className="text-lg text-slate-500 font-medium text-xs">Based on age {formData.age}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-black text-slate-900">₹{recommendation.monthlyPremium}</span>
                              <span className="text-slate-500 text-xs font-medium"> / mo</span>
                            </div>
                          </div>

                          {/* What's Included (Bullet points only, no clumps) */}
                          <div className="space-y-3.5">
                            <h5 className="text-xs font-black uppercase tracking-widest text-[#00338D] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-emerald-600" />
                              <span>Guaranteed Inclusions (Readable Details)</span>
                            </h5>

                            <ul className="space-y-2.5 text-xs">
                              <li className="flex items-start gap-2.5 bg-slate-50 hover:bg-slate-100/40 p-2.5 rounded-lg border border-slate-150 transition">
                                <span className="text-emerald-600 font-bold shrink-0">🛡️ Max Coverage:</span>
                                <span className="text-slate-700 leading-normal font-semibold">{matchedPlan.coverage} sum insured protection</span>
                              </li>
                              <li className="flex items-start gap-2.5 bg-slate-50 hover:bg-slate-100/40 p-2.5 rounded-lg border border-slate-150 transition">
                                <span className="text-emerald-600 font-bold shrink-0">🛏️ Room Allotment:</span>
                                <span className="text-slate-700 leading-normal font-semibold">{matchedPlan.roomRent}</span>
                              </li>
                              <li className="flex items-start gap-2.5 bg-slate-50 hover:bg-slate-100/40 p-2.5 rounded-lg border border-slate-150 transition">
                                <span className="text-emerald-600 font-bold shrink-0">⏱️ Waiting Period:</span>
                                <span className="text-slate-700 leading-normal font-semibold">{matchedPlan.waitingPeriod}</span>
                              </li>
                              <li className="flex items-start gap-2.5 bg-slate-50 hover:bg-slate-100/40 p-2.5 rounded-lg border border-slate-150 transition">
                                <span className="text-emerald-600 font-bold shrink-0">🤝 Co-payment Rule:</span>
                                <span className="text-slate-700 leading-normal font-semibold">{matchedPlan.coPay}</span>
                              </li>
                              <li className="flex items-start gap-2.5 bg-slate-50 hover:bg-slate-100/40 p-2.5 rounded-lg border border-slate-150 transition">
                                <span className="text-emerald-600 font-bold shrink-0">📈 Audited Claim Ratio:</span>
                                <span className="text-slate-700 leading-normal font-semibold">{matchedPlan.claimRatio} with instant clearances</span>
                              </li>
                              <li className="flex items-start gap-2.5 bg-slate-50 hover:bg-slate-100/40 p-2.5 rounded-lg border border-slate-150 transition">
                                <span className="text-emerald-600 font-bold shrink-0">🏥 Cashless Partners:</span>
                                <span className="text-slate-700 leading-normal font-semibold">Over {recommendation.cashlessCount} networked medical stations</span>
                              </li>
                            </ul>
                          </div>

                          {/* Extra Plan Benefits */}
                          <div className="space-y-2.5 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Additional Plan Highlights:</span>
                            <ul className="space-y-1.5 text-xs text-slate-600">
                              {matchedPlan.keyBenefits.map((b, i) => (
                                <li key={i} className="flex gap-2 items-start font-semibold">
                                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Want to know more? */}
                          <div className="pt-2">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center">
                              <h4 className="text-sm font-black text-blue-900 mb-1">Want to know more?</h4>
                              <p className="text-xs text-blue-700 font-medium mb-3">
                                We will send you the complete policy details over WhatsApp, and you can chat with our AI agent to explore more.
                              </p>
                              <div className="space-y-2 text-left">
                                <button
                                  onClick={handleSendWhatsapp}
                                  disabled={sendingWhatsapp || whatsappSent || !leadForm.phone}
                                  className="w-full py-2.5 bg-[#00338D] hover:bg-blue-900 text-white font-bold rounded-lg text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  {sendingWhatsapp ? "Sending Details..." : whatsappSent ? "Sent to WhatsApp!" : "Send details to WhatsApp"}
                                </button>

                                {/* Callback Scheduler & Google Calendar template */}
                                {!callScheduledConfirmed ? (
                                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                    <input
                                      type="datetime-local"
                                      value={leadForm.scheduledCallAt || ""}
                                      onChange={(e) => setLeadForm(prev => ({ ...prev, scheduledCallAt: e.target.value }))}
                                      className="flex-1 text-xs border border-blue-200 rounded-lg p-2 bg-white focus:outline-none focus:border-blue-500 font-medium"
                                    />
                                    <button
                                      onClick={confirmScheduleCall}
                                      disabled={!leadForm.scheduledCallAt}
                                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                                    >
                                      <Calendar className="w-4 h-4" />
                                      <span>Schedule Call</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="bg-white border border-emerald-100 rounded-lg p-2.5 mt-1 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
                                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1.5">
                                      ✅ Call Confirmed
                                    </span>
                                    <a
                                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Star+Health+Insurance+Consultation&details=Discussing+your+health+insurance+needs+and+the+${matchedPlan?.name}+plan.&dates=${leadForm.scheduledCallAt ? new Date(leadForm.scheduledCallAt).toISOString().replace(/-|:|\.\d\d\d/g, "") : ""}/${leadForm.scheduledCallAt ? new Date(new Date(leadForm.scheduledCallAt).getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "") : ""}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded text-[10px] font-extrabold text-blue-700 hover:bg-blue-100 transition cursor-pointer shadow-sm w-max"
                                    >
                                      📅 Add to Calendar
                                    </a>
                                  </div>
                                )}

                                {voipActive ? (
                                  <div className="bg-slate-900 text-white rounded-xl p-4.5 space-y-4 shadow-xl border border-slate-800">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                                        <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                                          {voipStatus === "connecting" ? "Establishing WebRTC..." : "VOIP Call Active"}
                                        </span>
                                      </div>
                                      <span className="text-[9px] text-slate-500 font-bold tracking-tight">Latency ~20ms (Direct VOIP)</span>
                                    </div>

                                    <div className="flex flex-col items-center justify-center py-4 space-y-3">
                                      {/* Audio Visualizer Waves */}
                                      <div className="flex items-center gap-1.5 h-8">
                                        {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
                                          let heightClass = "h-2";
                                          if (voipStatus === "speaking") {
                                            if (bar % 3 === 0) heightClass = "h-7 animate-pulse";
                                            else if (bar % 2 === 0) heightClass = "h-5 animate-pulse delay-75";
                                            else heightClass = "h-3 animate-pulse delay-150";
                                          } else if (voipStatus === "listening") {
                                            if (bar % 2 === 0) heightClass = "h-4 animate-ping";
                                            else heightClass = "h-2";
                                          } else if (voipStatus === "connected") {
                                            if (bar === 4) heightClass = "h-4";
                                            else heightClass = "h-2";
                                          } else if (voipStatus === "connecting") {
                                            heightClass = "h-2 animate-bounce";
                                          }
                                          return (
                                            <div
                                              key={bar}
                                              className={`w-1 bg-emerald-400 rounded-full transition-all duration-150 ${heightClass}`}
                                            />
                                          );
                                        })}
                                      </div>
                                    </div>

                                    <button
                                      onClick={handleEndVoipCall}
                                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-900/10"
                                    >
                                      <PhoneOff className="w-4 h-4" />
                                      <span>End Direct Call</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={handleStartVoipCall}
                                    disabled={!leadForm.phone}
                                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-lg text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md relative overflow-hidden group disabled:opacity-50"
                                  >
                                    <span className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                                    <Mic className="w-4 h-4 animate-pulse" />
                                    <span>Speak to Advisor Instantly (VOIP Call)</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* SELECT & COMPARE (Right Column) */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">

                          {/* Comparative Output */}
                          {(() => {
                            const comparedPlan = plans.find(p => p.id === selectedCompareId) || plans.find(p => p.id !== matchedPlan.id) || plans[0];
                            return (
                              <div className="space-y-6 relative">
                                <div>
                                  <span className="inline-flex items-center bg-slate-100 text-slate-800 border border-slate-200 text-[9px] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest mb-2.5">
                                    ⚖️ COMPARED PLAN OPTION
                                  </span>
                                  <h4 className="text-2xl font-extrabold text-[#00338D] tracking-tight">{comparedPlan.name}</h4>
                                </div>

                                {/* Head-to-Head Comparative Differences Highlights Panel - Accordion style */}
                                <div className="bg-amber-50/40 border border-amber-200/50 rounded-xl overflow-hidden text-xs text-left">
                                  <button
                                    type="button"
                                    onClick={() => setAnalysisOpen(!analysisOpen)}
                                    className="w-full p-4 flex justify-between items-center bg-amber-500/10 hover:bg-amber-500/15 transition-all text-left font-sans cursor-pointer"
                                  >
                                    <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                                      💡 Head-to-Head Difference Analysis
                                    </span>
                                    <div className="flex items-center gap-1.5 text-amber-900 text-[10px] font-bold">
                                      <span>{analysisOpen ? "Hide" : "Show summary"}</span>
                                      {analysisOpen ? (
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      ) : (
                                        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                                      )}
                                    </div>
                                  </button>

                                  <AnimatePresence initial={false}>
                                    {analysisOpen && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="border-t border-amber-200/50 px-4 pb-4 pt-3 space-y-2 overflow-hidden"
                                      >
                                        {/* Premium compare */}
                                        <div className="flex justify-between items-start border-b border-amber-100/30 pb-2 last:border-0">
                                          <span className="font-bold text-slate-500">💰 Monthly Premium:</span>
                                          <span className="text-right font-bold">
                                            {recommendation.monthlyPremium === comparedPlan.premium ? (
                                              <span className="text-slate-600">Same price (₹{comparedPlan.premium}/mo)</span>
                                            ) : recommendation.monthlyPremium < comparedPlan.premium ? (
                                              <span className="text-emerald-700">Recommended is cheaper by ₹{comparedPlan.premium - recommendation.monthlyPremium}/mo</span>
                                            ) : (
                                              <span className="text-amber-700">This alternative is cheaper by ₹{recommendation.monthlyPremium - comparedPlan.premium}/mo</span>
                                            )}
                                          </span>
                                        </div>

                                        {/* Room rent compare */}
                                        <div className="flex justify-between items-start border-b border-amber-100/30 pb-2 last:border-0">
                                          <span className="font-bold text-slate-500">🛏️ Room Allotment:</span>
                                          <span className="text-right text-slate-700 font-semibold max-w-[200px]">
                                            {matchedPlan.roomRent === comparedPlan.roomRent ? (
                                              <span className="text-slate-500">Matches recommended ({comparedPlan.roomRent})</span>
                                            ) : (
                                              <span>Recommended has <strong className="text-emerald-600 font-bold">{matchedPlan.roomRent}</strong> vs <strong className="text-amber-800 font-bold">{comparedPlan.roomRent}</strong></span>
                                            )}
                                          </span>
                                        </div>

                                        {/* Waiting period compare */}
                                        <div className="flex justify-between items-start border-b border-amber-100/30 pb-2 last:border-0">
                                          <span className="font-bold text-slate-500">⏱️ Pre-existing Wait:</span>
                                          <span className="text-right text-slate-700 font-semibold max-w-[200px]">
                                            {matchedPlan.waitingPeriod === comparedPlan.waitingPeriod ? (
                                              <span className="text-slate-500">Matches recommended ({comparedPlan.waitingPeriod})</span>
                                            ) : (
                                              <span>Recommended wait: <strong className="text-emerald-600 font-bold">{matchedPlan.waitingPeriod}</strong> vs <strong className="text-amber-800 font-bold">{comparedPlan.waitingPeriod}</strong></span>
                                            )}
                                          </span>
                                        </div>

                                        {/* Co-pay compare */}
                                        <div className="flex justify-between items-start last:border-0">
                                          <span className="font-bold text-slate-500">🤝 Co-payment Rule:</span>
                                          <span className="text-right text-slate-700 font-semibold max-w-[200px]">
                                            {matchedPlan.coPay === comparedPlan.coPay ? (
                                              <span className="text-slate-500">Matches recommended ({comparedPlan.coPay})</span>
                                            ) : (
                                              <span>Recommended co-pay rate is <strong className="text-emerald-600 font-bold">{matchedPlan.coPay}</strong> vs <strong className="text-amber-800 font-bold">{comparedPlan.coPay}</strong></span>
                                            )}
                                          </span>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {/* Premium details block */}
                                <div className="bg-slate-100/50 border border-slate-200 p-4.5 rounded-xl flex justify-between items-center">
                                  <div className="text-left">
                                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Estimated Base Premium</span>
                                    <span className="text-xs text-slate-450 font-semibold">Standard price list bracket</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-2xl font-black text-slate-900">₹{comparedPlan.premium}</span>
                                    <span className="text-slate-500 text-xs font-semibold"> / mo</span>
                                  </div>
                                </div>

                                {/* What's Included (Bullet points only, no clumps) */}
                                <div className="space-y-3.5">
                                  <h5 className="text-xs font-black uppercase tracking-widest text-slate-600 border-b border-slate-150 pb-2">
                                    Benefit specifications (Compare side-by-side)
                                  </h5>

                                  <ul className="space-y-2.5 text-xs">
                                    <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${comparedPlan.coverage !== matchedPlan.coverage
                                      ? 'bg-amber-50/60 border-amber-200 text-slate-800 shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-700'
                                      }`}>
                                      <div className="flex items-start gap-2.5">
                                        <span className="text-slate-500 font-bold shrink-0">🛡️ Max Coverage:</span>
                                        <span className="text-slate-700 leading-normal font-semibold">{comparedPlan.coverage} sum insured protection</span>
                                      </div>
                                      {comparedPlan.coverage !== matchedPlan.coverage && (
                                        <div className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-md w-fit ml-6 self-start animate-pulse">
                                          ⚠️ DIFFERENT FROM RECOMMENDED: matches alternative upper range sizes
                                        </div>
                                      )}
                                    </li>

                                    <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${comparedPlan.roomRent !== matchedPlan.roomRent
                                      ? 'bg-amber-50/60 border-amber-200 text-slate-800 shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-700'
                                      }`}>
                                      <div className="flex items-start gap-2.5">
                                        <span className="text-slate-500 font-bold shrink-0">🛏️ Room Allotment:</span>
                                        <span className="text-slate-700 leading-normal font-semibold">{comparedPlan.roomRent}</span>
                                      </div>
                                      {comparedPlan.roomRent !== matchedPlan.roomRent && (
                                        <div className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-md w-fit ml-6 self-start">
                                          ⚠️ DIFFERENT FROM RECOMMENDED: Recommended allows ({matchedPlan.roomRent})
                                        </div>
                                      )}
                                    </li>

                                    <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${comparedPlan.waitingPeriod !== matchedPlan.waitingPeriod
                                      ? 'bg-amber-50/60 border-amber-200 text-slate-800 shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-700'
                                      }`}>
                                      <div className="flex items-start gap-2.5">
                                        <span className="text-slate-500 font-bold shrink-0">⏱️ Waiting Period:</span>
                                        <span className="text-slate-700 leading-normal font-semibold">{comparedPlan.waitingPeriod}</span>
                                      </div>
                                      {comparedPlan.waitingPeriod !== matchedPlan.waitingPeriod && (
                                        <div className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-md w-fit ml-6 self-start">
                                          ⚠️ DIFFERENT FROM RECOMMENDED: Recommended wait is ({matchedPlan.waitingPeriod})
                                        </div>
                                      )}
                                    </li>

                                    <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${comparedPlan.coPay !== matchedPlan.coPay
                                      ? 'bg-amber-50/60 border-amber-200 text-slate-800 shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-700'
                                      }`}>
                                      <div className="flex items-start gap-2.5">
                                        <span className="text-slate-500 font-bold shrink-0">🤝 Co-payment Rule:</span>
                                        <span className="text-slate-700 leading-normal font-semibold">{comparedPlan.coPay}</span>
                                      </div>
                                      {comparedPlan.coPay !== matchedPlan.coPay && (
                                        <div className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-md w-fit ml-6 self-start">
                                          ⚠️ DIFFERENT FROM RECOMMENDED: Recommended holds ({matchedPlan.coPay})
                                        </div>
                                      )}
                                    </li>

                                    <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${comparedPlan.claimRatio !== matchedPlan.claimRatio
                                      ? 'bg-amber-50/60 border-amber-200 text-slate-800 shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-700'
                                      }`}>
                                      <div className="flex items-start gap-2.5">
                                        <span className="text-slate-550 font-bold shrink-0">📈 Audited Claim Ratio:</span>
                                        <span className="text-slate-700 leading-normal font-semibold">{comparedPlan.claimRatio} audit verification</span>
                                      </div>
                                      {comparedPlan.claimRatio !== matchedPlan.claimRatio && (
                                        <div className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-md w-fit ml-6 self-start">
                                          ⚠️ DIFFERENT FROM RECOMMENDED: Recommended holds ({matchedPlan.claimRatio})
                                        </div>
                                      )}
                                    </li>
                                  </ul>
                                </div>

                                {/* Extra Plan Benefits */}
                                <div className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-200">
                                  <span className="text-[10px] text-slate-450 font-extrabold uppercase tracking-wider block">Additional Highlights:</span>
                                  <ul className="space-y-1.5 text-xs text-slate-600">
                                    {comparedPlan.keyBenefits.map((b, i) => (
                                      <li key={i} className="flex gap-2 items-start font-semibold">
                                        <Check className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                        <span>{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Selection actions for compared item */}
                                <div className="pt-2">
                                  <button
                                    onClick={() => {
                                      // Update recommendation model locally to treat selected as recommended choice
                                      const opCount = comparedPlan.id === "star-comprehensive" ? "14,000+" : "11,500+";
                                      const opSavings = comparedPlan.id === "star-comprehensive" ? "₹2,40,000" : "₹1,20,000";
                                      const updatedReco: RecommendationResponse = {
                                        recommendedPlanId: comparedPlan.id,
                                        confidence: 90,
                                        whyExplanation: `You manually customized your selection to the ${comparedPlan.name} based on side-by-side parameters and premium balancing.`,
                                        savingsEstimate: opSavings,
                                        cashlessCount: opCount,
                                        monthlyPremium: comparedPlan.premium,
                                        highlightedBenefits: comparedPlan.keyBenefits
                                      };
                                      setRecommendation(updatedReco);
                                      const firstOther = plans.find(p => p.id !== comparedPlan.id);
                                      if (firstOther) {
                                        setSelectedCompareId(firstOther.id);
                                      }
                                    }}
                                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition duration-150 cursor-pointer text-center uppercase tracking-widest border border-slate-350"
                                  >
                                    Select {comparedPlan.name.replace("Star ", "")} Instead
                                  </button>
                                </div>
                              </div>
                            );
                          })()}

                        </div>

                      </div>
                    </div>
                  )}


                </motion.div>
              )}
            </AnimatePresence>
          )}

        </div>

      </div>
    </div>
  );
}

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#FF3366", "#00338D", "#FFD700", "#00E5FF", "#7C4DFF", "#4CAF50"];
    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 6 + 4,
      d: Math.random() * width,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
      speed: Math.random() * 3 + 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.speed;
        p.x += Math.sin(p.tiltAngle) * 0.5;
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        if (p.y > height) {
          particles[idx] = {
            ...p,
            x: Math.random() * width,
            y: -20,
            tilt: Math.random() * 10 - 5,
            speed: Math.random() * 3 + 2,
          };
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const timeoutId = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, width, height);
    }, 3000);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
