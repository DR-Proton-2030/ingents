"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/screens/layout/Layout";
import { api } from "@/utils/api";
import { Search, Power, Settings2, ExternalLink, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface IntegrationApp {
    name: string;
    displayName: string;
    description: string;
    logo: string;
    isConnected: boolean;
    status: string;
    category: string;
}

interface IntegrationsScreenProps {
    isEmbedded?: boolean;
    title?: string;
    projectContext?: string;
}

const FEATURED_APPS = [
    {
        name: "github",
        displayName: "GitHub",
        description: "Connect your repositories to automate issues and PRs.",
        logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        category: "Development"
    },
    {
        name: "slack",
        displayName: "Slack",
        description: "Send notifications and interact with channels.",
        logo: "https://cdn.brandfolder.io/5H075877/at/pl946bt8v399vcm.png",
        category: "Communication"
    },
    {
        name: "googlecalendar",
        displayName: "Google Calendar",
        description: "Manage meetings and schedule events automatically.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
        category: "Productivity"
    },
    {
        name: "gmail",
        displayName: "Gmail",
        description: "Read, summarize, and draft emails with AI.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
        category: "Productivity"
    },
    {
        name: "discord",
        displayName: "Discord",
        description: "Automate your community management and messages.",
        logo: "https://assets-global.website-files.com/6257adef93867e3d034a781d/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
        category: "Communication"
    },
    {
        name: "trello",
        displayName: "Trello",
        description: "Sync tasks and manage boards directly.",
        logo: "https://cdn.iconscout.com/icon/free/png-256/free-trello-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-card-pack-logos-icons-189794.png?f=webp&w=256",
        category: "Project Management"
    }
];

export const IntegrationsScreen: React.FC<IntegrationsScreenProps> = ({ 
    isEmbedded = false,
    title = "Connected Tools",
    projectContext
}) => {
    const [apps, setApps] = useState<IntegrationApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const integrations = await api.integration.getIntegrations(projectContext);
                if (Array.isArray(integrations)) {
                    const merged = FEATURED_APPS.map(featured => {
                        const conn = integrations.find((c: any) => c.name === featured.name);
                        return {
                            ...featured,
                            isConnected: conn?.isConnected || false,
                            status: conn?.status || 'none'
                        };
                    });
                    setApps(merged as IntegrationApp[]);
                } else {
                    setApps(FEATURED_APPS.map(a => ({ ...a, isConnected: false, status: 'none' })));
                }
            } catch (err) {
                console.error("Failed to fetch integrations:", err);
                setApps(FEATURED_APPS.map(a => ({ ...a, isConnected: false, status: 'none' })));
            } finally {
                setLoading(false);
            }
        };

        fetchIntegrations();
    }, [projectContext]);

    const handleConnect = async (toolkitName: string) => {
        try {
            const res = await api.integration.initiateConnection(toolkitName, undefined, projectContext);
            if (res?.authUrl) {
                window.location.href = res.authUrl;
            }
        } catch (err) {
            console.error("Connection failed:", err);
        }
    };

    const filteredApps = apps.filter(app => 
        app.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const Content = (
        <div className={`mx-auto max-w-7xl px-6 py-10 ${isEmbedded ? "max-h-[85vh] overflow-y-auto custom-scrollbar" : ""}`}>
            <div className="mb-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
                        <p className="mt-3 text-lg text-gray-500 max-w-2xl">
                            Connect your favorite applications to supercharge your Virtual Assistant.
                            Allow AI to perform actions across your workspace automatically.
                        </p>
                    </div>
                    
                    <div className="relative group min-w-[320px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search apps or categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                        />
                    </div>
                </motion.div>

                <div className="flex gap-4 mt-8">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-100">
                        <ShieldCheck className="h-4 w-4" />
                        Enterprise Secure OAuth
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
                        <Zap className="h-4 w-4" />
                        AI-Powered Execution
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[32px]" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr pb-10">
                    {filteredApps.map((app, index) => (
                        <motion.div
                            key={app.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative flex flex-col bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="h-16 w-16 rounded-2xl bg-gray-50 p-3 overflow-hidden border border-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                    <img src={app.logo} alt={app.displayName} className="h-full w-full object-contain" />
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                    app.isConnected ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-400 border border-gray-100'
                                }`}>
                                    {app.isConnected ? 'Connected' : 'Not Connected'}
                                </div>
                            </div>

                            <div className="mt-6">
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{app.category}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">{app.displayName}</h3>
                                <p className="mt-2 text-sm text-gray-500 leading-relaxed font-medium">
                                    {app.description}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 flex items-center gap-3">
                                {app.isConnected ? (
                                    <>
                                        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 py-3 rounded-2xl text-white text-sm font-bold hover:bg-black transition-colors">
                                            <Settings2 className="h-4 w-4" />
                                            Configure
                                        </button>
                                        <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                            <Power className="h-5 w-5" />
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => handleConnect(app.name)}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 py-4 rounded-2xl text-white text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Connect {app.displayName}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );

    if (isEmbedded) return Content;

    return (
        <Layout showSidebar={true}>
            {Content}
        </Layout>
    );
};

export default IntegrationsScreen;
