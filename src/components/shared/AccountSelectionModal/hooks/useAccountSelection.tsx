/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUserUpdate } from "@/hooks/useUpdateUser/useUpdateUser";
import { useConfettiEffect } from "../components/ConfettiEffect";

type Account = {
  id: string;
  name: string;
  username: string;
  followers?: number;
};

interface UseAccountSelectionProps {
  platform: string;
  accounts: Account[];
  user: unknown;
  setUser: (user: any) => void;
  onSelect: (accountId: string) => void;
  onClose: () => void;
  platformColor?: string;
}

export const useAccountSelection = ({
  platform,
  accounts,
  user,
  setUser,
  onSelect,
  onClose,
  platformColor,
}: UseAccountSelectionProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);

  const { updateUserDetails, loading } = useUserUpdate();
  const { fireConfetti } = useConfettiEffect();

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    setIsDropdownOpen(false);
  };

  const handleConfirm = async () => {
    if (!selectedAccount) return;

    const selected = accounts.find((a) => a.id === selectedAccount);
    if (!selected) return;

    try {
      const payload = {
        userId: (user as { id?: string })?.id,
        [platform]: {
          [platform === "facebook" ? "page_id" : "project_id"]: selected.id,
          name: selected.name,
        },
      };

      const res = await updateUserDetails(payload);

      if (res?.result) {
        try {
          if (typeof setUser === "function") {
            setUser(res.result);
          }
        } catch (e) {
          console.warn("setUser failed or not implemented:", e);
        }
      }

      // Show celebration effect
      setShowCelebration(true);

      // Fire confetti
      fireConfetti({
        platformColor,
        onComplete: () => {
          // Wait for celebration animation, then notify and close
          setTimeout(() => {
            try {
              if (typeof onSelect === "function") {
                onSelect(selectedAccount);
              }
            } catch (e) {
              console.warn("onSelect handler threw:", e);
            }

            onClose();
          }, 2000);
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Update failed:", message);
      alert(message || "Something went wrong while updating user details");
    }
  };

  return {
    selectedAccount,
    isDropdownOpen,
    showCelebration,
    loading,
    setIsDropdownOpen,
    handleAccountSelect,
    handleConfirm,
  };
};
