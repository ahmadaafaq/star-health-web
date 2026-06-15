import { useState } from "react";
import { DollarSign, ShieldAlert, Sparkles, AlertCircle} from "lucide-react";

export default function PremiumCalculator() {
  const [age, setAge] = useState<number>(30);
  const [familySize, setFamilySize] = useState<number>(2); // 1 = Self, 2 = Self + Spouse, 3 = Family + Kids
  const [city, setCity] = useState<'metro' | 'non-metro'>('metro');
  const [coverage, setCoverage] = useState<number>(10); // in Lakhs (5, 10, 20, 50, 100)
  const [hasDiabetes, setHasDiabetes] = useState<boolean>(false);
  const [hasBP, setHasBP] = useState<boolean>(false);

  // Compute calculated values based on combinations
  const calculatePremium = () => {
    let base = 350; // default base

    // Age multiples
    if (age <= 30) base += age * 5;
    else if (age <= 45) base += 150 + (age - 30) * 12;
    else if (age <= 60) base += 330 + (age - 45) * 22;
    else base += 660 + (age - 60) * 35;

    // Family size additions
    if (familySize === 2) base *= 1.6;
    else if (familySize >= 3) base *= 2.1;

    // City premium multiplier
    if (city === 'metro') base *= 1.15;

    // Coverage multiplier
    if (coverage === 10) base *= 1.25;
    else if (coverage === 20) base *= 1.5;
    else if (coverage === 50) base *= 2.0;
    else if (coverage === 100) base *= 2.6;

    // Medical conditions
    if (hasDiabetes) base += 250;
    if (hasBP) base += 150;

    return Math.round(base);
  };

  const currentPremiumValue = calculatePremium();

  // Compute average estimated medical savings vs out of pockets
  const averageSavings = () => {
    return Math.round(coverage * 100000 * 0.85);
  };

  const estimatedSavingsValue = averageSavings();

  return (
    <section id="premium-calculator-section" className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-slate-900 relative">
      <div className="absolute top-1/4 right-10 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        
        {/* Left Column: Sliders controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2 text-left">
            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-star-red text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
              Dynamic Calibration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00338D]">Instant Premium Advisor</h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Adjust variables below. Observe how coverage sizes and health indicators dictate monthly premiums without visiting phone call brokers.
            </p>
          </div>

          <div className="bg-white border border-slate-205 rounded-2xl p-6 space-y-6 shadow-sm">
            
            {/* Age Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-700">
                <span>Primary Insured Age</span>
                <span className="text-star-red text-sm font-extrabold">{age} Years old</span>
              </div>
              <input 
                type="range"
                min="18"
                max="75"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-star-red h-1.5 bg-slate-150 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Young Couples (18)</span>
                <span>Retirees (75)</span>
              </div>
            </div>

            {/* Family Size Selection buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Total Members Insured</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { size: 1, label: "Myself Solo", emoji: "👤" },
                  { size: 2, label: "Myself & Partner", emoji: "👩" },
                  { size: 3, label: "Entire Family + Kids", emoji: "👨‍👩‍👧" }
                ].map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setFamilySize(item.size)}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      familySize === item.size 
                        ? 'bg-blue-50/60 border-star-blue text-star-blue' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Coverage Size Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Coverage Sum Insured</label>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 20, 50, 100].map((cov) => (
                  <button
                    key={cov}
                    type="button"
                    onClick={() => setCoverage(cov)}
                    className={`py-2 px-1 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      coverage === cov 
                        ? 'bg-star-red border-red-350 text-white shadow-md' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-350'
                    }`}
                  >
                    {cov >= 100 ? "1 Cr" : `₹${cov}L`}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-slate-400 font-bold px-0.5 leading-tight uppercase tracking-wide">
                *Star Comprehensive offers unified ₹1 Crore options containing private tier-1 hospital allocations.
              </div>
            </div>

            {/* City selection options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-11">
                <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Resident Location Tier</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCity('metro')}
                    className={`flex-1 py-2.5 text-center text-xs font-bold rounded-lg border cursor-pointer ${city === 'metro' ? 'bg-blue-50 border-star-blue text-star-blue' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50'}`}
                  >
                    Metro / Tier-1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCity('non-metro')}
                    className={`flex-1 py-2.5 text-center text-xs font-bold rounded-lg border cursor-pointer ${city === 'non-metro' ? 'bg-blue-50 border-star-blue text-star-blue' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50'}`}
                  >
                    Tier-2 / Tier-3
                  </button>
                </div>
              </div>

              {/* Conditions toggle */}
              <div className="space-y-11">
                <label className="block text-xs font-extrabold uppercase text-slate-500 tracking-wider">Pre-Existing History</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHasDiabetes(!hasDiabetes)}
                    className={`flex-1 py-2.5 text-[11px] font-bold rounded-lg border cursor-pointer ${hasDiabetes ? 'bg-red-50 border-star-red text-star-red' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50'}`}
                  >
                    Diabetes Safe
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasBP(!hasBP)}
                    className={`flex-1 py-2.5 text-[11px] font-bold rounded-lg border cursor-pointer ${hasBP ? 'bg-red-50 border-star-red text-star-red' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50'}`}
                  >
                    Hypertension / BP
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Calculations Outputs Cards */}
        <div className="lg:col-span-5 relative">
          
          <div className="relative bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl text-center space-y-6 shadow-xl">
            
            {/* Header branding */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 text-star-red border border-red-100 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-star-red" />
              <span>Real-Time Estimation Sheet</span>
            </div>

            {/* Price display block */}
            <div className="py-2.5">
              <div className="text-xs text-slate-450 uppercase tracking-widest font-extrabold">Calculated Premium Estimate</div>
              <div className="flex items-baseline justify-center gap-1.5 mt-2">
                <span className="text-slate-400 text-lg font-extrabold">₹</span>
                <span className="text-4xl font-black text-slate-900">
                  {currentPremiumValue}
                </span>
                <span className="text-slate-550 text-xs font-bold">/ month</span>
              </div>
              <p className="text-[10px] text-slate-450 font-semibold mt-1">Starting coverage rates based on selected factors</p>
            </div>

            {/* Financial Hospitalization Savings Indicator Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="text-left text-[10px] text-slate-450 uppercase tracking-wider font-extrabold flex items-center justify-between">
                <span>Avg. Hospitalization Shield</span>
                <span className="text-green-600 font-extrabold block">SAVINGS: ~85%</span>
              </div>
              
              {/* Savings amount */}
              <div className="text-left">
                <div className="text-xl font-black text-green-600">
                  ₹{estimatedSavingsValue.toLocaleString("en-IN")}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug font-medium">
                  Estimated financial loss absorbed by Star Health during major surgeries or terminal ICU admittances.
                </p>
              </div>

              {/* Progress bar representing safe percentage */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Out of pocket: 15%</span>
                  <span>Paid by Star Cover: 85%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-lg overflow-hidden border border-slate-300">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-[85%]" />
                </div>
              </div>
            </div>

            {/* IRDAI note */}
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 text-star-red flex-shrink-0 mt-0.5 animate-pulse" />
              <p className="text-[10px] text-slate-600 leading-normal font-semibold">
                Tax Rebate Notice: Complete premium values are deductible up to ₹25,000 yearly (and up to ₹50,000 for parents) under <strong className="text-slate-900">Section 80D</strong> of Indian Income Tax Act.
              </p>
            </div>

            {/* Final CTA triggering onboarding flow with options */}
            <button
              onClick={() => {
                alert("Settings transferred! Complete the immediate AI onboarding and lock-in your selected price estimate.");
              }}
              className="w-full py-4 bg-star-red hover:bg-red-700 transition text-white font-extrabold rounded-xl text-xs shadow-lg shadow-red-500/10 cursor-pointer"
            >
              Lock Premium and Secure Family Now
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
