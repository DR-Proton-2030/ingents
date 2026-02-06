import React from "react";
import { Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  platformGradient?: string;
  platformColor?: string;
  cancelText?: string;
  confirmText?: string;
  loadingText?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onConfirm,
  isLoading,
  isDisabled,
  platformGradient,
  platformColor,
  cancelText = "Cancel",
  confirmText = "Confirm Selection",
  loadingText = "Updating...",
}) => {
  return (
    <div className="flex gap-4 pt-2">
      <button
        onClick={onCancel}
        className="flex-1 px-6 py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-gray-200 flex items-center justify-center"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        disabled={isDisabled || isLoading}
        className="flex-1 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
        style={{
          background: !isDisabled && !isLoading ? platformGradient : "#9ca3af",
          boxShadow: !isDisabled && !isLoading
            ? `0 10px 30px -5px ${platformColor}50`
            : "0 4px 15px -3px rgba(156, 163, 175, 0.3)",
        }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{loadingText}</span>
          </div>
        ) : (
          <span>{confirmText}</span>
        )}
      </button>
    </div>
  );
};
