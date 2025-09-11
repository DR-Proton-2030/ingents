"use client";
import { useRouter } from "next/navigation";
import React from "react";
// Make sure you still have the ArtifactPreview.css file with the animations

/**
 * A reusable component to render the glowing orb and waveform animation.
 * The animations are defined in the imported CSS file.
 */
const GlowingOrb = () => (
  <div className="relative w-full h-64 flex items-center justify-center">
    {/* Background Glow Layers */}
    <div className="absolute w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 animate-subtle-pulse"></div>
    <div
      className="absolute w-48 h-48 bg-cyan-400 rounded-full blur-2xl opacity-30 animate-subtle-pulse"
      style={{ animationDelay: "200ms" }}
    ></div>
    <div
      className="absolute w-32 h-32 bg-white rounded-full blur-xl opacity-20 animate-subtle-pulse"
      style={{ animationDelay: "400ms" }}
    ></div>

    {/* Dynamic "Siri-like" Waveform */}
    <div className="absolute w-full h-full flex items-center justify-center space-x-1">
      {[-20, 30, -15, 25, -5, 15, -25].map((height, i) => (
        <div
          key={i}
          className="w-1 bg-white/30 rounded-full animate-wave"
          style={{
            height: `${40 + Math.abs(height)}px`,
            animationDelay: `${i * 100}ms`,
          }}
        ></div>
      ))}
    </div>
  </div>
);

/**
 * A component to display a futuristic artifact that appears to float and
 * glow directly on the dark background.
 */
export default function ArtifactPreview() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/chat")}
      className="bg-black py-8 flex items-center justify-center font-sans rounded-xl mb-4 h-72"
    >
      <div className="w-full max-w-md mx-auto px-4">
        {/*
          The container below has no background, border, or padding,
          allowing the glowing orb to blend into the darkness.
        */}
        <div className="relative text-center ">
          {/* Background Radial Gradient for an extra bit of glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(4, 5, 5, 0.2),rgba(0,0,0,0))]"></div>

          <GlowingOrb />

          <div className="relative z-10 -mt-8 pb-4">
            <p className="text-white text-lg font-medium tracking-wide">
              How can I help you?
            </p>
            <p className="text-white/50 text-xs mt-1">Awaiting Command...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
