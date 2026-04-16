import React from "react";
import { ArrowLeft, Magnifer, UserSpeakRounded } from "@solar-icons/react";

interface CampaignHeaderProps {
  view: string;
  onBack: () => void;
  onSearch: (q: string) => void;
  onCreateClick: () => void;
  hasCampaigns: boolean;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  view,
  onBack,
  onSearch,
  onCreateClick,
  hasCampaigns,
}) => {
  const titles: Record<string, string> = {
    overview: "",
    create_selection: "",
    create_details: "Campaign Details",
  };

  const subtitles: Record<string, string> = {
    overview: "",
    create_selection: "",
    create_details: "Follow the steps to launch your campaign",
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {view !== "overview" && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{titles[view]}</h1>
          <p className="text-gray-500 text-sm">{subtitles[view]}</p>
        </div>
      </div>

      {view === "overview" && hasCampaigns && (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search campaigns..."
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white backdrop-blur-md shadow-xl shadow-gray-100 rounded-full focus:outline-none transition-all w-[25rem]"
            />
          </div>
          <button
            onClick={onCreateClick}
            className="flex cursor-pointer items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-blue-500/20"
          >
            <UserSpeakRounded size={24} />
            Create Campaign
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignHeader;
