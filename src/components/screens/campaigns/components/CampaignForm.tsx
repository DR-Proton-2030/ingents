import React, { useContext, useState } from "react";
import {
  ClockCircle,
  Calendar,
  Settings,
  CheckRead,
  Share,
  RoundAltArrowRight,
  RoundAltArrowLeft,
  ChatSquare,
  Play
} from "@solar-icons/react";
import AuthContext from "@/contexts/authContext/authContext";

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
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const hasFacebook = user ? !!(user.facebook?.access_token && user.facebook?.project_id) : false;
  const hasInstagram = user ? !!user.instagram?.access_token : false;
  const hasYouTube = user ? !!user.youtube?.access_token : false;
  const hasX = user ? !!(user as any).x?.access_token : false;

  const connectedSocialsCount = [hasFacebook, hasInstagram, hasYouTube, hasX].filter(Boolean).length;

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStep1Valid = name.trim().length > 0 && messageContent.trim().length > 0;
  const isStep2Valid = campaignType === 'whatsapp_messenger' || connectedSocialsCount > 0;
  const isStep3Valid = frequency === 'once' || (frequency === 'recurring' && selectedDays.length > 0);

  return (
    <div className="lg:col-span-2 flex flex-col h-full bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden">

      {/* Stepper Header */}
      <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white/40">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-gray-100 text-gray-400'}`}>1</div>
          <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-gray-100 text-gray-400'}`}>2</div>
          <div className={`w-12 h-1 rounded-full transition-colors ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-gray-100 text-gray-400'}`}>3</div>
        </div>

      </div>

      <div className="p-10 flex-1 relative overflow-hidden">

        {/* Step 1: Content */}
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-blue-500 rounded-full" />
              <h4 className="text-sm  font-bold text-gray-900 uppercase tracking-wider">Basic Information</h4>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2  ml-1">Campaign Title</label>
              <input
                type="text"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q4 Growth Sprint"
                className="w-full px-6 py-3 bg-gray-100  rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2  ml-1">Marketing Copy</label>
              <textarea
                rows={6}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Inject personality into your message..."
                className="w-full px-6 py-3 rounded-2xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none "
              />
            </div>
          </div>
        )}

        {/* Step 2: Target Channels */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-green-500 rounded-full" />
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Target Channels Review</h4>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              These are the active profiles that will broadcast this campaign.
            </p>
            <div className="flex flex-col gap-4 max-w-sm">
              {campaignType === 'social_broadcaster' ? (
                <>
                  {connectedSocialsCount === 0 && (
                    <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-center text-red-600 font-bold">
                      No linked profiles found! Please connect accounts in settings.
                    </div>
                  )}
                  {hasFacebook && (
                    <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4 transition-all hover:bg-blue-100/50 shadow-sm">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">f</div>
                      <span className="text-sm font-base text-gray-700">Facebook Page</span>
                    </div>
                  )}
                  {hasInstagram && (
                    <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100 flex items-center gap-4 transition-all hover:bg-pink-100/50 shadow-sm">
                      <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                        <div className="w-5 h-5 border-[2.5px] border-white rounded-md" />
                      </div>
                      <span className="text-sm font- text-gray-700">Instagram</span>
                    </div>
                  )}
                  {hasYouTube && (
                    <div className="p-3 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4 transition-all hover:bg-red-100/50 shadow-sm">
                      <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white">
                        <Play size={20} />
                      </div>
                      <span className="text-sm font- text-gray-700">YouTube</span>
                    </div>
                  )}
                  {hasX && (
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4 transition-all hover:bg-gray-100/50 shadow-sm">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold tracking-widest text-lg">𝕏</div>
                      <span className="text-sm font- text-gray-700">X (Twitter)</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-4 shadow-sm">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                    <ChatSquare size={20} />
                  </div>
                  <span className="text-base font-bold text-gray-700">Direct WhatsApp Inbox</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Scheduling */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full" />
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Release Schedule</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setFrequency("once")}
                className={`p-4 rounded-3xl  cursor-pointer transition-all flex flex-col gap-4 ${frequency === "once" ? "border-orange-500 bg-gray-100 " : "border-gray-100 bg-gray-50/50 hover:border-gray-200"}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${frequency === "once" ? "bg-orange-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-md">One-time Blast</p>
                  <p className="text-xs text-gray-500 mt-1">Deploy campaign immediately after creation.</p>
                </div>
              </div>

              <div
                onClick={() => setFrequency("recurring")}
                className={`p-6 rounded-3xl  cursor-pointer transition-all flex flex-col gap-4 ${frequency === "recurring" ? "border-orange-500 bg-gray-100 " : "border-gray-100 bg-gray-50/50 hover:border-gray-200"}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${frequency === "recurring" ? "bg-orange-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                  <Settings size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-md">Automated Routine</p>
                  <p className="text-xs text-gray-500 mt-1">Repeats automatically on chosen days.</p>
                </div>
              </div>
            </div>

            {frequency === "recurring" && (
              <div className="bg-gray-100 p-4 rounded-2xl space-y-6 animate-in slide-in-from-bottom-2 duration-300  mt-4">
                <p className="text-sm font-bold text-gray-700  text-center flex items-center justify-center gap-2">
                  Active Delivery Days
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {days.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`flex-1 min-w-[60px] py-2.5 rounded-xl font- text-sm transition-all duration-300 ${selectedDays.includes(day) ? "bg-orange-500 text-white shadow-orange-500/30 scale-105" : "bg-gray-200 text-gray-600 border border-white/10 hover:border-white/30"}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-10 py-3 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center rounded-b-2xl">
        <button
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
        >
          <RoundAltArrowLeft size={20} /> Back
        </button>

        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
            className="bg-black/80 hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed text-white /10 px-8 py-3 rounded-full font- 
            transition-all flex items-center gap-2"
          >
            Review Setup <RoundAltArrowRight size={20} />
          </button>
        ) : (
          <button
            disabled={!isStep3Valid || isSubmitting}
            onClick={onSubmit}
            className="bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-3 rounded-full font-bold transition-all shadow-2xl shadow-gray-400 active:scale-95 flex items-center gap-2"
          >
            {isSubmitting ? "Deploying..." : "Launch Campaign"}
            {!isSubmitting && <RoundAltArrowRight size={20} className="text-orange-400" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default CampaignForm;
