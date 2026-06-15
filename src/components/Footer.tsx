import { Mail, Phone, ShieldCheck, Heart, Info, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer id="main-app-footer" className="bg-white border-t border-slate-200 text-slate-605 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Grid links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 space-y-5 text-left">
            <div className="flex items-center gap-2 text-slate-905">
              <span className="text-xl font-black tracking-tighter text-[#00338D]">
                STAR <span className="text-star-red font-extrabold text-lg">HEALTH</span> AI
              </span>
              <span className="text-[10px] font-extrabold text-[#9E0F11] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                IRDAI #129
              </span>
            </div>
            
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
              Modern health insurance redesigned through advanced conversational algorithms. Discover Star Health’s premium protective shields with zero room-rent cap restrictions.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                <Phone className="w-4 h-4 text-slate-450" />
                <span>IRDAI Toll-Free assistance: <strong className="text-slate-805">1800 425 2255</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                <Mail className="w-4 h-4 text-slate-450" />
                <span>Regulatory contact: <strong className="text-slate-805">support@starhealthai.co.in</strong></span>
              </div>
            </div>
          </div>

          <div className="text-left space-y-3">
            <h4 className="font-extrabold text-xs text-[#00338D] uppercase tracking-wider">Products</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-bold">
              <li><a href="#discovery-section" className="hover:text-star-red transition">Star Comprehensive Plus</a></li>
              <li><a href="#discovery-section" className="hover:text-star-red transition">Star Diabetes Safe Specialty</a></li>
              <li><a href="#discovery-section" className="hover:text-star-red transition">Senior Citizen Red Carpet</a></li>
              <li><a href="#discovery-section" className="hover:text-star-red transition">Star Family Delite Budget</a></li>
              <li><a href="#discovery-section" className="hover:text-star-red transition">Critical Illness Multipay</a></li>
            </ul>
          </div>

          <div className="text-left space-y-3">
            <h4 className="font-extrabold text-xs text-[#00338D] uppercase tracking-wider">Claims</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-bold">
              <li><a href="#claims-visualizer-section" className="hover:text-star-red transition">Find cashless outlets</a></li>
              <li><a href="#claims-visualizer-section" className="hover:text-star-red transition">Register emergency claim</a></li>
              <li><a href="#claims-visualizer-section" className="hover:text-star-red transition">Download claim formats</a></li>
              <li><a href="#claims-visualizer-section" className="hover:text-star-red transition">Live audit track</a></li>
              <li><a href="#claims-visualizer-section" className="hover:text-star-red transition">Cashless approval rates</a></li>
            </ul>
          </div>

          <div className="text-left space-y-3">
            <h4 className="font-extrabold text-xs text-[#00338D] uppercase tracking-wider">Hospitals</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-bold">
              <li><a href="#hospital-section" className="hover:text-star-red transition">Bengaluru network</a></li>
              <li><a href="#hospital-section" className="hover:text-star-red transition">Mumbai network</a></li>
              <li><a href="#hospital-section" className="hover:text-star-red transition">New Delhi partner stations</a></li>
              <li><a href="#hospital-section" className="hover:text-star-red transition">Apollo clinic directory</a></li>
              <li><a href="#hospital-section" className="hover:text-star-red transition">Fortis outlets list</a></li>
            </ul>
          </div>

        </div>

        {/* Regulatory disclaimer panel */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-8 space-y-2 text-left">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#00338D]">
              <Info className="w-4 h-4 text-slate-400" />
              <span>IRDAI Regulatory Filing Compliance Information</span>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-normal max-w-3xl font-semibold">
              Star Health and Allied Insurance Co. Ltd is a licensed stand-alone health insurer registered under IRDAI with registration code 129. Insurance is the subject matter of solicitation. Please read the specified prospectus, product sales brochures, policy wordings, terms and conditions carefully before completing purchases. Estimated monthly premiums are computed based on base coordinates and do not bind final policy quotes.
            </p>
          </div>

          <div className="md:col-span-4 text-center md:text-right space-y-2">
            <div className="text-[10px] text-slate-450 uppercase tracking-widest font-black">Secure Verification Seals</div>
            <div className="flex flex-wrap justify-end gap-2 text-[10px] text-slate-500 font-bold">
              <span className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200">✓ SSL certified payment route</span>
              <span className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200">✓ 80D tax exemption applicable</span>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-widest flex flex-wrap justify-between items-center gap-4">
          <span>© 2026 Star Health AI Systems India. All security rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#00338D] transition">Privacy Statement</a>
            <span>•</span>
            <a href="#" className="hover:text-[#00338D] transition">Term Compliance regulations</a>
            <span>•</span>
            <a href="#" className="hover:text-[#00338D] transition">WhatsApp Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
