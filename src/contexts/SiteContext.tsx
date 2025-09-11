"use client";
import { createContext, useContext, ReactNode } from "react";
import { useParams } from "next/navigation";

interface SiteContextType {
  site: string;
  siteUrl: string;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const site = (params?.site as string) || "dashboard";
  const siteUrl = `/${site}`;

  return (
    <SiteContext.Provider value={{ site, siteUrl }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
}
