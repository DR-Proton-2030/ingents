"use client";
import React, { useState } from "react";
import { MinusCircle, AddCircle, CloseCircle } from "@solar-icons/react";
import { SearchIcon, Plus, Tag } from "lucide-react";
import { useTaskTags } from "@/hooks/useTaskTags";
import { cn } from "@/lib/utils";
import { TagPickerProps } from "@/types/interface/props/tagPicker.props";



const COLORS = [
    "#F97316", "#3B82F6", "#22C55E", "#EF4444", "#A855F7", 
    "#EC4899", "#06B6D4", "#64748B", "#F59E0B", "#10B981"
];

const TagPicker: React.FC<TagPickerProps> = ({
    selectedTagIds,
    onAddTag,
    onRemoveTag,
    onClose,
}) => {
    const { tags, createTag, loading } = useTaskTags();
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState(COLORS[0]);

    const filteredTags = tags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;
        try {
            const createdTag = await createTag(newTagName, newTagColor);
            if (createdTag) {
                onAddTag(createdTag);
                setNewTagName("");
                setIsCreating(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const selectedTags = tags.filter(tag => selectedTagIds.includes(tag._id));

    return (
        <div className="space-y-6">
            {/* <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full h-12 pl-11 pr-4 rounded-2xl transition-all outline-none text-sm font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/10 border border-transparent focus:border-orange-500 text-gray-800"
                />
            </div> */}

            {!isCreating ? (
                <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                    className="w-full h-11 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Create New Tag
                </button>
            ) : (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Tag</span>
                        <button type="button" onClick={() => setIsCreating(false)}>
                            <CloseCircle className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                    </div>
                    <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Tag name..."
                        className="w-full h-10 px-3 rounded-xl border border-gray-100 outline-none text-sm font-medium"
                        autoFocus
                    />
                    <div className="flex flex-wrap gap-2">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setNewTagColor(color)}
                                className={cn(
                                    "w-6 h-6 rounded-full transition-all transform hover:scale-110",
                                    newTagColor === color ? "ring-2 ring-offset-2 ring-gray-400" : ""
                                )}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleCreateTag}
                        disabled={!newTagName.trim()}
                        className="w-full h-10 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 disabled:opacity-50 disabled:grayscale transition-all"
                    >
                        Create Tag
                    </button>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1 border-b border-gray-100 pb-2">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Tags</h5>
                </div>
                <div className="max-h-[200px] overflow-y-auto pr-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-2">
                             <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fetching tags...</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-x-2 gap-y-3">
                            {filteredTags.map((tag) => {
                                const isSelected = selectedTagIds.includes(tag._id);
                                return (
                                    <button
                                        key={tag._id}
                                        type="button"
                                        onClick={() => isSelected ? onRemoveTag(tag._id) : onAddTag(tag)}
                                        className={cn(
                                            "h-9 px-3 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 border uppercase tracking-tight",
                                            isSelected 
                                                ? "border-2 border-gray-400/20" 
                                                : "hover:bg-opacity-20 bg-opacity-10 border-transparent"
                                        )}
                                        style={{ 
                                            backgroundColor: `${tag.color}15`, 
                                            color: tag.color,
                                            borderColor: isSelected ? tag.color : `${tag.color}30`
                                        }}
                                    >
                                        <Tag className="w-3 h-3 shrink-0" />
                                        <span className="truncate max-w-[120px] block transform translate-y-[0.5px]">
                                            {tag.name}
                                        </span>
                                        {isSelected ? (
                                            <MinusCircle className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                        ) : (
                                            <AddCircle className="w-3.5 h-3.5 shrink-0 opacity-40 hover:opacity-80 transition-opacity" />
                                        )}
                                    </button>
                                );
                            })}
                            {filteredTags.length === 0 && (
                                <p className="text-xs text-gray-400 text-center w-full py-4 italic">
                                    {searchQuery ? "No tags match your search" : "No tags available yet"}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="w-full h-12 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200 mt-4"
            >
                Done
            </button>
        </div>
    );
};

export default TagPicker;
