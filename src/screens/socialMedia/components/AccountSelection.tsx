"use client";
import React, { useState } from "react";

const socials = [
  {
    src: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png", // Instagram
    href: "https://instagram.com",
    alt: "Instagram",
  },
  {
    src: "https://cdn-icons-png.flaticon.com/512/733/733547.png", // Facebook
    href: "https://facebook.com",
    alt: "Facebook",
  },
  {
    src: "https://cdn-icons-png.flaticon.com/512/5968/5968830.png", // Twitter / X
    href: "https://x.com",
    alt: "Twitter / X",
  },
];

export default function AccountSelection() {
  const [connected, setConnected] = useState<string[]>([]);

  const handleConnect = (name: string) => {
    setConnected((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  return (
    <div className="w-full flex justify-start">
      <div className="flex flex-wrap gap-4 mt-6">
        {socials.map((social) => (
          <>
            <div className="w-64 rounded-xl border border-gray-200 bg-white p-4 ">
              {/* Top: Icon + Title */}
              <div className="flex items-center gap-3">
                <img
                  src={social?.src}
                  alt="Math"
                  className="h-10 w-10 rounded-full"
                />
                <span className="font-semibold text-gray-900">
                  {social?.alt}
                </span>
              </div>

              {/* Middle: Description */}
              <p className="mt-2 text-sm text-gray-600">
                The world’s most powerful math tool.
              </p>

              <div className="bg-gray-600 rounded-full px-5 py-1.5 text-white w-24 text-sm mt-2 ">
                Connect
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
