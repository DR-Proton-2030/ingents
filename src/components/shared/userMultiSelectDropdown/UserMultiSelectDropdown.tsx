"use client";

import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

export interface UserOption {
  _id: string;
  full_name: string;
  email: string;
}

interface Props {
  label?: string;
  placeholder?: string;
  value: UserOption[];
  onChange: (users: UserOption[]) => void;
  searchApi: (query: string) => Promise<UserOption[]>;
}

const UserMultiSelectDropdown: React.FC<Props> = ({
  label = "Assign To",
  placeholder = "Search user...",
  value,
  onChange,
  searchApi,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchApi(query);
      setResults(res);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, searchApi]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectUser = (user: UserOption) => {
    if (value.some((u) => u._id === user._id)) return;
    onChange([...value, user]);
    setQuery("");
    setResults([]);
  };

  const removeUser = (id: string) => {
    onChange(value.filter((u) => u._id !== id));
  };

  return (
    <div ref={wrapperRef}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 neu-inset focus:outline-none transition"
      />

      {/* Selected users */}
      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((u) => (
            <div
              key={u._id}
              className="neu px-4 py-1 flex items-center gap-2 text-sm"
            >
              {u.full_name}
              <button
                type="button"
                onClick={() => removeUser(u._id)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {results.length > 0 && (
        <div className="mt-3 border rounded-lg overflow-hidden bg-white shadow-md">
          {results.map((u) => (
            <button
              key={u._id}
              type="button"
              onClick={() => selectUser(u)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition"
            >
              <p className="text-sm font-medium">{u.full_name}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <p className="mt-2 text-xs text-gray-400">Searching...</p>
      )}
    </div>
  );
};

export default UserMultiSelectDropdown;
