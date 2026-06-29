      return {
        ...prev,
        preExisting: [...current, trimmed]
      };
    });
    setCustomAilmentInput("");
    setShowAilmentSuggestions(false);
  };

  const removeCustomAilment = (ailment: string) => {
    setFormData(prev => ({
      ...prev,
      preExisting: prev.preExisting.filter(a => a !== ailment)
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const runRecommendation = async () => {
    // Validate required fields (Name and Phone) and consent checkbox
    if (!leadForm.name.trim() || !leadForm.phone.trim() || !consentChecked) {
      setShowValidationErrors(true);
      return;
    }

    setLoading(true);
    let matchedPlanId = "";
    let mockData: RecommendationResponse | null = null;

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data: RecommendationResponse = await response.json();
        matchedPlanId = data.recommendedPlanId;
        mockData = data;
      } else {
        throw new Error("API Recommend call failed");
      }
    } catch (e) {
      console.warn("Falling back to clie
<truncated 2555 bytes>
     budget: formData.budget,
          preExistingDiseases: formData.preExisting,
          diabetes: formData.diabetes,
          parentsIncluded: formData.parentsIncluded,
          employerInsurance: formData.employerInsurance,
          pregnancyPlan: formData.pregnancyPlan,
          preferredHospital: formData.preferredHospital,
          recommendedPlanId: matchedPlanId
        })
      });
      if (leadRes.ok) {
        const leadData = await leadRes.json();
        if (isContactFilled) {
          setLeadSubmitted(true);
        }
        setSubmittedLeadData(leadData.lead);
      }
    } catch (e) {
      console.error("Autosave lead failed:", e);
    }

    if (mockData) {
      setRecommendation(mockData);
      const alternative = plans.find(p => p.id !== matchedPlanId);
      if (alternative) setSelectedCompareId(alternative.id);
      onRecommendationReceived(mockData);
    }
    setLoading(false);
  };

  const getMatchedPlan = (): Plan | undefined => {
    if (!recommendation) return undefined;
    return plans.find(p => p.id === recommendation.recommendedPlanId) || plans[0];
  };

  const matchedPlan = getMatchedPlan();

  const [callScheduledConfirmed, setCallScheduledConfirmed] = useState(false);

  const confirmScheduleCall = async () => {
    if (!submittedLeadData || !submittedLeadData.id || !leadForm.scheduledCallAt) return;
    try {
      const res = await fetch("/api/update-lead-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: submittedLeadData.id,
          call_status: 'scheduled',
