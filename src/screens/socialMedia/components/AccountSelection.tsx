/* eslint-disable  */

"use client";
import AccountSelectionModal from "@/components/shared/AccountSelectionModal/AccountSelectionModal";
import IntegrationCard from "@/components/shared/IntegrationCard/IntegrationCard";
import AuthContext from "@/contexts/authContext/authContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const socials = [
  {
    id: "instagram",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/250px-Instagram_logo_2022.svg.png",
    href: "https://instagram.com",
    alt: "Instagram",
    description: "Share your visual content and connect with audiences",
  },
  {
    id: "facebook",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Logo_de_Facebook.png/1028px-Logo_de_Facebook.png",
    href: "https://facebook.com",
    alt: "Facebook",
    description: "Reach billions of users with targeted content",
  },
  {
    id: "X",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/250px-X_logo.jpg",
    href: "https://x.com",
    alt: "X",
    description: "Share real-time updates and trending content",
  },
  {
    id: "linkedin",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png",
    href: "https://linkedin.com",
    alt: "LinkedIn",
    description: "Professional networking and B2B content sharing",
    comingSoon: true,
  },
  {
    id: "reddit",
    src: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Reddit_Logo_Icon.svg/250px-Reddit_Logo_Icon.svg.png",
    href: "https://reddit.com",
    alt: "Reddit",
    description: "Engage with communities and drive discussions",
    comingSoon: true,
  },
  {
    id: "youtube",
    src: "https://goodly.co.in/wp-content/uploads/2023/10/youtube-logo-png-46016-1.png",
    href: "https://youtube.com",
    alt: "YouTube",
    description: "Broadcast videos, grow subscribers and engage viewers",
  },
];

type PlatformKey =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "x"
  | "youtube"
  | "telegram";
export default function AccountSelection() {
  const searchParams = useSearchParams();
  const [connected, setConnected] = useState<string[]>([]);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  console.log("=====>user id", user?.id);
  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // const [iuser, setUser] = useState<IUser>(null);

  console.log(profile);
  const handleConnect = async (socialId: string) => {
    console.log(socialId);
    let authURL = "";
    const baseURL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

    switch (socialId) {
      case "facebook":
        authURL = `${baseURL}/api/v1/facebook/login?user_id=${user?.id}`;

        break;
      case "instagram":
        authURL = `https://a7b68de5a1df.ngrok-free.app/api/v1/ig/login-instagram?user_id=${user?.id}`;
        break;
      case "youtube":
        authURL = `${baseURL}/api/v1/youtube/auth?user_id=${user?.id}`;
      default:
        console.log("Unsupported integration title:", socialId);
        break;
    }
    if (authURL) {
      try {
        window.open(authURL, "_blank");
      } catch (e) {
        console.warn("Could not open auth URL:", e);
      }
    }
  };
  const fetchProfile = async (access_token: string, user_id?: string) => {
    console.log("Token", access_token);
    try {
      const uid = user_id ?? "";
      const res = await fetch(
        `/api/facebook/profile?access_token=${access_token}&userId=${uid}`
      );
      const data = await res.json();

      console.log(data);

      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setProfile(data.result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(msg);
      // setError(err.message);
    }
  };

  const fetchInstagramProfile = async (
    access_token: string,
    user_id?: string
  ) => {
    console.log("Token", access_token);
    try {
      const uid = user_id ?? "";
      const res = await fetch(
        `/api/instagram/profile?access_token=${access_token}&userId=${uid}`
      );
      const data = await res.json();

      console.log(data.result);

      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setProfile([data.result]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(msg);
      // setError(err.message);
    }
  };

  const fetchYoutubeChannel = async (
    access_token: string,
    user_id?: string
  ) => {
    console.log("Token", access_token);
    try {
      const uid = user_id ?? "";
      const res = await fetch(
        `/api/youtube/channel?access_token=${access_token}&userId=${uid}`
      );
      const data = await res.json();

      console.log(data.result);

      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setProfile([data.result]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(msg);
      // setError(err.message);
    }
  };

  useEffect(() => {
    // Clean Facebook hash fragment
    if (typeof window !== "undefined" && window.location.hash === "#_=_") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const platformParam = searchParams.get("platform");
    const tokenParam = searchParams.get("token");

    if (platformParam && tokenParam) {
      setPlatform(platformParam);
      setToken(tokenParam);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!token || !user?.id) return;
    if (platform === "facebook") {
      fetchProfile(token, user.id);
    } else if (platform === "instagram") {
      fetchInstagramProfile(token, user.id);
    } else if (platform === "youtube") {
      fetchYoutubeChannel(token, user.id);
    }
  }, [token, user?.id]);

  const clearAuthQuery = () => {
    try {
      router.replace(pathname);
      // Also clear hash fragments like '#_=_'
      if (typeof window !== "undefined" && window.location.hash) {
        window.history.replaceState(null, "", pathname);
      }
      // Clear local state that was populated from query params
      setPlatform(null);
      setToken(null);
    } catch (_) {
      // no-op
    }
  };

  useEffect(() => {
    if (!user) return;

    const connectedPlatforms = socials
      .map((s) => {
        const key = s.id === "twitter" ? "x" : s.id; // normalize Twitter to 'x'
        const slot = (user as any)[key];

        // Ensure slot exists and has both name & project_id/page_id/id
        if (!slot) return null;
        const hasId = !!(slot.project_id || slot.page_id || slot.id);
        const hasName =
          typeof slot.name === "string" && slot.name.trim() !== "";
        return hasId && hasName ? s.id : null;
      })
      .filter(Boolean) as string[];

    setConnected(connectedPlatforms);
  }, [user]);

  function handleAccountSelect(accountId: string): void {
    // When an account is selected in the modal, consider the current platform connected
    if (platform) {
      const uiId = platform === "x" ? "twitter" : platform; // normalize for UI list
      setConnected((prev) => (prev.includes(uiId) ? prev : [...prev, uiId]));
    }
    // Optionally store selected account id
    console.log("Selected account:", accountId);
    clearAuthQuery();
    setIsModalOpen(false);
  }

  const handleCloseModal = () => {
    clearAuthQuery();
    setIsModalOpen(false);
  };

  const toPlatformKey = (id: string | null): PlatformKey | undefined => {
    if (!id) return undefined;
    if (id === "twitter") return "x";
    const allowed: PlatformKey[] = [
      "instagram",
      "facebook",
      "linkedin",
      "x",
      "youtube",
      "telegram",
    ];
    return allowed.includes(id as PlatformKey)
      ? (id as PlatformKey)
      : undefined;
  };
  const platformKey = toPlatformKey(platform);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {socials.map((social, index) => (
          <IntegrationCard
            key={social.id}
            integration={{
              title: social.alt,
              description: social.description,
              logo: social.src,
              isConnected: connected.includes(social.id),
              comingSoon: (social as any).comingSoon ? "Coming Soon" : undefined,
            }}
            index={index}
            onConnect={() => {
              handleConnect(social.id);
            }}
            onView={(integration) => {
              if (integration.title === "YouTube") {
                router.push(`${pathname}/youtube`);
              } else if (integration.title === "Facebook") {
                const pageId = (user as any)?.facebook?.page_id || (user as any)?.facebook?.id;
                router.push(`${pathname}/facebook${pageId ? `?pageId=${pageId}` : ""}`);
              } else {
                console.log("View connection details for:", integration.title);
              }
            }}
            onDisconnect={(integration) => {
              console.log("Disconnect:", integration.title);
              // Add disconnect logic here
              setConnected(prev => prev.filter(id => id !== social.id));
            }}
            onReconnect={(integration) => {
              handleConnect(social.id);
            }}
          />
        ))}
      </div>

      {/* Modal */}
      {platformKey && (
        <AccountSelectionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          platform={platformKey}
          accounts={profile || []}
          onSelect={handleAccountSelect}
        />
      )}
    </div>
  );
}
