import React from "react";

interface CampaignPreviewProps {
  messageContent: string;
}

const CampaignPreview: React.FC<CampaignPreviewProps> = ({ messageContent }) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-6 bg-gray-900 rounded-[3.5rem] p-4 shadow-2xl border-[12px] border-gray-800 h-[640px] w-full max-w-[320px] mx-auto text-white overflow-hidden flex flex-col group">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500/20 rounded-full ml-auto mr-3 border border-white/5" />
        </div>

        {/* Status Bar */}
        <div className="flex justify-between px-8 pt-4 pb-6 z-10">
          <span className="text-xs font-bold font-mono">9:41</span>
          <div className="flex gap-2">
            <div className="w-4 h-2 bg-white/30 rounded-full" />
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full mt-0.5" />
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 bg-white rounded-t-[2.5rem] p-6 text-gray-900 overflow-y-auto hidescroll relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg" />
            <div className="space-y-1.5">
              <div className="h-2 w-24 bg-gray-100 rounded-full" />
              <div className="h-1.5 w-12 bg-gray-50 rounded-full" />
            </div>
          </div>

          <div className="space-y-5 p-5 bg-white rounded-3xl shadow-2xl shadow-blue-500/5 border border-gray-100 group-hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center text-gray-300 font-bold text-xs uppercase tracking-widest border border-gray-50/50">
               Media Preview
            </div>
            {messageContent ? (
               <p className="text-[13px] text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
                 {messageContent}
               </p>
            ) : (
              <div className="space-y-3 pb-2 opacity-30">
                <div className="h-2 w-full bg-gray-200 rounded-full" />
                <div className="h-2 w-3/4 bg-gray-200 rounded-full" />
                <div className="h-2 w-1/2 bg-gray-200 rounded-full" />
              </div>
            )}
            
            <div className="pt-2 flex gap-4 opacity-40">
               <div className="w-4 h-4 rounded bg-gray-100" />
               <div className="w-4 h-4 rounded bg-gray-100" />
               <div className="w-4 h-4 rounded bg-gray-100 ml-auto" />
            </div>
          </div>

          {/* Background Branding */}
          <div className="mt-32 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 opacity-5 mb-2">
               <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2z"/></svg>
            </div>
            <p className="text-[10px] font-black text-gray-200 uppercase tracking-widest">Live Experience Preview</p>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center space-y-1">
         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Simulated View</p>
         <p className="text-[10px] text-gray-300">Device renders may differ slightly from actual release</p>
      </div>
    </div>
  );
};

export default CampaignPreview;
