"use client";
import React from "react";

export default function ImageBadge({
  url,
  active,
}: {
  url: string;
  active?: boolean;
}) {
  return (
    <div className="relative h-6 w-6">
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-2 rounded-full blur-2xl transition-opacity duration-300 ${
          active ? "opacity-70" : "opacity-0 group-hover:opacity-50"
        } bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),rgba(147,51,234,0.12)_45%,rgba(236,72,153,0.08)_70%,transparent_85%)]`}
      />
      <div
        className={`relative z-10 h-7 w-7 overflow-hidden rounded-full bg-white shadow-sm ${
          active ? "ring-2 ring-white/70" : "ring-1 ring-white/50"
        }`}
      >
        <img
          src={url}
          alt="brand logo"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
