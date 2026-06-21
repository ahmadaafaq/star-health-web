import { useState } from "react";
import { Check, X, Shield, ShieldCheck, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface ComparePlansProps {
  onStartAdvisor: () => void;
}

type PresetKey = "all" | "family" | "senior" | "youth";

export default function ComparePlans({ onStartAdvisor }: ComparePlansProps) {
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("all");
  const [visibleStartIdx, setVisibleStartIdx] = useState(0);

  // ── Comparison Metrics ────────────────────────────────────────────────────
  const METRICS = [
    { id: "coverage",     label: "Sum Insured Range" },
    { id: "premium",      label: "Est. Base Monthly Premium" },
    { id: "roomRent",     label: "Room Rent Rules" },
    { id: "copay",        label: "Co-Payment" },
    { id: "cashless",     label: "Cashless Network Hospitals" },
    { id: "waiting",      label: "Pre-Existing Waiting Period" },
    { id: "restoration",  label: "Sum Insured Restoration" },
    { id: "ncb",          label: "No Claim / Loyalty Bonus" },
    { id: "maternity",    label: "Maternity / Newborn Cover" },
    { id: "ayush",        label: "AYUSH Treatment" },
    { id: "daycare",      label: "All Day-Care Treatments" },
    { id: "icu",          label: "ICU Charges" },
    { id: "ambulance",    label: "Emergency Road Ambulance" },
    { id: "homecare",     label: "Home Care Treatment" },
    { id: "modern",       label: "Modern Treatments (Immunotherapy, Stem Cell)" },
    { id: "claimRatio",   label: "Claim Settlement Ratio" },
  ];

  // ── All 8 Plans — synced with rag.py POLICY_SUMMARIES & App.tsx PLANS_DATA ──
  const ALL_PLANS = [
    {
      id: "family-health-optima",
      name: "Family Health Optima",
      shortName: "FHO",
      category: "Family Floater",
      popular: false,
      presets: ["all", "family"],
      badge: "Best for Families",
      badgeColor: "bg-emerald-600",
      data: {
        coverage:    "₹5 Lakh – ₹25 Lakh",
        premium:     "₹1,199 / month",
        roomRent:    "Single Private Room (no capping)",
        copay:       "No Co-Pay for network hospitals",
        cashless:    "14,000+ top centers",
        waiting:     "36 Months (Immediate for accidents)",
        restoration: "100% automatic restoration whenever exhausted",
        ncb:         "Loyalty bonus up to 100% of sum insured",
        maternity:   "Newborn baby covered from day 1 of birth",
        ayush:       "Fully covered up to sum insured",
        daycare:     "Fully covered (all day-care procedures)",
        icu:         "Fully covered — zero deductions",
        ambulance:   "Additional SI for road traffic accident injuries",
        homecare:    "Not covered",
        modern:      "Covered (immunotherapy, stem cell therapy)",
        claimRatio:  "98.2%",
      }
    },
    {
      id: "star-assure",
      name: "Star Health Assure",
      shortName: "Assure",
      category: "Comprehensive Floater",
      popular: true,
      presets: ["all", "family"],
      badge: "Most Popular",
      badgeColor: "bg-star-red",
      data: {
        coverage:    "₹5 Lakh – ₹2 Crore",
        premium:     "₹1,499 / month",
        roomRent:    "Single Private Room (no capping)",
        copay:       "No Co-Pay",
        cashless:    "14,000+ top centers",
        waiting:     "36 Months (Immediate for accidents)",
        restoration: "Unlimited automatic restoration in a policy year",
        ncb:         "Up to 100% booster on claim-free runs",
        maternity:   "Newborn covered; maternity add-on available",
        ayush:       "Fully covered up to sum insured",
        daycare:     "Fully covered (all day-care procedures)",
        icu:         "Fully covered — zero deductions",
        ambulance:   "Fully covered (Road ambulance)",
        homecare:    "Not covered",
        modern:      "Covered (modern surgical interventions)",
        claimRatio:  "98.0%",
      }
    },
    {
      id: "super-star",
      name: "Super Star",
      shortName: "Super Star",
      category: "Super-Comprehensive",
      popular: false,
      presets: ["all", "family"],
      badge: "Flagship Plan",
      badgeColor: "bg-indigo-600",
      data: {
        coverage:    "₹5 Lakh – ₹5 Crore",
        premium:     "₹2,299 / month",
        roomRent:    "Single Private Room (no capping)",
        copay:       "No Co-Pay",
        cashless:    "14,000+ top centers",
        waiting:     "36 Months (Immediate for accidents)",
        restoration: "Unlimited automatic restoration",
        ncb:         "Cumulative bonus on claim-free years",
        maternity:   "Covered (with maternity benefit rider)",
        ayush:       "Fully covered up to sum insured",
        daycare:     "Fully covered (all procedures)",
        icu:         "Fully covered — zero deductions",
        ambulance:   "Fully covered (Road ambulance)",
        homecare:    "Fully covered",
        modern:      "Fully covered (broadest modern treatment list)",
        claimRatio:  "98.8%",
      }
    },
    {
      id: "star-premier",
      name: "Star Health Premier",
      shortName: "Premier",
      category: "Premium 50+ Plan",
      popular: false,
      presets: ["all", "senior"],
      badge: "Best for 50+",
      badgeColor: "bg-amber-600",
      data: {
        coverage:    "₹10 Lakh – ₹1 Crore",
        premium:     "₹1,899 / month",
        roomRent:    "Single Private Room (no capping)",
        copay:       "No Co-Pay",
        cashless:    "14,000+ top centers",
        waiting:     "36 Months (Pre-existing diseases)",
        restoration: "100% Automatic restoration once per year",
        ncb:         "Wellness rewards points program",
        maternity:   "Not covered (50+ plan)",
        ayush:       "Fully covered (AYUSH treatment)",
        daycare:     "Fully covered (all day-care procedures)",
        icu:         "Fully covered — zero deductions",
        ambulance:   "Fully covered (Road ambulance)",
        homecare:    "Fully covered (home care treatment)",
        modern:      "Covered (stem cell, immunotherapy)",
        claimRatio:  "98.5%",
      }
    },
    {
      id: "arogya-sanjeevani",
      name: "Arogya Sanjeevani",
      shortName: "Arogya",
      category: "Standard IRDAI Plan",
      popular: false,
      presets: ["all", "senior"],
      badge: "IRDAI Standard",
      badgeColor: "bg-slate-600",
      data: {
        coverage:    "₹5 Lakh – ₹2 Crore",
        premium:     "₹799 / month",
        roomRent:    "Up to 2% of Sum Insured per day",
        copay:       "5% co-pay on all claims",
        cashless:    "14,000+ top centers",
        waiting:     "36 Months (30-day initial waiting)",
        restoration: "Not applicable (Standard policy)",
        ncb:         "Cumulative bonus: 5% per claim-free year (max 50%)",
        maternity:   "Not covered",
        ayush:       "Covered up to sum insured",
        daycare:     "Fully covered (all day-care procedures)",
        icu:         "Up to 5% of SI/day (max ₹10,000/day)",
        ambulance:   "Road ambulance capped as per IRDAI limits",
        homecare:    "Not covered",
        modern:      "Not covered (standard plan scope)",
        claimRatio:  "97.5%",
      }
    },
    {
      id: "young-star",
      name: "Young Star Insurance",
      shortName: "Young Star",
      category: "Youth & Family Plan",
      popular: false,
      presets: ["all", "youth"],
      badge: "Best for Young Adults",
      badgeColor: "bg-teal-600",
      data: {
        coverage:    "₹5 Lakh – ₹1 Crore",
        premium:     "₹699 / month",
        roomRent:    "Single Private Room",
        copay:       "No Co-Pay",
        cashless:    "14,000+ top centers",
        waiting:     "36 Months (Immediate for accidents)",
        restoration: "Unlimited automatic restoration in a policy year",
        ncb:         "Wellness discount up to 20% on premium",
        maternity:   "Covered (Silver & Gold variants)",
        ayush:       "Covered up to sum insured",
        daycare:     "Fully covered (all day-care procedures)",
        icu:         "Fully covered — zero deductions",
        ambulance:   "Fully covered (Road ambulance)",
        homecare:    "Not covered",
        modern:      "Covered (day-care and modern procedures)",
        claimRatio:  "97.6%",
      }
    },
    {
      id: "medi-classic",
      name: "Medi Classic (Individual)",
      shortName: "Medi Classic",
      category: "Individual Plan",
      popular: false,
      presets: ["all", "youth"],
      badge: "Best Individual Plan",
      badgeColor: "bg-violet-600",
      data: {
        coverage:    "₹5 Lakh – ₹15 Lakh",
        premium:     "₹899 / month",
        roomRent:    "Single Private Room",
        copay:       "No Co-Pay",
        cashless:    "14,000+ top centers",
        waiting:     "36 Months (30-day initial waiting)",
        restoration: "Not applicable (Individual plan)",
        ncb:         "10% discount yr 2 / 12.5% discount yr 3 (long-term)",
        maternity:   "Not covered",
        ayush:       "Covered up to sum insured",
        daycare:     "Fully covered (all day-care procedures)",
        icu:         "Fully covered — zero deductions",
        ambulance:   "Road ambulance ₹750 per hospitalisation",
        homecare:    "Not covered",
        modern:      "Covered (day-care surgical procedures)",
        claimRatio:  "97.8%",
      }
    },
    {
      id: "star-comprehensive",
      name: "Star Comprehensive Insurance Policy",
      shortName: "Comprehensive",
      category: "All-Round Individual & Floater",
      popular: false,
      presets: ["all", "family"],
      badge: "Best for OPD & Maternity",
      badgeColor: "bg-blue-600",
      data: {
        coverage:    "₹5 Lakh – ₹1 Crore",
        premium:     "₹1,099 / month",
        roomRent:    "Single Private Room (no capping)",
        copay:       "No Co-Pay",
        cashless:    "14,000+ top centers",
        waiting:     "36 Months (Immediate for accidents)",
        restoration: "100% automatic restoration (related & unrelated illnesses)",
        ncb:         "Cumulative bonus up to 100% of sum insured",
        maternity:   "Delivery & newborn covered from day 1",
        ayush:       "Fully covered up to sum insured",
        daycare:     "Fully covered (all procedures)",
        icu:         "Fully covered — zero deductions",
        ambulance:   "Fully covered (Road ambulance)",
        homecare:    "Domiciliary hospitalisation up to 10% of sum insured",
        modern:      "Covered up to Sum Insured (broad range)",
        claimRatio:  "98.1%",
      }
    },
  ];

  const PRESETS: { key: PresetKey; label: string; icon: string }[] = [
    { key: "all",    label: "All 8 Plans",            icon: "🏥" },
    { key: "family", label: "Family Floater Plans",   icon: "👨‍👩‍👧‍👦" },
    { key: "senior", label: "Senior & Standard",      icon: "🧓" },
    { key: "youth",  label: "Youth & Individual",     icon: "🌟" },
  ];

  const visiblePlans = ALL_PLANS.filter(p => p.presets.includes(selectedPreset));

  // For mobile, paginate 2 plans at a time
  const COLS_PER_PAGE = 2;
  const maxStart = Math.max(0, visiblePlans.length - COLS_PER_PAGE);
  const displayedPlans = visiblePlans.slice(visibleStartIdx, visibleStartIdx + COLS_PER_PAGE);

  const handlePresetChange = (preset: PresetKey) => {
    setSelectedPreset(preset);
    setVisibleStartIdx(0);
  };

  // Determine highlighted vs dimmed cells
  const getCellStyle = (value: string) => {
    const v = value.toLowerCase();
    if (
      v.includes("no capping") ||
      v.includes("fully covered") ||
      v.includes("immediate") ||
      v.includes("14,000+") ||
      v.includes("no co-pay") ||
      v.includes("unlimited")
    ) return "positive";
    if (
      v.includes("not covered") ||
      v.includes("5% co-pay") ||
      v.includes("capped") ||
      v.includes("not applicable")
    ) return "negative";
    return "neutral";
  };

  return (
    <section id="compare-section" className="bg-slate-50 border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-red-100 rounded-full filter blur-[150px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-100 rounded-full filter blur-[120px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10">

        {/* Section Title */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-wider text-star-red bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
            All 8 Policies Compared
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900">Interactive Plan Comparison</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-medium">
            Every Star Health policy side-by-side — sourced directly from official policy documents and our knowledge base.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">

          {/* Preset Filter Row */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map(preset => (
                <button
                  key={preset.key}
                  onClick={() => handlePresetChange(preset.key)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    selectedPreset === preset.key
                      ? "bg-star-red text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setVisibleStartIdx(i => Math.max(0, i - 1))}
                disabled={visibleStartIdx === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-slate-500 font-bold">
                {visibleStartIdx + 1}–{Math.min(visibleStartIdx + COLS_PER_PAGE, visiblePlans.length)} of {visiblePlans.length}
              </span>
              <button
                onClick={() => setVisibleStartIdx(i => Math.min(maxStart, i + 1))}
                disabled={visibleStartIdx >= maxStart}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:block">
              *Section 80D tax deductions apply to all plans
            </div>
          </div>

          {/* Table — Desktop shows all; Mobile shows paginated */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: `${Math.max(560, visiblePlans.length * 200)}px` }}>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="p-5 font-extrabold text-xs text-slate-400 uppercase tracking-widest w-52 sticky left-0 bg-slate-50/80 backdrop-blur z-10">
                    Core Metric
                  </th>

                  {/* Desktop: all visible; Mobile: paginated subset */}
                  {visiblePlans.map(plan => (
                    <th
                      key={plan.id}
                      className={`p-5 relative border-r border-slate-200 last:border-0 text-left sm:table-cell ${
                        !displayedPlans.find(d => d.id === plan.id) ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute top-2 right-3 bg-star-red text-[8px] font-extrabold uppercase text-white px-2 py-0.5 rounded-full tracking-wider">
                          RECOMMENDED
                        </span>
                      )}
                      <div className="flex items-start gap-2 mt-2">
                        <span className={`flex-shrink-0 mt-0.5 text-[8px] font-extrabold uppercase text-white px-1.5 py-0.5 rounded-md ${plan.badgeColor}`}>
                          {plan.badge}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-star-blue mt-2 leading-snug">{plan.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{plan.category}</div>
                      <a
                        href={`https://efsgbittghkwjoklhqfk.supabase.co/storage/v1/object/public/policy-pdfs/${plan.id}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-star-blue hover:text-blue-900 text-[10px] font-bold rounded-lg transition"
                      >
                        📥 Policy PDF
                      </a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metric, index) => (
                  <tr
                    key={metric.id}
                    className={`border-b last:border-0 border-slate-200 hover:bg-slate-50/60 transition duration-100 ${index % 2 === 1 ? "bg-slate-50/20" : ""}`}
                  >
                    {/* Metric label — sticky on left */}
                    <td className="p-5 font-bold text-xs text-slate-800 sticky left-0 bg-white/90 backdrop-blur z-10">
                      <span className="block leading-snug">{metric.label}</span>
                    </td>

                    {visiblePlans.map(plan => {
                      const value = (plan.data as Record<string, string>)[metric.id] ?? "—";
                      const style = getCellStyle(value);
                      return (
                        <td
                          key={plan.id}
                          className={`p-5 text-xs border-r border-slate-200 last:border-r-0 sm:table-cell ${
                            !displayedPlans.find(d => d.id === plan.id) ? "hidden sm:table-cell" : ""
                          } ${
                            style === "positive" ? "text-emerald-700 font-bold" :
                            style === "negative" ? "text-rose-600 font-semibold" :
                            "text-slate-600 font-semibold"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {style === "positive" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            ) : style === "negative" ? (
                              <X className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                            )}
                            <span className="leading-snug">{value}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend row */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Best-in-class feature</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-blue-400" /> Standard coverage</span>
            <span className="flex items-center gap-1.5"><X className="w-3 h-3 text-rose-500" /> Not covered / limited</span>
          </div>

          {/* CTA Banner */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 text-center md:flex justify-between items-center gap-6">
            <div className="text-left space-y-1 mb-4 md:mb-0">
              <div className="text-sm font-extrabold text-slate-800">Not sure which plan fits your unique health profile?</div>
              <p className="text-xs text-slate-500 font-medium">Let our AI Advisor analyze your family, age, pre-existing conditions and budget — in under 2 minutes.</p>
            </div>
            <button
              onClick={onStartAdvisor}
              className="px-6 py-3 bg-star-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-md flex items-center justify-center gap-2 mx-auto md:mx-0 cursor-pointer whitespace-nowrap"
            >
              <Star className="w-3.5 h-3.5" />
              <span>Find My Best Plan with AI</span>
            </button>
          </div>

        </div>

        {/* Plan count notice */}
        <p className="text-center text-xs text-slate-400 font-medium">
          Showing {visiblePlans.length} of 8 Star Health policies · All data sourced from official policy documents ·{" "}
          <span className="text-star-blue font-bold">Section 80D</span> tax benefits applicable to all
        </p>

      </div>
    </section>
  );
}
