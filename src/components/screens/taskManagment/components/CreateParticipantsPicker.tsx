"use client";
import React from "react";
import { MinusCircle, AddCircle } from "@solar-icons/react";
import { SearchIcon } from "lucide-react";
import { IUser } from "@/types/interface/user.interface";

interface CreateParticipantsPickerProps {
    searchQuery: string;
    filteredUsers: IUser[];
    selectedUsers: IUser[];
    onSearchChange: (query: string) => void;
    onAddAssignee: (user: IUser) => void;
    onRemoveAssignee: (userId: string) => void;
    onClose: () => void;
}

const CreateParticipantsPicker: React.FC<CreateParticipantsPickerProps> = ({
    searchQuery,
    filteredUsers,
    selectedUsers,
    onSearchChange,
    onAddAssignee,
    onRemoveAssignee,
    onClose,
}) => {
    return (
        <div className="space-y-6">
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search teammates..."
                    className="w-full h-12 pl-11 pr-4 rounded-2xl transition-all outline-none text-sm font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/10 border border-transparent focus:border-orange-500 text-gray-800"
                />

                {searchQuery.trim() && filteredUsers.length > 0 && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="p-2 max-h-64 overflow-y-auto">
                            {filteredUsers.map((u: any) => (
                                <button
                                    key={u.id || u._id}
                                    type="button"
                                    onClick={() => onAddAssignee(u)}
                                    className="w-full p-2.5 flex items-center gap-3 hover:bg-orange-50 rounded-xl transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white text-gray-600 flex items-center justify-center text-xs font-bold border border-gray-100 shadow-sm uppercase overflow-hidden">
                                        {u.profile_picture ? (
                                            <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            u.full_name?.charAt(0) || "?"
                                        )}
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-orange-600 truncate">{u.full_name}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                                    </div>
                                    <AddCircle className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1 border-b border-gray-100 pb-2">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Assignees ({selectedUsers.length})</h5>
                </div>
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {selectedUsers.map((u: any) => (
                        <div key={u.id || u._id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-black shadow-sm uppercase overflow-hidden">
                                {u.profile_picture ? (
                                    <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    u.full_name?.charAt(0) || "?"
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800 truncate">{u.full_name}</p>
                                <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                            </div>
                            <button type="button" onClick={() => onRemoveAssignee(u.id || u._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <MinusCircle className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {selectedUsers.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-xs font-bold text-gray-400">Search above to assign people</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="w-full h-12 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200 mt-4"
            >
                Done Managing
            </button>
        </div>
    );
};

export default CreateParticipantsPicker;
