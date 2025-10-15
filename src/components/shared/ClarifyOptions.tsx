"use client";

import React from "react";

type Props = {
  text?: string;
  onSelect: (choice: number, label: string) => void;
};

export default function ClarifyOptions({ text, onSelect }: Props) {
  const options = [
    { id: 1, label: "Generate a text post" },
    { id: 2, label: "Create an image" },
    { id: 3, label: "Make a short video" },
    { id: 4, label: "Something else" },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {text && <div className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{text}</div>}
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id, o.label)}
            className="px-3 py-1 rounded bg-sky-600 text-white text-sm hover:bg-sky-700"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
