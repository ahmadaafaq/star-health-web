import { useState } from "react";
import { Check, HelpCircle, Activity, Heart, EyeOff, RefreshCw, Layers } from "lucide-react";

export default function ExplainSimply() {
  const [selectedTopic, setSelectedTopic] = useState<string>("roomRent");

  const TOPICS = [
    {
      id: "roomRent",
      title: "Room Rent Limit",
      corporate: "No sub-limits or capping on single private room board charges.",
      plain: "Stay in a comfortable private room during hospitalization without worrying about extra hidden charges.",
      why: "If you exceed a capped room rent, hospitals often inflate pricing on surgery, medicines, and doctors by 50% too! That's why Star Comprehensive bypasses all capping metrics.",
      icon: <Layers className="w-5 h-5 text-indigo-400" />
    },
    {
      id: "restoration",
      title: "Automatic Restoration",
      corporate: "100% restoration of sum insured upon complete depletion of cover.",
      plain: "If you exhaust your entire ₹10 Lakh sum on a major surgery, we instantly reload another ₹10 Lakh for free.",
      why: "Essential if multiple relatives get hospitalized in the same calendar year. Keeps your secondary buffers complete.",
      icon: <RefreshCw className="w-5 h-5 text-teal-400" />
    },
    {
      id: "ped",
      title: "Pre-Existing (PED)",
      corporate: "Waiting periods applicable on pre-recorded pathology or diseases.",
      plain: "If you have high BP or past asthma, there is a waiting timeline before claims for those specifically trigger.",
      why: "Standard policies require 3 to 4 years wait. With our specialized models, diabetes safe plans have zero wait, and basic packages can reduce periods automatically.",
      icon: <EyeOff className="w-5 h-5 text-rose-400" />
    },
    {
      id: "ncb",
      title: "No Claim Bonus",
      corporate: "Cumulative bonus multiplier per claim-free continuous block.",
      plain: "Every year you don't file a claim, your policy coverage increases for free (up to double!).",
      why: "A ₹10 Lakh plan can automatically swell to ₹20 Lakh coverage over five healthy years without paying any extra premium.",
      icon: <AwardIcon className="w-5 h-5 text-yellow-400" />
    },
    {
      id: "copay",
      title: "Co-Payment Clause",
      corporate: "Compulsory deductibles payable by the insured party on claim exits.",
      plain: "A shared cost rule where you pay a flat percentage of the bill, and we cover the remaining heavy chunk.",
      why: "We avoid co-pay inside our core comprehensive models so you pay ₹0. It's only optional inside elder parent policies to lower premiums.",
      icon: <Activity className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <section id="explain-simply-section" className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column: Jargon Translator Interface */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3 text-left">
            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-star-red text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Translation Engine</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00338D]">Insurance, Explained. Finally.</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              We translated the confusing technical copy from competitors' documents into honest, straightforward English. Select any metric to see the plain truth.
            </p>
          </div>

          {/* List of select buttons */}
          <div className="space-y-2 pt-2 text-left">
            {TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`w-full text-left p-4 rounded-2xl border transition duration-150 flex items-center justify-between cursor-pointer ${
                  selectedTopic === topic.id 
                    ? 'bg-blue-50/50 border-star-blue text-star-blue shadow-md' 
                    : 'bg-slate-50 border-slate-200 text-slate-750 hover:bg-slate-100/30 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    {topic.icon}
                  </div>
                  <span className="font-bold text-sm text-slate-900">{topic.title}</span>
                </div>
                <span className="text-xs font-bold text-slate-500">Translation →</span>
              </button>
            ))}
          </div>

        </div>

        {/* Right column: Beautiful translation display panel */}
        <div className="lg:col-span-7">
          {TOPICS.filter(t => t.id === selectedTopic).map(topic => (
            <div 
              key={topic.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden shadow-xl text-left"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

              {/* Header block with translation graphic */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full text-slate-500 font-bold tracking-widest uppercase">
                    Core Concept
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{topic.title}</h3>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                  {topic.icon}
                </div>
              </div>

              {/* Comparison display split card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Corporate description */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl relative space-y-2">
                  <span className="text-[9px] text-star-red font-bold uppercase tracking-widest">Standard Competitor Copy:</span>
                  <div className="text-xs text-slate-500 leading-relaxed italic line-through font-semibold">
                    "{topic.corporate}"
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium italic block pt-2">(Confusing, makes you second-guess limits)</span>
                </div>

                {/* Plain English description */}
                <div className="bg-blue-50/40 border border-star-blue/20 p-5 rounded-2xl relative space-y-2">
                  <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Plain English Cover:</span>
                  </span>
                  <div className="text-xs text-slate-905 font-bold leading-relaxed">
                    "{topic.plain}"
                  </div>
                  <span className="text-[10px] text-star-blue font-bold block pt-1">Simple, honest and straightforward.</span>
                </div>

              </div>

              {/* Explanation of Why it Matters */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="text-xs font-extrabold text-star-blue uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-star-blue" />
                  <span>Why this translates into real-world value:</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {topic.why}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// Custom simple svg award icon wrapper
function AwardIcon(props: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}
