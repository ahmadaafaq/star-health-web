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
      id: "star-assure",
      name: "Star Health Assure",
      popular: true,
      data: {
        premium: "₹1,499",
        roomRent: "Single Private Room (no capping)",
        cashless: "14,000+ top centers",
        waiting: "36 Months (Reduced to immediate for accidents)",
        opd: "Wellness discount up to 20% on premium",
        daycare: "Fully covered (all day-care procedures)",
        restoration: "Unlimited automatic restoration in a policy year",
        ncb: "Up to 100% booster on claim-free runs",
        maternity: "Newborn baby covered from day 1",
        icu: "Fully covered - zero deductions",
        ambulance: "Fully covered (Road ambulance)"
      }
    },
    {
      id: "family-health-optima",
      name: "Family Health Optima",
      popular: false,
      data: {
        premium: "₹1,199",
        roomRent: "Single Private Room (no capping)",
        cashless: "14,000+ top centers",
        waiting: "36 Months (Reduced to immediate for accidents)",
        opd: "Outpatient checks not directly covered",
        daycare: "Fully covered (all day-care procedures)",
        restoration: "100% Automatic restoration whenever exhausted",
        ncb: "Loyalty bonus accumulation up to 100% of sum insured",
        maternity: "Newborn baby covered from day 1 of birth",
        icu: "Fully covered - zero deductions",
        ambulance: "Additional SI for road traffic accident injuries"
      }
    },
    {
      id: "star-premier",
      name: "Star Health Premier",
      popular: false,
      data: {
        premium: "₹1,899",
        roomRent: "Single Private Room (no capping)",
        cashless: "14,000+ top centers",
        waiting: "36 Months (Pre-existing diseases)",
        opd: "AYUSH and home care fully covered",
        daycare: "Fully covered (all day-care procedures)",
        restoration: "100% Automatic restoration once per year",
        ncb: "Wellness rewards points program",
        maternity: "Not covered",
        icu: "Fully covered - zero deductions",
        ambulance: "Fully covered (Road ambulance)"
      }
    },
    {
      id: "arogya-sanjeevani",
      name: "Arogya Sanjeevani",
      popular: false,
      data: {
        premium: "₹799",
        roomRent: "Up to 2% of Sum Insured per day",
        cashless: "14,000+ top centers",
        waiting: "36 Months (30-day initial waiting period)",
        opd: "Outpatient checks not covered",
        daycare: "Fully covered (all day-care procedures)",
        restoration: "Not applicable (Standard policy limits)",
        ncb: "Cumulative bonus: 5% increase per claim-free year (max 50%)",
        maternity: "Not covered",
        icu: "Up to 5% of Sum Insured per day (max ₹10,000/day)",
        ambulance: "Road ambulance capped as per limits"
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
                    if (selectedPreset === 'family' && plan.id !== 'star-assure' && plan.id !== 'family-health-optima') return null;
                    if (selectedPreset === 'specialty' && plan.id !== 'star-premier' && plan.id !== 'arogya-sanjeevani') return null;

                    return (
                      <th key={plan.id} className="p-5 w-1/4 relative border-r border-slate-200 last:border-0 text-left">
                        {plan.popular && (
                          <span className="absolute top-2 right-4 bg-star-red text-[8px] font-extrabold uppercase text-white px-2 py-0.5 rounded-full tracking-wider">
                            RECOMMENDED
                          </span>
                        )}
                        <div className="text-sm font-extrabold text-star-blue mt-2">{plan.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">STAR PREMIUM SECTOR</div>
                        <a
                          href={`https://efsgbittghkwjoklhqfk.supabase.co/storage/v1/object/public/policies/${plan.id}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-star-blue hover:text-blue-900 text-[10px] font-bold rounded-lg transition"
                        >
                          📥 Download Policy PDF
                        </a>
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
                      if (selectedPreset === 'family' && plan.id !== 'star-assure' && plan.id !== 'family-health-optima') return null;
                      if (selectedPreset === 'specialty' && plan.id !== 'star-premier' && plan.id !== 'arogya-sanjeevani') return null;

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
