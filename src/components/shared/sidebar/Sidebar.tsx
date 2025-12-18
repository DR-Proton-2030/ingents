"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import NavList from "./NavList";
import Profile from "./Profile";
import { useSite } from "@/contexts/SiteContext";
import { assets } from "@/assets";

export default function Sidebar() {
  const pathname = usePathname();
  const { site } = useSite();

  const todayItems = [
    {
      href: `/${site}`,
      label: "Dashboard",
      imageUrl: assets.icons.dashboard,
      icon: undefined,
    },
    {
      href: `/${site}/seo-management`,
      label: "Seomi Seo",
      imageUrl: assets.icons.graph,
    },
    {
      href: `/${site}/finance-ai`,
      label: "Finance AI",
      imageUrl: assets.icons.finance,
    },
    {
      href: `/${site}/tasks`,
      label: "Task Management",
      imageUrl: assets.icons.socialMedia,
    },
    {
      href: `/${site}/social-media`,
      label: "Social Media",
      imageUrl: assets.icons.socialMedia,
    },
    {
      href: `/${site}/email-marketing`,
      label: "Email Marketing",
      imageUrl: assets.icons.email,
    },
  ];

  const bottomItems = [
    { href: `/${site}/analytics`, label: "Analytics" },
    { href: `/${site}/support`, label: "Support" },
    { href: `/${site}/subscription`, label: "Subscription" },
  ];

  return (
    <aside className="w-56 2xl:w-68 min-h-screen overflow-y-auto flex-shrink-0 relative">
      <div className="relative z-10">
        <Header />

        <div className="pt-6 px-4 pb-4">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3">
            AGENTS
          </h2>
          <NavList items={todayItems} pathname={pathname} />
        </div>

        <div className="mt-5 2xl:mt-16 px-4 pb-6">
          <NavList items={bottomItems} pathname={pathname} itemHeight={44} />
          <Profile />
        </div>
      </div>
    </aside>
  );
}
