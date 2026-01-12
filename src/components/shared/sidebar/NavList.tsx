"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconProps } from "@solar-icons/react";
import ImageBadge from "./ImageBadge";

interface NavListProps {
  items: Array<{
    href: string;
    label: string;
    imageUrl?: string;
    icon?: React.ComponentType<IconProps>;
  }>;
  pathname: string;
  itemHeight?: number;
}

export default function NavList({
  items,
  pathname,
  itemHeight = 58,
}: NavListProps) {
  return (
    <nav className="space-y-1 relative">
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <React.Fragment key={index}>
            {isActive && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-x-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 shadow-[0_10px_28px_-12px_rgba(249,115,22,0.65)]"
                style={{
                  // top: `${index * itemHeight -10}px`,
                  height: `${itemHeight + 1}px`,
                }}
              />
            )}
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all duration-150 relative group z-10 ${
                isActive
                  ? "text-white"
                  : "text-gray-600 hover:bg-white/70 hover:text-gray-800"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  isActive
                    ? "bg-white/15 border border-white/20 shadow-[0_6px_16px_-10px_rgba(15,23,42,0.4)]"
                    : "bg-white/70 border border-white/60 group-hover:border-white"
                }`}
              >
                {Icon ? (
                  <Icon
                    color={isActive ? "#FFFFFF" : "#6B7280"}
                    size={20}
                    className="shrink-0"
                  />
                ) : item.imageUrl ? (
                  <ImageBadge url={item.imageUrl} active={isActive} />
                ) : null}
              </span>
              <span className="tracking-tight">{item.label}</span>
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
