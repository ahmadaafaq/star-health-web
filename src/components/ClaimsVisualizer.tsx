import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  Play, CheckCircle, Search, Clock, FileText, Landmark, ShieldCheck, Heart, ArrowRight
} from "lucide-react";

export default function ClaimsVisualizer() {
  const [activeTab, setActiveTab] = useState<'journey' | 'tracker'>('journey');
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);

  // Live Claim Tracker State
  const [claimId, setClaimId] = useState("STAR-9382");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  // Interactive timeline definitions
  const JOURNEY_STAGES = [
    { title: "Buy Policy", desc: "Select the tailored plan on Star Portal. Complete instant online KYC clearance.", note: "Day 1: Protection starts" },
    { title: "Medical Emergency", desc: "Patient gets admitted. Simply produce your digital Star Health ID card in the claims desk.", note: "No papers required" },
    { title: "Hospital Admission", desc: "The hospital desk shoots an alert to Star’s dedicated medical team.", note: "Within 20 minutes" },
    { title: "Cashless Approval", desc: "Our in-house doctors audit diagnostics and pass pre-authorization approvals.", note: "Under 2 Hours standard" },
    { title: "Treatment", desc: "Undergo professional medical procedures without paying security deposits.", note: "Focus fully on healing" },
    { title: "Claim Settlement", desc: "Star settles bills directly with the corporate financial account of the partner hospital.", note: "Direct cashless exit" },
    { title: "Recovery", desc: "Patient is discharged and recovers safely at home with zero balance worries.", note: "Worry-free restoration" }
  ];

  // Tracker states definitions
  const TRACKER_STEPS = [
    { label: "Claim Submitted", status: "completed", date: "June 09, 2026 14:30" },
    { label: "Medical Review", status: "completed", date: "June 09, 2026 16:15" },
    { label: "Hospital Verification", status: "completed", date: "June 10, 2026 09:10" },
    { label: "Approved & Authorized", status: "current", date: "June 10, 2026 11:45" },
    { label: "Payment Initiated", status: "pending", date: "--" },
    { label: "Completed", status: "pending", date: "--" }
  ];

  const handleSearchClaim = (e: FormEvent) => {
    e.preventDefault();
    if (!claimId.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    setTimeout(() => {
      setIsSearching(false);
      setSearchResult({
        id: claimId.toUpperCase(),
        patient: "Aarav Sharma",
        hospital: "Apollo Hospital, Bannerghatta Bengaluru",
        admitDate: "June 09, 2026",
        sumApproved: "₹3,45,000",
        stages: TRACKER_STEPS
      });
    }, 1200);
  };

  useEffect(() => {
    // Auto populate default search
    setSearchResult({
      id: "STAR-9382",
      patient: "Aarav Sharma",
      hospital: "Apollo Hospital, Bannerghatta Bengaluru",
      admitDate: "June 09, 2026",
      sumApproved: "₹3,45,000",
      stages: TRACKER_STEPS
    });
  }, []);

  // Interval rotation on timeline to demonstrate interactive flow
  useEffect(() => {
    if (activeTab === 'journey') {
      const interval = setInterval(() => {
        setActiveJourneyStep(prev => (prev + 1) % JOURNEY_STAGES.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  return (
    <section id="claims-visualizer-section" className="bg-slate-50 border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-slate-900 relative">
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Headline */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-star-red text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
            Claim Processing Track
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-[#00338D]">Cashless Claims, Demystified</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-medium">
            Watch exactly how your emergency claims move from initial admission to complete cashless payment inside 120 minutes.
          </p>
        </div>

        {/* Tab switcher buttons with clean pill design */}
        <div className="flex justify-center">
          <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex gap-1 shadow-inner">
            <button 
              onClick={() => setActiveTab('journey')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition duration-200 cursor-pointer ${activeTab === 'journey' ? 'bg-star-red text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Interactive Cashless Journey
            </button>
            <button 
              onClick={() => setActiveTab('tracker')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition duration-200 cursor-pointer ${activeTab === 'tracker' ? 'bg-star-red text-white shadow-md' : 'text-slate-605 hover:text-slate-900'}`}
            >
              Live Claim Tracker Dashboard
            </button>
          </div>
        </div>

        {/* Body Render */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl">
          {activeTab === 'journey' ? (
            <div className="space-y-10">
              
              {/* Animated Progress Timeline dot sequence */}
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4 items-center relative">
                {/* Horizontal progress connector line (visible on desktop) */}
                <div className="absolute left-[7%] right-[7%] top-[24px] h-0.5 bg-slate-200 hidden md:block z-0" />
                
                {JOURNEY_STAGES.map((stepItem, idx) => {
                  const isActive = idx === activeJourneyStep;
                  const isPassed = idx < activeJourneyStep;

                  return (
                    <button
                      key={stepItem.title}
                      onClick={() => setActiveJourneyStep(idx)}
                      className="text-center focus:outline-none col-span-1 z-10 space-y-3 group cursor-pointer"
                    >
                      <div className="flex justify-center">
                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center font-extrabold text-sm transition-all duration-300 ${
                          isActive 
                            ? 'bg-star-red border-red-300 ring-4 ring-red-100 text-white scale-110 shadow-lg' 
                            : isPassed 
                              ? 'bg-blue-50 border-star-blue text-star-blue'
                              : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-slate-300'
                        }`}>
                          {isPassed ? <CheckCircle className="w-5 h-5 text-star-blue fill-blue-50" /> : idx + 1}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className={`text-xs font-bold leading-tight ${isActive ? 'text-star-red font-extrabold' : 'text-slate-700'}`}>
                          {stepItem.title}
                        </div>
                        <div className="text-[9px] text-slate-400 tracking-wider font-semibold">
                          {stepItem.note}
                        </div>
                      </div>

                    </button>
                  );
                })}
              </div>

              {/* Selected Stage Detail Explainer Box */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl md:flex justify-between items-center gap-8 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

                <div className="space-y-3 md:max-w-xl">
                  <div className="inline-flex items-center gap-1.5 text-[9px] bg-red-50 text-star-red border border-red-100 font-extrabold tracking-widest px-2.5 py-1 rounded-md uppercase">
                    Stage {activeJourneyStep + 1} in detail
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {JOURNEY_STAGES[activeJourneyStep].title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {JOURNEY_STAGES[activeJourneyStep].desc}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 bg-white px-5 py-4 rounded-xl border border-slate-200 text-center min-w-[200px] shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Standard Waiting Time</div>
                  <div className="text-lg font-extrabold text-star-blue mt-1">Instant Direct</div>
                  <div className="text-[9px] text-green-600 mt-0.5 font-bold">✓ Zero out-of-pocket deposits</div>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-8 text-left">
              
              {/* Claim Search Bar Form */}
              <form onSubmit={handleSearchClaim} className="max-w-md mx-auto relative flex gap-2">
                <input 
                  type="text" 
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  placeholder="Enter policy/claim code (e.g. STAR-9382)"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-star-blue focus:outline-none rounded-xl px-4 py-3 placeholder-slate-400 text-xs font-semibold text-slate-900 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-5 py-3 bg-star-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isSearching ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Track</span>
                </button>
              </form>

              {/* Progress Panel details */}
              {searchResult && (
                <div className="space-y-8 border-t border-slate-200 pt-6">
                  
                  {/* Summary Card metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                    <div>
                      <div className="text-[10px] text-slate-450 uppercase tracking-widest font-extrabold">Tracking Claim-ID</div>
                      <div className="text-sm font-extrabold text-[#00338D] mt-0.5">{searchResult.id}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-455 uppercase tracking-widest font-extrabold">Beneficiary Name</div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">{searchResult.patient}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-455 uppercase tracking-widest font-extrabold">Cashless Hospital Location</div>
                      <div className="text-sm font-bold text-slate-700 mt-0.5 truncate">{searchResult.hospital}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-455 uppercase tracking-widest font-extrabold">Sum Insured Under Review</div>
                      <div className="text-sm font-black text-green-600 mt-0.5">{searchResult.sumApproved}</div>
                    </div>
                  </div>

                  {/* Parcel-like Tracking Progression sequence */}
                  <div className="space-y-6">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Claims Authorization Status Timeline:</h4>
                    
                    <div className="flex flex-col space-y-4">
                      {searchResult.stages.map((stg: any, indx: number) => (
                        <div key={stg.label} className="grid grid-cols-12 items-center text-xs">
                          
                          {/* Dot connector */}
                          <div className="col-span-1 flex justify-center relative">
                            {/* line down to next element */}
                            {indx < searchResult.stages.length - 1 && (
                              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-0.5 bg-slate-200 h-12 z-0" />
                            )}
                            
                            <div className={`w-5 h-5 rounded-full z-10 flex items-center justify-center ${
                              stg.status === 'completed'
                                ? 'bg-green-600 text-white'
                                : stg.status === 'current'
                                  ? 'bg-star-blue ring-4 ring-blue-100 text-white'
                                  : 'bg-slate-100 border border-slate-200 text-slate-400'
                            }`}>
                              {stg.status === 'completed' ? '✓' : ''}
                            </div>
                          </div>

                          {/* Label info */}
                          <div className="col-span-7 space-y-0.5">
                            <div className={`font-bold ${stg.status === 'completed' ? 'text-slate-700' : stg.status === 'current' ? 'text-star-blue font-extrabold' : 'text-slate-450'}`}>
                              {stg.label}
                            </div>
                            <div className="text-[10px] text-slate-450 font-semibold">Live verifications ongoing</div>
                          </div>

                          {/* Timestamp info */}
                          <div className="col-span-4 text-right text-[10px] text-slate-400 font-mono font-semibold">
                            {stg.date}
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Completion Notice bar */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-xs text-slate-600 font-medium">
                        <strong>Review State:</strong> Our in-house audit specialists are verifying final bills dynamically with Apollo Hospital billing desk. Outpatient clearance timeline target: <strong className="text-star-red font-bold">15 minutes remaining</strong>.
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
