"use client";
import React from "react";
import { Plus, Instagram, Twitter, MoreHorizontal, Youtube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const YourAccounts = () => {
  const pathname = usePathname();
  // We want to go back to /site/social-media from /site/social-media/youtube
  const basePath = pathname.split('/').slice(0, -1).join('/') || "/site/social-media";

  const accounts = [
    {
      name: "@samanthawilliam_",
      platform: "YouTube",
      stats: "278,534 Subscribers",
      icon: <Youtube className="w-4 h-4 text-red-600" />,
      active: true,
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
      link: "#"
    },
    {
      name: "@samanthawilliam_",
      platform: "Instagram",
      stats: "278,534 Followers",
      icon: <Instagram className="w-4 h-4 text-pink-600" />,
      active: false,
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
      link: basePath
    },
    {
      name: "@samanthawilliam-x",
      platform: "Twitter / X",
      stats: "48,190 Followers",
      icon: <Twitter className="w-4 h-4 text-blue-400" />,
      active: false,
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
      link: basePath
    }
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your Accounts</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">You have {accounts.length} accounts</p>
        </div>
        <Link 
          href={basePath}
          className="text-blue-500 border border-blue-500 rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1 hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-3 h-3 child-stroke-3" /> Add Account
        </Link>
      </div>

      <div className="space-y-6">
        {accounts.map((acc, idx) => (
          <Link key={idx} href={acc.link} className={`flex items-center justify-between group transition-all ${acc.active ? 'cursor-default' : 'hover:translate-x-1'}`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={acc.img} className="w-10 h-10 rounded-full" alt="" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                  {acc.icon}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{acc.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">{acc.platform} • {acc.stats}</p>
              </div>
            </div>
            {acc.active ? (
              <span className="bg-pink-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-pink-100 uppercase tracking-wider">
                Active
              </span>
            ) : (
                <MoreHorizontal className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default YourAccounts;
