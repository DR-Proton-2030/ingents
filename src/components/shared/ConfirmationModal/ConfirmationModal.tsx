"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white"
          >
            {/* Header / Icon Area */}
            <div
              className={`h-2 border-b-0 ${type === "danger" ? "bg-red-500" : "bg-orange-500"}`}
            />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/50 rounded-full transition-all shadow-sm hover:scale-110 active:scale-95 z-10"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="p-10 text-center relative z-0">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${type === "danger" ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"}`}
              >
                <AlertCircle className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">
                {title}
              </h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">
                {description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full px-8 py-4 rounded-3xl font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`w-full px-8 py-4 rounded-3xl font-black text-white shadow-xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 ${
                    type === "danger"
                      ? "bg-red-500 shadow-red-100 hover:bg-red-600"
                      : "bg-orange-500 shadow-orange-100 hover:bg-orange-600"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ConfirmationModal;
