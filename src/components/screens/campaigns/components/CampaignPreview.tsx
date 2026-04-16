import React from "react";

interface CampaignPreviewProps {
  messageContent: string;
}

const CampaignPreview: React.FC<CampaignPreviewProps> = ({ messageContent }) => {
  return (
    <div className="lg:col-span-1 flex justify-center">
      <div className="relative bg-black rounded-[2.5rem] p-3 shadow-xl border border-gray-800 h-[560px] w-[280px] text-white overflow-hidden flex flex-col">

        {/* iPhone Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />

        {/* Screen */}
        <div className="flex-1 bg-gray-50 rounded-[2rem] overflow-hidden flex flex-col">

          {/* Status Bar */}
          <div className="flex justify-between items-center px-4 pt-3 pb-1 text-[10px] text-gray-500">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-3 h-1 bg-gray-300 rounded" />
              <div className="w-3 h-1 bg-gray-300 rounded" />
              <div className="w-3 h-1 bg-gray-300 rounded" />
            </div>
          </div>

          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 bg-white">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full" />
            <div>
              <div className="text-xs font-semibold text-gray-900">Brand</div>
              <div className="text-[10px] text-gray-400">Online</div>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-3 overflow-y-auto">
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 max-w-[85%]">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-[10px] text-gray-400">
                Media
              </div>

              {messageContent ? (
                <p className="text-[12px] text-gray-800 leading-relaxed">
                  {messageContent}
                </p>
              ) : (
                <div className="space-y-2 opacity-40">
                  <div className="h-2 w-full bg-gray-200 rounded-full" />
                  <div className="h-2 w-3/4 bg-gray-200 rounded-full" />
                </div>
              )}
            </div>
          </div>

          {/* Input Bar */}
          <div className="px-3 py-2 border-t border-gray-100 bg-white flex items-center gap-2">
            <div className="flex-1 h-8 bg-gray-100 rounded-full" />
            <div className="w-8 h-8 bg-green-500 rounded-full" />
          </div>
        </div>
      </div>


    </div>
  );
};

export default CampaignPreview;
