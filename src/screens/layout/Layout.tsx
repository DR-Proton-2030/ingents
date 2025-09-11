import Navbar from "@/components/shared/navbar/Navbar";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    // Set a base background and establish a relative container for the gradient blobs
    <div className="relative h-screen hidescroll flex overflow-hidden bg-gray-100 isolate">
      {/* 1. The Aurora Gradient Background */}
      {/* These are the blurred "blobs" that create the soft, multi-color effect. */}
      {/* They are positioned absolutely behind all other content. */}
      {/* ...gradient layers... */}
      <div className="pointer-events-none absolute -top-32 -left-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(ellipse_at_top_left,_rgba(255,186,122,0.45)_0%,_rgba(255,214,170,0.28)_35%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
      <div className="pointer-events-none absolute top-24 -right-36 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0.35)_40%,_transparent_70%)] blur-3xl opacity-90 -z-10" />
      <div className="pointer-events-none absolute bottom-[-14rem] left-1/3 h-[48rem] w-[48rem] rotate-12 rounded-full bg-[conic-gradient(from_120deg_at_50%_50%,_rgba(255,255,255,0.55)_0deg,_rgba(255,179,71,0.28)_120deg,_transparent_300deg)] blur-3xl opacity-90 -z-10" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.0)_40%,rgba(255,186,122,0.08)_60%,rgba(255,255,255,0.2)_100%)] opacity-80 -z-10" />

      {/* Sidebar - Make sure its text is dark for readability */}
      {showSidebar && (
        <div className="relative z-10 text-slate-800">
          <Sidebar />
        </div>
      )}

      {/* Main content wrapper */}
      <div className=" z-10 flex-1 p-4 hidescroll">
        <div
          className="w-full hidescroll h-full bg-white/50 backdrop-blur-2xl
         rounded-3xl shadow-xl shadow-black/5 border border-white/30 overflow-y-auto"
        >
          <Navbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
