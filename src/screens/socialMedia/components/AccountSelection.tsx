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
    id: "x",
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
  {
    id: "whatsapp",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png",
    href: "https://business.whatsapp.com",
    alt: "WhatsApp",
    description: "Connect WhatsApp Cloud API to broadcast targeted messages",
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
  console.log("=====>user id", user?._id);
  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // WhatsApp settings state
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [waPhoneNumberId, setWaPhoneNumberId] = useState("");
  const [waAccessToken, setWaAccessToken] = useState("");
  const [waWabaId, setWaWabaId] = useState("");
  const [connectingWa, setConnectingWa] = useState(false);

  console.log(profile);
  const handleConnect = async (socialId: string) => {
    console.log(socialId);
    let authURL = "";
    const baseURL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";

    switch (socialId) {
      case "facebook":
        authURL = `${baseURL}/api/v1/facebook/login?user_id=${user?._id}`;

        break;
      case "instagram":
        authURL = `https://a7b68de5a1df.ngrok-free.app/api/v1/ig/login-instagram?user_id=${user?._id}`;
        break;
      case "youtube":
        authURL = `${baseURL}/api/v1/youtube/auth?user_id=${user?._id}`;
        break;
      case "x":
        authURL = `${baseURL}/api/v1/x/login?user_id=${user?._id}`;
        break;
      case "whatsapp":
        setIsWhatsappModalOpen(true);
        break;
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
      if (data.result) {
        setProfile(Array.isArray(data.result) ? data.result : [data.result]);
      }
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
      if (data.result) {
        setProfile([data.result]);
      }
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
      if (data.result) {
        setProfile([data.result]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(msg);
      // setError(err.message);
    }
  };

  const fetchXProfile = async (
    access_token: string,
    user_id?: string
  ) => {
    console.log("Token", access_token);
    try {
      const uid = user_id ?? "";
      const res = await fetch(
        `/api/x/profile?access_token=${access_token}&userId=${uid}`
      );
      const data = await res.json();

      console.log("X RAW Data:", data);

      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      
      if (data.result) {
        setProfile(Array.isArray(data.result) ? data.result : [data.result]);
      }
     
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("fetchXProfile Error:", msg);
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
    if (!token || !user?.id || !platform) return;
    const normalizedPlatform = platform.toLowerCase();
    if (normalizedPlatform === "facebook") {
      fetchProfile(token, user.id);
    } else if (normalizedPlatform === "instagram") {
      fetchInstagramProfile(token, user.id);
    } else if (normalizedPlatform === "youtube") {
      fetchYoutubeChannel(token, user.id);
    } else if (normalizedPlatform === "x") {
      fetchXProfile(token, user.id);
    }
  }, [token, user?.id, platform]);

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
        if (key === 'whatsapp') {
           return slot.phone_number_id ? s.id : null;
        }
        
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
    const normalized = id.toLowerCase();
    if (normalized === "twitter") return "x";
    const allowed: PlatformKey[] = [
      "instagram",
      "facebook",
      "linkedin",
      "x",
      "youtube",
      "telegram",
    ];
    return allowed.includes(normalized as PlatformKey)
      ? (normalized as PlatformKey)
      : undefined;
  };
  const platformKey = toPlatformKey(platform);

  const submitWhatsappConnection = async () => {
    try {
      setConnectingWa(true);
      const res = await fetch("/api/v1/whatsapp/connect", { // using rewrite or full url if needed. assuming frontend rewrite handles this or full env url
         method: "POST",
         headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
         body: JSON.stringify({ phone_number_id: waPhoneNumberId, access_token: waAccessToken, waba_id: waWabaId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to connect");
      setConnected(prev => [...prev, "whatsapp"]);
      setIsWhatsappModalOpen(false);
      window.location.reload(); // Refresh to pull updated user context
    } catch (err: any) {
      alert(err.message);
    } finally {
      setConnectingWa(false);
    }
  };

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

      {isWhatsappModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Connect WhatsApp Cloud API</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your Meta Developer app details to enable automated broadcasting.</p>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-sm font-bold text-gray-700">Phone Number ID</label>
                    <input type="text" value={waPhoneNumberId} onChange={e=>setWaPhoneNumberId(e.target.value)} className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl outline-none focus:border-green-500" placeholder="e.g. 102394029340" />
                 </div>
                 <div>
                    <label className="text-sm font-bold text-gray-700">Permanent Access Token</label>
                    <input type="password" value={waAccessToken} onChange={e=>setWaAccessToken(e.target.value)} className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl outline-none focus:border-green-500" placeholder="EAAB..." />
                 </div>
                 <div>
                    <label className="text-sm font-bold text-gray-700">WhatsApp Business Account ID (Optional)</label>
                    <input type="text" value={waWabaId} onChange={e=>setWaWabaId(e.target.value)} className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-xl outline-none focus:border-green-500" />
                 </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                 <button onClick={() => setIsWhatsappModalOpen(false)} className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold">Cancel</button>
                 <button onClick={submitWhatsappConnection} disabled={connectingWa} className="px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold">{connectingWa ? "Saving..." : "Connect"}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
