import React from "react";
import { Boombox } from "@solar-icons/react";

interface CampaignEmptyStateProps {
  onCreateClick: () => void;
}

const CampaignEmptyState: React.FC<CampaignEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="bg-white/70 w-full max-w-2xl mx-auto mt-20 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 ">
      <Boombox className="text-orange-600/50 mt-3" size={80} />
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-black/80">No active campaigns yet</h2>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          Ready to grow? Launch a multi-channel campaign across Social Media and WhatsApp to reach your users.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="bg-gray-100 mt-2 hover:bg-gray-200 cursor-pointer text-black/70 px-8 py-3 rounded-xl font-semibold transition-all "
      >
        Let's create a campaign
      </button>
    </div>
  );
};

export default CampaignEmptyState;
