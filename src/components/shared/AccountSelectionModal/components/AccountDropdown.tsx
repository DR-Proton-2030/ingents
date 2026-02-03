import React from "react";
import { Check, ChevronDown, LucideIcon } from "lucide-react";

type Account = {
  id: string;
  name: string;
  username: string;
  followers?: number;
};

interface AccountDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedAccount: string | null;
  onSelectAccount: (accountId: string) => void;
  accounts: Account[];
  PlatformIcon: LucideIcon;
  platformGradient: string;
  placeholder?: string;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  isOpen,
  onToggle,
  selectedAccount,
  onSelectAccount,
  accounts,
  PlatformIcon,
  platformGradient,
  placeholder = "Select an account...",
}) => {
  const selectedData = Array.isArray(accounts) 
    ? accounts.find((acc) => acc?.id === selectedAccount)
    : null;

  return (
    <div className="relative">
      {/* Dropdown Trigger */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50/80 hover:border-gray-300 hover:bg-white hover:shadow-lg transition-all duration-300 group"
      >
        <div className="flex items-center gap-4">
          {selectedData ? (
            <>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200"
                style={{ background: platformGradient }}
              >
                <PlatformIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-gray-900">
                  {selectedData?.name || "Selected Account"}
                </p>
                <p className="text-sm text-gray-500">
                  @{selectedData?.username || selectedData?.id || ""}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                <PlatformIcon className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-base text-gray-500 font-medium">
                {placeholder}
              </span>
            </>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full mt-3 w-full bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-20 overflow-hidden backdrop-blur-xl animate-in-dropdown"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
            boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div className="max-h-72 overflow-y-auto scrollable-dropdown">
            {Array.isArray(accounts) && accounts.filter(Boolean).map((account) => {
              const isSelected = account?.id === selectedAccount;

              return (
                <button
                  key={account?.id}
                  onClick={() => onSelectAccount(account?.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-all duration-200 group border-b border-gray-100 last:border-b-0 hover:shadow-sm"
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-md"
                    style={{ background: platformGradient }}
                  >
                    <PlatformIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Account Info */}
                  <div className="flex-1 text-left">
                    <p className="text-base font-semibold text-gray-900">
                      {account?.name || "Unknown Account"}
                    </p>
                    <p className="text-sm text-gray-500">
                      @{account?.username || account?.id || "unknown"}
                    </p>
                  </div>

                  {/* Check Icon */}
                  {isSelected && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg animate-in-scale"
                      style={{ background: platformGradient }}
                    >
                      <Check className="w-4 h-4 text-white font-bold" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
