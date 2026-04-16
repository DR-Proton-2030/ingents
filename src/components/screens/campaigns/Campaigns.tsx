"use client";
import React, { useState } from "react";
import Layout from "@/screens/layout/Layout";
import { useCampaigns } from "@/hooks/useCampaigns";

// Modular Components
import CampaignHeader from "./components/CampaignHeader";
import CampaignEmptyState from "./components/CampaignEmptyState";
import CampaignCard from "./components/CampaignCard";
import CampaignTypeSelection from "./components/CampaignTypeSelection";
import CampaignForm from "./components/CampaignForm";
import CampaignPreview from "./components/CampaignPreview";
import CampaignGrid from "./components/CampaignGrid";

type ViewState = "overview" | "create_selection" | "create_details";

const Campaigns: React.FC = () => {
  const {
    campaigns,
    loading,
    handleCreateCampaign,
    handleDeleteCampaign,
    handleUpdateStatus
  } = useCampaigns();

  const [view, setView] = useState<ViewState>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [campaignType, setCampaignType] = useState<"social_broadcaster" | "whatsapp_messenger">("social_broadcaster");
  const [name, setName] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [frequency, setFrequency] = useState("once");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setScheduledTime("09:00");
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
        recurring_days: frequency === "recurring" ? selectedDays : [],
        scheduled_time: frequency === "recurring" ? scheduledTime : undefined,
      });
      resetForm();
      setView("overview");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-4 space-y-8 animate-in fade-in duration-500 pb-20">

        {/* <CampaignHeader
          view={view}
          hasCampaigns={campaigns.length > 0}
          onBack={() => setView(view === "create_details" ? "create_selection" : "overview")}
          onSearch={setSearchQuery}
          onCreateClick={() => setView("create_selection")}
        /> */}

        {/* --- VIEW: OVERVIEW --- */}
        {view === "overview" && (
          <div className="min-h-[60vh]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Syncing Campaigns...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <CampaignEmptyState onCreateClick={() => setView("create_selection")} />
            ) : (
              <CampaignGrid 
                campaigns={filteredCampaigns} 
                onDeleteCampaign={handleDeleteCampaign} 
                onUpdateStatus={handleUpdateStatus} 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCreateClick={() => setView("create_selection")}
              />
            )}
          </div>
        )}

        {/* --- VIEW: CREATE SELECTION --- */}
        {view === "create_selection" && (
          <div className="pt-10">
            <CampaignTypeSelection onSelect={handleSelectType} />
          </div>
        )}

        {/* --- VIEW: CREATE DETAILS --- */}
        {view === "create_details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4 h-[80vh] overflow-y-auto">
            <CampaignForm
              name={name}
              setName={setName}
              messageContent={messageContent}
              setMessageContent={setMessageContent}
              frequency={frequency}
              setFrequency={setFrequency}
              selectedDays={selectedDays}
              toggleDay={toggleDay}
              scheduledTime={scheduledTime}
              setScheduledTime={setScheduledTime}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              campaignType={campaignType}
            />
            <CampaignPreview messageContent={messageContent} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Campaigns;
