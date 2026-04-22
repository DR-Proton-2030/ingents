import React from "react";
import { ExternalLink } from "lucide-react";

// File category detection and icon/color mapping
const FILE_CATEGORIES: Array<{
    match: RegExp;
    label: string;
    icon: string;
    bgColor: string;
    textColor: string;
}> = [
    {
        match: /\.(doc|docx|txt|rtf|odt|pages)$/i,
        label: "Document",
        icon: "📄",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
    },
    {
        match: /\.(xls|xlsx|csv|tsv|numbers)$/i,
        label: "Spreadsheet",
        icon: "📊",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
    },
    {
        match: /\.(ppt|pptx|key|odp)$/i,
        label: "Presentation",
        icon: "📽️",
        bgColor: "bg-orange-50",
        textColor: "text-orange-600",
    },
    {
        match: /\.(pdf)$/i,
        label: "PDF",
        icon: "📕",
        bgColor: "bg-red-50",
        textColor: "text-red-600",
    },
    {
        match: /\.(jpg|jpeg|png|gif|svg|webp|bmp|ico|heic)$/i,
        label: "Image",
        icon: "🖼️",
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
    },
    {
        match: /\.(mp4|mov|avi|mkv|webm|flv)$/i,
        label: "Video",
        icon: "🎬",
        bgColor: "bg-pink-50",
        textColor: "text-pink-600",
    },
    {
        match: /\.(mp3|wav|aac|flac|ogg|m4a)$/i,
        label: "Audio",
        icon: "🎵",
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-600",
    },
    {
        match: /\.(zip|rar|7z|tar|gz|bz2)$/i,
        label: "Archive",
        icon: "📦",
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
    },
    {
        match: /\.(js|ts|tsx|jsx|py|java|go|rs|c|cpp|html|css|json|xml|yaml|yml|md)$/i,
        label: "Code",
        icon: "💻",
        bgColor: "bg-cyan-50",
        textColor: "text-cyan-600",
    },
    {
        match: /\.(fig|sketch|psd|ai|xd)$/i,
        label: "Design",
        icon: "🎨",
        bgColor: "bg-fuchsia-50",
        textColor: "text-fuchsia-600",
    },
];

// Google Docs / Sheets / Slides detection (no file extension, use name patterns)
const GOOGLE_CATEGORIES: Array<{
    match: RegExp;
    label: string;
    icon: string;
    bgColor: string;
    textColor: string;
}> = [
    {
        match: /\(Responses\)$/i,
        label: "Spreadsheet",
        icon: "📊",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
    },
];

const DEFAULT_CATEGORY = {
    label: "File",
    icon: "📁",
    bgColor: "bg-gray-50",
    textColor: "text-gray-500",
};

function getFileCategory(fileName: string) {
    for (const cat of FILE_CATEGORIES) {
        if (cat.match.test(fileName)) return cat;
    }
    for (const cat of GOOGLE_CATEGORIES) {
        if (cat.match.test(fileName)) return cat;
    }
    return DEFAULT_CATEGORY;
}

interface DashboardFileItemProps {
    file: {
        name: string;
        when: string;
        webViewLink?: string;
    };
}

export const DashboardFileItem: React.FC<DashboardFileItemProps> = ({ file }) => {
    const category = getFileCategory(file.name);

    return (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white hover:bg-gray-50/80 transition-all duration-200 group">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`h-10 w-10 ${category.bgColor} rounded-xl flex items-center justify-center text-lg shrink-0`}>
                    {category.icon}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-gray-700 truncate">
                        {file.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${category.bgColor} ${category.textColor}`}>
                            {category.label}
                        </span>
                        <span className="text-[11px] text-gray-400">
                            {file.when}
                        </span>
                    </div>
                </div>
            </div>

            {file.webViewLink && (
                <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    title="Open file"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>
            )}
        </div>
    );
};
