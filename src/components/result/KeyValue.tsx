/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export default function KeyValue({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex justify-between text-sm py-1 border-b border-white/10">
      <span className="text-white/70">{k}</span>
      <span className="text-white/90 font-medium">{String(v)}</span>
    </div>
  );
}
