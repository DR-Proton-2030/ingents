import React from "react";
import {
  Share,
  CheckRead,
  TrashBinMinimalistic,
  Settings,
  Calendar,
  Flag,
  User,
  Paperclip
} from "@solar-icons/react";

interface CampaignCardProps {
  campaign: any;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  isCompact?: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onDelete, onStatusUpdate, isCompact }) => {
  const isSocial = campaign.type === 'social_broadcaster';

  // Format date nicely if it exists, otherwise fallback
  const dateFormatted = campaign.created_at ? new Date(campaign.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "May 4, 2026";
  const attachmentName = campaign.name.toLowerCase().replace(/\s+/g, '-') + "-brief.pdf";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(campaign._id);
  };

  if (isCompact) {
    // Kanban Specific Design (matching User Mockup exactly)
    return (
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col group relative">
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
        >
          <TrashBinMinimalistic size={16} />
        </button>

        <h3 className="text-sm font-bold text-gray-900 mb-3 pr-8">{campaign.name}</h3>

        {/* Chips Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold tracking-wide capitalize">
            1 {campaign.type.split('_')[0]}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold tracking-wide capitalize">
            {campaign.frequency}
          </span>
        </div>

        {/* Manager Name */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">
            <User size={12} />
          </div>
          <span className="text-xs font-bold text-gray-800">Local Campaign</span>
        </div>

        {/* Flag Date */}
        <div className="flex items-center gap-2 text-gray-500 mb-3">
          <Flag size={14} />
          <span className="text-xs font-medium">{campaign.scheduled_time ? `Scheduled: ${campaign.scheduled_time}` : dateFormatted}</span>
        </div>

        {/* Attachment Pill */}
        {/* <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full w-fit">
          <Paperclip size={12} className="text-gray-500" />
          <span className="text-[10px] font-medium text-gray-600 line-clamp-1 max-w-[150px]">{attachmentName}</span>
        </div> */}
      </div>
    );
  }

  // Fallback / Overview List Design 
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all flex flex-col group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${isSocial ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
          {isSocial ? <Share size={24} /> : <CheckRead size={24} />}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${campaign.status === 'active' ? 'bg-green-100 text-green-700' :
            campaign.status === 'paused' ? 'bg-orange-100 text-orange-700' :
              'bg-gray-200 text-gray-700'
            }`}>
            {campaign.status}
          </span>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
          >
            <TrashBinMinimalistic size={18} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{campaign.name}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4 line-clamp-2 leading-relaxed h-10">
        {campaign.message_content}
      </p>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
          {campaign.frequency === 'recurring' ? <Settings size={14} className="text-orange-500" /> : <Calendar size={14} className="text-blue-500" />}
          <span className="capitalize">{campaign.frequency}</span>
          {campaign.recurring_days?.length > 0 && <span className="text-gray-400">({campaign.recurring_days.join(", ")})</span>}
        </div>
        {campaign.status === 'active' ? (
          <button
            onClick={() => onStatusUpdate(campaign._id, 'paused')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Pause
          </button>
        ) : campaign.status === 'paused' ? (
          <button
            onClick={() => onStatusUpdate(campaign._id, 'active')}
            className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            Resume
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default CampaignCard;
