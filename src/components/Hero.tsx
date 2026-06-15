import { motion } from "motion/react";
import { Shield, Sparkles, HeartPulse, ShieldCheck, Play, ArrowRight, UserCheck } from "lucide-react";

interface HeroProps {
  onStartAdvisor: () => void;
  onOpenChat: () => void;
}

export default function Hero({ onStartAdvisor, onOpenChat }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-slate-900">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Heading & CTAs */}
        <div id="hero-main-content" className="lg:col-span-7 space-y-6 text-left">
          
          {/* Tag Badges */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-star-blue tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-star-red animate-pulse" />
            <span>Next-Gen Star AI advisor</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
            Protect your family with the <span className="text-star-blue">right</span> health insurance, not the most expensive one.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Answer a few simple questions and let our advanced Star AI recommend the perfect personalized plan tailored precisely to your budget and healthcare needs.
          </p>

          {/* Key Quick Badges of Trust */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
              <ShieldCheck className="w-5 h-5 text-star-blue flex-shrink-0" />
              <span>IRDAI Registered Shield</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
              <HeartPulse className="w-5 h-5 text-star-red flex-shrink-0" />
              <span>14,000+ Cashless Outlets</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 text-sm font-semibold">
              <UserCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>98.2% Seamless Settlement</span>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              id="cta-find-plan"
              onClick={onStartAdvisor}
              className="px-8 py-4 bg-star-red hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all transform hover:scale-[1.03] flex items-center justify-center gap-2"
            >
              <span>Find My Best Plan</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="cta-talk-expert"
              onClick={onOpenChat}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Talk to our AI Agent</span>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </button>
          </div>

          {/* Partner Trust Row */}
          <div className="pt-8 border-t border-slate-200">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-extrabold mb-3">TRUST VALUE COMPARISON VS COMPETITORS</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-500 text-xs items-center font-bold">
              <span className="text-star-blue font-extrabold text-sm tracking-wider">STAR HEALTH AI</span>
              <span className="text-slate-300">|</span>
              <span>Policybazaar: Generic matches</span>
              <span className="text-slate-300">|</span>
              <span>Niva Bupa: High premiums</span>
              <span className="text-slate-300">|</span>
              <span>Care Health: Co-pay locks</span>
            </div>
          </div>

        </div>

        {/* Right Column: AI Assistant Welcome Card / Family Illustration */}
        <div id="hero-ai-card" className="lg:col-span-5 relative">
          
          {/* Card Border glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-star-blue to-star-red rounded-3xl blur opacity-20"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6 text-left"
          >
            {/* Indian Family Illustration Container */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-50 h-44 flex items-center justify-center border border-slate-200 p-4">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00338d_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Symbolic Multi-generational family graphic using modern elegant SVGs */}
              <div className="z-10 text-center space-y-2">
                <div className="flex justify-center -space-x-4 mb-1">
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-[#00338D] flex items-center justify-center text-white text-xs font-bold shadow-md">👨‍💼</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">👩‍⚕️</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-md">👴</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-md">👧</div>
                </div>
                <div className="text-xs font-bold text-slate-800">Unified Indian Family Coverage Shield</div>
                <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  Parents, Spouse & Children Secured
                </span>
              </div>

              {/* Floating Shield Tech badge */}
              <div className="absolute top-3 right-3 bg-star-red text-[10px] font-bold px-2 py-1 rounded-md text-white shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3 text-white" />
                <span>Star Certified</span>
              </div>
            </div>

            {/* AI Assistant Greeting */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-star-blue flex items-center justify-center text-xl shadow-lg border border-blue-400">
                  👋
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">Hi! I'm Star AI</h4>
                  <div className="text-xs text-star-blue font-bold">Digital Healthcare Advisor</div>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>

              <blockquote className="text-xs italic text-slate-600 bg-slate-50 p-4 rounded-xl border-l-4 border-star-red border border-slate-200/50">
                "Finding insurance shouldn't feel like completing a tax return. I can read your budget, analyze pre-existing conditions, and match you with Star Comprehensive in under 60 seconds."
              </blockquote>

              <div className="space-y-2">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pb-1">AI Recommendation Quick Start:</div>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={onStartAdvisor}
                    className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl transition duration-150 flex items-center justify-between text-xs font-bold text-slate-750"
                  >
                    <span>🎯 Find cover with pre-existing Diabetes</span>
                    <ArrowRight className="w-3.5 h-3.5 text-star-blue" />
                  </button>
                  <button 
                    onClick={onStartAdvisor}
                    className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl transition duration-150 flex items-center justify-between text-xs font-bold text-slate-750"
                  >
                    <span>🛡️ Secure my Senior Citizen parents</span>
                    <ArrowRight className="w-3.5 h-3.5 text-star-blue" />
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
