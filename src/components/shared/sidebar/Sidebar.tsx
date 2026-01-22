"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import NavList from "./NavList";
import Profile from "./Profile";
import { useSite } from "@/contexts/SiteContext";
import {
  Checklist,
  Folder,
  GraphUp,
  Home,
  Letter,
  Settings,
  Share,
  Wallet,
} from "@solar-icons/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { site } = useSite();

  const todayItems = [
    {
      href: `/${site}`,
      label: "Dashboard",
      icon: Home,
    },

    // {
    //   href: `/${site}/seo-management`,
    //   label: "Seomi Seo",
    //   icon: GraphUp,
    // },
    // {
    //   href: `/${site}/finance-ai`,
    //   label: "Finance AI",
    //   icon: Wallet,
    // },
    {
      href: `/${site}/tasks`,
      label: "Task Management",
      icon: Checklist,
    },
    {
      href: `/${site}/project-management`,
      label: "Project Management",
      icon: Folder,
    },
    {
      href: `/${site}/social-media`,
      label: "Social Media",
      icon: Share,
    },
    {
      href: `/${site}/email-marketing`,
      label: "Email Marketing",
      icon: Letter,
    },
  ];

  const bottomItems = [
    { href: `/${site}/settings`, label: "Settings", icon: Settings },
    // { href: `/${site}/analytics`, label: "Analytics", icon: GraphBold },
    // { href: `/${site}/support`, label: "Support", icon: HelpBold },
    // { href: `/${site}/subscription`, label: "Subscription", icon: CardBold },
  ];

  return (
    <aside className="w-66 2xl:w-72 h-screen flex flex-col overflow-y-auto flex-shrink-0 relative">
      <div className="relative z-10 flex flex-col h-full">
        <Header />

        <div className="pt-6 px-4 pb-4 flex-1">
          <NavList items={todayItems} pathname={pathname} />
        </div>

        <div className="px-4 pb-11  mt-auto">
          <Profile />
        </div>
      </div>
    </aside>
  );
}
