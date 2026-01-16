"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Eye, Mail, Users, UserPlus, X, Terminal, ArrowLeft, ArrowRight } from "lucide-react";

interface TeamMember {
    _id: string;
    full_name: string;
    email: string;
    profile_picture?: string;
    role: string;
    has_joined: boolean;
    events_count?: number;
}

interface TeamMembersTableProps {
    data: TeamMember[];
    onClose?: () => void;
}

export const TeamMembersTable = ({ data, onClose }: TeamMembersTableProps) => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const router = useRouter();

    // Filter data based on search
    const filteredData = data.filter((member) => {
        const term = search.toLowerCase().trim();
        if (!term) return true;
        return (
            (member.full_name || "").toLowerCase().includes(term) ||
            (member.email || "").toLowerCase().includes(term)
        );
    });

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="h-full flex flex-col bg-[#0b0118] text-cyan-50 relative overflow-hidden">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00ffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            {/* Header */}
            <div className="flex-shrink-0 border-b border-cyan-500/20 relative z-10 bg-[#0b0118]/80 backdrop-blur-xl">
                <div className="px-6 pt-8 pb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                                <Terminal className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-wider italic flex items-center gap-2">
                                    <span className="text-cyan-400">Personnel</span> Database
                                </h2>
                                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-magenta-500/70">Secure Nexus Access Level v4.0</p>
                            </div>
                        </div>
                        {onClose && (
                            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-magenta-500/20 border border-white/10 hover:border-magenta-500/50 text-magenta-400 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="INITIALIZING SCAN FOR SECTOR AGENTS..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded-2xl border border-cyan-500/20 bg-black/40 py-4 pl-12 pr-4 text-sm font-mono text-cyan-400 placeholder:text-cyan-900 focus:border-cyan-400 focus:bg-cyan-500/5 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-auto px-6 py-4 relative z-10 custom-cyber-scrollbar">
                <div className="grid grid-cols-1 gap-4">
                    {paginatedData.map((member, index) => (
                        <div
                            key={member._id || index}
                            className="group/card relative rounded-[20px] bg-white/5 p-4 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 shadow-sm"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none border-t border-r border-cyan-500/0 group-hover/card:border-cyan-500/50 rounded-tr-[20px] transition-all"></div>

                            <div className="flex items-center gap-4 relative">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-cyan-500/20 blur-[10px] rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                    {member.profile_picture ? (
                                        <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-cyan-500 to-magenta-500">
                                            <Image
                                                src={member.profile_picture}
                                                alt={member.full_name}
                                                width={52}
                                                height={52}
                                                className="h-13 w-13 rounded-full object-cover bg-[#0b0118]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-magenta-500/20 to-cyan-500/20 border border-cyan-500/30 text-lg font-black text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                            {member.full_name?.charAt(0).toUpperCase() || "!"}
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <span
                                        className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#0b0118] ${member.has_joined ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-magenta-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                                            }`}
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold text-white text-lg truncate tracking-tight">{member.full_name}</p>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                            {member.role?.toUpperCase() || "OPERATIVE"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-500/60 truncate">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <button
                                        onClick={() => router.push(`/dashboard/user-details/${member._id}`)}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-black border border-white/10 text-cyan-400 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all">
                                        <Eye className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {filteredData.length === 0 && (
                        <div className="py-20 text-center relative">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/5 border border-cyan-500/10 shadow-inner">
                                <Users className="h-10 w-10 text-cyan-900 animate-pulse" />
                            </div>
                            <p className="font-mono text-cyan-400 text-lg uppercase tracking-widest">Zero Signals Captured</p>
                            <p className="mt-2 text-sm text-cyan-900 font-mono italic">Adjust scanner frequency and retry...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {filteredData.length > 0 && (
                <div className="flex-shrink-0 border-t border-cyan-500/20 px-6 py-6 bg-[#0b0118]/80 backdrop-blur-xl relative z-20">
                    <div className="flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 p-2 px-4 rounded-full bg-black border border-cyan-500/20 text-cyan-100">
                                <span className="text-magenta-500 font-black">{paginatedData.length}</span> / {filteredData.length} UNITS
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 rounded-xl px-4 py-2 bg-black border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                PREV
                            </button>
                            <div className="bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20">
                                <span className="text-cyan-400 font-bold">{currentPage}</span> / {totalPages || 1}
                            </div>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="flex items-center gap-2 rounded-xl px-4 py-2 bg-black border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            >
                                NEXT
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-cyber-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-cyber-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-cyber-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-cyber-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

export default TeamMembersTable;
