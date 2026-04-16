import React, { useState } from "react";
import CampaignCard from "./CampaignCard";
import { AddSquare, WidgetAdd } from "@solar-icons/react";

interface CampaignGridProps {
  campaigns: any[];
  onDeleteCampaign: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const KANBAN_COLUMNS = [
  { id: "active", label: "Active", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  { id: "paused", label: "Paused", color: "bg-gray-100 text-gray-700", dot: "bg-gray-500" },
  { id: "completed", label: "Completed", color: "bg-green-100 text-green-700", dot: "bg-green-500" }
];

const CampaignGrid: React.FC<CampaignGridProps> = ({
  campaigns,
  onDeleteCampaign,
  onUpdateStatus,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData("campaignId", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("campaignId");
    if (id) {
      onUpdateStatus(id, statusId);
    }
    setDraggedId(null);
  };

  return (
    <div className="w-full h-full overflow-x-auto pb-8 pt-2">
      <div className="flex gap-6 min-w-max h-full">
        {KANBAN_COLUMNS.map((column) => {
          const colCampaigns = campaigns.filter(c => c.status === column.id);

          return (
            <div
              key={column.id}
              className="bg-white/50 flex flex-col  w-[350px] rounded-xl shrink-0 h-[80vh] overflow-hidden border border-gray-100"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="p-5 flex items-center justify-between sticky top-0 b z-10 ">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-md text-xs font-bold ${column.color}`}>
                    {column.label}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center  ">
                    {colCampaigns.length}
                  </span>
                </div>
                <span className="text-md text-center ">
                  <WidgetAdd size={20} />
                </span>
              </div>

              {/* Column Body / Cards */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 -mt-4 no-scrollbar">
                {colCampaigns.length === 0 ? (
                  <div className="h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                    Drop campaign here
                  </div>
                ) : (
                  colCampaigns.map((camp: any) => (
                    <div
                      key={camp._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, camp._id)}
                      onDragEnd={() => setDraggedId(null)}
                      className={`cursor-grab active:cursor-grabbing transition-transform ${draggedId === camp._id ? 'opacity-50 scale-95' : 'hover:-translate-y-1'}`}
                    >
                      <CampaignCard
                        campaign={camp}
                        onDelete={onDeleteCampaign}
                        onStatusUpdate={onUpdateStatus}
                        isCompact // if supported, else it's just fine as normal
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignGrid;
