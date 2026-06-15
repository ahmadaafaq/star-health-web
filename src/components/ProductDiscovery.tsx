import { Shield, Users, HeartPulse, ShieldAlert, Award, Plane, Briefcase, ChevronRight } from "lucide-react";

interface ProductDiscoveryProps {
  onSelectCategory: (category: string) => void;
}

export default function ProductDiscovery({ onSelectCategory }: ProductDiscoveryProps) {
  
  const DISCOVERY_CARDS = [
    {
      id: "myself",
      title: "Myself (Individual)",
      icon: <Shield className="w-6 h-6 text-star-blue" />,
      color: "from-slate-50/50 to-white hover:shadow-xl hover:shadow-blue-900/5",
      border: "border-slate-250 hover:border-star-blue/40",
      desc: "Comprehensive room-by-room coverages customized for self-reliant working professionals & freelancers.",
      cta: "Explore self plans"
    },
    {
      id: "family",
      title: "Family Protection",
      icon: <Users className="w-6 h-6 text-star-red" />,
      color: "from-slate-50/50 to-white hover:shadow-xl hover:shadow-red-500/5",
      border: "border-slate-250 hover:border-star-red/40",
      desc: "Secure your spouse, kids & dependents under one unified float sum with direct maternity & newborn safety locks.",
      cta: "Explore family shields"
    },
    {
      id: "parents",
      title: "Parents & Senior Citizens",
      icon: <HeartPulse className="w-6 h-6 text-emerald-600" />,
      color: "from-slate-50/50 to-white hover:shadow-xl hover:shadow-emerald-500/5",
      border: "border-slate-250 hover:border-emerald-550/40",
      desc: "Avoid stressful pre-policy health checkups. Tailored specifically for parents aged 60+ with rapid pre-existing waivers.",
      cta: "Explore elder protectors"
    },
    {
      id: "diabetes",
      title: "Diabetes Care",
      icon: <Award className="w-6 h-6 text-amber-600" />,
      color: "from-slate-50/50 to-white hover:shadow-xl hover:shadow-amber-500/5",
      border: "border-slate-250 hover:border-amber-500/40",
      desc: "Specific immediate Day-1 covers for type-1/type-2 diabetes complications, bypass dialysis limitations, and wellness discounts.",
      cta: "Explore diabetes safe"
    },
    {
      id: "critical",
      title: "Critical Illness Shield",
      icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
      color: "from-slate-50/50 to-white hover:shadow-xl hover:shadow-rose-500/5",
      border: "border-slate-250 hover:border-rose-500/40",
      desc: "Direct tax-free lumpsum payout upon diagnosis of 37 critical organ issues or cancer to sustain lifestyle recovery budgets.",
      cta: "Explore lumpsum cash"
    },
    {
      id: "travel",
      title: "Travel Protection",
      icon: <Plane className="w-6 h-6 text-cyan-600" />,
      color: "from-slate-50/50 to-white hover:shadow-xl hover:shadow-cyan-500/5",
      border: "border-slate-250 hover:border-cyan-500/40",
      desc: "Emergency cashless treatment, missed flight coverages, and baggage lost protection across 150+ countries.",
      cta: "Explore travel passes"
    },
    {
      id: "business",
      title: "Business & Corporate Group",
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
      color: "from-slate-50/50 to-white hover:shadow-xl hover:shadow-indigo-500/5",
      border: "border-slate-250 hover:border-indigo-550/40",
      desc: "Retain high-performance talent with corporate health float policies featuring immediate maternity, OPD, & mental wellness.",
      cta: "Explore company quotes"
    }
  ];

  return (
    <section id="discovery-section" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12 text-slate-900">
        
        {/* Row Header */}
        <div className="text-center md:text-left md:flex justify-between items-end gap-6 space-y-3 md:space-y-0">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest font-extrabold text-star-red">Targeted Protection</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00338D]">Product Discovery Hub</h2>
            <p className="text-slate-600 max-w-xl text-sm leading-relaxed font-medium">
              Unlock personalized coverage categories mapped directly with Star Health's advanced claims authorization systems. No complex lists, just straightforward choices.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-400">
            Click on any category to configure its advisor parameter presets instantly!
          </div>
        </div>

        {/* Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DISCOVERY_CARDS.map(card => (
            <div
              key={card.id}
              onClick={() => onSelectCategory(card.id)}
              className={`p-6 rounded-3xl bg-gradient-to-b ${card.color} border ${card.border} transition-all duration-300 group cursor-pointer hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div className="space-y-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition duration-300">
                  {card.icon}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-slate-850 group-hover:text-star-blue transition">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 font-bold text-xs text-star-red flex items-center justify-between group-hover:text-red-700 transition">
                <span>{card.cta}</span>
                <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1.5 transition duration-300" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
