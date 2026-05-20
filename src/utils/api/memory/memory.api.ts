/**
 * Memory API utility
 *
 * Usage from anywhere in the app:
 *
 *   import { addMemory } from "@/utils/api/memory/memory.api";
 *   await addMemory("User prefers dark mode");
 */

import API from "@/utils/api/api";

export interface Memory {
  _id: string;
  text: string;
  createdAt: string;
}

// ─── Core functions ───────────────────────────────────────────────────────────

/** Fetch all memories for the current user */
export async function getMemories(): Promise<Memory[]> {
  const res = await API.get("/memory");
  const raw = (res.data as any);
  const list = raw?.data ?? raw?.memories ?? raw ?? [];
  return Array.isArray(list) ? list.filter((m: any) => m?._id) : [];
}

/**
 * Save a new memory.
 * Call this from anywhere — pass any string and it will be persisted.
 *
 * @example
 *   await addMemory("I prefer Python over JavaScript");
 */
export async function addMemory(text: string): Promise<Memory> {
  const trimmed = text?.trim();
  if (!trimmed) throw new Error("Memory text cannot be empty");

  const res = await API.post("/memory", { text: trimmed });
  const raw = (res.data as any);

  // Normalise response shape: { data: {...} } | { memory: {...} } | {...}
  const created: Memory =
    raw?.data?._id  ? raw.data   :
    raw?.memory?._id ? raw.memory :
    raw?._id         ? raw        :
    null;

  if (!created) throw new Error("Unexpected response from server");
  return created;
}

/** Update an existing memory by ID */
export async function updateMemory(id: string, text: string): Promise<Memory> {
  const trimmed = text?.trim();
  if (!trimmed) throw new Error("Memory text cannot be empty");

  const res = await API.put(`/memory/${id}`, { text: trimmed });
  const raw = (res.data as any);

  const updated: Memory =
    raw?.data?._id  ? raw.data   :
    raw?.memory?._id ? raw.memory :
    raw?._id         ? raw        :
    null;

  if (!updated) throw new Error("Unexpected response from server");
  return updated;
}

/** Delete a memory by ID */
export async function deleteMemory(id: string): Promise<void> {
  if (!id || id === "undefined") throw new Error("Invalid memory ID");
  await API.delete(`/memory/${id}`);
}
