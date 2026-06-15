import { useEffect, useState } from "react";
import { Check, Shield, Zap, Sparkles, UserCheck, ShieldCheck, Heart } from "lucide-react";

export default function TrustStats() {
  const [claimsCount, setClaimsCount] = useState(1482);

  // Simulate dynamically updating live claims settled today
  useEffect(() => {
    const interval = setInterval(() => {
      setClaimsCount(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const TRUST_METRICS = [
    { label: "Policies Issued", value: "3.2 Crores+", note: "Insuring families across tier-1/2/3" },
    { label: "Claims Settled Today", value: claimsCount.toString(), note: "Live updating audit settled numbers", live: true },
    { label: "Cashless Hospitals", value: "14,000+", note: "Largest unified Indian partner roster" },
    { label: "Customer Satisfaction", value: "98.5%", note: "Verified aggregate trust reports" },
    { label: "Avg Approval Time", value: "1.4 Hours", note: "Fastest standard clearance in India" },
    { label: "Claim Success Rate", value: "98.2%", note: "Audited IRDAI performance metric" }
  ];

  const WHY_CARDS = [
    { title: "Ultra Fast Claims", text: "Direct cashless pre-authorizations are audited and processed inside 120 minutes of hospital desk check-ins." },
    { title: "Vast Cashless Network", text: "Secure treatments across 14,000+ top Indian medical units with zero advance personal safety deposits." },
    { title: "Trusted by Millions", text: "Delivering security covering 32 Million+ active lives with complete IRDAI licensed regulatory filings." },
    { title: "Next-Gen AI Recommendations", text: "Skip complex PDF lists. Let specialized LLM advisors match coverages based purely on diagnosed histories." },
    { title: "Unified family coverage", text: "Insure parents, spouse, kids & newborn dependents inside one unified float sum with direct maternity rewards." },
    { title: "24/7 Premium Assistance", text: "Call our in-house clinicians, emergency helpline coordinators, or prompt WhatsApp agents anytime." }
  ];

  return (
    <section id="trust-section" className="bg-slate-50 border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-16 text-left">
        
        {/* Live counter metrics grid */}
        <div className="space-y-8">
          
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-star-red text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
              Live Audited Statistics
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#00338D]">The Numbers Behind the Trust</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-medium">
              We operate with complete metrics transparency. Our live claims settles show direct authorization numbers today.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {TRUST_METRICS.map(metric => (
              <div 
                key={metric.label} 
                className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-sm"
              >
                {metric.live && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                
                <div>
                  <div className="text-[10px] text-slate-450 uppercase tracking-widest font-extrabold">
                    {metric.label}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {metric.value}
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 mt-3 border-t border-slate-100 pt-2 leading-tight font-semibold">
                  {metric.note}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Why Choose Column */}
        <div className="space-y-10 pt-8 border-t border-slate-200 text-left">
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs uppercase font-extrabold text-[#00338D] tracking-widest">Why choose Star health</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00338D]">Uncompromising Protection Values</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CARDS.map(card => (
              <div 
                key={card.title}
                className="bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-slate-300 p-6 rounded-2xl transition duration-150 space-y-3 shadow-sm text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="font-extrabold text-sm text-[#00338D]">{card.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
