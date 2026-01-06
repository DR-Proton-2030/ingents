"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import type {
    CreateSubtaskModalProps,
  CreateTaskModalProps,
  SubTaskFormData,
  TaskFormData,
} from "@/types/interface/task-modal.interface";

const CreateSubtaskModal: React.FC<CreateSubtaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<SubTaskFormData>({
    title: "",
    description: "",
    due_date: "",
    priority: "Normal",
    // status: "pending",
    assigned_user_list: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // ✅ Effect is ALWAYS called
  useEffect(() => {
    if (!userQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers(userQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [userQuery]);

  if (!isOpen) return null;
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const res = await fetch(
        `/api/users/search?query=${encodeURIComponent(query)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (err) {
      console.error("User search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  // When a user is selected:
  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      assigned_user_list: [user._id], // ← update state here
    }));
    setUserQuery("");
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Build payload explicitly
      const payload = {
        title: formData.title.trim(),
        description: formData.description,
        due_date: formData.due_date,
        priority: formData.priority,
        // ✅ Always include selected user's _id in assigned_user_list
        assigned_user_list: selectedUser ? [selectedUser._id] : [],
      };

      console.log("Submitting task payload:", payload);

      await onSubmit(payload);

      // Reset form
      setFormData({
        title: "",
        description: "",
        due_date: "",
        priority: "Normal",
        // status: "pending",
        assigned_user_list: [],
      });
      setSelectedUser(null);
      setSearchResults([]);
      setUserQuery("");
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Create New SubTask
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Enter task description"
            />
          </div>

          {/* Due Date and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label
                htmlFor="due_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Due Date
              </label>
              <input
                type="datetime-local"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
              >
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Status */}

          {/* Assign To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>

            {/* Selected user */}
            {formData.assigned_user_list.length > 0 && selectedUser && (
              <div className="flex items-center justify-between mb-2 px-3 py-2 bg-gray-100 rounded">
                <span className="text-sm">
                  {selectedUser.full_name} ({selectedUser.email})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setFormData((prev) => ({
                      ...prev,
                      assigned_user_list: [],
                    }));
                  }}
                  className="text-gray-500 text-sm"
                >
                  <X />
                </button>
              </div>
            )}

            {/* Search input */}
            {!selectedUser && (
              <input
                type="text"
                placeholder="Search user by name or email"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            {/* Searching indicator */}
            {isSearching && (
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            )}

            {/* Search results */}
            {searchResults.length > 0 && !selectedUser && (
              <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto bg-white shadow">
                {searchResults.map((user) => (
                  <button
                    type="button"
                    key={user._id}
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData((prev) => ({
                        ...prev,
                        assigned_user_list: [user._id],
                      }));

                      setUserQuery("");
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Subtask"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubtaskModal;
