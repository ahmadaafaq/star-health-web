import { Star, ShieldAlert, Heart, Quote } from "lucide-react";

export default function Testimonials() {

  const REVIEWS = [
    {
      name: "Rohan & Priya Deshmukh",
      role: "Software Architects, Pune",
      story: "Family Protected After Surgery",
      rating: 5,
      quote: "When Priya needed emergency gall-bladder removal at 2 AM, I was terrified. We walked into Apollo Pune, showed our digital Star health card, and our pre-authorization was passed cashless within 90 minutes. We paid exactly ₹0 out-of-pocket for private room bills. Competitors like Policybazaar and care kept telling us room rent was capped, but Star lived up to every single promise.",
      avatar: "👨‍👩‍👦"
    },
    {
      name: "Vikas Malhotra",
      role: "Business Owner, New Delhi",
      story: "Parents Covered During Cardiac Emergency",
      rating: 5,
      quote: "Securing parents aged 68+ is usually an insurance nightmare with high co-pay. We bought Senior Citizen Red Carpet. When Dad had a sudden cardiac admission last month, Star settled ₹4.2 Lakhs of the ₹4.8 Lakhs bill directly without pre-screening checks or delays. That co-pay structure lowered our premiums significantly while providing elite immediate backup.",
      avatar: "👴"
    },
    {
      name: "Dr. Ananya Sen",
      role: "Associate Professor, Kolkata",
      story: "Cancer Recovery Journey",
      rating: 5,
      quote: "Being diagnosed with early-stage breast cancer was devastating. The Critical Illness Multipay plan paid out the entire ₹25 Lakh sum insured within 7 days of diagnostic verification. This direct lumpsum helped our family secure experimental immunotherapy treatments and sustained household EMI budgets when I was on medical sabbatical. True lifesaver.",
      avatar: "👩‍⚕️"
    },
    {
      name: "Siddharth & Meera Nair",
      role: "Content Editors, Kochi",
      story: "Child Hospitalization & Pediatric ward",
      rating: 5,
      quote: "Our 4-year-old daughter was hospitalized for severe respiratory croup during monsoon. Star Comprehensive safe-locked us through 4 days of high-end pediatric ICU care and private room suites. Not only was the stay completely cashless, but Star also compensated vaccine schedules and infant consultations subsequently. No forms to fill, completely modern fintech experience.",
      avatar: "👧"
    }
  ];

  return (
    <section id="testimonials-section" className="bg-slate-50 border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-slate-900 relative">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-star-red text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
            Real Family Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#00338D]">Verified Recovery Milestones</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-medium">
            Read how Star Health acts as an active companion during high-stakes medical emergencies across India. Honest stories, not corporate scripts.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {REVIEWS.map(review => (
            <div 
              key={review.name}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-6"
            >
              <div className="absolute top-4 right-4 text-slate-100 pointer-events-none">
                <Quote className="w-16 h-16 opacity-30" />
              </div>

              <div className="space-y-4">
                
                {/* Story Label & Stars */}
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center bg-red-50 text-star-red border border-red-100 text-[10px] px-2.5 py-0.5 rounded font-extrabold uppercase tracking-widest">
                    {review.story}
                  </span>
                  <div className="flex gap-0.5 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-xs text-slate-650 leading-relaxed italic relative z-10 font-semibold">
                  "{review.quote}"
                </p>

              </div>

              {/* Profile Meta footer */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-inner">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-805 text-xs">{review.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-bold">{review.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
