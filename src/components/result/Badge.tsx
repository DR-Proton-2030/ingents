import React from "react";

export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-1 rounded-full bg-white/6 text-white/80 text-xs mr-2">
      {children}
    </span>
  );
}
