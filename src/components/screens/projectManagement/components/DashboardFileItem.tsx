import React from "react";
import { ExternalLink } from "lucide-react";
import {
    DocumentText,
    Document,
    FileText,
    Gallery,
    Videocamera,
    MusicNote,
    ZipFile,
    Code,
    FigmaFile,
    File,
} from "@solar-icons/react";

// File category detection and icon/color mapping
const FILE_CATEGORIES: Array<{
    match: RegExp;
    label: string;
    Icon: React.ComponentType<any>;
    bgColor: string;
    iconColor: string;
}> = [
    {
        match: /\.(doc|docx|txt|rtf|odt|pages)$/i,
        label: "Document",
        Icon: DocumentText,
        bgColor: "bg-blue-50",
        iconColor: "#3B82F6",
    },
    {
        match: /\.(xls|xlsx|csv|tsv|numbers)$/i,
        label: "Spreadsheet",
        Icon: FileText,
        bgColor: "bg-emerald-50",
        iconColor: "#10B981",
    },
    {
        match: /\.(ppt|pptx|key|odp)$/i,
        label: "Presentation",
        Icon: Document,
        bgColor: "bg-orange-50",
        iconColor: "#F97316",
    },
    {
        match: /\.(pdf)$/i,
        label: "PDF",
        Icon: DocumentText,
        bgColor: "bg-red-50",
        iconColor: "#EF4444",
    },
    {
        match: /\.(jpg|jpeg|png|gif|svg|webp|bmp|ico|heic)$/i,
        label: "Image",
        Icon: Gallery,
        bgColor: "bg-purple-50",
        iconColor: "#8B5CF6",
    },
    {
        match: /\.(mp4|mov|avi|mkv|webm|flv)$/i,
        label: "Video",
        Icon: Videocamera,
        bgColor: "bg-pink-50",
        iconColor: "#EC4899",
    },
    {
        match: /\.(mp3|wav|aac|flac|ogg|m4a)$/i,
        label: "Audio",
        Icon: MusicNote,
        bgColor: "bg-indigo-50",
        iconColor: "#6366F1",
    },
    {
        match: /\.(zip|rar|7z|tar|gz|bz2)$/i,
        label: "Archive",
        Icon: ZipFile,
        bgColor: "bg-amber-50",
        iconColor: "#F59E0B",
    },
    {
        match: /\.(js|ts|tsx|jsx|py|java|go|rs|c|cpp|html|css|json|xml|yaml|yml|md)$/i,
        label: "Code",
        Icon: Code,
        bgColor: "bg-cyan-50",
        iconColor: "#06B6D4",
    },
    {
        match: /\.(fig|sketch|psd|ai|xd)$/i,
        label: "Design",
        Icon: FigmaFile,
        bgColor: "bg-fuchsia-50",
        iconColor: "#D946EF",
    },
];

// Google Docs / Sheets / Slides detection (no file extension, use name patterns)
const GOOGLE_CATEGORIES: Array<{
    match: RegExp;
    label: string;
    Icon: React.ComponentType<any>;
    bgColor: string;
    iconColor: string;
}> = [
    {
        match: /\(Responses\)$/i,
        label: "Spreadsheet",
        Icon: FileText,
        bgColor: "bg-emerald-50",
        iconColor: "#10B981",
    },
];

const DEFAULT_CATEGORY = {
    label: "File",
    Icon: File,
    bgColor: "bg-gray-50",
    iconColor: "#6B7280",
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
    const IconComponent = category.Icon;

    return (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white hover:bg-gray-50/80 transition-all duration-200 group">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`h-10 w-10 ${category.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                    <IconComponent className="h-5 w-5" color={category.iconColor} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-gray-700 truncate">
                        {file.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${category.bgColor}`} style={{ color: category.iconColor }}>
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
