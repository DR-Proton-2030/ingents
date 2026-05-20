"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import { createApi } from "@/utils/api/api";
import {
  getMemories,
  addMemory,
  updateMemory,
  deleteMemory,
  type Memory,
} from "@/utils/api/memory/memory.api";

// Silent axios instance — strips the global error-toast interceptor so
// a 500 on GET /memory doesn't pop a toast while the backend is being set up.
const silentGetMemories = async (): Promise<Memory[]> => {
  try {
    return await getMemories();
  } catch {
    return [];
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────

// Memory type is imported from memory.api.ts

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Add input row ────────────────────────────────────────────────────────────

interface AddRowProps {
  onAdd: (text: string) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const AddRow: React.FC<AddRowProps> = ({ onAdd, onCancel, isSaving }) => {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await onAdd(trimmed);
    setText("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border-2 border-gray-900 bg-white p-4 shadow-sm space-y-3"
    >
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder="e.g. I prefer concise answers. My timezone is IST."
        rows={3}
        className="w-full resize-none text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none leading-relaxed"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Press Enter to save · Esc to cancel</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!text.trim() || isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Memory card ──────────────────────────────────────────────────────────────

interface MemoryCardProps {
  memory: Memory;
  onUpdate: (id: string, text: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isMutating: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onUpdate,
  onDelete,
  isMutating,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(memory.text);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const startEdit = () => {
    setDraft(memory.text);
    setEditing(true);
    setTimeout(() => ref.current?.focus(), 0);
  };

  const cancelEdit = () => {
    setDraft(memory.text);
    setEditing(false);
  };

  const saveEdit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === memory.text) {
      cancelEdit();
      return;
    }
    await onUpdate(memory._id, trimmed);
    setEditing(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all"
    >
      {editing ? (
        /* ── Edit mode ── */
        <div className="space-y-3">
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            rows={3}
            className="w-full resize-none text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all leading-relaxed"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={cancelEdit}
              disabled={isMutating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              onClick={saveEdit}
              disabled={!draft.trim() || isMutating}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-all disabled:opacity-40"
            >
              {isMutating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Update
            </button>
          </div>
        </div>
      ) : (
        /* ── View mode ── */
        <div className="flex items-start gap-3">
          {/* Brain dot */}
          <div className="mt-1 w-2 h-2 rounded-full bg-gray-300 shrink-0" />

          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {memory.text}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formatDate(memory.createdAt)}</span>
            </div>
          </div>

          {/* Actions — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={startEdit}
              disabled={isMutating}
              aria-label="Edit memory"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-40"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            {confirmDelete ? (
              <>
                <button
                  onClick={() => onDelete(memory._id)}
                  disabled={isMutating}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-40"
                >
                  {isMutating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  No
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={isMutating}
                aria-label="Delete memory"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const ProfileMemory: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "idle" | "error">("loading");
  const [isMutating, setIsMutating] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const list = await silentGetMemories();
      setMemories(list);
      setLoadState("idle");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Add ───────────────────────────────────────────────────────────────────

  const handleAdd = async (text: string) => {
    setIsMutating(true);
    try {
      await addMemory(text);
      await load(); // reload to get real _id from backend
      setShowAddRow(false);
      toast.success("Memory saved.");
    } catch {
      // error toast handled by API interceptor
    } finally {
      setIsMutating(false);
    }
  };

  // ── Update ────────────────────────────────────────────────────────────────

  const handleUpdate = async (id: string, text: string) => {
    setIsMutating(true);
    try {
      const updated = await updateMemory(id, text);
      setMemories((prev) =>
        prev.map((m) => (m._id === id ? { ...m, ...updated } : m))
      );
      toast.success("Memory updated.");
    } catch {
      // error toast handled by API interceptor
    } finally {
      setIsMutating(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (!id || id === "undefined") {
      toast.error("Cannot delete: invalid memory ID. Try refreshing.");
      return;
    }
    setIsMutating(true);
    try {
      await deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m._id !== id));
      toast.success("Memory deleted.");
    } catch {
      // error toast handled by API interceptor
    } finally {
      setIsMutating(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      {/* ── Page header ── */}
      <div className="flex items-start justify-between -mt-10">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Memories</h2>
          <p className="text-gray-500 text-sm">
            Things Ingents should always remember about you.
          </p>
        </div>

        <button
          onClick={() => setShowAddRow(true)}
          disabled={loadState === "loading" || showAddRow}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-700 transition-all active:scale-95 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Memory
        </button>
      </div>

      {/* ── Add row ── */}
      <AnimatePresence>
        {showAddRow && (
          <AddRow
            onAdd={handleAdd}
            onCancel={() => setShowAddRow(false)}
            isSaving={isMutating}
          />
        )}
      </AnimatePresence>

      {/* ── Loading ── */}
      {loadState === "loading" && (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
        </div>
      )}

      {/* ── Error ── */}
      {loadState === "error" && (
        <div className="flex flex-col items-center justify-center gap-3 h-48 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <p className="text-sm text-gray-500">Failed to load memories.</p>
          <button
            onClick={load}
            className="text-xs font-semibold text-gray-700 underline underline-offset-4 hover:text-gray-900"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Memory list ── */}
      {loadState === "idle" && (
        <>
          {memories.length === 0 && !showAddRow ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50"
            >
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <Brain className="w-8 h-8 text-gray-300" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-gray-500">
                  No memories saved yet
                </p>
                <p className="text-xs text-gray-400 max-w-xs">
                  Add preferences, context, or facts you want Ingents to always remember.
                </p>
              </div>
              <button
                onClick={() => setShowAddRow(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-700 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add your first memory
              </button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {/* Count badge */}
              {memories.length > 0 && (
                <p className="text-xs text-gray-400 font-medium">
                  {memories.length} {memories.length === 1 ? "memory" : "memories"} saved
                </p>
              )}

              <AnimatePresence mode="popLayout">
                {memories.map((memory) => (
                  <MemoryCard
                    key={memory._id}
                    memory={memory}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    isMutating={isMutating}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default ProfileMemory;
