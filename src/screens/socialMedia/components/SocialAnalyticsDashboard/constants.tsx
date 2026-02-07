import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export interface PlatformConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  followerKey?: string;
  authEndpoint?: string;
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <FaInstagram className="w-6 h-6" />,
    color: "text-pink-500",
    bgColor: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
    followerKey: "followers_count",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <FaFacebook className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    followerKey: "followers_count",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <FaYoutube className="w-6 h-6" />,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    followerKey: "subscriberCount",
  },
  {
    id: "x",
    name: "X",
    icon: <FaXTwitter className="w-6 h-6" />,
    color: "text-gray-900",
    bgColor: "bg-gray-500/10",
    followerKey: "followers_count",
  },
];

export const DEFAULT_MONTHLY_DATA = [
  { month: "Jan", followers: 180000, viewers: 45000 },
  { month: "Feb", followers: 95000, viewers: 25000 },
  { month: "Mar", followers: 78000, viewers: 35000 },
  { month: "Apr", followers: 210000, viewers: 68000 },
  { month: "May", followers: 75000, viewers: 42000 },
  { month: "Jun", followers: 145000, viewers: 55000 },
  { month: "Jul", followers: 95000, viewers: 48000 },
  { month: "Aug", followers: 68000, viewers: 32000 },
];

export const formatNumber = (num: number): string => {
  if (!num) return "0";
  const n = Number(num);
  if (n >= 10000000) return (n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1) + " Cr";
  if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + " M";
  if (n >= 100000) return (n / 100000).toFixed(n % 100000 === 0 ? 0 : 1) + " Lakh";
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + " K";
  return n.toLocaleString();
};

export const getAuthUrl = (platformId: string, userId: string, baseURL: string): string => {
  switch (platformId) {
    case "facebook":
      return `${baseURL}/api/v1/facebook/login?user_id=${userId}`;
    case "instagram":
      return `https://a7b68de5a1df.ngrok-free.app/api/v1/ig/login-instagram?user_id=${userId}`;
    case "youtube":
      return `${baseURL}/api/v1/youtube/auth?user_id=${userId}`;
    case "x":
      return `${baseURL}/api/v1/x/login?user_id=${userId}`;
    default:
      return "";
  }
};
