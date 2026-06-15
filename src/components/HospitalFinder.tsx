import { useState } from "react";
import { Search, MapPin, Phone, Award, ShieldAlert, Navigation, Star, Car, Check } from "lucide-react";

interface Hospital {
  name: string;
  city: string;
  lat: number; // simulated coordinates for the vector map display
  lng: number;
  distance: string;
  rating: number;
  cashlessRatio: string;
  address: string;
  phone: string;
  type: string;
  emergency: boolean;
  parking: boolean;
}

export default function HospitalFinder() {
  const [selectedCity, setSelectedCity] = useState<string>("Bengaluru");
  const [filterType, setFilterType] = useState<string>("all");
  const [activeHospital, setActiveHospital] = useState<number>(0);

  const HOSPITALS: Hospital[] = [
    {
      name: "Apollo Speciality Hospitals",
      city: "Bengaluru",
      lat: 40,
      lng: 60,
      distance: "2.8 km",
      rating: 4.8,
      cashlessRatio: "100% Cashless Settle",
      address: "154/11, Bannerghatta Main Rd, Bangalore - 560076",
      phone: "+91 80 2630 4050",
      type: "Multi-Speciality",
      emergency: true,
      parking: true
    },
    {
      name: "Fortis Hospital",
      city: "Bengaluru",
      lat: 70,
      lng: 35,
      distance: "4.1 km",
      rating: 4.6,
      cashlessRatio: "100% Cashless Settle",
      address: "14, Cunningham Rd, Vasanth Nagar, Bengaluru - 560052",
      phone: "+91 80 2200 4455",
      type: "Multi-Speciality",
      emergency: true,
      parking: true
    },
    {
      name: "Manipal Hospital",
      city: "Bengaluru",
      lat: 25,
      lng: 45,
      distance: "5.5 km",
      rating: 4.7,
      cashlessRatio: "98.5% Cashless Settle",
      address: "98, HAL Old Airport Rd, Kodihalli, Bengaluru - 560017",
      phone: "+91 80 2502 4444",
      type: "Heart & Organ Care",
      emergency: true,
      parking: false
    },
    {
      name: "Max Super Speciality Hospital",
      city: "Delhi",
      lat: 35,
      lng: 65,
      distance: "1.2 km",
      rating: 4.9,
      cashlessRatio: "100% Cashless Settle",
      address: "FC-50, Shalimar Bagh, New Delhi, Delhi - 110088",
      phone: "+91 11 6611 2233",
      type: "Multi-Speciality",
      emergency: true,
      parking: true
    },
    {
      name: "Fortis Escorts Heart Institute",
      city: "Delhi",
      lat: 65,
      lng: 40,
      distance: "3.4 km",
      rating: 4.7,
      cashlessRatio: "100% Cashless Settle",
      address: "Okhla Rd, New Friends Colony, New Delhi - 110025",
      phone: "+91 11 4713 5000",
      type: "Heart Specialist",
      emergency: true,
      parking: true
    },
    {
      name: "Kokilaben Dhirubhai Ambani Hospital",
      city: "Mumbai",
      lat: 50,
      lng: 50,
      distance: "1.8 km",
      rating: 4.8,
      cashlessRatio: "100% Cashless Settle",
      address: "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Mumbai - 400053",
      phone: "+91 22 4269 9999",
      type: "Multi-Speciality",
      emergency: true,
      parking: true
    },
    {
      name: "Leelavati Hospital & Research Center",
      city: "Mumbai",
      lat: 30,
      lng: 25,
      distance: "4.5 km",
      rating: 4.5,
      cashlessRatio: "96.4% Cashless Settle",
      address: "A-791, Bandra Reclamation, Bandra West, Mumbai - 400050",
      phone: "+91 22 2675 1000",
      type: "Research & General",
      emergency: false,
      parking: true
    }
  ];

  // Filtering hospitals by selected options
  const filteredHospitals = HOSPITALS.filter(h => {
    const isCityMatch = h.city.toLowerCase() === selectedCity.toLowerCase();
    if (filterType === "all") return isCityMatch;
    if (filterType === "emergency") return isCityMatch && h.emergency;
    return isCityMatch;
  });

  return (
    <section id="hospital-section" className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10 text-left">
        
        {/* Title */}
        <div className="text-center md:text-left md:flex justify-between items-end gap-6 space-y-3 md:space-y-0">
          <div className="space-y-3 text-left">
            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-star-red text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
              Global Cashless Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00338D]">Network Cashless Hospital Finder</h2>
            <p className="text-slate-600 max-w-xl text-sm leading-relaxed font-medium">
              Skip traditional reimbursement stress. Star partners directly with India's lead clinics to offer 2-hour cashless exit clearances.
            </p>
          </div>

          {/* Quick city selectors options */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1 shadow-inner shrink-0">
            {["Bengaluru", "Delhi", "Mumbai"].map(c => (
              <button
                key={c}
                onClick={() => {
                  setSelectedCity(c);
                  setActiveHospital(0);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${selectedCity === c ? 'bg-star-red text-white shadow-sm' : 'text-slate-650 hover:text-slate-900'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard grid panel */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl">
          
          {/* Left Block hospital list panel (5 cols) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-200 h-[480px] overflow-y-auto divide-y divide-slate-100">
            
            {/* Headers search panel */}
            <div className="p-4 bg-slate-50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase text-slate-505 tracking-wider">Hospitals in {selectedCity}</span>
              <button 
                onClick={() => setFilterType(filterType === "all" ? "emergency" : "all")}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition cursor-pointer ${
                  filterType === "emergency" 
                    ? 'bg-red-50 text-star-red border-star-red/40' 
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-755'
                }`}
              >
                🚨 Emergency Only
              </button>
            </div>

            {/* List */}
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((h, i) => {
                const isActive = activeHospital === i;
                return (
                  <div
                    key={h.name}
                    onClick={() => setActiveHospital(i)}
                    className={`p-4 text-left transition duration-200 cursor-pointer space-y-2 ${isActive ? 'bg-blue-50/40 border-l-4 border-star-red shadow-inner' : 'hover:bg-slate-50/50'}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <h4 className={`font-bold text-xs ${isActive ? 'text-star-red text-sm font-extrabold' : 'text-slate-805'}`}>{h.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono font-bold flex-shrink-0">{h.distance}</span>
                    </div>

                    <p className="text-[10px] text-slate-500 font-medium truncate max-w-sm">{h.address}</p>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[9px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200 flex items-center gap-1 font-semibold">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                        <span>{h.cashlessRatio}</span>
                      </span>
                      {h.emergency && (
                        <span className="text-[9px] font-extrabold bg-red-50 text-star-red px-1.5 py-0.5 rounded border border-red-200">
                          🚨 24/7 ER
                        </span>
                      )}
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 font-semibold bg-slate-50">
                No matching network hospitals found.
              </div>
            )}

          </div>

          {/* Right active Map Vector Visualizer panel (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 h-[480px] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Simulated Vector Map Grid */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner">
              
              {/* Star Coordinates grids */}
              <div className="absolute top-2 left-3 text-[10px] text-slate-400 font-mono font-bold">STAR-GPS-GRID-VIEW-SIMULATED</div>
              
              <svg className="w-full h-full opacity-40" viewBox="0 0 100 100">
                {/* simulated street vectors */}
                <line x1="10" y1="0" x2="15" y2="100" stroke="#cbd5e1" strokeWidth="0.5" />
                <line x1="45" y1="0" x2="40" y2="100" stroke="#cbd5e1" strokeWidth="0.5" />
                <line x1="75" y1="0" x2="80" y2="100" stroke="#cbd5e1" strokeWidth="0.5" />
                <line x1="0" y1="30" x2="100" y2="35" stroke="#cbd5e1" strokeWidth="0.5" />
                <line x1="0" y1="65" x2="100" y2="60" stroke="#cbd5e1" strokeWidth="0.5" />
              </svg>

              {/* Rendering location coordinates dots for the city's hospitals */}
              {filteredHospitals.map((h, i) => {
                const isActive = activeHospital === i;
                return (
                  <div
                    key={h.name}
                    style={{ top: `${h.lat}%`, left: `${h.lng}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition"
                    onClick={() => setActiveHospital(i)}
                  >
                    <div className="relative">
                      {isActive && (
                        <span className="absolute -inset-2.5 bg-red-100 rounded-full animate-ping opacity-60" />
                      )}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-[9px] shadow-md transition-all ${isActive ? 'bg-star-red border-white text-white scale-125 z-20' : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'}`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Compass Indicator */}
              <div className="absolute bottom-3 right-4 bg-white px-2.5 py-1 border border-slate-200 text-[9px] text-slate-500 rounded-lg tracking-wider font-extrabold uppercase shadow-sm">
                Vector MAP SCALE: 1:15,000
              </div>
            </div>

            {/* Selected Hospital Details Info Footer inside Map */}
            {filteredHospitals[activeHospital] && (
              <div className="bg-white border border-slate-200 p-4 rounded-2xl mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 shadow-md">
                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-extrabold tracking-widest text-star-red uppercase flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-star-red" />
                    <span>Starred Cashless Partner</span>
                  </span>
                  <h3 className="font-extrabold text-sm text-[#00338D]">{filteredHospitals[activeHospital].name}</h3>
                  <div className="text-[10px] text-slate-500 font-semibold">{filteredHospitals[activeHospital].address}</div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs w-full md:w-auto">
                  <a 
                    href={`tel:${filteredHospitals[activeHospital].phone}`}
                    className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-bold rounded-lg transition text-slate-650 flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-star-blue" />
                    <span>Call desk</span>
                  </a>
                  <button 
                    onClick={() => {
                      alert(`Mocking routing navigation to coordinates: Latitude ${filteredHospitals[activeHospital].lat}, Longitude ${filteredHospitals[activeHospital].lng}. Emergency desk notified.`);
                    }}
                    className="px-3.5 py-1.5 bg-star-red hover:bg-red-700 text-[10px] font-extrabold rounded-lg transition text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
