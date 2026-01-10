"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import type {
  CreateTaskModalProps,
  TaskFormData,
} from "@/types/interface/task-modal.interface";
import UserMultiSelectDropdown, { UserOption } from "@/components/shared/userMultiSelectDropdown/UserMultiSelectDropdown";

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    due_date: "",
    priority: "Normal",
    assigned_user_list: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);

  const [userQuery, setUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!userQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => searchUsers(userQuery), 400);
    return () => clearTimeout(timer);
  }, [userQuery]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

 const searchUsers = async (query: string): Promise<UserOption[]> => {
  const res = await fetch(
    `/api/users/search?query=${encodeURIComponent(query)}`,
    { credentials: "include" }
  );
  const data = await res.json();
  return data.data || [];
};


  const handleUserSelect = (user: any) => {
    if (selectedUsers.some((u) => u._id === user._id)) return;
    const updated = [...selectedUsers, user];
    setSelectedUsers(updated);
    setFormData((p) => ({
      ...p,
      assigned_user_list: updated.map((u) => u._id),
    }));
    setUserQuery("");
    setSearchResults([]);
  };

  const removeUser = (id: string) => {
    const updated = selectedUsers.filter((u) => u._id !== id);
    setSelectedUsers(updated);
    setFormData((p) => ({
      ...p,
      assigned_user_list: updated.map((u) => u._id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Title is required");
    setIsSubmitting(true);
    await onSubmit({
      ...formData,
      assigned_user_list: selectedUsers.map((u) => u._id),
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="flex items-center justify-between p-4 ">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button className="neu p-2 hover:scale-95 transition" onClick={onClose}>
            <X size={14}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 outline-none transition shadow-sm"
            />
          </div>

          {/* description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Task description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-300 outline-none transition shadow-sm resize-none"
            />
          </div>

          {/* due + priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
 <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
            />
            </div>
           
            
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
  <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="px-4 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm bg-white"
            >
              <option>High</option>
              <option>Normal</option>
              <option>Low</option>
            </select>
            </div>

          
          </div>

          {/* assign */}
       <UserMultiSelectDropdown
  value={selectedUsers}
  onChange={(users) => {
    setSelectedUsers(users);
    setFormData((p) => ({
      ...p,
      assigned_user_list: users.map((u) => u._id),
    }));
  }}
  searchApi={searchUsers}
/>


          {/* actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="neu neu-hover px-6 py-2">
              Cancel
            </button>
         <button
  type="submit"
  disabled={isSubmitting}
  className="rounded-xl shadow-lg px-6 py-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-medium disabled:opacity-50"
>
  {isSubmitting ? "Creating..." : "Create Task"}
</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
