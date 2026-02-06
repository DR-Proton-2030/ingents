import React, { useContext } from "react";
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  MessageCircle,
  X,
} from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import { ModalHeader, AccountDropdown, ActionButtons } from "./components";
import { useAccountSelection } from "./hooks";

// Social platform icons and colors mapping
const platformConfig = {
  instagram: {
    icon: Instagram,
    color: "#E4405F",
    gradient:
      "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
  },
  x: {
    icon: Twitter,
    color: "#000000",
    gradient: "linear-gradient(45deg, #000000 0%, #333333 100%)",
  },
  facebook: {
    icon: Facebook,
    color: "#1877F2",
    gradient: "linear-gradient(45deg, #1877F2 0%, #0C63D4 100%)",
  },
  linkedin: {
    icon: Linkedin,
    color: "#0A66C2",
    gradient: "linear-gradient(45deg, #0A66C2 0%, #004182 100%)",
  },
  youtube: {
    icon: Youtube,
    color: "#FF0000",
    gradient: "linear-gradient(45deg, #FF0000 0%, #CC0000 100%)",
  },
  telegram: {
    icon: MessageCircle,
    color: "#0088cc",
    gradient: "linear-gradient(45deg, #0088cc 0%, #006699 100%)",
  },
} as const;

type Account = {
  id: string;
  name: string;
  username: string;
  followers?: number;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  platform: keyof typeof platformConfig;
  accounts: Account[];
  onSelect: (accountId: string) => void;
  token?: string;
}

const AccountSelectionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  platform,
  accounts,
  onSelect,
  token,
}) => {
  const { user, setUser } = useContext(AuthContext);

  const {
    selectedAccount,
    isDropdownOpen,
    showCelebration,
    loading,
    setIsDropdownOpen,
    handleAccountSelect,
    handleConfirm,
  } = useAccountSelection({
    platform,
    accounts,
    user,
    setUser,
    onSelect,
    onClose,
    token,
    platformColor: platformConfig[platform]?.color,
  });

  if (!isOpen) return null;

  const config = platformConfig[platform];
  const PlatformIcon = config?.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />

      {/* Celebration Effect */}
      {/* <CelebrationOverlay
        isVisible={showCelebration}
        platformGradient={config?.gradient}
      /> */}

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden animate-in ${
          showCelebration ? "scale-105" : ""
        } transition-transform duration-300`}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-white/20"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header with Platform Logo */}
        <ModalHeader
          platformGradient={config?.gradient}
          PlatformIcon={PlatformIcon}
        />

        {/* Content */}
        <div className="p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              Select {platform.charAt(0).toUpperCase() + platform.slice(1)}{" "}
              Account
            </h2>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
              Choose which account you want to use for posting content and
              managing interactions on{" "}
              {platform.charAt(0).toUpperCase() + platform.slice(1)}.
            </p>
          </div>

          {/* Dropdown Container */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-gray-700 mb-4 block tracking-tight">
              Connected Accounts
            </label>

            <AccountDropdown
              isOpen={isDropdownOpen}
              onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
              selectedAccount={selectedAccount}
              onSelectAccount={handleAccountSelect}
              accounts={accounts}
              PlatformIcon={PlatformIcon}
              platformGradient={config?.gradient}
            />
          </div>

          {/* Action Buttons */}
          <ActionButtons
            onCancel={onClose}
            onConfirm={handleConfirm}
            isLoading={loading}
            isDisabled={!selectedAccount}
            platformGradient={config?.gradient}
            platformColor={config?.color}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSelectionModal;
