import { useState } from "react";
import { Check, X, Shield, Award, HeartHandshake, ShieldCheck } from "lucide-react";

interface ComparePlansProps {
  onStartAdvisor: () => void;
}

export default function ComparePlans({ onStartAdvisor }: ComparePlansProps) {
  const [selectedPreset, setSelectedPreset] = useState<'all' | 'family' | 'specialty'>('all');

  // Hardcoded comparison criteria
  const METRICS = [
    { id: "premium", label: "Est. Base Monthly Premium" },
    { id: "roomRent", label: "Room Rent Rules" },
    { id: "cashless", label: "Cashless Network Hospitals" },
    { id: "waiting", label: "Pre-Existing Waiting Period" },
    { id: "opd", label: "Outpatient (OPD) Consults" },
    { id: "daycare", label: "All Day-Care Treatments" },
    { id: "restoration", label: "Sum Insured Restoration" },
    { id: "ncb", label: "No Claim Bonus" },
    { id: "maternity", label: "Maternity Coverage" },
    { id: "icu", label: "ICU Charges Limit" },
    { id: "ambulance", label: "Emergency Road Ambulance" }
  ];

  const PLAN_COLUMNS = [
    {
      id: "comprehensive",
      name: "Star Comprehensive Plus",
      popular: true,
      data: {
        premium: "₹1,250",
        roomRent: "Private Single AC Room (No capping limit)",
        cashless: "14,000+ top centers",
        waiting: "36 Months (Reduced to immediate for accidents)",
        opd: "Up to ₹5,000 yearly outpatient checks",
        daycare: "Fully covered (100% of costs claimable)",
        restoration: "100% Automatic instantaneous reload",
        ncb: "Up to 100% booster on claim-free runs",
        maternity: "₹1,00,000 with newborn support",
        icu: "Fully covered - zero deductions",
        ambulance: "Fully covered (Road & Air ambulance)"
      }
    },
    {
      id: "diabetes",
      name: "Star Diabetes Safe Specialty",
      popular: false,
      data: {
        premium: "₹1,100",
        roomRent: "Capped daily at ₹5,000/day private limit",
        cashless: "13,800+ top centers",
        waiting: "Zero waiting period for direct diabetic safety issues",
        opd: "Comprehensive glucose tests & clinician visits included",
        daycare: "Fully covered for specified sub-procedures",
        restoration: "100% Automatic restoration once per year",
        ncb: "Up to 50% extra sum booster",
        maternity: "Not covered inside this specialty plan",
        icu: "Fully covered up to sum insured",
        ambulance: "Capped to ₹3,000 per admission"
      }
    },
    {
      id: "assure",
      name: "Star Senior Citizens Red Carpet",
      popular: false,
      data: {
        premium: "₹1,850",
        roomRent: "Private Room capped at ₹6,000/day limit",
        cashless: "12,900+ top centers",
        waiting: "12 Months (Shorter waiting with 30% co-pay rules)",
        opd: "Outpatient physiotherapy checks included",
        daycare: "Fully covered for cataract & joint care",
        restoration: "Not applicable inside elder safe",
        ncb: "Not applicable",
        maternity: "Not applicable",
        icu: "Capped up to 2% of sum insured daily",
        ambulance: "Fully covered up to ₹2,500 limits"
      }
    },
    {
      id: "family-delite",
      name: "Star Family Delite Budget",
      popular: false,
      data: {
        premium: "₹650",
        roomRent: "Shared Room or Private capped at 1% daily",
        cashless: "11,500+ top centers",
        waiting: "48 Months (4-Year pre-existing cap)",
        opd: "Not covered",
        daycare: "400+ specified surgeries only",
        restoration: "50% reload on complete exhaustion",
        ncb: "20% booster every claim-free year",
        maternity: "Capped to ₹20,000 basic",
        icu: "Capped at 2% of sum insured daily",
        ambulance: "Capped to ₹1,500 per alert"
      }
    }
  ];

  return (
    <section id="compare-section" className="bg-slate-50 border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-slate-905 relative">
      <div className="absolute top-10 left-10 w-80 h-80 bg-red-100 rounded-full filter blur-[150px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Title */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-wider text-star-red bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
            Granular Assessment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900">Interactive Plan Comparison</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-medium">
            See how Star Health's key plans look head-to-head. Identify exactly where competitors (like Policybazaar or Care) fall short in features.
          </p>
        </div>

        {/* Comparison table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
          
          {/* Preset Buttons row */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-1">
              <button 
                onClick={() => setSelectedPreset('all')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${selectedPreset === 'all' ? 'bg-star-red text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'}`}
              >
                Show All Plans
              </button>
              <button 
                onClick={() => setSelectedPreset('family')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${selectedPreset === 'family' ? 'bg-star-red text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'}`}
              >
                Family Focus
              </button>
              <button 
                onClick={() => setSelectedPreset('specialty')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${selectedPreset === 'specialty' ? 'bg-star-red text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'}`}
              >
                Specialty Ailments & Elder
              </button>
            </div>
            
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              *All Star plans qualify for Section 80D tax deductions
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="p-5 font-extrabold text-xs text-slate-400 uppercase tracking-widest w-1/4">Core Metric Criteria</th>
                  
                  {PLAN_COLUMNS.map((plan, idx) => {
                    // Check local visibility based on selection preset
                    if (selectedPreset === 'family' && plan.id !== 'comprehensive' && plan.id !== 'family-delite') return null;
                    if (selectedPreset === 'specialty' && plan.id !== 'diabetes' && plan.id !== 'assure') return null;

                    return (
                      <th key={plan.id} className="p-5 w-1/4 relative border-r border-slate-200 last:border-0 text-left">
                        {plan.popular && (
                          <span className="absolute top-2 right-4 bg-star-red text-[8px] font-extrabold uppercase text-white px-2 py-0.5 rounded-full tracking-wider">
                            RECOMMENDED
                          </span>
                        )}
                        <div className="text-sm font-extrabold text-star-blue mt-2">{plan.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">STAR PREMIUM SECTOR</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metric, index) => (
                  <tr 
                    key={metric.id}
                    className={`border-b last:border-0 border-slate-200 transition duration-150 hover:bg-slate-50/50 ${index % 2 === 1 ? 'bg-slate-50/20' : ''}`}
                  >
                    <td className="p-5 font-bold text-xs text-slate-800 flex flex-col">
                      <span>{metric.label}</span>
                      <span className="font-medium text-[9px] text-slate-400 mt-0.5 uppercase tracking-wide">Primary star comparison metrics</span>
                    </td>
                    
                    {PLAN_COLUMNS.map(plan => {
                      if (selectedPreset === 'family' && plan.id !== 'comprehensive' && plan.id !== 'family-delite') return null;
                      if (selectedPreset === 'specialty' && plan.id !== 'diabetes' && plan.id !== 'assure') return null;

                      // Highlight key values
                      const value = (plan.data as any)[metric.id];
                      const isHighValue = value?.toLowerCase().includes("no capping") || 
                                         value?.toLowerCase().includes("fully covered") || 
                                         value?.toLowerCase().includes("zero waiting") ||
                                         value?.toLowerCase().includes("immediate") ||
                                         value?.toLowerCase().includes("14,000+");

                      return (
                        <td key={plan.id} className={`p-5 text-xs border-r border-slate-200 last:border-r-0 ${isHighValue ? 'text-emerald-700 font-bold' : 'text-slate-600 font-semibold'}`}>
                          <div className="flex items-start gap-2">
                            {isHighValue ? (
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            ) : value?.toLowerCase().includes("not covered") ? (
                              <X className="w-4 h-4 text-star-red flex-shrink-0 mt-0.5" />
                            ) : (
                              <ShieldCheck className="w-4 h-4 text-star-blue flex-shrink-0 mt-0.5" />
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

          {/* Quick cta banner under table */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 text-center md:flex justify-between items-center">
            <div className="text-left space-y-1 mb-4 md:mb-0">
              <div className="text-sm font-extrabold text-slate-800">Not sure which policy parameters matter for your specific medical history?</div>
              <p className="text-xs text-slate-500 font-medium">Let our automated advisor compute the specific co-payments needed for cashless verification.</p>
            </div>
            <button
              onClick={onStartAdvisor}
              className="px-6 py-3 bg-star-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-md flex items-center justify-center gap-2 mx-auto md:mx-0 cursor-pointer"
            >
              <span>Verify with Star AI Advisor</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
