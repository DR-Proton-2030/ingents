"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SolarIconProps } from "solar-icon-set";
import ImageBadge from "./ImageBadge";

interface NavListProps {
  items: Array<{
    href: string;
    label: string;
    imageUrl?: string;
    icon?: React.ComponentType<SolarIconProps>;
  }>;
  pathname: string;
  itemHeight?: number;
}

export default function NavList({
  items,
  pathname,
  itemHeight = 64,
}: NavListProps) {
  return (
    <nav className="space-y-2 relative">
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <React.Fragment key={index}>
            {isActive && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-x-0 bg-orange-500 shadow-lg rounded-full"
                style={{
                  top: `${index * itemHeight}px`,
                  height: `${itemHeight - 8}px`,
                }}
              />
            )}
            <Link
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-4 rounded-full text-sm transition-all duration-100 relative group z-10 ${
                isActive
                  ? "text-white"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-500/5 hover:via-purple-500/5 hover:to-pink-500/5 hover:text-gray-800 hover:backdrop-blur-lg"
              }`}
            >
              {Icon ? (
                <Icon
                  color={isActive ? "#FFFFFF" : "#6B7280"}
                  size={24}
                  className="shrink-0"
                />
              ) : item.imageUrl ? (
                <ImageBadge url={item.imageUrl} active={isActive} />
              ) : null}
              <span className="font-medium">{item.label}</span>
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
