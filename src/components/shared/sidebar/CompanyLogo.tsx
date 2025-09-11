"use client";
import React from "react";
import { SiFacebook } from "react-icons/si";

export default function CompanyLogo({
  type,
  active,
}: {
  type: string;
  active?: boolean;
}) {
  const { Icon, color } = getCompanyIcon(type);
  return (
    <div className="relative h-6 w-6">
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-2 rounded-full blur-2xl transition-opacity duration-300 ${
          active ? "opacity-70" : "opacity-0 group-hover:opacity-50"
        }`}
        style={{
          background: `radial-gradient(ellipse at center, ${hexWithAlpha(
            color,
            0.28
          )}, transparent 70%)`,
        }}
      />
      <div
        className={`relative z-10 h-6 w-6 rounded-full flex items-center justify-center bg-white shadow-sm ${
          active ? "ring-2 ring-white/70" : "ring-1 ring-white/50"
        }`}
      >
        <Icon size={14} color={color} />
      </div>
    </div>
  );
}

function getCompanyIcon(type: string): {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
} {
  switch (type) {
    case "SEO Management":
      return { Icon: (props) => <SiFacebook {...props} />, color: "#FF642D" };
    case "Finance AI":
      return { Icon: (props) => <SiFacebook {...props} />, color: "#635BFF" };
    case "Social Media":
      return { Icon: (props) => <SiFacebook {...props} />, color: "#1877F2" };
    case "Virtual Assistant":
      return { Icon: (props) => <SiFacebook {...props} />, color: "#74AA9C" };
    default:
      return { Icon: (props) => <SiFacebook {...props} />, color: "#64748B" };
  }
}

function hexWithAlpha(hex: string, alpha: number) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
