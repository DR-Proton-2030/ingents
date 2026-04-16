import React from "react";
import { 
  ClockCircle, 
  Calendar, 
  Settings, 
  CheckRead,
  Share,
  Letter,
  RoundAltArrowRight
} from "@solar-icons/react";

interface CampaignFormProps {
  name: string;
  setName: (v: string) => void;
  messageContent: string;
  setMessageContent: (v: string) => void;
  frequency: string;
  setFrequency: (v: string) => void;
  selectedDays: string[];
  toggleDay: (day: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  campaignType: string;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  name,
  setName,
  messageContent,
  setMessageContent,
  frequency,
  setFrequency,
  selectedDays,
  toggleDay,
  onSubmit,
  isSubmitting,
  campaignType
}) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] space-y-8 flex-1 shadow-sm">
        
        {/* Campaign Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-1 h-4 bg-blue-500 rounded-full" />
             <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Basic Information</h4>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase ml-1">Campaign Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Growth Sprint"
              className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase ml-1">Marketing Copy</label>
            <textarea
              rows={5}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Inject personality into your message..."
              className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
            />
          </div>
        </div>

        {/* Target Platforms / Profiles (Visual Only for now as requested) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-1 h-4 bg-green-500 rounded-full" />
             <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Target Channels</h4>
          </div>
          <div className="flex gap-4">
            {campaignType === 'social_broadcaster' ? (
              <>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3 flex-1 opacity-80">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">f</div>
                  <span className="text-sm font-bold text-gray-700">Facebook Page</span>
                </div>
                <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 flex items-center gap-3 flex-1 opacity-80">
                  <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-lg" />
                  <span className="text-sm font-bold text-gray-700">Instagram</span>
                </div>
              </>
            ) : (
              <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
                   <Share size={18} />
                </div>
                <span className="text-sm font-bold text-gray-700">Direct WhatsApp</span>
              </div>
            )}
          </div>
        </div>

        {/* Scheduling */}
        <div className="border-t border-gray-100 pt-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-1 h-4 bg-orange-500 rounded-full" />
             <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Release Schedule</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setFrequency("once")}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${frequency === "once" ? "border-orange-500 bg-orange-50/30" : "border-gray-100 bg-gray-50/30 hover:border-gray-200"}`}
            >
              <div className={`p-3 rounded-2xl ${frequency === "once" ? "bg-orange-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                <Calendar size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">One-time Blast</p>
                <p className="text-xs text-gray-500">Immediate release</p>
              </div>
            </div>
            <div
              onClick={() => setFrequency("recurring")}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${frequency === "recurring" ? "border-orange-500 bg-orange-50/30" : "border-gray-100 bg-gray-50/30 hover:border-gray-200"}`}
            >
              <div className={`p-3 rounded-2xl ${frequency === "recurring" ? "bg-orange-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                <Settings size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Automation</p>
                <p className="text-xs text-gray-500">Weekly repeated flow</p>
              </div>
            </div>
          </div>

          {frequency === "recurring" && (
            <div className="bg-gray-900 p-8 rounded-[2.5rem] space-y-6 animate-in zoom-in-95 duration-300">
              <p className="text-sm font-bold text-gray-300 uppercase tracking-widest text-center">Active Delivery Days</p>
              <div className="flex gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all ${selectedDays.includes(day) ? "bg-orange-500 text-white shadow-xl shadow-orange-500/30 scale-105" : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-orange-400 font-medium">
                Your campaign will auto-deploy every {selectedDays.join(", ") || "selected day"}.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button
          disabled={!name || !messageContent || isSubmitting}
          onClick={onSubmit}
          className="bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-gray-200 active:scale-95 flex items-center gap-2"
        >
          {isSubmitting ? "Launching..." : "Deploy Campaign"}
          {!isSubmitting && <RoundAltArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default CampaignForm;
