"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import NavList from "./NavList";
import Profile from "./Profile";
import { useSite } from "@/contexts/SiteContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { site } = useSite();

  const todayItems = [
    {
      href: `/${site}`,
      label: "Dashboard",
      imageUrl:
        "https://chatgpt.com/backend-api/estuary/content?id=file-RFWBMhwa9SsnXoMCKdyBjH&gizmo_id=g-67e595af0a408191b84ee532fca12cd1&ts=488180&p=gpp&cid=1&sig=ab25bbeb0dddec647fd0f3fddc62acee74bcf04c2d1dad137d8ab9de59836be3&v=0",
      icon: undefined,
    },
    {
      href: `/${site}/seo-management`,
      label: "Seomi Seo",
      imageUrl:
        "https://chatgpt.com/backend-api/estuary/content?id=file-IrBNu77AV10e4xnLWISJNrh3&gizmo_id=g-iYSeH3EAI&ts=488180&p=gpp&cid=1&sig=517d39aa5d52cfd8ea55ccb3c9a5ad43ed879f13e095e4365cf4214dcd4be2f6&v=0",
    },
    {
      href: `/${site}/finance-ai`,
      label: "Finance AI",
      imageUrl:
        "https://chatgpt.com/backend-api/estuary/content?id=file-rdCQ0lZNp84NkdCMq56ppn8r&gizmo_id=g-NgAcklHd8&ts=488180&p=gpp&cid=1&sig=50aedced0b17e09a4845c5581805034eeccd251f1dfcd591fea842c117c0da4b&v=0",
    },
    {
      href: `/${site}/social-media`,
      label: "Social Media",
      imageUrl:
        "https://chatgpt.com/backend-api/estuary/content?id=file-JzREpGs5Msxd7RmW8q81Qf&gizmo_id=g-vI2kaiM9N&ts=488180&p=gpp&cid=1&sig=de4df36214a58b90ed62abd686c5f4a88bde09abad3f024906f96b06557cfddc&v=0",
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
