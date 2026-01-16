import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export interface PlatformConfig {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    name: string;
}

export const platformIcons: Record<string, PlatformConfig> = {
    instagram: {
        icon: <FaInstagram size={16} />,
        color: "text-pink-600",
        bgColor: "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500",
        name: "Instagram",
    },
    facebook: {
        icon: <FaFacebookF size={14} />,
        color: "text-blue-600",
        bgColor: "bg-[#1877F2]",
        name: "Facebook",
    },
    X: {
        icon: <FaXTwitter size={14} />,
        color: "text-black",
        bgColor: "bg-black",
        name: "X",
    },
    youtube: {
        icon: <FaYoutube size={16} />,
        color: "text-red-600",
        bgColor: "bg-[#FF0000]",
        name: "YouTube",
    },
};

export interface UploadedImage {
    id: string;
    file: File;
    preview: string;
}

export type TabType = "compose" | "preview";
export type PreviewPlatform = "instagram" | "facebook" | "X";
