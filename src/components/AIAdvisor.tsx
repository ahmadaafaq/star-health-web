import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, ArrowLeft, Loader2, Play, Sparkles, CheckCircle, 
  Baby, AlertOctagon, HelpCircle, Heart, Shield, Activity, DollarSign, CloudLightning,
  Check, Info, Award, Scale, ChevronDown, ChevronUp
} from "lucide-react";
import { RecommendationRequest, RecommendationResponse, Plan } from "../types";

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
      parentsIncluded: myParents > 0 || spouseParents > 0
    }));
  };

  const totalMembers = (myselfSelected ? 1 : 0) + (spouseSelected ? 1 : 0) + childrenCount + myParentsCount + spouseParentsCount;

  const toggleMyself = () => {
    const nextVal = !myselfSelected;
    const projectTotal = (nextVal ? 1 : 0) + (spouseSelected ? 1 : 0) + childrenCount + myParentsCount + spouseParentsCount;
    if (projectTotal === 0) return; // Prevent completely empty select
    if (nextVal && totalMembers >= 8) return;

    setMyselfSelected(nextVal);
    updateMembersListState(nextVal, spouseSelected, childrenCount, myParentsCount, spouseParentsCount);
  };

  const toggleSpouse = () => {
    const nextVal = !spouseSelected;
    const projectTotal = (myselfSelected ? 1 : 0) + (nextVal ? 1 : 0) + childrenCount + myParentsCount + spouseParentsCount;
    if (projectTotal === 0) return;
    if (nextVal && totalMembers >= 8) return;

    setSpouseSelected(nextVal);
    updateMembersListState(myselfSelected, nextVal, childrenCount, myParentsCount, spouseParentsCount);
  };

  const incrementChildren = () => {
    if (childrenCount >= 3) return;
    if (totalMembers >= 8) return;
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
    if (spouseParentsCount > 0) return; // Only one set of parents can be active
    if (myParentsCount >= 2) return;
    if (totalMembers >= 8) return;
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
    if (myParentsCount > 0) return; // Only one set of parents can be active
    if (spouseParentsCount >= 2) return;
    if (totalMembers >= 8) return;
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
    setLoading(true);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data: RecommendationResponse = await response.json();
        setRecommendation(data);
        const alternative = plans.find(p => p.id !== data.recommendedPlanId);
        if (alternative) setSelectedCompareId(alternative.id);
        onRecommendationReceived(data);
      } else {
        throw new Error("API Recommend call failed");
      }
    } catch (e) {
      console.warn("Falling back to client-side recommendation engine");
      // Fallback matching logic
      const isDiabetes = formData.diabetes || formData.preExisting.includes("diabetes");
      const hasSenior = formData.members.includes("parents") || Number(formData.age) >= 60;
      const isBudget = formData.budget === "low" || formData.budget === "modest";
      const hasPregnancy = formData.pregnancyPlan;

      let matchPlan = plans[0]; // Star Comprehensive plus
      let savings = "₹2,40,000";
      let count = "14,000+";

      if (isDiabetes) {
        matchPlan = plans.find(p => p.id === "diabetes") || plans[0];
        savings = "1,85,000";
        count = "13,800+";
      } else if (hasSenior) {
        matchPlan = plans.find(p => p.id === "assure") || plans[0];
        savings = "3,10,000";
        count = "12,950+";
      } else if (hasPregnancy) {
        matchPlan = plans.find(p => p.id === "comprehensive") || plans[0];
        savings = "2,60,000";
        count = "14,200+";
      } else if (isBudget) {
        matchPlan = plans.find(p => p.id === "family-delite") || plans[0];
        savings = "1,20,000";
        count = "11,500+";
      }

      const mockData: RecommendationResponse = {
        recommendedPlanId: matchPlan.id,
        confidence: 96,
        whyExplanation: `Based on your family setup of ${formData.members.join(", ")} and your priority on coverage, the ${matchPlan.name} is the ideal fit. It avoids heavy room renting limitations, locks in affordable rates, and settles claims instantly within 2 hours of exit.`,
        savingsEstimate: savings,
        cashlessCount: count,
        monthlyPremium: matchPlan.premium,
        highlightedBenefits: matchPlan.keyBenefits
      };
      setRecommendation(mockData);
      const alternative = plans.find(p => p.id !== matchPlan.id);
      if (alternative) setSelectedCompareId(alternative.id);
      onRecommendationReceived(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getMatchedPlan = (): Plan | undefined => {
    if (!recommendation) return undefined;
    return plans.find(p => p.id === recommendation.recommendedPlanId) || plans[0];
  };

  const matchedPlan = getMatchedPlan();

  return (
    <div id="ai-advisor-section" className="py-12 lg:py-20 border-t border-slate-200 bg-blue-50/30 text-slate-900 relative">
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className={`mx-auto px-4 sm:px-6 transition-all duration-500 ${recommendation ? "max-w-6xl" : "max-w-4xl"}`}>
        
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
          
          <AnimatePresence mode="wait">
            {!recommendation ? (
              <motion.div key="questions" exit={{ opacity: 0, x: -50 }} className="space-y-6">
                
                {/* Progress Indicators */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-550">Question {step} of 4</span>
                  <div className="flex gap-1.55">
                    {[1, 2, 3, 4].map(s => (
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
                        className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                          myselfSelected 
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
                        className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                          spouseSelected 
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
                        className={`p-4 rounded-2xl text-left border transition-all duration-200 ${
                          childrenCount > 0 
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
                        className={`p-4 rounded-2xl text-left border transition-all duration-200 ${
                          spouseParentsCount > 0 ? 'opacity-40 bg-slate-100 border-slate-200 pointer-events-none' : ''
                        } ${
                          myParentsCount > 0 
                            ? 'bg-blue-50/80 border-star-blue text-star-blue shadow-md' 
                            : 'bg-slate-50 border-slate-200 text-slate-705'
                        }`}
                      >
                        <span className="text-2xl block mb-2">👵</span>
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-sm text-slate-900">My Parents</div>
                          {spouseParentsCount === 0 ? (
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
                                disabled={myParentsCount >= 2 || totalMembers >= 8}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-slate-850 flex items-center justify-center text-xs transition cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-red-600 font-extrabold uppercase bg-red-50 px-2 py-1 rounded">Locked</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between font-semibold">
                          <span>{spouseParentsCount > 0 ? "Only 1 set of parents allowed" : "Mother and/or Father (Max 2)"}</span>
                          {myParentsCount > 0 && <span className="font-bold text-slate-700">{myParentsCount} covered</span>}
                        </div>
                      </div>

                      {/* Spouse's Parents Counter Card */}
                      <div
                        className={`p-4 rounded-2xl text-left border transition-all duration-200 ${
                          myParentsCount > 0 ? 'opacity-40 bg-slate-100 border-slate-200 pointer-events-none' : ''
                        } ${
                          spouseParentsCount > 0 
                            ? 'bg-blue-50/80 border-star-blue text-star-blue shadow-md' 
                            : 'bg-slate-50 border-slate-200 text-slate-705'
                        }`}
                      >
                        <span className="text-2xl block mb-2">👴</span>
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-sm text-slate-900">Spouse's Parents</div>
                          {myParentsCount === 0 ? (
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
                                disabled={spouseParentsCount >= 2 || totalMembers >= 8}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-extrabold text-slate-850 flex items-center justify-center text-xs transition cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-red-600 font-extrabold uppercase bg-red-50 px-2 py-1 rounded">Locked</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between font-semibold">
                          <span>{myParentsCount > 0 ? "Only 1 set of parents allowed" : "In-laws support (Max 2)"}</span>
                          {spouseParentsCount > 0 && <span className="font-bold text-slate-700">{spouseParentsCount} covered</span>}
                        </div>
                      </div>

                    </div>

                    {/* Member Limit Alert Indicator */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-650 text-left">
                        <Info className="w-4 h-4 text-star-blue shrink-0" />
                        <span>Regulatory limit: Max 8 members are allowed per policy. You can choose at most 3 children and only 1 set of parents (either yours or spouse's).</span>
                      </div>
                      <div className="shrink-0 font-extrabold text-xs text-slate-800 bg-white border border-slate-2 weight-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <span>Total Selected:</span>
                        <span className={`text-sm font-black ${totalMembers === 8 ? "text-star-red animate-pulse" : "text-[#00338D]"}`}>
                          {totalMembers}
                        </span>
                        <span>/ 8</span>
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

                      {/* Other pre-existing select list */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Other diagnosed conditions:</label>
                        <div className="grid grid-cols-2 gap-2">
                          {PRE_EXISTED_OPTIONS.map(opt => {
                            const isChosen = formData.preExisting.includes(opt.value);
                            return (
                              <button
                                key={opt.value}
                                onClick={() => handleDiseasesToggle(opt.value)}
                                className={`text-left text-xs font-bold px-4 py-2.5 border rounded-lg transition-colors cursor-pointer ${
                                  isChosen 
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
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "tier-1", label: "Tier 1 Metros", desc: "Delhi, Mumbai, Bengaluru" },
                            { value: "tier-2", label: "Tier 2 Cities", desc: "Jaipur, Lucknow, Kochi" },
                            { value: "tier-3", label: "Tier 3 Towns", desc: "Rural / Non-metro hubs" }
                          ].map(c => (
                            <button
                              key={c.value}
                              onClick={() => setFormData({ ...formData, city: c.value })}
                              className={`p-3 text-left border rounded-xl cursor-pointer ${formData.city === c.value ? 'bg-blue-50 border-star-blue text-star-blue font-bold' : 'bg-white text-slate-600 border-slate-200'}`}
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-25">
                          {[
                            { value: "low", label: "Highly Budget Friendly", desc: "Covers base essentials, shared rooms", icon: "💎" },
                            { value: "moderate", label: "Balanced Safety & Comfort", desc: "Private room, standard sum insureds", icon: "⚖️" },
                            { value: "premium", label: "Complete Unlimited Coverage", desc: "Immediate premium benefits, no co-pay", icon: "🏆" }
                          ].map(bg => (
                            <button
                              key={bg.value}
                              onClick={() => setFormData({ ...formData, budget: bg.value })}
                              className={`p-3 text-left border rounded-xl flex gap-3 items-center cursor-pointer ${formData.budget === bg.value ? 'bg-blue-50 border-star-blue text-star-blue font-bold' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                              <span className="text-xl shrink-0">{bg.icon}</span>
                              <div>
                                <div className="font-bold text-xs text-slate-900">{bg.label}</div>
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

                  {step < 4 ? (
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
                          <span>Find My Best Plan</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </motion.div>
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* RECOMMENDED CHOICE (Left Column) */}
                    <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-md relative overflow-hidden space-y-6">
                      {/* Top ribbon */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="inline-flex items-center bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest mb-2.5">
                            🌟 YOUR RECOMMENDED BEST MATCH
                          </span>
                          <h4 className="text-2xl font-extrabold text-[#00338D] tracking-tight">{matchedPlan.name}</h4>
                          <p className="text-xs text-slate-505 font-bold italic mt-1 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/30">
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

                    </div>

                    {/* SELECT & COMPARE (Right Column) */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                      
                      {/* Interactive Selector Header */}
                      <div className="space-y-1 text-left">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] px-2.5 py-1 rounded font-extrabold uppercase tracking-wider">
                          <Scale className="w-3.5 h-3.5 text-slate-500" />
                          <span>Interactive Multi-Plan Side-By-Side</span>
                        </span>
                        <h4 className="text-sm font-black text-slate-800">Choose any other plan to inspect & compare side-by-side:</h4>
                      </div>

                      {/* Alternatives Toggles */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                        {plans
                          .filter(p => p.id !== matchedPlan.id)
                          .map(op => {
                            const isComparing = selectedCompareId === op.id;
                            return (
                              <button
                                key={op.id}
                                onClick={() => setSelectedCompareId(op.id)}
                                className={`px-2.5 py-2.5 text-xs font-bold rounded-lg transition-all border cursor-pointer text-center leading-tight ${
                                  isComparing
                                    ? "bg-star-red text-white border-red-600 shadow-md scale-[1.02]"
                                    : "bg-white border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                {op.name.replace("Star ", "")}
                              </button>
                            );
                          })}
                      </div>

                      {/* Comparative Output */}
                      {(() => {
                        const comparedPlan = plans.find(p => p.id === selectedCompareId) || plans.find(p => p.id !== matchedPlan.id) || plans[0];
                        return (
                          <div className="border border-slate-200 rounded-2xl p-4.5 space-y-6 bg-slate-50/20 relative">
                            <div>
                              <span className="inline-flex items-center bg-slate-100 text-slate-700 border border-slate-200 text-[9px] px-2.5 py-0.5 rounded font-extrabold uppercase tracking-widest mb-1.5">
                                Compared Option details
                              </span>
                              <h4 className="text-xl font-extrabold text-[#00338D] tracking-tight">{comparedPlan.name}</h4>
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
                                <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${
                                  comparedPlan.coverage !== matchedPlan.coverage 
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

                                <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${
                                  comparedPlan.roomRent !== matchedPlan.roomRent 
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

                                <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${
                                  comparedPlan.waitingPeriod !== matchedPlan.waitingPeriod 
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

                                <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${
                                  comparedPlan.coPay !== matchedPlan.coPay 
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

                                <li className={`flex flex-col gap-1.5 p-2.5 rounded-lg border transition ${
                                  comparedPlan.claimRatio !== matchedPlan.claimRatio 
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
                                  const opCount = comparedPlan.id === "comprehensive" ? "14,000+" : "11,500+";
                                  const opSavings = comparedPlan.id === "comprehensive" ? "₹2,40,000" : "₹1,20,000";
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
                )}

                {/* Unified Bottom Booking Desk Action Block */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
                  <div className="text-left space-y-1 max-w-xl">
                    <h4 className="font-extrabold text-[#00338D] text-lg">Would you like to lock this protective shield in?</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      All estimates are calibrated against Star Health's public regulatory brochures. Book now to bypass standard medical tests and secure immediate 15-minute callback clearance.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
                    <a 
                      href={`https://wa.me/911234567890?text=Hi%2C%20Star%20Health%21%20I%20just%20completed%20the%20AI%20Advising%20Discovery.%20I%20have%20chosen%20the%20${matchedPlan?.name}%20at%20%E2%82%B9${recommendation?.monthlyPremium}/month.%20Please%20verify%20and%20lock%20this%20in.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-xs transition text-center shadow-lg shadow-green-600/10"
                    >
                      💬 Book plan via WhatsApp Call
                    </a>
                    <button 
                      onClick={() => {
                        alert(`Thank you! Our human verification desk has logged your current configuration: ${matchedPlan?.name}. We will reach out on your linked email in 15 minutes!`);
                      }}
                      className="px-6 py-3.5 bg-star-red hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition shadow-lg shadow-red-500/10 cursor-pointer"
                    >
                      ☎️ Request Instant Callback
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
