import React from "react";
import { CheckRead, RoundAltArrowRight, Dialog, CallChat } from "@solar-icons/react";

interface CampaignTypeSelectionProps {
  onSelect: (type: "social_broadcaster" | "whatsapp_messenger") => void;
}

const Card = ({
  icon,
  title,
  subtitle,
  description,
  onClick,
  accent = "neutral",
}: any) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-3xl  bg-white p-6 transition-all shadow-lg shadow-gray-100 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${accent === "green"
            ? "bg-green-50 text-green-600"
            : "bg-blue-100 text-gray-700"
            }`}
        >
          {icon}
        </div>
        <RoundAltArrowRight className="opacity-0 group-hover:opacity-100 transition-all" />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-400 italic mt-1">{subtitle}</p>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const CampaignTypeSelection: React.FC<CampaignTypeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900">
          Choose Campaign Type
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Select how you want to reach your audience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          onClick={() => onSelect("social_broadcaster")}
          icon={<Dialog size={28} />}
          title="Social Broadcaster"
          subtitle="Reach everyone, everywhere"
          description="Post across Facebook, Instagram, and LinkedIn simultaneously. Ideal for announcements and brand visibility."
        />

        <Card
          onClick={() => onSelect("whatsapp_messenger")}
          icon={<CallChat size={28} />}
          title="WhatsApp Messenger"
          subtitle="Direct. Personal. Effective"
          description="Send targeted campaigns directly to users' WhatsApp inbox with high engagement and conversion."
          accent="green"
        />
      </div>
    </div>
  );
};

export default CampaignTypeSelection;
