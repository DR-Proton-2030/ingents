"use client";
import React, { useState } from "react";
import Layout from "@/screens/layout/Layout";
import { 
  Flag, 
  AddCircle, 
  Magnifer, 
  Share, 
  Letter, 
  RoundAltArrowRight,
  ClockCircle,
  Calendar,
  Settings,
  ArrowLeft,
  CheckRead,
  TrashBinMinimalistic
} from "@solar-icons/react";
import { useCampaigns } from "@/hooks/useCampaigns";

type ViewState = "overview" | "create_selection" | "create_details";

const Campaigns: React.FC = () => {
  const { campaigns, loading, handleCreateCampaign, handleDeleteCampaign, handleUpdateStatus } = useCampaigns();
  const [view, setView] = useState<ViewState>("overview");
  
  // Form State
  const [campaignType, setCampaignType] = useState<"social_broadcaster" | "whatsapp_messenger">("social_broadcaster");
  const [name, setName] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [frequency, setFrequency] = useState("once");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSelectType = (type: "social_broadcaster" | "whatsapp_messenger") => {
    setCampaignType(type);
    setView("create_details");
  };

  const resetForm = () => {
    setName("");
    setMessageContent("");
    setFrequency("once");
    setSelectedDays([]);
  };

  const handleSubmit = async () => {
    if (!name || !messageContent) return;
    setIsSubmitting(true);
    try {
      await handleCreateCampaign({
        name,
        type: campaignType,
        message_content: messageContent,
        frequency,
        recurring_days: frequency === "recurring" ? selectedDays : []
      });
      resetForm();
      setView("overview");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6 animate-in fade-in duration-500">
        
        {/* Header Logic */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {view !== "overview" && (
              <button 
                onClick={() => setView(view === "create_details" ? "create_selection" : "overview")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {view === "overview" ? "Campaigns" : view === "create_selection" ? "Select Campaign Type" : "Campaign Details"}
              </h1>
              <p className="text-gray-500 text-sm">
                {view === "overview" ? "Manage and track your marketing efforts" : "Follow the steps to launch your campaign"}
              </p>
            </div>
          </div>
          
          {view === "overview" && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  className="pl-10 pr-4 py-2 bg-white/50 backdrop-blur-md border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all w-64"
                />
              </div>
              <button 
                onClick={() => setView("create_selection")}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20 active:scale-95"
              >
                <AddCircle className="w-5 h-5" />
                New Campaign
              </button>
            </div>
          )}
        </div>

        {/* --- VIEW: OVERVIEW --- */}
        {view === "overview" && (
          <>
            {loading ? (
               <div className="flex justify-center items-center h-64"><p>Loading campaigns...</p></div>
            ) : campaigns.length === 0 ? (
              <div className="bg-white/40 backdrop-blur-3xl border border-white/50 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-[2.5rem] flex items-center justify-center text-orange-500 mb-2 rotate-3 shadow-inner">
                  <Flag className="w-12 h-12" iconStyle="Bold" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">No active campaigns yet</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Ready to grow? Launch a multi-channel campaign across Social Media and WhatsApp to reach your users where they are.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={() => setView("create_selection")}
                    className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
                  >
                    Create your first campaign
                  </button>
                  <button className="text-orange-600 font-medium hover:underline text-sm">
                    View Campaign Strategy Guide
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {campaigns.map((camp: any) => (
                   <div key={camp._id} className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all relative">
                     <div className="flex justify-between items-start mb-4">
                       <div className={`p-3 rounded-xl ${camp.type === 'social_broadcaster' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                         {camp.type === 'social_broadcaster' ? <Share size={24} /> : <CheckRead size={24} />}
                       </div>
                       <div className="flex items-center gap-2">
                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${camp.status === 'active' ? 'bg-green-100 text-green-700' : camp.status === 'paused' ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-700'}`}>
                           {camp.status.toUpperCase()}
                         </span>
                         <button onClick={() => handleDeleteCampaign(camp._id)} className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                           <TrashBinMinimalistic size={18} />
                         </button>
                       </div>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{camp.name}</h3>
                     <p className="text-sm text-gray-500 mb-4 line-clamp-2">{camp.message_content}</p>
                     
                     <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                           {camp.frequency === 'recurring' ? <Settings size={14}/> : <Calendar size={14}/>}
                           <span className="capitalize">{camp.frequency}</span>
                           {camp.recurring_days?.length > 0 && <span>({camp.recurring_days.join(", ")})</span>}
                        </div>
                        {camp.status === 'active' ? (
                          <button onClick={() => handleUpdateStatus(camp._id, 'paused')} className="text-xs font-semibold text-orange-600 hover:underline">Pause</button>
                        ) : camp.status === 'paused' ? (
                          <button onClick={() => handleUpdateStatus(camp._id, 'active')} className="text-xs font-semibold text-green-600 hover:underline">Resume</button>
                        ) : null}
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </>
        )}

        {/* --- VIEW: CREATE SELECTION --- */}
        {view === "create_selection" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-5 duration-500">
            <div 
              onClick={() => handleSelectType("social_broadcaster")}
              className="group cursor-pointer bg-white/60 hover:bg-white backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all relative overflow-hidden flex flex-col items-start"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Share size={32} iconStyle="Bold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Social Broadcaster</h3>
              <p className="text-gray-500 mt-2 leading-relaxed">
                Post simultaneously to Facebook, Instagram, and LinkedIn. Perfect for brand awareness and news.
              </p>
              <div className="mt-8 flex items-center gap-2 text-orange-600 font-bold group-hover:translate-x-2 transition-transform">
                Get Started <RoundAltArrowRight size={20} />
              </div>
            </div>

            <div 
              onClick={() => handleSelectType("whatsapp_messenger")}
              className="group cursor-pointer bg-white/60 hover:bg-white backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-green-500/10 transition-all relative overflow-hidden flex flex-col items-start"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <CheckRead size={32} iconStyle="Bold" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">WhatsApp Messenger</h3>
              <p className="text-gray-500 mt-2 leading-relaxed">
                Send targeted campaigns directly to your user's WhatsApp. Boasting a 98% open rate for maximum conversion.
              </p>
              <div className="mt-8 flex items-center gap-2 text-orange-600 font-bold group-hover:translate-x-2 transition-transform">
                Get Started <RoundAltArrowRight size={20} />
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: CREATE DETAILS (RECURRING OPTION) --- */}
        {view === "create_details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-5 duration-500">
            
            {/* Left: Input Form */}
            <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] space-y-6 flex-1">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Summer Flash Sale"
                    className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message Content</label>
                  <textarea 
                    rows={4}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Write your amazing message here..."
                    className="w-full px-5 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <ClockCircle size={20} className="text-orange-500" />
                    <h4 className="font-bold">Advanced Scheduling</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setFrequency("once")}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${frequency === "once" ? "border-orange-500 bg-orange-50/50 ring-1 ring-orange-500" : "border-gray-200 hover:border-orange-300"}`}
                    >
                      <Calendar size={20} className={frequency === "once" ? "text-orange-600" : "text-gray-400"} />
                      <div>
                        <p className="font-bold text-sm">One-time</p>
                        <p className="text-xs text-gray-500">Send only once</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setFrequency("recurring")}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${frequency === "recurring" ? "border-orange-500 bg-orange-50/50 ring-1 ring-orange-500" : "border-gray-200 hover:border-orange-300"}`}
                    >
                      <Settings size={20} className={frequency === "recurring" ? "text-orange-600" : "text-gray-400"} />
                      <div>
                        <p className="font-bold text-sm">Recurring</p>
                        <p className="text-xs text-gray-500">Repeat schedule</p>
                      </div>
                    </div>
                  </div>

                  {/* Recurring Controls */}
                  {frequency === "recurring" && (
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4 animate-in zoom-in-95 duration-300">
                      <p className="text-sm font-bold text-gray-700">Select active days</p>
                      <div className="flex gap-2">
                        {days.map(day => (
                          <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${selectedDays.includes(day) ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-white text-gray-500 border border-gray-200 hover:border-orange-200"}`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                        <p className="text-gray-500 flex items-center gap-2">
                          <CheckRead size={14} className="text-green-500" />
                          Recurring {selectedDays.length} days/week
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                 <button 
                  disabled={!name || !messageContent || isSubmitting}
                  onClick={handleSubmit} 
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                 >
                   {isSubmitting ? "Creating..." : "Launch Campaign"}
                 </button>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-[8px] border-gray-800 h-[600px] w-full max-w-[320px] mx-auto text-white overflow-hidden flex flex-col">
                <div className="flex justify-between px-6 pt-2 pb-4">
                  <span className="text-xs font-bold">9:41</span>
                  <div className="flex gap-1.5">
                    <div className="w-4 h-2 bg-white/20 rounded-full" />
                    <div className="w-2 h-2 bg-white/20 rounded-full" />
                  </div>
                </div>
                
                <div className="flex-1 bg-gray-100 rounded-t-[2rem] p-4 text-gray-900 overflow-y-auto hidescroll">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-orange-500 rounded-full" />
                    <div className="h-2 w-20 bg-gray-300 rounded-full" />
                  </div>
                  
                  <div className="space-y-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center text-gray-300 border border-gray-100">
                       Media Preview
                    </div>
                    {messageContent ? (
                       <p className="text-sm text-gray-800 whitespace-pre-wrap">{messageContent}</p>
                    ) : (
                      <div className="space-y-2 pb-2">
                        <div className="h-3 w-full bg-gray-200 rounded-full" />
                        <div className="h-3 w-3/4 bg-gray-200 rounded-full" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-20 flex flex-col items-center justify-center text-center opacity-40">
                    <p className="text-xs font-bold text-gray-400">PREVIEW MODE</p>
                    <p className="text-[10px] text-gray-400">Interact with inputs to see magic</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-6 font-medium">Real-time smartphone preview</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Campaigns;
