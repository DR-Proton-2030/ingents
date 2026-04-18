"use client";

import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ChevronRight,
    User,
    ShieldCheck,
    Search as SearchIcon,
} from "lucide-react";
import {
    ArchiveMinimalistic,
    ChatSquare,
    Folder,
    HashtagSquare,
    Home,
    Letter,
    Wallet,
    GraphUp,
    Settings,
} from "@solar-icons/react";
import { useRouter } from "next/navigation";
import { useSite } from "@/contexts/SiteContext";
import API from "@/utils/api/api";
import { createPortal } from "react-dom";

interface SearchResult {
    id: string;
    label: string;
    type: "navigation" | "user" | "setting" | "project";
    href: string;
    icon: any;
    category: string;
}

export const UniversalSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mounted, setMounted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { site } = useSite();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Features / Navigation items to search locally
    const staticItems: SearchResult[] = useMemo(() => [
        // Navigation & Dashboard
        { id: "dashboard", label: "Dashboard", type: "navigation", href: `/${site}`, icon: Home, category: "Navigation" },

        // Management
        { id: "project-mgmt", label: "Project Management", type: "navigation", href: `/${site}/project-management`, icon: Folder, category: "Management" },
        { id: "tasks", label: "Task Management", type: "navigation", href: `/${site}/tasks`, icon: ArchiveMinimalistic, category: "Management" },
        { id: "campaigns", label: "Campaigns & Marketing", type: "navigation", href: `/${site}/campaigns`, icon: HashtagSquare, category: "Management" },
        { id: "social", label: "Social Media Center", type: "navigation", href: `/${site}/social-media`, icon: ChatSquare, category: "Management" },


        // Communication
        { id: "team-chat", label: "Team Chat", type: "navigation", href: `/${site}/team-chat`, icon: ChatSquare, category: "Communication" },
        { id: "support", label: "Help & Support", type: "navigation", href: `/${site}/support`, icon: User, category: "Communication" },

        // Tools & Data
        { id: "storage", label: "Cloud Storage", type: "navigation", href: `/${site}/storage`, icon: Folder, category: "Operations" },
        { id: "users", label: "User Management", type: "navigation", href: `/${site}/all-users`, icon: User, category: "Operations" },

        // Actions
        { id: "create-post", label: "Create Social Post", type: "project", href: `/${site}/social-media/create-post`, icon: ChatSquare, category: "Quick Actions" },

        // Settings
        { id: "profile", label: "Personal Profile", type: "setting", href: `/${site}/profile-settings`, icon: User, category: "Settings" },
        { id: "security", label: "Security & Safety", type: "setting", href: `/${site}/profile-settings`, icon: ShieldCheck, category: "Settings" },
        { id: "subscription", label: "Billing & Subscription", type: "setting", href: `/${site}/subscription`, icon: Wallet, category: "Settings" },
    ], [site]);

    // Handle Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "/") {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Search Logic
    useEffect(() => {
        if (!query.trim()) {
            setResults(staticItems); // Show static items by default
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            const regex = new RegExp(query, "i");
            const filteredStatic = staticItems.filter(item =>
                regex.test(item.label) || regex.test(item.category)
            );

            let dynamicResults: SearchResult[] = [];
            try {
                const res = await API.get(`/users/search?query=${query}`);
                if (res.data?.data) {
                    dynamicResults = res.data.data.map((u: any) => ({
                        id: u._id,
                        label: u.full_name,
                        type: "user" as const,
                        href: `/${site}/profile-settings`,
                        icon: User,
                        category: "Organization"
                    }));
                }
            } catch (error) {
                console.error("User search failed", error);
            }

            setResults([...filteredStatic, ...dynamicResults]);
            setIsLoading(false);
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query, staticItems, site]);

    const handleSelect = (result: SearchResult) => {
        router.push(result.href);
        setIsOpen(false);
        setQuery("");
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter") {
            if (results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            }
        }
    };

    const searchOverlay = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex flex-col items-center pt-[15vh] px-4">
                    {/* Blurred Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-[20px]"
                    />

                    <div className="w-full max-w-2xl space-y-3 relative z-[99999]">
                        {/* SEARCH BAR */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white/70 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-4 px-6 flex items-center gap-4"
                        >
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Search everything..."
                                className="flex-1 bg-transparent text-lg font-medium text-gray-900 placeholder:text-gray-500 outline-none"
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-300 tracking-wider">ESC TO CLOSE</span>
                            </div>
                        </motion.div>

                        {/* RESULTS CARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-white/70 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden"
                        >
                            <div className="max-h-[50vh] overflow-y-auto">
                                {results.length > 0 ? (
                                    <div className="pb-2">
                                        {Object.entries(
                                            results.reduce((acc, result) => {
                                                if (!acc[result.category]) acc[result.category] = [];
                                                acc[result.category].push(result);
                                                return acc;
                                            }, {} as Record<string, SearchResult[]>)
                                        ).map(([category, items]) => (
                                            <div key={category}>
                                                <div className="bg-gray-50/50 px-6 py-2.5 border-b border-gray-100/50">
                                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{category}</h3>
                                                </div>

                                                <div className="px-2 py-1.5">
                                                    {items.map((item) => {
                                                        const Icon = item.icon;
                                                        const isSelected = results[selectedIndex]?.id === item.id;
                                                        return (
                                                            <button
                                                                key={item.id}
                                                                onClick={() => handleSelect(item)}
                                                                onMouseEnter={() => setSelectedIndex(results.indexOf(item))}
                                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${isSelected ? "bg-gray-50" : "bg-transparent"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`p-2 rounded-lg transition-all duration-200 ${isSelected ? "bg-white text-gray-900 " : "text-gray-400 group-hover:text-gray-900"
                                                                        }`}>
                                                                        <Icon className="w-5 h-5" strokeWidth={2} />
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-4">
                                                                    <ChevronRight className={`w-4 h-4 transition-all duration-200 ${isSelected ? "text-gray-400 translate-x-0" : "text-transparent -translate-x-2"
                                                                        }`} />
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : !isLoading ? (
                                    <div className="p-12 text-center text-gray-300 text-sm font-medium">
                                        No results found for "{query}"
                                    </div>
                                ) : (
                                    <div className="p-12 flex justify-center">
                                        <div className="w-6 h-6 border-2 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            {/* Minimalism Footer */}
                            <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-1">
                                        <span className="px-1.5 py-0.5 rounded border border-gray-200 bg-white">↑↓</span>
                                        <span>Navigate</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="px-1.5 py-0.5 rounded border border-gray-200 bg-white">↵</span>
                                        <span>Select</span>
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                    INGENTS UNIVERSAL SEARCH
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="relative w-full max-w-xl group cursor-pointer"
            >
                <div className="w-full flex items-center bg-[#f7f9fc] border border-transparent rounded-full pl-12 pr-4 py-4 text-sm text-[#a0aec0] font-medium group-hover:bg-[#f1f4f8] transition-all">
                    What would you like to find today?
                </div>
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a0aec0] group-hover:text-gray-900 transition-colors" />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-all font-serif italic text-xs text-[#a0aec0]">
                    /
                </div>
            </div>

            {mounted && typeof document !== "undefined" ? createPortal(searchOverlay, document.body) : null}
        </>
    );
};

