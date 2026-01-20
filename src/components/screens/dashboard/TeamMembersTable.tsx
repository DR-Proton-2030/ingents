"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Eye, Mail, Users, X, ArrowLeft, ArrowRight, UserCheck, UserPlus } from "lucide-react";

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
        <div className="h-full flex flex-col bg-white/40 backdrop-blur-[12px] text-gray-800 relative overflow-hidden rounded-[24px] border border-white/40 shadow-xl">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-orange-100 relative z-10 bg-white/20">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                    Team Members
                                </h2>
                                <p className="text-[11px] font-medium text-gray-500 ">
                                    Network Access Directory
                                </p>
                            </div>
                        </div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white hover:bg-orange-50 border border-gray-100 text-gray-400 hover:text-orange-500 transition-all shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search team by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded-2xl border border-gray-100 bg-white/80 py-3.5 pl-12 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-orange-500/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all shadow-inner"
                        />
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-auto px-6 py-4 relative z-10 hidescroll">
                <div className="grid grid-cols-1 gap-3">
                    {paginatedData.map((member, index) => (
                        <div
                            key={member._id || index}
                            className="group/card relative rounded-[18px] bg-white/60 p-4 border border-white hover:border-orange-500/20 hover:bg-white transition-all duration-300 shadow-[2px_2px_10px_rgba(0,0,0,0.02)]"
                        >
                            <div className="flex items-center gap-4 relative">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    {member.profile_picture ? (
                                        <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-orange-400 to-orange-100">
                                            <Image
                                                src={member.profile_picture}
                                                alt={member.full_name}
                                                width={48}
                                                height={48}
                                                className="h-12 w-12 rounded-full object-cover bg-white"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 border border-orange-200 text-base font-bold text-orange-600">
                                            {member.full_name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <span
                                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${member.has_joined ? "bg-green-500" : "bg-orange-300"
                                            }`}
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="font-bold text-gray-900 text-sm truncate tracking-tight">{member.full_name}</p>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                            {member.role?.toUpperCase() || "MEMBER"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                                        <Mail className="h-3 w-3 text-gray-400" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => router.push(`/dashboard/user-details/${member._id}`)}
                                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-orange-500 transition-all shadow-md active:scale-95"
                                        title="View Profile"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {filteredData.length === 0 && (
                        <div className="py-20 text-center relative">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
                                <Users className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="font-bold text-gray-800 text-base">No members found</p>
                            <p className="mt-1 text-xs text-gray-500 tracking-wide">Try searching with a different name or email</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {filteredData.length > 0 && (
                <div className="flex-shrink-0 border-t border-gray-100 px-6 py-5 bg-white/50 backdrop-blur-md relative z-20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>Showing</span>
                                <span className="text-orange-600 px-2 py-0.5 bg-orange-50 rounded-lg">{paginatedData.length}</span>
                                <span>of</span>
                                <span className="text-gray-900">{filteredData.length}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-gray-100 bg-white text-gray-600 hover:text-orange-500 hover:border-orange-500/20 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div className="text-xs font-bold text-gray-800 min-w-16 text-center">
                                {currentPage} <span className="text-gray-400 font-medium mx-1">/</span> {totalPages || 1}
                            </div>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-xl border border-gray-100 bg-white text-gray-600 hover:text-orange-500 hover:border-orange-500/20 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMembersTable;
