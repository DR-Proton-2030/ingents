"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { CloseCircle, AddCircle } from "@solar-icons/react";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { CreateNewPhaseProps } from "@/types/interface/props/createNewPhase.props";


const CreateNewPhase: React.FC<CreateNewPhaseProps> = ({
  isOpen,
  onClose,
  onSuccess,
  task_object_id,
}) => {
  const [newPhaseName, setNewPhaseName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [mounted, setMounted] = useState(false);

  console.log("task_object_id", task_object_id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreatePhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseName.trim()) return;

    try {
      setIsCreating(true);
      const response = await api.taskPhase.createTaskPhase({ name: newPhaseName, task_object_id : task_object_id });
      toast.success("New phase created successfully!");
      setNewPhaseName("");
      api.taskPhase.clearTaskPhasesCache();
      
      onSuccess(response?.data?._id || response?.data?.id);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to create phase");
    } finally {
      setIsCreating(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[400px] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.3)] rounded-[32px] border border-white/20 flex flex-col overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                    <AddCircle className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 tracking-tight">
                      New Phase
                    </h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                      Create custom status
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                >
                  <CloseCircle className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleCreatePhase} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Phase Name
                  </label>
                  <input
                    autoFocus
                    value={newPhaseName}
                    onChange={(e) => setNewPhaseName(e.target.value)}
                    placeholder="e.g., QA Review"
                    className="w-full h-14 px-5 rounded-2xl transition-all outline-none text-base font-bold bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 border-2 border-transparent focus:border-orange-500 text-gray-800 placeholder:text-gray-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-14 rounded-2xl text-sm font-black uppercase tracking-widest text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newPhaseName.trim()}
                    className="h-14 rounded-2xl text-sm font-black uppercase tracking-widest text-white bg-orange-500 hover:bg-orange-600 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                  >
                    {isCreating ? "Creating..." : "Create Phase"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CreateNewPhase;
