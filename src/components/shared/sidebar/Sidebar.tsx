"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import NavList from "./NavList";
import Profile from "./Profile";
import { useSite } from "@/contexts/SiteContext";
import {
  CardBold,
  ChecklistBold,
  GraphBold,
  HelpBold,
  HomeBold,
  LetterBold,
  PresentationGraphBold,
  ShareBold,
  WalletBold,
} from "solar-icon-set";

export default function Sidebar() {
  const pathname = usePathname();
  const { site } = useSite();

  const todayItems = [
    {
      href: `/${site}`,
      label: "Dashboard",
      icon: HomeBold,
    },
 
    {
      href: `/${site}/seo-management`,
      label: "Seomi Seo",
      icon: PresentationGraphBold,
    },
    {
      href: `/${site}/finance-ai`,
      label: "Finance AI",
      icon: WalletBold,
    },
    {
      href: `/${site}/tasks`,
      label: "Task Management",
      icon: ChecklistBold,
    },
    {
      href: `/${site}/social-media`,
      label: "Social Media",
      icon: ShareBold,
    },
    {
      href: `/${site}/email-marketing`,
      label: "Email Marketing",
      icon: LetterBold,
    },
  ];

  const bottomItems = [
    { href: `/${site}/settings`, label: "Settings", icon: CardBold },
    // { href: `/${site}/analytics`, label: "Analytics", icon: GraphBold },
    // { href: `/${site}/support`, label: "Support", icon: HelpBold },
    // { href: `/${site}/subscription`, label: "Subscription", icon: CardBold },
  ];

  return (
    <aside className="w-66 2xl:w-72 min-h-screen overflow-y-auto flex-shrink-0 relative">
      <div className="relative z-10">
        <Header />

        <div className="pt-6 px-4 pb-4">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3">
            AGENTS
          </h2>
          <NavList items={todayItems} pathname={pathname} />
        </div>

        <div className="absolute w-full mt-10 2xl:mt-24 px-4 pb-6">
          <Profile />
        </div>
      </div>
    </aside>
  );
}
