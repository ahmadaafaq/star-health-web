export interface Plan {
  id: string;
  name: string;
  category: string;
  tagline: string;
  premium: number; // Base monthly premium in INR
  coverage: string; // e.g., "5 Lakh - 1 Crore"
  waitingPeriod: string; // e.g., "3 Years" or "None for Accidents"
  claimRatio: string; // e.g., "98.2%"
  coPay: string; // e.g., "No Co-Pay"
  roomRent: string; // e.g., "Single Private Room (No Capping)"
  keyBenefits: string[];
  description: string;
}

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'select' | 'multi-select' | 'text' | 'yes-no';
  options?: { value: string; label: string; icon?: string; description?: string }[];
}

export interface RecommendationRequest {
  age: string;
  members: string[];
  city: string;
  budget: string;
  preExisting: string[];
  diabetes: boolean;
  parentsIncluded: boolean;
  employerInsurance: boolean;
  pregnancyPlan: boolean;
  preferredHospital?: string;
}

export interface RecommendationResponse {
  recommendedPlanId: string;
  confidence: number;
  whyExplanation: string;
  savingsEstimate: string;
  cashlessCount: string;
  monthlyPremium: number;
  highlightedBenefits: string[];
}
