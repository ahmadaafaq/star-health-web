import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Mail, Phone, Activity, TrendingUp, CheckCircle2, Clock, Sliders, X, 
  ChevronRight, Send, Volume2, Calendar, DollarSign, AlertCircle, MessageSquare, 
  Loader2, Search, Grid, List, MessageCircle, AlertTriangle, FileText, ChevronLeft,
  ArrowLeft, RefreshCw, BarChart2, Plus, Users, Play, Pause, Smartphone, Laptop, 
  Database, Upload, Sparkles, Check, HelpCircle, PhoneCall, Sun, Moon
} from "lucide-react";

interface AdminPortalProps {
  onBackToSite: () => void;
  plans: any[];
}

export default function AdminPortal({ onBackToSite, plans }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "contacts" | "agents" | "campaigns" | "whatsapp" | "phone-numbers" | "scheduled"
  >("dashboard");
  
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  // Phone number normalization
  const normalizePhone = (phone: string | null | undefined): string => {
    if (!phone) return "";
    return phone.replace(/\D/g, "").slice(-10);
  };

  // Search & Filter state for Contacts
  const [searchQuery, setSearchQuery] = useState("");
  const [contactsViewMode, setContactsViewMode] = useState<"list" | "kanban">("list");
  const [typeFilter, setTypeFilter] = useState<"all" | "hot" | "warm" | "cold">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "attempting" | "no_answer" | "callback" | "connected" | "interested" | "not_interested" | "qualified" | "converted" | "junk"
  >("all");
  const [sentimentFilter, setSentimentFilter] = useState<"all" | "positive" | "neutral" | "negative">("all");
  const [callsFilter, setCallsFilter] = useState<"all" | "has_calls" | "no_calls">("all");

  // Scheduled Calls filters state
  const [scheduledDateFilter, setScheduledDateFilter] = useState<"today" | "tomorrow" | "all" | "custom">("today");
  const [scheduledCustomDate, setScheduledCustomDate] = useState<string>("");
  const [scheduledTypeFilter, setScheduledTypeFilter] = useState<"all" | "new" | "followup" | "reminder">("all");

  // Integrations Modal
  const [integrationsOpen, setIntegrationsOpen] = useState(false);

  // Chat/WhatsApp state
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [whatsappActiveFilter, setWhatsappActiveFilter] = useState<"all" | "open" | "closed">("all");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Campaign management state
  const [campaignImporterTab, setCampaignImporterTab] = useState<"upload" | "sheet">("upload");
  const [csvInput, setCsvInput] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [campaignType, setCampaignType] = useState<"standard" | "quick_qualify">("standard");
  const [campaignNameInput, setCampaignNameInput] = useState("LeadX Outbound Q3");
  const [retryAttempts, setRetryAttempts] = useState("3");
  const [callWindowStart, setCallWindowStart] = useState("10");
  const [callWindowEnd, setCallWindowEnd] = useState("19");
  const [cooldownMin, setCooldownMin] = useState("180");
  const [maxCallsDay, setMaxCallsDay] = useState("2");
  const [shortCallSec, setShortCallSec] = useState("15");
  const [longCallSec, setLongCallSec] = useState("60");
  const [maxDays, setMaxDays] = useState("10");
  const [autoDisqualifyDays, setAutoDisqualifyDays] = useState("7");
  const [isImporting, setIsImporting] = useState(false);

  // AI Call Analysis Modal
  const [aiAnalysisLead, setAiAnalysisLead] = useState<any | null>(null);

  // Action status loading tracker (for dialing triggers)
  const [dialingLeadId, setDialingLeadId] = useState<string | null>(null);
  const [dialStatusMessage, setDialStatusMessage] = useState("");

  const theme = {
    mainBg: darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800",
    cardBg: darkMode ? "bg-slate-900/40 border-slate-900/80" : "bg-white border-slate-200/80 shadow-sm",
    cardInner: darkMode ? "bg-slate-950 border-slate-900" : "bg-slate-50 border-slate-200/60",
    border: darkMode ? "border-slate-900" : "border-slate-200",
    borderStrong: darkMode ? "border-slate-950" : "border-slate-300/80",
    textMain: darkMode ? "text-white" : "text-slate-900",
    textMuted: darkMode ? "text-slate-400" : "text-slate-600",
    textLight: darkMode ? "text-slate-500" : "text-slate-400",
    inputBg: darkMode ? "bg-slate-950 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-900",
    tableHead: darkMode ? "bg-slate-900/60 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500",
    hoverBg: darkMode ? "hover:bg-slate-800/20" : "hover:bg-slate-100/60",
    divider: darkMode ? "divide-slate-900" : "divide-slate-200",
    selectedBg: darkMode ? "bg-slate-800/40" : "bg-blue-50/50",
    sidebarBg: darkMode ? "bg-slate-900/80 border-r border-slate-950 text-slate-400" : "bg-white border-r border-slate-200 text-slate-600 shadow-sm",
    headerBg: darkMode ? "bg-slate-900/30 border-b border-slate-950" : "bg-white border-b border-slate-200 shadow-xs",
  };

  // Purchased numbers mock list (matching screenshot)
  const phoneLinesData = [
    { number: "+912248933821", sip: "-", date: "4/14/2026", price: "499/mo", kyc: "Pending", inbound: "Not Supported" },
    { number: "+912248933890", sip: "-", date: "4/14/2026", price: "499/mo", kyc: "Pending", inbound: "Not Supported" },
    { number: "+912248933936", sip: "-", date: "4/14/2026", price: "Outbound Only", kyc: "Approved", inbound: "Not Supported" },
    { number: "+912248933873", sip: "-", date: "4/14/2026", price: "499/mo", kyc: "Pending", inbound: "Not Supported" },
    { number: "+912248933909", sip: "-", date: "4/14/2026", price: "499/mo", kyc: "Pending", inbound: "Not Supported" },
    { number: "+912248933970", sip: "-", date: "4/14/2026", price: "499/mo", kyc: "Pending", inbound: "Not Supported" },
  ];

  // Mock voice agents (matching screenshot)
  const [voiceAgents, setVoiceAgents] = useState([
    { name: "leadx_agent", phone: "+917969205407", voice: "Priya", status: true },
    { name: "LeadXAgent", phone: "+917969205407", voice: "Maya", status: true },
    { name: "leadx_agent_2", phone: "+917949108805", voice: "Meera", status: true },
    { name: "ganga_in", phone: "+917969205407", voice: "Maya", status: true },
    { name: "Property", phone: "+917969205407", voice: "Maya", status: true },
  ]);

  // Computed metrics from DB leads
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.lead_type === 'hot').length;
  const warmLeads = leads.filter(l => l.lead_type === 'warm').length;
  const coldLeads = leads.filter(l => l.lead_type === 'cold').length;
  const wonLeads = leads.filter(l => l.lead_status === 'won').length;
  const lostLeads = leads.filter(l => l.lead_status === 'lost').length;
  const scheduledCalls = leads.filter(l => l.call_status === 'scheduled' || l.follow_up_scheduled === true).length;
  
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";
  const averageIntentScore = totalLeads > 0 
    ? (leads.reduce((sum, l) => sum + (l.ai_rank_score || 0), 0) / totalLeads).toFixed(0)
    : "0";

  // Fetch leads and messages list
  const loadData = async () => {
    setLoading(true);
    try {
      const leadsRes = await fetch("/api/leads");
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data);
      }
      
      const msgsRes = await fetch("/api/messages");
      if (msgsRes.ok) {
        const data = await msgsRes.json();
        setMessages(data);
      }
    } catch (e) {
      console.error("Failed to load admin portal data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (window.location.pathname !== "/admin") {
      window.history.pushState(null, "", "/admin");
    }
  }, []);

  // Sync scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Load chat messages when a lead is selected
  const loadLeadChat = async (leadId: string, phone: string) => {
    if (!leadId) return;
    setChatLoading(true);
    try {
      const res = await fetch(`/api/messages/lead/${encodeURIComponent(leadId)}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data.history || []);
      } else {
        // Fallback to local messages
        const localMsgs = messages.filter(m => m.lead_id === leadId || normalizePhone(m.phone) === normalizePhone(phone));
        setChatMessages(localMsgs);
      }
    } catch (e) {
      console.error("Failed to fetch messages for lead, falling back to local messages:", leadId, e);
      // Fallback to local messages
      const localMsgs = messages.filter(m => m.lead_id === leadId || normalizePhone(m.phone) === normalizePhone(phone));
      setChatMessages(localMsgs);
    } finally {
      setChatLoading(false);
    }
  };

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  useEffect(() => {
    if (selectedLead) {
      loadLeadChat(selectedLead.id, selectedLead.phone);
    } else {
      setChatMessages([]);
    }
  }, [selectedLeadId]);

  // Trigger Outbound Twilio Call manually
  const triggerOutboundCall = async (leadId: string) => {
    setDialingLeadId(leadId);
    setDialStatusMessage("Connecting to Twilio & ElevenLabs...");
    try {
      const res = await fetch("/api/trigger-outbound-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId })
      });

      if (res.ok) {
        const data = await res.json();
        setDialStatusMessage(`Call initiated successfully! SID: ${data.callSid || "Success"}`);
        setTimeout(() => {
          setDialingLeadId(null);
          setDialStatusMessage("");
          loadData(); // reload statuses
        }, 3000);
      } else {
        const err = await res.json();
        setDialStatusMessage(`Error dialer: ${err.error || "Failed to trigger call"}`);
        setTimeout(() => {
          setDialingLeadId(null);
          setDialStatusMessage("");
        }, 5000);
      }
    } catch (e: any) {
      setDialStatusMessage(`Connection failure: ${e.message}`);
      setTimeout(() => {
        setDialingLeadId(null);
        setDialStatusMessage("");
      }, 5000);
    }
  };

  // Send a custom WhatsApp message
  const handleSendCustomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedLead?.phone) return;

    const targetPhone = selectedLead.phone;
    const bodyText = replyText;
    setReplyText("");

    // optimistic update local state
    const mockMessage = {
      id: Math.random().toString(),
      created_at: new Date().toISOString(),
      lead_phone: targetPhone,
      direction: "outbound",
      body: bodyText,
      channel: "whatsapp",
      message_type: "custom"
    };
    setChatMessages(prev => [...prev, mockMessage]);

    try {
      const res = await fetch("/api/send-custom-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: targetPhone,
          message: bodyText
        })
      });
      if (res.ok) {
        loadLeadChat(selectedLead.id, targetPhone);
        loadData(); // reload stats
      }
    } catch (e) {
      console.error("Failed to send custom message:", e);
    }
  };

  // Update lead status
  const updateLeadStatusField = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/update-lead-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, lead_status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, lead_status: newStatus } : l));
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  // Update call details
  const updateCallDetails = async (leadId: string, callStatus: string, scheduledTime?: string) => {
    try {
      const payload: any = { id: leadId, call_status: callStatus };
      if (scheduledTime) {
        payload.scheduled_call_at = scheduledTime;
      }
      const res = await fetch("/api/update-lead-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...data.lead } : l));
      }
    } catch (e) {
      console.error("Failed to update call details:", e);
    }
  };

  // Human readable Plan names mapping
  const getPolicyName = (policyId: string) => {
    const matched = plans.find(p => p.id === policyId);
    if (matched) return matched.name;
    const cleanId = (policyId || "").replace(/-/g, " ");
    return cleanId.charAt(0).toUpperCase() + cleanId.slice(1);
  };

  // CSV/JSON importer trigger
  const handleBulkImport = async () => {
    if (campaignImporterTab === "upload" && !csvInput.trim()) return;
    if (campaignImporterTab === "sheet" && !sheetUrl.trim()) return;

    setIsImporting(true);
    try {
      let leadsToImport: any[] = [];

      if (campaignImporterTab === "upload") {
        // Parse CSV format: Name, Phone, Email, Age, Gender, Policy/Plan, PreExisting
        const lines = csvInput.split("\n");
        lines.forEach(line => {
          if (!line.trim()) return;
          const cols = line.split(",").map(c => c.trim());
          if (cols.length >= 2) {
            leadsToImport.push({
              name: cols[0],
              phone: cols[1],
              email: cols[2] || "",
              age: cols[3] || null,
              gender: cols[4] || "other",
              policy: cols[5] || "family-health-optima",
              pre_existing_diseases: cols[6] ? cols[6].split(";").map(d => d.trim()) : [],
              campaign_name: campaignNameInput
            });
          }
        });
      } else {
        // Mock Google Sheets URL sync
        leadsToImport = [
          { name: "Saurabh Mishra", phone: "+919634776903", email: "saurabh@gmail.com", age: 34, gender: "male", policy: "family-health-optima", campaign_name: campaignNameInput },
          { name: "Vikram Malhotra", phone: "+917969205407", email: "vikram@yahoo.com", age: 52, gender: "male", policy: "star-premier", campaign_name: campaignNameInput }
        ];
      }

      if (leadsToImport.length === 0) {
        alert("No valid leads parsed. Check columns formatting (e.g. Name, Phone).");
        setIsImporting(false);
        return;
      }

      const res = await fetch("/api/bulk-import-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: leadsToImport })
      });

      if (res.ok) {
        alert(`Successfully imported ${leadsToImport.length} contacts into campaign ${campaignNameInput}`);
        setCsvInput("");
        setSheetUrl("");
        loadData();
      } else {
        alert("Failed to submit bulk leads to database.");
      }
    } catch (e: any) {
      alert(`Import error: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  // Filter contacts based on filters and search query
  const filteredLeads = leads.filter(l => {
    const nameMatch = (l.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (l.phone || "").toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (l.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const policyMatch = getPolicyName(l.recommended_plan_id || l.policy || "").toLowerCase().includes(searchQuery.toLowerCase());
    const queryMatch = nameMatch || phoneMatch || emailMatch || policyMatch;

    const typeMatch = typeFilter === "all" || l.lead_type === typeFilter;
    const statusMatch = statusFilter === "all" || l.lead_status === statusFilter;
    
    // calls filter
    let callsMatch = true;
    if (callsFilter === "has_calls") {
      callsMatch = !!(l.call_recording_url || l.call_summary);
    } else if (callsFilter === "no_calls") {
      callsMatch = !(l.call_recording_url || l.call_summary);
    }

    // sentiment filter (derived from mock values if missing, or interest levels)
    let sentimentMatch = true;
    if (sentimentFilter !== "all") {
      const leadSentiment = l.interest_level === "high" || l.lead_type === "hot" ? "positive" :
                            l.interest_level === "low" || l.lead_type === "cold" ? "negative" : "neutral";
      sentimentMatch = leadSentiment === sentimentFilter;
    }

    return queryMatch && typeMatch && statusMatch && callsMatch && sentimentMatch;
  });

  return (
    <div className={`min-h-screen ${theme.mainBg} flex flex-col font-sans select-none selection:bg-blue-600 selection:text-white ${darkMode ? "dark" : ""}`}>
      
      {/* Dialer Call Progress Banner */}
      <AnimatePresence>
        {dialingLeadId && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-indigo-900 border-b border-indigo-700 py-3 px-6 text-center text-xs font-black uppercase tracking-wider flex justify-center items-center gap-3 relative z-50 shadow-lg text-white"
          >
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{dialStatusMessage}</span>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sticky Header */}
      <header className={`border-b ${theme.border} ${theme.headerBg} backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.history.pushState(null, "", "/");
              onBackToSite();
            }}
            className={`p-2 rounded-xl transition ${theme.hoverBg} ${theme.textMuted} hover:${theme.textMain} flex items-center gap-1.5 text-xs font-black uppercase tracking-wider cursor-pointer`}
          >
            <ArrowLeft className="w-4 h-4 text-blue-500" />
            <span>Customer Advisor View</span>
          </button>
          <span className={`h-4 w-px ${theme.border}`} />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
            <h1 className={`text-sm font-black tracking-tight ${theme.textMain} uppercase`}>LEADX AGENT CONTROL PANEL</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light/Dark theme switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center cursor-pointer ${
              darkMode 
                ? "bg-slate-900 hover:bg-slate-800 border-slate-800 text-yellow-400 hover:text-yellow-350" 
                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
            }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={loadData}
            className={`p-2.5 rounded-xl border transition flex items-center gap-2 text-xs font-black tracking-wider uppercase cursor-pointer ${
              darkMode
                ? "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white"
                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950 shadow-sm"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-500" : ""}`} />
            <span>Sync Data</span>
          </button>

          <div className={`h-8 w-px ${theme.border}`} />
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              SA
            </div>
            <div className="hidden md:block">
              <span className={`text-xs font-black block ${theme.textMain} leading-tight`}>Super Admin</span>
              <span className={`text-[9px] ${theme.textMuted} font-semibold uppercase tracking-wider block`}>LeadX Inbound</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Unified Vertical Sidebar Menu */}
        <aside className={`w-64 ${theme.sidebarBg} flex flex-col p-4 space-y-1.5 shrink-0 hidden lg:flex`}>
          
          <div className={`pb-3 mb-2 border-b ${theme.border} text-left px-2`}>
            <span className={`text-[10px] ${theme.textMuted} font-black uppercase tracking-widest block`}>Main Menu</span>
          </div>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition text-xs font-extrabold uppercase tracking-wide cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                : `${theme.textMuted} hover:${theme.hoverBg} hover:${theme.textMain}`
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("contacts")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition text-xs font-extrabold uppercase tracking-wide cursor-pointer ${
              activeTab === "contacts"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                : `${theme.textMuted} hover:${theme.hoverBg} hover:${theme.textMain}`
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab("agents")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition text-xs font-extrabold uppercase tracking-wide cursor-pointer ${
              activeTab === "agents"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                : `${theme.textMuted} hover:${theme.hoverBg} hover:${theme.textMain}`
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Agents</span>
          </button>

          <button
            onClick={() => setActiveTab("campaigns")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition text-xs font-extrabold uppercase tracking-wide cursor-pointer ${
              activeTab === "campaigns"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                : `${theme.textMuted} hover:${theme.hoverBg} hover:${theme.textMain}`
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Campaigns</span>
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition text-xs font-extrabold uppercase tracking-wide cursor-pointer ${
              activeTab === "whatsapp"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                : `${theme.textMuted} hover:${theme.hoverBg} hover:${theme.textMain}`
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Hub</span>
          </button>

          <button
            onClick={() => setActiveTab("phone-numbers")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition text-xs font-extrabold uppercase tracking-wide cursor-pointer ${
              activeTab === "phone-numbers"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                : `${theme.textMuted} hover:${theme.hoverBg} hover:${theme.textMain}`
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Phone Numbers</span>
          </button>

          <button
            onClick={() => setActiveTab("scheduled")}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition text-xs font-extrabold uppercase tracking-wide cursor-pointer ${
              activeTab === "scheduled"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                : `${theme.textMuted} hover:${theme.hoverBg} hover:${theme.textMain}`
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Scheduled Calls</span>
          </button>

          <div className="flex-1" />
          
          <div className={`rounded-xl p-3.5 text-left space-y-2 ${theme.cardInner} border ${theme.border}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest block ${theme.textMuted}`}>Server Health</span>
            <div className={`space-y-1.5 text-xs font-bold ${theme.textMuted}`}>
              <div className="flex justify-between items-center">
                <span>Voice Hub:</span>
                <span className="text-emerald-500 font-extrabold flex items-center gap-1">● Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span>RAG API:</span>
                <span className="text-emerald-500 font-extrabold flex items-center gap-1">● Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Supabase:</span>
                <span className="text-emerald-500 font-extrabold flex items-center gap-1">● Linked</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Content view container */}
        <main className={`flex-1 flex flex-col overflow-y-auto p-6 relative ${theme.mainBg}`}>
          
          {/* Mobile Tab Navbar */}
          <div className={`lg:hidden flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 border-b ${theme.border}`}>
            {(["dashboard", "contacts", "agents", "campaigns", "whatsapp", "phone-numbers", "scheduled"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition cursor-pointer ${
                  activeTab === t 
                    ? "bg-blue-600 text-white" 
                    : `${theme.textMuted} hover:${theme.hoverBg}`
                }`}
              >
                {t.replace("-", " ")}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col justify-center items-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Retrieving database sync...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* TAB 1: DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                    <div className={`${theme.cardBg} border rounded-2xl p-4 flex flex-col justify-between hover:border-slate-800 transition`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] ${theme.textMuted} font-black uppercase tracking-wider`}>Total Leads</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center"><User className="w-4 h-4" /></div>
                      </div>
                      <div className="mt-3">
                        <span className={`text-3xl font-black ${theme.textMain}`}>{totalLeads}</span>
                        <span className={`text-[9px] ${theme.textMuted} font-bold block mt-0.5`}>Database count</span>
                      </div>
                    </div>

                    <div className={`${theme.cardBg} border rounded-2xl p-4 flex flex-col justify-between hover:border-slate-800 transition`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] ${theme.textMuted} font-black uppercase tracking-wider`}>Hot Leads (🔥)</span>
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>
                      </div>
                      <div className="mt-3">
                        <span className="text-3xl font-black text-rose-500">{hotLeads}</span>
                        <span className={`text-[9px] ${theme.textMuted} font-bold block mt-0.5`}>Highly qualified</span>
                      </div>
                    </div>

                    <div className={`${theme.cardBg} border rounded-2xl p-4 flex flex-col justify-between hover:border-slate-800 transition`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] ${theme.textMuted} font-black uppercase tracking-wider`}>Callback Queue</span>
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center"><Calendar className="w-4 h-4" /></div>
                      </div>
                      <div className="mt-3">
                        <span className="text-3xl font-black text-indigo-400">{scheduledCalls}</span>
                        <span className={`text-[9px] ${theme.textMuted} font-bold block mt-0.5`}>Follow-ups pending</span>
                      </div>
                    </div>

                    <div className={`${theme.cardBg} border rounded-2xl p-4 flex flex-col justify-between hover:border-slate-800 transition`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] ${theme.textMuted} font-black uppercase tracking-wider`}>Won Policies</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                      </div>
                      <div className="mt-3">
                        <span className="text-3xl font-black text-emerald-400">{wonLeads}</span>
                        <span className={`text-[9px] ${theme.textMuted} font-bold block mt-0.5`}>Closed prospects</span>
                      </div>
                    </div>

                    <div className={`${theme.cardBg} border rounded-2xl p-4 flex flex-col justify-between hover:border-slate-800 transition`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] ${theme.textMuted} font-black uppercase tracking-wider`}>Conversion Ratio</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center"><Activity className="w-4 h-4" /></div>
                      </div>
                      <div className="mt-3">
                        <span className="text-3xl font-black text-amber-500">{conversionRate}%</span>
                        <span className={`text-[9px] ${theme.textMuted} font-bold block mt-0.5`}>Lead to won scale</span>
                      </div>
                    </div>
                  </div>

                  {/* Intent Matrix breakdowns */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                    <div className={`${theme.cardBg} border rounded-2xl p-5 space-y-5`}>
                      <h3 className={`text-xs font-black uppercase tracking-wider ${theme.textMuted}`}>Lead Intent Matrix</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className={`flex justify-between text-xs font-bold ${theme.textMuted}`}>
                            <span>🔥 Hot Leads (Score 80+)</span>
                            <span className="text-rose-500 font-black">{hotLeads} ({totalLeads > 0 ? ((hotLeads / totalLeads) * 100).toFixed(0) : 0}%)</span>
                          </div>
                          <div className={`h-2 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border ${theme.border}`}>
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${totalLeads > 0 ? (hotLeads / totalLeads) * 100 : 0}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className={`flex justify-between text-xs font-bold ${theme.textMuted}`}>
                            <span>⚡ Warm Leads (Score 40-79)</span>
                            <span className="text-amber-500 font-black">{warmLeads} ({totalLeads > 0 ? ((warmLeads / totalLeads) * 100).toFixed(0) : 0}%)</span>
                          </div>
                          <div className={`h-2 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border ${theme.border}`}>
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalLeads > 0 ? (warmLeads / totalLeads) * 100 : 0}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className={`flex justify-between text-xs font-bold ${theme.textMuted}`}>
                            <span>❄️ Cold Leads (Score &lt; 40)</span>
                            <span className="text-blue-500 font-black">{coldLeads} ({totalLeads > 0 ? ((coldLeads / totalLeads) * 100).toFixed(0) : 0}%)</span>
                          </div>
                          <div className={`h-2 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border ${theme.border}`}>
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalLeads > 0 ? (coldLeads / totalLeads) * 100 : 0}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className={`pt-4 border-t ${theme.border} flex justify-between items-center text-xs font-bold`}>
                        <span className={theme.textMuted}>Average Profile Intent Score:</span>
                        <span className={`text-base font-black ${theme.textMain}`}>{averageIntentScore}%</span>
                      </div>
                    </div>

                    <div className={`${theme.cardBg} border rounded-2xl p-5 space-y-4`}>
                      <h3 className={`text-xs font-black uppercase tracking-wider ${theme.textMuted}`}>Call Dispatch Stats</h3>
                      
                      <div className={`grid grid-cols-2 gap-3 font-black ${theme.textMain}`}>
                        <div className={`${theme.cardInner} border ${theme.border} p-3.5 rounded-xl`}>
                          <span className={`text-[9px] ${theme.textMuted} font-bold block uppercase`}>PENDING</span>
                          <span className="text-2xl mt-1 block">{leads.filter(l => l.call_status === 'pending' || !l.call_status).length}</span>
                        </div>
                        <div className={`${theme.cardInner} border ${theme.border} p-3.5 rounded-xl`}>
                          <span className="text-[9px] text-indigo-400 font-bold block uppercase">SCHEDULED</span>
                          <span className="text-2xl mt-1 block text-indigo-400">{scheduledCalls}</span>
                        </div>
                        <div className={`${theme.cardInner} border ${theme.border} p-3.5 rounded-xl`}>
                          <span className="text-[9px] text-emerald-400 font-bold block uppercase">CONNECTED</span>
                          <span className="text-2xl mt-1 block text-emerald-400">{leads.filter(l => l.call_status === 'completed').length}</span>
                        </div>
                        <div className={`${theme.cardInner} border ${theme.border} p-3.5 rounded-xl`}>
                          <span className="text-[9px] text-rose-550 font-bold block uppercase">FAILED</span>
                          <span className="text-2xl mt-1 block text-rose-500">{leads.filter(l => l.call_status === 'failed').length}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme.cardBg} border rounded-2xl p-5 space-y-4`}>
                      <h3 className={`text-xs font-black uppercase tracking-wider ${theme.textMuted}`}>Lifecycle Status Breakdown</h3>
                      
                      <div className={`space-y-2 text-xs font-bold ${theme.textMuted}`}>
                        <div className={`flex justify-between items-center p-2 ${theme.cardInner} rounded-xl border ${theme.border}`}>
                          <span>Open Opportunities</span>
                          <span className={`bg-slate-200 dark:bg-slate-950 px-2 py-0.5 rounded ${theme.textMain}`}>{leads.filter(l => l.lead_status === 'open').length}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/20">
                          <span className="text-blue-600 dark:text-blue-300">In Progress (Active)</span>
                          <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded text-blue-800 dark:text-blue-200">{leads.filter(l => l.lead_status === 'in_progress').length}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/20">
                          <span className="text-amber-600 dark:text-amber-300">Callback Pending</span>
                          <span className="bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded text-amber-800 dark:text-amber-200">{leads.filter(l => l.lead_status === 'communication').length}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                          <span className="text-emerald-600 dark:text-emerald-300">Converted (Won)</span>
                          <span className="bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-200">{wonLeads}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACTS */}
              {activeTab === "contacts" && (
                <div className="space-y-6 text-left">
                  
                  {/* Top bar controls */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className={`flex items-center gap-2 ${theme.cardInner} border ${theme.border} rounded-xl p-0.5`}>
                      <button
                        onClick={() => setContactsViewMode("list")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition cursor-pointer flex items-center gap-1.5 ${
                          contactsViewMode === "list" ? "bg-blue-600 text-white" : `${theme.textMuted} hover:${theme.textMain}`
                        }`}
                      >
                        <List className="w-3.5 h-3.5" />
                        <span>List</span>
                      </button>
                      <button
                        onClick={() => setContactsViewMode("kanban")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition cursor-pointer flex items-center gap-1.5 ${
                          contactsViewMode === "kanban" ? "bg-blue-600 text-white" : `${theme.textMuted} hover:${theme.textMain}`
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span>Kanban</span>
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIntegrationsOpen(true)}
                        className={`px-4 py-2.5 ${theme.cardInner} hover:${theme.hoverBg} border ${theme.border} ${theme.textMuted} hover:${theme.textMain} rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer`}
                      >
                        Integrations
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab("campaigns");
                          setCampaignImporterTab("upload");
                        }}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Import CSV</span>
                      </button>
                    </div>
                  </div>

                  {contactsViewMode === "list" ? (
                    <div className="space-y-6">
                      {/* Search & Filter cards */}
                      <div className={`${theme.cardBg} border rounded-2xl p-4 flex flex-col gap-4`}>
                        <div className="relative max-w-sm">
                          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full ${theme.inputBg} border ${theme.border} rounded-xl pl-9 pr-4 py-2 text-xs font-bold ${theme.textMain} placeholder-slate-600 focus:outline-none focus:border-blue-500`}
                          />
                        </div>

                        {/* Filter groups */}
                        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-wider">
                          <div className="space-y-1.5">
                            <span className={`${theme.textMuted} block`}>STATUS</span>
                            <div className={`flex flex-wrap gap-1 ${theme.cardInner} p-0.5 rounded-lg border ${theme.border}`}>
                              {[
                                { id: "all", label: "All" },
                                { id: "new", label: "New" },
                                { id: "attempting", label: "Attempting" },
                                { id: "no_answer", label: "No Answer" },
                                { id: "callback", label: "Callback" },
                                { id: "connected", label: "Connected" },
                                { id: "interested", label: "Interested" },
                                { id: "not_interested", label: "Not Interested" },
                                { id: "qualified", label: "Qualified" },
                                { id: "converted", label: "Converted" },
                                { id: "junk", label: "Junk / DNC" }
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => setStatusFilter(item.id as any)}
                                  className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                                    statusFilter === item.id ? "bg-blue-600 text-white" : `${theme.textMuted} hover:text-blue-500`
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className={`${theme.textMuted} block`}>SENTIMENT</span>
                            <div className={`flex flex-wrap gap-1 ${theme.cardInner} p-0.5 rounded-lg border ${theme.border}`}>
                              {[
                                { id: "all", label: "All" },
                                { id: "positive", label: "Positive" },
                                { id: "neutral", label: "Neutral" },
                                { id: "negative", label: "Negative" }
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => setSentimentFilter(item.id as any)}
                                  className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                                    sentimentFilter === item.id ? "bg-blue-600 text-white" : `${theme.textMuted} hover:text-blue-500`
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className={`${theme.textMuted} block`}>CALLS</span>
                            <div className={`flex flex-wrap gap-1 ${theme.cardInner} p-0.5 rounded-lg border ${theme.border}`}>
                              {[
                                { id: "all", label: "All" },
                                { id: "has_calls", label: "Has Calls" },
                                { id: "no_calls", label: "No Calls" }
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => setCallsFilter(item.id as any)}
                                  className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                                    callsFilter === item.id ? "bg-blue-600 text-white" : `${theme.textMuted} hover:text-blue-500`
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Leads Directory Split View */}
                      <div className="flex gap-6 h-[600px] items-stretch overflow-hidden relative">
                        <div className={`border ${theme.border} rounded-2xl flex-1 overflow-y-auto ${selectedLeadId ? "hidden md:block md:max-w-[45%]" : "w-full"} ${darkMode ? "bg-slate-900/20" : "bg-white shadow-sm"}`}>
                          {filteredLeads.length === 0 ? (
                            <div className="h-full flex flex-col justify-center items-center text-slate-500 p-8">
                              <AlertCircle className="w-8 h-8 text-slate-700 mb-2" />
                              <span className="text-[10px] font-black uppercase tracking-wider">No contacts matched</span>
                            </div>
                          ) : (
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className={`${theme.tableHead} border-b ${theme.border} font-black uppercase tracking-wider text-[9px]`}>
                                  <th className="p-3">Name</th>
                                  <th className="p-3">Phone</th>
                                  <th className="p-3">Policy</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3">Status</th>
                                  <th className="p-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className={`divide-y ${theme.divider} font-bold`}>
                                {filteredLeads.map((lead) => {
                                  const isSelected = lead.id === selectedLeadId;
                                  const policyName = getPolicyName(lead.recommended_plan_id || lead.policy || "");
                                  
                                  const statusPill = 
                                    lead.lead_status === 'new' ? 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800' :
                                    lead.lead_status === 'attempting' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/25 dark:text-yellow-400 dark:border-yellow-900/30' :
                                    lead.lead_status === 'no_answer' ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/25 dark:text-orange-400 dark:border-orange-900/30' :
                                    lead.lead_status === 'callback' ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/25 dark:text-purple-400 dark:border-purple-900/30' :
                                    lead.lead_status === 'connected' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/25 dark:text-blue-400 dark:border-blue-900/30' :
                                    lead.lead_status === 'interested' ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/30' :
                                    lead.lead_status === 'not_interested' ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/25 dark:text-rose-400 dark:border-rose-900/30' :
                                    lead.lead_status === 'qualified' ? 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/25 dark:text-teal-400 dark:border-teal-900/30' :
                                    lead.lead_status === 'converted' ? 'bg-emerald-200 text-emerald-900 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50' :
                                    'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-950 dark:text-slate-500 dark:border-slate-900';

                                  return (
                                    <tr 
                                      key={lead.id}
                                      onClick={() => setSelectedLeadId(lead.id)}
                                      className={`hover:${theme.hoverBg} transition cursor-pointer ${
                                        isSelected ? theme.selectedBg : ""
                                      }`}
                                    >
                                      <td className={`p-3 font-extrabold ${theme.textMain} truncate max-w-[90px]`}>{lead.name || "N/A"}</td>
                                      <td className={`p-3 ${theme.textMuted}`}>{lead.phone}</td>
                                      <td className="p-3 truncate max-w-[110px]">
                                        <span className={`bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border ${theme.border} text-[8px] font-black uppercase ${theme.textMuted}`}>
                                          {policyName.replace("Star ", "")}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                                          lead.lead_type === 'hot' ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30' :
                                          lead.lead_type === 'warm' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30' :
                                          'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                                        }`}>
                                          {lead.lead_type === 'hot' ? '🔥 Hot' : lead.lead_type === 'warm' ? '⚡ Warm' : '❄️ Cold'}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${statusPill}`}>
                                          {lead.lead_status}
                                        </span>
                                      </td>
                                      <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                                        <button
                                          onClick={() => setSelectedLeadId(lead.id)}
                                          className={`px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border ${theme.border} text-blue-600 dark:text-blue-500 rounded text-[8px] font-black uppercase cursor-pointer`}
                                        >
                                          View
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>

                        {/* Jira split drawer details panel */}
                        <div className={`flex-1 ${theme.cardBg} border rounded-2xl overflow-hidden flex flex-col`}>
                          {selectedLeadId && selectedLead ? (
                            <div className="flex-1 flex flex-col justify-between overflow-hidden">
                              
                              {/* Header */}
                              <div className={`p-4 border-b ${theme.border} flex justify-between items-center bg-slate-100/60 dark:bg-slate-900/60`}>
                                <div className="text-left">
                                  <h3 className={`text-xs font-black ${theme.textMain}`}>{selectedLead.name}</h3>
                                  <p className={`text-[9px] ${theme.textMuted} font-bold uppercase tracking-wider`}>{selectedLead.id.substring(0, 8)}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                                    selectedLead.lead_type === 'hot' ? 'bg-rose-950/25 text-rose-500 border-rose-900/30' :
                                    selectedLead.lead_type === 'warm' ? 'bg-amber-950/25 text-amber-500 border-amber-900/30' :
                                    'bg-blue-950/25 text-blue-500 border-blue-900/30'
                                  }`}>
                                    Score: {selectedLead.ai_rank_score || 0}%
                                  </span>
                                  <button onClick={() => setSelectedLeadId(null)} className={`p-1 hover:${theme.hoverBg} rounded transition cursor-pointer`}>
                                    <X className={`w-4 h-4 ${theme.textMuted}`} />
                                  </button>
                                </div>
                              </div>
 
                              {/* Split details body */}
                              <div className={`flex-1 overflow-y-auto p-4 space-y-4 text-xs font-semibold ${theme.textMuted}`}>
                                
                                {/* Info fields */}
                                <div className="grid grid-cols-2 gap-3 text-left">
                                  <div className={`${theme.cardInner} border ${theme.border} p-2.5 rounded-xl`}>
                                    <span className="text-[9px] font-bold text-slate-500 block uppercase">Phone</span>
                                    <span className={`block mt-0.5 font-black ${theme.textMain}`}>{selectedLead.phone}</span>
                                  </div>
                                  <div className={`${theme.cardInner} border ${theme.border} p-2.5 rounded-xl`}>
                                    <span className="text-[9px] font-bold text-slate-500 block uppercase">Email</span>
                                    <span className={`block mt-0.5 truncate font-black ${theme.textMain}`}>{selectedLead.email || "N/A"}</span>
                                  </div>
                                  <div className={`${theme.cardInner} border ${theme.border} p-2.5 rounded-xl`}>
                                    <span className="text-[9px] font-bold text-slate-500 block uppercase">Demographic</span>
                                    <span className={`block mt-0.5 font-black ${theme.textMain}`}>🎂 {selectedLead.age || "N/A"} | 🌆 {selectedLead.city || "N/A"}</span>
                                  </div>
                                  <div className={`${theme.cardInner} border ${theme.border} p-2.5 rounded-xl`}>
                                    <span className="text-[9px] font-bold text-slate-500 block uppercase">Recommended Plan</span>
                                    <span className="text-blue-500 dark:text-blue-400 font-black block mt-0.5 truncate">
                                      {getPolicyName(selectedLead.recommended_plan_id || selectedLead.policy || "").replace("Star ", "")}
                                    </span>
                                  </div>
                                </div>
 
                                {/* Call Summary */}
                                <div className="text-left space-y-1">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">AI Call Summary</span>
                                  <div className={`${theme.cardInner} border ${theme.border} p-3 rounded-xl`}>
                                    {selectedLead.call_summary ? (
                                      <p className={`italic ${theme.textMain}`}>"{selectedLead.call_summary}"</p>
                                    ) : (
                                      <span className="text-slate-500 dark:text-slate-600 block text-center py-2 uppercase text-[9px] font-black">No call logs registered</span>
                                    )}
                                  </div>
                                </div>
 
                                {/* Audio Recorder Player */}
                                <div className="text-left space-y-1">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Call Recording</span>
                                  {selectedLead.call_recording_url ? (
                                    <div className={`${theme.cardInner} border ${theme.border} p-2 rounded-xl`}>
                                      <audio src={selectedLead.call_recording_url} controls className="w-full h-8 text-xs focus:outline-none" />
                                    </div>
                                  ) : (
                                    <div className={`border border-dashed ${theme.border} p-3.5 rounded-xl text-center`}>
                                      <span className="text-[9px] text-slate-500 font-bold uppercase block">No recording uploaded</span>
                                    </div>
                                  )}
                                </div>
 
                                {/* Lifecycle update fields */}
                                <div className={`border-t ${theme.border} pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left`}>
                                  <div>
                                    <label className="text-[9px] font-bold text-slate-500 block uppercase mb-1">Opportunity Status</label>
                                    <select
                                      value={selectedLead.lead_status || 'open'}
                                      onChange={(e) => updateLeadStatusField(selectedLead.id, e.target.value)}
                                      className={`w-full ${theme.inputBg} border rounded-xl px-2.5 py-2 text-xs font-black cursor-pointer`}
                                    >
                                      <option value="open">Open</option>
                                      <option value="in_progress">In Progress</option>
                                      <option value="communication">Callback Queue</option>
                                      <option value="won">Won (Policy Issued)</option>
                                      <option value="lost">Lost</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-slate-500 block uppercase mb-1">Telephony Dial Status</label>
                                    <select
                                      value={selectedLead.call_status || 'pending'}
                                      onChange={(e) => updateCallDetails(selectedLead.id, e.target.value)}
                                      className={`w-full ${theme.inputBg} border rounded-xl px-2.5 py-2 text-xs font-black cursor-pointer`}
                                    >
                                      <option value="pending">Pending call</option>
                                      <option value="scheduled">Outbound scheduled</option>
                                      <option value="dialing">Dialing</option>
                                      <option value="completed">Completed</option>
                                      <option value="failed">Failed / No Answer</option>
                                    </select>
                                  </div>
                                </div>
 
                                {/* Callback scheduler */}
                                <div className="text-left">
                                  <label className="text-[9px] font-bold text-slate-500 block uppercase mb-1">Schedule Outbound Callback</label>
                                  <input
                                    type="datetime-local"
                                    value={selectedLead.scheduled_call_at ? new Date(new Date(selectedLead.scheduled_call_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                                    onChange={(e) => updateCallDetails(selectedLead.id, 'scheduled', e.target.value)}
                                    className={`w-full ${theme.inputBg} border rounded-xl px-3 py-2 text-xs font-black cursor-pointer`}
                                  />
                                </div>
 
                                {/* Manual trigger dialing CTA */}
                                <div className="pt-2">
                                  <button
                                    onClick={() => triggerOutboundCall(selectedLead.id)}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5" />
                                    <span>Dial Outbound Immediately</span>
                                  </button>
                                </div>
 
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col justify-center items-center text-slate-500">
                              <FileText className={`w-10 h-10 ${theme.textMuted} opacity-40 mb-2`} />
                              <span className="text-[10px] font-black uppercase tracking-wider">Select contact to view profile</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    ) : (
                    
                    /* Contacts Kanban View (expanded to all 10 pipeline stages) */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-10 gap-4 overflow-x-auto pb-4">
                      {[
                        { id: "new", title: "01. NEW", color: darkMode ? "border-slate-800 text-slate-300 bg-slate-900/10" : "border-slate-200 text-slate-600 bg-slate-100", btn: "CONTACT" },
                        { id: "attempting", title: "02. ATTEMPTING", color: darkMode ? "border-yellow-900 text-yellow-400 bg-yellow-950/10" : "border-yellow-200 text-yellow-700 bg-yellow-50", btn: "DIAL AGAIN" },
                        { id: "no_answer", title: "03. NO ANSWER", color: darkMode ? "border-orange-900 text-orange-400 bg-orange-950/10" : "border-orange-200 text-orange-700 bg-orange-50", btn: "RETRY" },
                        { id: "callback", title: "04. CALLBACK", color: darkMode ? "border-purple-900 text-purple-400 bg-purple-950/10" : "border-purple-200 text-purple-700 bg-purple-50", btn: "CALL QUEUE" },
                        { id: "connected", title: "05. CONNECTED", color: darkMode ? "border-blue-900 text-blue-400 bg-blue-950/10" : "border-blue-200 text-blue-700 bg-blue-50", btn: "UNDERWRITE" },
                        { id: "interested", title: "06. INTERESTED", color: darkMode ? "border-emerald-900 text-emerald-400 bg-emerald-950/10" : "border-emerald-200 text-emerald-700 bg-emerald-50", btn: "PREPARE QUOTE" },
                        { id: "not_interested", title: "07. NOT INT.", color: darkMode ? "border-rose-900 text-rose-400 bg-rose-950/10" : "border-rose-200 text-rose-700 bg-rose-50" },
                        { id: "qualified", title: "08. QUALIFIED", color: darkMode ? "border-teal-900 text-teal-400 bg-teal-950/10" : "border-teal-200 text-teal-700 bg-teal-50", btn: "ISSUE POLICY" },
                        { id: "converted", title: "09. CONVERTED", color: darkMode ? "border-emerald-500 text-emerald-400 bg-emerald-900/10" : "border-emerald-300 text-emerald-800 bg-emerald-50" },
                        { id: "junk", title: "10. JUNK / DNC", color: darkMode ? "border-red-900 text-rose-400 bg-rose-950/10" : "border-red-200 text-red-700 bg-red-50" }
                      ].map((col) => {
                        const colLeads = leads.filter(l => l.lead_status === col.id || (col.id === 'new' && l.lead_status === 'open'));

                        return (
                          <div key={col.id} className={`flex flex-col min-w-[210px] min-h-[500px] ${darkMode ? "bg-slate-900/40 border-slate-900" : "bg-white border-slate-200 shadow-xs"} border rounded-2xl p-3 space-y-3 shrink-0`}>
                            <div className={`flex justify-between items-center border p-2 rounded-xl font-black text-[9px] uppercase tracking-wider ${col.color}`}>
                              <span>{col.title}</span>
                              <span className={`px-2 py-0.5 rounded-full ${darkMode ? "bg-slate-950 text-white" : "bg-slate-200 text-slate-700"}`}>{colLeads.length}</span>
                            </div>

                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px]">
                              {colLeads.map((lead) => {
                                const policyName = getPolicyName(lead.recommended_plan_id || lead.policy || "");
                                return (
                                  <div
                                    key={lead.id}
                                    onClick={() => {
                                      setSelectedLeadId(lead.id);
                                      setContactsViewMode("list");
                                    }}
                                    className={`border rounded-xl p-3 shadow-sm cursor-pointer text-left space-y-2.5 relative transition ${
                                      darkMode ? "bg-slate-900 hover:bg-slate-800 border-slate-900 hover:border-slate-800" : "bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-1">
                                      <span className={`font-extrabold text-xs ${theme.textMain} truncate max-w-[100px]`}>{lead.name || "Prospect"}</span>
                                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-200 border-slate-300 text-slate-600"} shrink-0`}>
                                        SCORE: {lead.ai_rank_score || 50}
                                      </span>
                                    </div>
                                    <div className={`text-[10px] ${theme.textMuted} font-bold space-y-1`}>
                                      <div>📞 {lead.phone}</div>
                                      <div className="truncate">📋 {policyName.replace("Star ", "")}</div>
                                    </div>

                                    {/* Action button inside card */}
                                    {col.btn && (
                                      <div className={`pt-2 border-t ${theme.border} flex justify-between items-center`} onClick={e => e.stopPropagation()}>
                                        <button
                                          onClick={() => triggerOutboundCall(lead.id)}
                                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition cursor-pointer"
                                        >
                                          {col.btn}
                                        </button>
                                      </div>
                                    )}

                                    {/* Dropdown status update switcher */}
                                    <div className="pt-1.5 flex justify-end" onClick={e => e.stopPropagation()}>
                                      <select
                                        value={lead.lead_status === 'open' ? 'new' : (lead.lead_status || 'new')}
                                        onChange={(e) => updateLeadStatusField(lead.id, e.target.value)}
                                        className={`border rounded px-1 py-0.5 text-[8px] font-black cursor-pointer ${
                                          darkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-300 text-slate-700"
                                        }`}
                                      >
                                        <option value="new">New</option>
                                        <option value="attempting">Attempting</option>
                                        <option value="no_answer">No Answer</option>
                                        <option value="callback">Callback</option>
                                        <option value="connected">Connected</option>
                                        <option value="interested">Interested</option>
                                        <option value="not_interested">Not Interested</option>
                                        <option value="qualified">Qualified</option>
                                        <option value="converted">Converted</option>
                                        <option value="junk">Junk / DNC</option>
                                      </select>
                                    </div>

                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: AGENTS */}
              {activeTab === "agents" && (
                <div className="space-y-6 text-left">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className={`text-base font-black uppercase tracking-tight ${theme.textMain}`}>Voice Agents</h2>
                      <p className={`text-xs ${theme.textMuted} mt-0.5`}>Configure and deploy custom AI voice interfaces.</p>
                    </div>
                    <button 
                      onClick={() => alert("Agent templates browsing is fully simulated.")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                    >
                      + Add Agent
                    </button>
                  </div>

                  {/* Agents list table matching screenshot 1 */}
                  <div className={`${theme.cardBg} border rounded-2xl overflow-hidden`}>
                    <table className={`w-full text-xs ${theme.textMuted} text-left`}>
                      <thead>
                        <tr className={`${theme.tableHead} border-b ${theme.border} font-black uppercase tracking-wider text-[10px]`}>
                          <th className="p-4">Name</th>
                          <th className="p-4">Phone Number</th>
                          <th className="p-4">Voice Template</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme.divider} font-bold`}>
                        {voiceAgents.map((agent) => (
                          <tr key={agent.name} className={`hover:${theme.hoverBg} transition`}>
                            <td className={`p-4 font-extrabold ${theme.textMain}`}>{agent.name}</td>
                            <td className="p-4">{agent.phone}</td>
                            <td className="p-4">{agent.voice}</td>
                            <td className="p-4">
                              <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input 
                                  type="checkbox" 
                                  checked={agent.status} 
                                  onChange={() => {
                                    setVoiceAgents(prev => prev.map(a => a.name === agent.name ? { ...a, status: !a.status } : a));
                                  }}
                                  className="sr-only peer" 
                                />
                                <div className="w-8 h-4 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-100 after:border-slate-300 dark:after:bg-slate-300 dark:after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                                <span className={`ml-2 text-[10px] ${theme.textMuted} font-semibold uppercase`}>{agent.status ? "Active" : "Inactive"}</span>
                              </label>
                            </td>
                            <td className="p-4 text-right space-x-1.5">
                              <button onClick={() => alert("Simulation started.")} className={`px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border ${theme.border} text-blue-600 dark:text-blue-400 rounded text-[9px] font-black uppercase cursor-pointer`}>Test</button>
                              <button onClick={() => alert("Configuration settings loaded.")} className={`px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border ${theme.border} ${theme.textMuted} hover:${theme.textMain} rounded text-[9px] font-black uppercase cursor-pointer`}>Simulate</button>
                              <button className={`px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border ${theme.border} ${theme.textMuted} hover:${theme.textMain} rounded text-[9px] font-black uppercase cursor-pointer`}>Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: CAMPAIGNS */}
              {activeTab === "campaigns" && (
                <div className="space-y-6 text-left">
                  
                  {/* Campaign Creation Block */}
                  <div className={`${theme.cardBg} border rounded-2xl p-5 space-y-6`}>
                    <div>
                      <h2 className={`text-base font-black ${theme.textMain} uppercase tracking-tight`}>Outbound Campaigns Manager</h2>
                      <p className={`text-xs ${theme.textMuted} mt-0.5`}>Import directories and configure automated voice qualification workflows.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Left: Input CSV or Sheets sync */}
                      <div className="space-y-4">
                        <div className={`flex border-b ${theme.border} p-0.5 bg-slate-100 dark:bg-slate-950 rounded-xl w-fit`}>
                          <button
                            onClick={() => setCampaignImporterTab("upload")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase cursor-pointer transition ${
                              campaignImporterTab === "upload" ? "bg-blue-600 text-white" : `${theme.textMuted}`
                            }`}
                          >
                            Upload File
                          </button>
                          <button
                            onClick={() => setCampaignImporterTab("sheet")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase cursor-pointer transition ${
                              campaignImporterTab === "sheet" ? "bg-blue-600 text-white" : `${theme.textMuted}`
                            }`}
                          >
                            Google Sheet
                          </button>
                        </div>

                        {campaignImporterTab === "upload" ? (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 block">Lead Prospects CSV Import</label>
                            <textarea
                              rows={4}
                              placeholder="Name, Phone, Email, Age, Gender, Recommended Policy ID&#10;e.g. Saurabh Mishra, +919634776903, saurabh@gmail.com, 34, male, family-health-optima"
                              value={csvInput}
                              onChange={(e) => setCsvInput(e.target.value)}
                              className={`w-full ${theme.inputBg} border ${theme.border} rounded-xl p-3 text-xs font-bold placeholder-slate-400 dark:placeholder-slate-700 focus:outline-none focus:border-blue-500`}
                            />
                            <p className={`text-[10px] ${theme.textMuted} font-bold leading-normal`}>
                              Note: Phone number requires country code format. Separated by commas. Plan IDs: `family-health-optima`, `arogya-sanjeevani`, `medi-classic`, `star-assure`.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Google Sheets Document URL</label>
                              <input
                                type="text"
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                                className={`w-full ${theme.inputBg} border ${theme.border} rounded-xl px-3 py-2 text-xs font-bold placeholder-slate-400 dark:placeholder-slate-700 focus:outline-none focus:border-blue-500`}
                              />
                            </div>
                            <div className={`${theme.cardInner} border ${theme.border} rounded-xl p-3 flex gap-3 ${theme.textMuted} text-[10px] font-bold leading-normal`}>
                              <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                              <p>
                                <strong>Requirement:</strong> Anyone with link must be configured to **Viewer**. Synchronization executes automatically every 5 minutes.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Campaign Title</label>
                            <input
                              type="text"
                              value={campaignNameInput}
                              onChange={(e) => setCampaignNameInput(e.target.value)}
                              className={`w-full ${theme.inputBg} border ${theme.border} rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500`}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Retry Attempts</label>
                            <select
                              value={retryAttempts}
                              onChange={(e) => setRetryAttempts(e.target.value)}
                              className={`w-full ${theme.inputBg} border ${theme.border} rounded-xl px-2.5 py-2 text-xs font-bold cursor-pointer focus:outline-none`}
                            >
                              <option value="1">1 Retry</option>
                              <option value="2">2 Retries</option>
                              <option value="3">3 Retries</option>
                              <option value="4">4 Retries</option>
                              <option value="5">5 Retries</option>
                            </select>
                          </div>
                        </div>
                      </div>

                    {/* Right: Qualification settings (matching screenshot 3) */}
                      <div className={`space-y-4 ${theme.cardInner} border ${theme.border} p-4 rounded-2xl`}>
                        
                        <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-wider">
                          <button
                            type="button"
                            onClick={() => {
                              setCampaignType("standard");
                              setCallWindowStart("10");
                              setCallWindowEnd("19");
                              setCooldownMin("180");
                              setMaxCallsDay("2");
                              setAutoDisqualifyDays("7");
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                              campaignType === "standard" 
                                ? "bg-blue-600/10 border-blue-600 text-blue-600 dark:text-white" 
                                : `border-slate-200 dark:border-slate-800 ${theme.textMuted} hover:border-slate-300 dark:hover:border-slate-800`
                            }`}
                          >
                            <span className={`block font-black ${theme.textMain}`}>Standard</span>
                            <span className={`text-[8px] font-semibold ${theme.textMuted} block mt-1`}>Fixed retries, scheduled start/end</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setCampaignType("quick_qualify");
                              setCallWindowStart("9");
                              setCallWindowEnd("20");
                              setCooldownMin("30");
                              setMaxCallsDay("4");
                              setAutoDisqualifyDays("3");
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                              campaignType === "quick_qualify" 
                                ? "bg-blue-600/10 border-blue-600 text-blue-600 dark:text-white" 
                                : `border-slate-200 dark:border-slate-800 ${theme.textMuted} hover:border-slate-300 dark:hover:border-slate-800`
                            }`}
                          >
                            <span className={`block font-black ${theme.textMain}`}>⚡ Quick Qualify</span>
                            <span className={`text-[8px] font-semibold ${theme.textMuted} block mt-1`}>Sentiment-driven, auto stops on +/-</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 text-[9px] font-black uppercase text-slate-500">
                          <div>
                            <label className="block mb-1">Call Start (Hr)</label>
                            <input 
                              type="number" 
                              value={callWindowStart} 
                              onChange={(e) => setCallWindowStart(e.target.value)}
                              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg p-1.5 text-xs font-bold`} 
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Call End (Hr)</label>
                            <input 
                              type="number" 
                              value={callWindowEnd} 
                              onChange={(e) => setCallWindowEnd(e.target.value)}
                              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg p-1.5 text-xs font-bold`} 
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Cooldown (Min)</label>
                            <input 
                              type="number" 
                              value={cooldownMin} 
                              onChange={(e) => setCooldownMin(e.target.value)}
                              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg p-1.5 text-xs font-bold`} 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[9px] font-black uppercase text-slate-500">
                          <div>
                            <label className="block mb-1">Max Daily Calls</label>
                            <input 
                              type="number" 
                              value={maxCallsDay} 
                              onChange={(e) => setMaxCallsDay(e.target.value)}
                              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg p-1.5 text-xs font-bold`} 
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Auto-Disqualify Days</label>
                            <input 
                              type="number" 
                              value={autoDisqualifyDays} 
                              onChange={(e) => setAutoDisqualifyDays(e.target.value)}
                              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg p-1.5 text-xs font-bold`} 
                            />
                          </div>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={handleBulkImport}
                            disabled={isImporting}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-blue-600/10"
                          >
                            {isImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                            <span>Configure & Run Campaign Queue</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* All Call Activity Logs Table (matching screenshot 3) */}
                  <div className={`${theme.cardBg} border rounded-2xl p-5 space-y-4`}>
                    <div className={`flex justify-between items-center border-b ${theme.border} pb-3`}>
                      <h3 className={`text-xs font-black uppercase tracking-wider ${theme.textMain}`}>All outbound Call Logs</h3>
                      <span className={`text-[10px] ${theme.textMuted} font-bold uppercase`}>GMT+5:30</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className={`w-full text-xs ${theme.textMuted} text-left`}>
                        <thead>
                          <tr className={`border-b ${theme.border} font-black uppercase tracking-wider text-[9px] ${theme.textMuted}`}>
                            <th className="py-2.5">Phone Number</th>
                            <th className="py-2.5">Status</th>
                            <th className="py-2.5">Call Type</th>
                            <th className="py-2.5">Sentiment</th>
                            <th className="py-2.5">Outcome</th>
                            <th className="py-2.5">AI Analysis</th>
                            <th className="py-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.divider} font-bold`}>
                          {leads.filter(l => l.phone).map((lead) => {
                            const hasCall = lead.call_summary || lead.call_recording_url;
                            const leadSentiment = lead.interest_level === "high" || lead.lead_type === "hot" ? "positive" :
                                                  lead.interest_level === "low" || lead.lead_type === "cold" ? "negative" : "neutral";
                            
                            return (
                              <tr key={lead.id} className={`hover:${theme.hoverBg} transition`}>
                                <td className={`py-3 font-extrabold ${theme.textMain}`}>{lead.phone}</td>
                                <td className="py-3">
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                    lead.call_status === 'completed' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' :
                                    lead.call_status === 'dialing' ? 'bg-indigo-950/20 text-indigo-400 border-indigo-900/30 animate-pulse' :
                                    lead.call_status === 'failed' ? 'bg-rose-950/20 text-rose-400 border-rose-900/30' :
                                    `${theme.cardInner} ${theme.textMuted} ${theme.border}`
                                  }`}>
                                    {lead.call_status || "pending"}
                                  </span>
                                </td>
                                <td className={`py-3 ${theme.textMuted} uppercase text-[9px]`}>Send Call</td>
                                <td className="py-3">
                                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                                    leadSentiment === 'positive' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' :
                                    leadSentiment === 'negative' ? 'bg-rose-950/20 text-rose-400 border-rose-900/30' :
                                    `${theme.cardInner} ${theme.textMuted} ${theme.border}`
                                  }`}>
                                    {leadSentiment}
                                  </span>
                                </td>
                                <td className={`py-3 ${theme.textMuted} font-medium truncate max-w-[200px]`}>
                                  {lead.call_summary || "Voicemail / No details loaded"}
                                </td>
                                <td className="py-3">
                                  {hasCall ? (
                                    <button
                                      onClick={() => setAiAnalysisLead(lead)}
                                      className={`px-2 py-0.5 ${theme.cardInner} hover:${theme.hoverBg} border rounded text-[9px] font-black text-blue-600 dark:text-blue-500 cursor-pointer uppercase transition`}
                                    >
                                      View
                                    </button>
                                  ) : (
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">No data</span>
                                  )}
                                </td>
                                <td className="py-3 text-right space-x-1">
                                  <button 
                                    onClick={() => triggerOutboundCall(lead.id)}
                                    className={`p-1.5 ${theme.cardInner} hover:${theme.hoverBg} border rounded-lg text-emerald-500 cursor-pointer transition`}
                                    title="Call Now"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedLeadId(lead.id);
                                      setActiveTab("whatsapp");
                                    }}
                                    className={`p-1.5 ${theme.cardInner} hover:${theme.hoverBg} border rounded-lg text-emerald-500 dark:text-emerald-400 cursor-pointer transition`}
                                    title="WhatsApp Chat"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}



              {/* TAB 5: WHATSAPP HUB (matching screenshot 3 chat layouts) */}
              {activeTab === "whatsapp" && (
                <div className="space-y-6 text-left">
                  <div>
                    <h2 className={`text-base font-black ${theme.textMain} uppercase tracking-tight`}>WhatsApp Live Discussion board</h2>
                    <p className={`text-xs ${theme.textMuted} mt-0.5`}>Admin-takeover console to monitor or directly type replies.</p>
                  </div>

                  <div className={`${theme.cardBg} border rounded-2xl h-[560px] flex overflow-hidden shadow-lg`}>
                    
                    {/* Left: Chat card listings with score badges */}
                    <div className={`w-1/3 border-r ${theme.border} flex flex-col ${theme.cardBg} overflow-y-auto`}>
                      <div className={`p-4 border-b ${theme.border} space-y-3 ${theme.cardInner}`}>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Search chats..."
                            className={`w-full ${theme.inputBg} border rounded-lg pl-8 pr-3 py-1.5 text-xs placeholder-slate-400`}
                          />
                        </div>
                        <div className={`flex gap-1.5 text-[9px] font-black uppercase ${theme.textMuted} border ${theme.border} p-0.5 rounded-lg ${theme.cardInner}`}>
                          {["all", "open", "closed"].map((f) => (
                            <button
                              key={f}
                              onClick={() => setWhatsappActiveFilter(f as any)}
                              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                                whatsappActiveFilter === f ? "bg-blue-600 text-white" : `hover:${theme.textMain}`
                              }`}
                            >
                              {f === "open" ? "24h Open" : f}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={`divide-y ${theme.divider}`}>
                        {leads
                          .filter(l => l.phone)
                          .map((lead) => {
                            const isSelected = lead.id === selectedLeadId;
                            const phoneMessages = messages.filter(m => normalizePhone(m.phone) === normalizePhone(lead.phone));
                            const lastMsg = phoneMessages.length > 0 ? phoneMessages[phoneMessages.length - 1] : null;

                            // Intent state mappings matching screenshot 3
                            const intentState = lead.lead_status === 'won' ? 'Interested' :
                                                lead.lead_status === 'lost' ? 'Attempting' : 'Connected';
                            
                            const intentColor = 
                              intentState === 'Interested' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' :
                              intentState === 'Attempting' ? 'bg-rose-950/20 text-rose-400 border-rose-900/30' :
                              'bg-blue-950/20 text-blue-400 border-blue-900/30';

                            return (
                              <div
                                key={lead.id}
                                onClick={() => setSelectedLeadId(lead.id)}
                                className={`p-4 flex items-start gap-3 hover:${theme.hoverBg} transition cursor-pointer text-left ${
                                  isSelected ? theme.selectedBg : ""
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-full ${theme.cardInner} border ${theme.border} ${theme.textMain} flex items-center justify-center font-extrabold shrink-0`}>
                                  {lead.name ? lead.name.charAt(0) : "C"}
                                </div>
                                <div className="space-y-1 truncate w-full">
                                  <div className="flex justify-between items-center">
                                    <span className={`font-extrabold text-xs ${theme.textMain} truncate max-w-[110px]`}>{lead.name || "Customer"}</span>
                                    <span className={`${theme.cardInner} border ${theme.border} text-[8px] font-black px-1.5 py-0.5 rounded ${theme.textMuted} shrink-0`}>
                                      {lead.ai_rank_score || 50}
                                    </span>
                                  </div>
                                  <div className={`text-[9px] ${theme.textMuted} font-bold block`}>📞 {lead.phone}</div>
                                  
                                  {/* Subline detail row */}
                                  <div className="flex gap-1.5 items-center mt-1">
                                    <span className={`text-[7px] font-black uppercase px-1 py-0.2 rounded border ${intentColor}`}>
                                      {intentState}
                                    </span>
                                    <span className={`text-[9px] ${theme.textLight} truncate font-semibold block italic`}>
                                      {lastMsg ? lastMsg.body : "No messaging history"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Chat Board Pane */}
                    <div className={`flex-1 flex flex-col ${theme.mainBg}`}>
                      {selectedLeadId && selectedLead ? (
                        <div className="flex-1 flex flex-col justify-between overflow-hidden">
                          
                          {/* Chat Pane Header */}
                          <div className={`p-4 border-b ${theme.border} ${theme.cardInner} flex items-center justify-between`}>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-900/30 flex items-center justify-center font-extrabold">
                                {selectedLead.name ? selectedLead.name.charAt(0) : "C"}
                              </div>
                              <div className="text-left font-bold">
                                <span className={`text-xs ${theme.textMain} block`}>{selectedLead.name}</span>
                                <span className="text-[9px] text-emerald-500 block flex items-center gap-1">● AI Auto-Agent Active</span>
                              </div>
                            </div>
                            <span className={`text-xs font-bold ${theme.textMuted}`}>{selectedLead.phone}</span>
                          </div>

                          {/* Chat message bubbles */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                            {chatLoading ? (
                              <div className="flex-1 flex justify-center items-center">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                              </div>
                            ) : chatMessages.length === 0 ? (
                              <div className={`flex-1 flex flex-col justify-center items-center ${theme.textMuted} p-8 border border-dashed ${theme.border} rounded-2xl`}>
                                <MessageCircle className="w-8 h-8 mb-2 text-slate-400" />
                                <span className="text-[10px] font-black uppercase">No chat logs recorded</span>
                              </div>
                            ) : (
                              chatMessages.map((msg) => {
                                const isOutbound = msg.direction === 'outbound';
                                return (
                                  <div
                                    key={msg.id}
                                    className={`max-w-[75%] rounded-2xl p-3 text-xs text-left leading-relaxed ${
                                      isOutbound
                                        ? 'bg-emerald-600 text-white self-end rounded-tr-none'
                                        : `${darkMode ? 'bg-slate-900 text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-800 border border-slate-200/80'} self-start rounded-tl-none`
                                    }`}
                                  >
                                    {isOutbound && (
                                      <div className="text-[7px] font-black uppercase text-emerald-200 block mb-1">
                                        🤖 AI Reply
                                      </div>
                                    )}
                                    <p className="font-semibold whitespace-pre-wrap">{msg.body}</p>
                                    <span className={`text-[8px] ${isOutbound ? 'text-emerald-200' : 'text-slate-500'} block mt-1.5 text-right font-bold`}>
                                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                );
                              })
                            )}
                            <div ref={chatEndRef} />
                          </div>

                          {/* Quick reply message form */}
                          <form onSubmit={handleSendCustomMessage} className={`p-4 border-t ${theme.border} ${theme.cardInner} flex gap-2`}>
                            <input
                              type="text"
                              placeholder={`Reply directly to ${selectedLead.name}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className={`flex-1 ${theme.inputBg} border ${theme.border} focus:border-blue-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs font-semibold placeholder-slate-400`}
                            />
                            <button
                              type="submit"
                              disabled={!replyText.trim()}
                              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                            >
                              <Send className="w-4 h-4" />
                              <span>Reply</span>
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-slate-500">
                          <MessageCircle className="w-12 h-12 text-slate-600 mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-wider">Select thread conversation to view chat</span>
                        </div>
                      )}
                    </div>

                     </div>
                </div>
              )}

              {/* TAB 6: PHONE NUMBERS (matching screenshot 2 Phone Number layouts) */}
              {activeTab === "phone-numbers" && (
                <div className="space-y-6 text-left">
                  <div>
                    <h2 className={`text-base font-black ${theme.textMain} uppercase tracking-tight`}>Active Phone Lines & Trunks</h2>
                    <p className={`text-xs ${theme.textMuted} mt-0.5`}>Purchased outbound SIP numbers, compliance status, and details.</p>
                  </div>

                  <div className={`${theme.cardBg} border rounded-2xl overflow-hidden shadow-lg`}>
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className={`${theme.tableHead} border-b ${theme.border} font-black uppercase tracking-wider text-[9px]`}>
                          <th className="p-4">Phone Number</th>
                          <th className="p-4">SIP Trunk ID</th>
                          <th className="p-4">Date Purchased</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">KYC Compliance</th>
                          <th className="p-4">Inbound Agent</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme.divider} font-bold`}>
                        {phoneLinesData.map((line) => (
                          <tr key={line.number} className={`hover:${theme.hoverBg} transition`}>
                            <td className={`p-4 font-extrabold ${theme.textMain}`}>{line.number}</td>
                            <td className={`p-4 ${theme.textMuted}`}>{line.sip}</td>
                            <td className={`p-4 ${theme.textMuted}`}>{line.date}</td>
                            <td className="p-4">
                              {line.price === "Outbound Only" ? (
                                <span className={`${theme.cardInner} border ${theme.border} px-2 py-0.5 rounded text-[10px] font-black ${theme.textMuted}`}>{line.price}</span>
                              ) : (
                                <span className={theme.textMain}>{line.price}</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                                line.kyc === "Approved" ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30" : "bg-amber-950/20 text-amber-400 border-amber-900/30"
                              }`}>
                                {line.kyc}
                              </span>
                            </td>
                            <td className={`p-4 ${theme.textMuted} font-semibold`}>{line.inbound}</td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => alert("Connecting SIP lines trunk is fully integrated with voice service.")}
                                className={`px-3 py-1 ${theme.cardInner} hover:${theme.hoverBg} border ${theme.border} ${theme.textMuted} hover:${theme.textMain} rounded text-[9px] font-black uppercase cursor-pointer transition`}
                              >
                                Contact Us
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 7: SCHEDULED CALLS CALLBACK QUEUE */}
              {activeTab === "scheduled" && (() => {
                // Compute filtered scheduled leads
                const filteredScheduledLeads = leads.filter(l => {
                  const isScheduled = l.call_status === 'scheduled' || l.scheduled_call_at;
                  if (!isScheduled) return false;

                  if (l.scheduled_call_at) {
                    const getLocalDateStr = (dateVal: string | Date) => {
                      const d = new Date(dateVal);
                      const offset = d.getTimezoneOffset();
                      const localDate = new Date(d.getTime() - offset * 60 * 1000);
                      return localDate.toISOString().split("T")[0];
                    };
                    
                    const clientTodayStr = getLocalDateStr(new Date());
                    const clientTomorrowStr = getLocalDateStr(new Date(Date.now() + 24 * 60 * 60 * 1000));
                    const leadDateStr = getLocalDateStr(l.scheduled_call_at);

                    if (scheduledDateFilter === "today" && leadDateStr !== clientTodayStr) return false;
                    if (scheduledDateFilter === "tomorrow" && leadDateStr !== clientTomorrowStr) return false;
                    if (scheduledDateFilter === "custom" && scheduledCustomDate && leadDateStr !== scheduledCustomDate) return false;
                  } else {
                    if (scheduledDateFilter !== "all") return false;
                  }

                  if (scheduledTypeFilter === "new") {
                    const isNew = l.lead_status === 'new' || l.lead_status === 'open' || !l.follow_up_scheduled;
                    if (!isNew) return false;
                  } else if (scheduledTypeFilter === "followup") {
                    const isFollowUp = l.follow_up_scheduled === true || l.lead_status === 'callback';
                    if (!isFollowUp) return false;
                  } else if (scheduledTypeFilter === "reminder") {
                    const isReminder = l.lead_status === 'interested' || l.lead_status === 'connected';
                    if (!isReminder) return false;
                  }

                  return true;
                });

                return (
                  <div className="space-y-6 text-left">
                    <div>
                      <h2 className={`text-base font-black uppercase tracking-tight ${theme.textMain}`}>Scheduled Callback Queue</h2>
                      <p className={`text-xs ${theme.textMuted} mt-0.5`}>List of qualified follow-up leads calls that are scheduled for outbound callback.</p>
                    </div>

                    {/* Queue Filters */}
                    <div className={`${theme.cardBg} border rounded-2xl p-4 flex flex-wrap gap-6 items-end text-[10px] font-black uppercase tracking-wider`}>
                      {/* Date filter group */}
                      <div className="space-y-1.5">
                        <span className={`${theme.textMuted} block`}>Date Filter</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className={`flex gap-1 ${theme.cardInner} p-0.5 rounded-lg border ${theme.border}`}>
                            {[
                              { id: "today", label: "Today" },
                              { id: "tomorrow", label: "Tomorrow" },
                              { id: "all", label: "All" },
                              { id: "custom", label: "Custom Date" }
                            ].map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setScheduledDateFilter(item.id as any)}
                                className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                                  scheduledDateFilter === item.id ? "bg-blue-600 text-white" : `${theme.textMuted} hover:text-blue-500`
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>

                          {scheduledDateFilter === "custom" && (
                            <input
                              type="date"
                              value={scheduledCustomDate}
                              onChange={(e) => setScheduledCustomDate(e.target.value)}
                              className={`px-2.5 py-1.5 rounded-lg border ${theme.border} ${theme.inputBg} font-black text-xs cursor-pointer focus:outline-none focus:border-blue-500`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Call Type filter group */}
                      <div className="space-y-1.5">
                        <span className={`${theme.textMuted} block`}>Call Type</span>
                        <div className={`flex gap-1 ${theme.cardInner} p-0.5 rounded-lg border ${theme.border}`}>
                          {[
                            { id: "all", label: "All Types" },
                            { id: "new", label: "New Lead Calls" },
                            { id: "followup", label: "Follow-up Calls" },
                            { id: "reminder", label: "Reminder Calls" }
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setScheduledTypeFilter(item.id as any)}
                              className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                                scheduledTypeFilter === item.id ? "bg-blue-600 text-white" : `${theme.textMuted} hover:text-blue-500`
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6 h-[550px] items-stretch overflow-hidden relative">
                      
                      {/* Left: Queue Table */}
                      <div className={`border ${theme.border} rounded-2xl flex-1 overflow-y-auto ${darkMode ? "bg-slate-900/20" : "bg-white shadow-sm"}`}>
                        {filteredScheduledLeads.length === 0 ? (
                          <div className="h-full flex flex-col justify-center items-center text-slate-500 p-8">
                            <Calendar className="w-10 h-10 text-slate-800 mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-wider">No callbacks scheduled</span>
                          </div>
                        ) : (
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className={`${theme.tableHead} border-b ${theme.border} font-black uppercase tracking-wider text-[9px]`}>
                                <th className="p-4">Lead Name</th>
                                <th className="p-4">Phone Number</th>
                                <th className="p-4">Policy Preferred</th>
                                <th className="p-4">Callback Timing</th>
                                <th className="p-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${theme.divider} font-bold`}>
                              {filteredScheduledLeads.map((lead) => {
                                const isSelected = lead.id === selectedLeadId;
                                const policyName = getPolicyName(lead.recommended_plan_id || lead.policy || "");
                                
                                return (
                                  <tr 
                                    key={lead.id}
                                    onClick={() => setSelectedLeadId(lead.id)}
                                    className={`hover:${theme.hoverBg} transition cursor-pointer ${
                                      isSelected ? theme.selectedBg : ""
                                    }`}
                                  >
                                    <td className={`p-4 font-extrabold ${theme.textMain}`}>{lead.name || "N/A"}</td>
                                    <td className={`p-4 ${theme.textMuted}`}>{lead.phone}</td>
                                    <td className="p-4 font-bold">
                                      <span className={`bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border ${theme.border} text-[8px] font-black uppercase ${theme.textMuted}`}>
                                        {policyName.replace("Star ", "")}
                                      </span>
                                    </td>
                                    <td className="p-4 text-blue-500 dark:text-blue-400 font-black">
                                      {new Date(lead.scheduled_call_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                                      <button
                                        onClick={() => triggerOutboundCall(lead.id)}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[9px] font-black uppercase cursor-pointer"
                                      >
                                        Call Now
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>

                      {/* Right: Jira detail viewer drawer */}
                      <div className={`w-80 ${theme.cardBg} border rounded-2xl overflow-hidden hidden md:flex flex-col`}>
                        {selectedLeadId && selectedLead ? (
                          <div className={`p-4 space-y-4 text-xs font-bold ${theme.textMuted} text-left`}>
                            <div>
                              <span className={`text-[9px] ${theme.textLight} block uppercase`}>Selected Queue Lead</span>
                              <h4 className={`text-sm font-black ${theme.textMain} mt-0.5`}>{selectedLead.name}</h4>
                            </div>
                            
                            <div className={`${theme.cardInner} p-3 rounded-xl border ${theme.border} space-y-2 text-[11px] font-bold ${theme.textMuted}`}>
                              <div>📞 {selectedLead.phone}</div>
                              <div>🎂 Age: {selectedLead.age || "N/A"}</div>
                              <div>🏙️ City: {selectedLead.city || "N/A"}</div>
                              <div>📋 Policy: {getPolicyName(selectedLead.recommended_plan_id || selectedLead.policy || "").replace("Star ", "")}</div>
                            </div>

                            <div className="text-left space-y-1">
                              <span className={`text-[9px] ${theme.textLight} uppercase block`}>Last AI Call Summary</span>
                              <div className={`${theme.cardInner} border ${theme.border} p-3 rounded-xl text-[10px] ${theme.textMuted} italic font-semibold leading-relaxed`}>
                                {selectedLead.call_summary ? `"${selectedLead.call_summary}"` : "No call logs registered"}
                              </div>
                            </div>

                            <div className="space-y-2 pt-2">
                              <button
                                onClick={() => triggerOutboundCall(selectedLead.id)}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1 shadow"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Call Now</span>
                              </button>
                              <button
                                onClick={() => updateCallDetails(selectedLead.id, 'pending')}
                                className={`w-full py-2 ${theme.cardInner} hover:${theme.hoverBg} border ${theme.border} ${theme.textMuted} rounded-xl text-xs font-black uppercase cursor-pointer`}
                              >
                                Cancel Call
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col justify-center items-center text-slate-500">
                            <Calendar className="w-8 h-8 text-slate-400 mb-1" />
                            <span className="text-[9px] font-black uppercase tracking-wider">Select lead from list</span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })()}

            </div>
          )}
        </main>
      </div>

      {/* AI Call Analysis structured modal popup matching screenshot 5 */}
      {aiAnalysisLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-between items-center">
              <div className="text-left">
                <h3 className={`text-xs font-black ${theme.textMain} uppercase tracking-wider`}>AI Call Analysis</h3>
                <span className={`text-[9px] ${theme.textMuted} font-bold uppercase`}>{aiAnalysisLead.phone}</span>
              </div>
              <button 
                onClick={() => setAiAnalysisLead(null)}
                className={`p-1 hover:${theme.hoverBg} rounded transition cursor-pointer`}
              >
                <X className={`w-4 h-4 ${theme.textMuted} hover:${theme.textMain}`} />
              </button>
            </div>

            {/* Modal Body showing structured breakdown block exactly like screenshot 5 */}
            <div className="p-5 overflow-y-auto space-y-4 text-left font-mono text-[11px] leading-relaxed text-blue-600 dark:text-blue-300 bg-slate-50 dark:bg-slate-950/60">
              <pre className="whitespace-pre-wrap select-text selection:bg-blue-600/30">
{`{
  "summary": "${aiAnalysisLead.call_summary || "Call summary transcripts completed."}",
  "sentiment": "${aiAnalysisLead.interest_level === 'high' || aiAnalysisLead.lead_type === 'hot' ? 'positive' : 'neutral'}",
  "json_output": {
    "key_points": [
      "User name is ${aiAnalysisLead.name || 'N/A'}.",
      "Recommended plan is ${getPolicyName(aiAnalysisLead.recommended_plan_id || aiAnalysisLead.policy || 'N/A')}.",
      "Budget category preferred: ${aiAnalysisLead.budget || 'moderate'}.",
      "User pre-existing conditions: ${aiAnalysisLead.pre_existing_diseases && aiAnalysisLead.pre_existing_diseases.length > 0 ? aiAnalysisLead.pre_existing_diseases.join(', ') : 'none'}."
    ],
    "action_items": [
      "Update lead status based on customer purchase triggers.",
      "Send follow-up details on policy restoration benefits."
    ],
    "outcome": "${aiAnalysisLead.ai_rank_explanation || 'Lead call completed and converted based on standard terms.'}"
  }
}`}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end">
              <button
                onClick={() => setAiAnalysisLead(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-[10px] font-black uppercase cursor-pointer"
              >
                Close Analysis
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Connect an Integration Modal (matching screenshot 4) */}
      {integrationsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col text-left">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-between items-center">
              <div>
                <h3 className={`text-xs font-black ${theme.textMain} uppercase tracking-wider`}>Connect an Integration</h3>
                <span className={`text-[9px] ${theme.textMuted} font-bold uppercase block mt-0.5`}>Choose source to automatically sync contacts</span>
              </div>
              <button 
                onClick={() => setIntegrationsOpen(false)}
                className={`p-1 hover:${theme.hoverBg} rounded cursor-pointer transition ${theme.textMuted} hover:${theme.textMain}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Integration Grid Layout matching screenshot 4 */}
            <div className="p-5 grid grid-cols-2 gap-3 text-xs font-black uppercase tracking-wider">
              
              <div className={`border ${theme.border} hover:border-slate-300 dark:hover:border-slate-700 p-4 rounded-xl space-y-2 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 cursor-pointer`}>
                <span className="text-emerald-400 block font-black">💬 WhatsApp</span>
                <span className={`text-[8px] font-semibold ${theme.textMuted} block normal-case`}>Pull leads from WhatsApp Business</span>
                <span className={`text-[7px] ${theme.textLight} block`}>Set up →</span>
              </div>

              <div className="border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/5 p-4 rounded-xl space-y-2 cursor-pointer flex flex-col justify-between text-slate-800 dark:text-slate-200">
                <div>
                  <span className="text-blue-400 block font-black">👤 Meta Ads</span>
                  <span className="text-[8px] font-semibold text-slate-500 dark:text-slate-400 block normal-case">Facebook & Instagram lead forms</span>
                </div>
                <span className="bg-blue-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded w-fit uppercase">● Connected</span>
              </div>

              <div className={`border ${theme.border} hover:border-slate-300 dark:hover:border-slate-700 p-4 rounded-xl space-y-2 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 cursor-pointer`}>
                <span className="text-emerald-500 block font-black">📊 Google Sheets</span>
                <span className={`text-[8px] font-semibold ${theme.textMuted} block normal-case`}>Sync contacts from a spreadsheet</span>
              </div>

              <div className={`border ${theme.border} hover:border-slate-300 dark:hover:border-slate-700 p-4 rounded-xl space-y-2 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 cursor-pointer`}>
                <span className="text-amber-500 block font-black">📞 JustDial</span>
                <span className={`text-[8px] font-semibold ${theme.textMuted} block normal-case`}>Pull JustDial leads in real-time</span>
              </div>

              <div className={`border ${theme.border} hover:border-slate-300 dark:hover:border-slate-700 p-4 rounded-xl space-y-2 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 cursor-pointer`}>
                <span className="text-orange-500 block font-black">💼 IndiaMart</span>
                <span className={`text-[8px] font-semibold ${theme.textMuted} block normal-case`}>Import buyer enquiries automatically</span>
              </div>

              <div className={`border ${theme.border} hover:border-slate-300 dark:hover:border-slate-700 p-4 rounded-xl space-y-2 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 cursor-pointer`}>
                <span className={`text-slate-500 dark:text-slate-400 block font-black`}>🧩 Other Source</span>
                <span className={`text-[8px] font-semibold ${theme.textMuted} block normal-case`}>Custom HTTP webhook / API sync</span>
              </div>

            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end">
              <button
                onClick={() => setIntegrationsOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-xl text-[10px] font-black uppercase cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
