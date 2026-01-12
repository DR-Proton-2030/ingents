"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Eye, Mail, Users, UserPlus, X } from "lucide-react";

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
    const itemsPerPage = 10;
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
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-gray-100">

                {/* Title Section */}
                <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center gap-3 mb-4">

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800/90">Team Members</h2>
                            <p className="text-xs text-gray-500">Manage your team</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800/80 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
                        />
                        <Search className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
                    </div>


                </div>
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-auto px-4 py-3">
                <div className="space-y-2">
                    {paginatedData.map((member, index) => (
                        <div
                            key={member._id || index}
                            className="rounded-[20px] bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md hover:border-orange-100"
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    {member.profile_picture ? (
                                        <Image
                                            src={member.profile_picture}
                                            alt={member.full_name}
                                            width={44}
                                            height={44}
                                            className="h-11 w-11 rounded-full object-cover ring-2 ring-gray-100"
                                        />
                                    ) : (
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-bold text-white ring-2 ring-gray-100">
                                            {member.full_name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <span
                                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${member.has_joined ? "bg-emerald-500" : "bg-amber-400"
                                            }`}
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800/90 truncate">{member.full_name}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                                        <Mail className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                </div>

                                {/* Status & Action */}
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${member.has_joined
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {member.has_joined ? "Joined" : "Pending"}
                                    </span>
                                    <button
                                        onClick={() => router.push(`/dashboard/user-details/${member._id}`)}
                                        className="flex items-center gap-1 
                                    rounded-xl bg-black/70 px-2.5 py-2 text-xs font-medium text-white hover:bg-black/60 transition-colors">
                                        <Eye className="h-3 w-3" />
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {paginatedData.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                <Users className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="font-medium text-gray-600">No members found</p>
                            <p className="mt-1 text-sm text-gray-400">Try adjusting your search</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {filteredData.length > 0 && (
                <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            {paginatedData.length} of {filteredData.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="rounded-md px-2.5 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>
                            <span className="px-2 text-gray-400">{currentPage}/{totalPages || 1}</span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="rounded-md px-2.5 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMembersTable;
