import { useState, useEffect } from "react";
import { PreviewPlatform } from "@/screens/socialMedia/components/PostComposer/types";

export interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
}

export interface UploadedVideo {
  id: string;
  file?: File;
  preview: string;
  url?: string;
}

export const usePostForm = (user: any, connectedPlatforms: string[]) => {
  const [previewPlatform, setPreviewPlatform] = useState<PreviewPlatform>("instagram");
  const [postContent, setPostContent] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [video, setVideo] = useState<UploadedVideo | null>(null);
  const [youtubeThumbnail, setYoutubeThumbnail] = useState<UploadedImage | null>(null);
  const [youtubeThumbnailDataUrl, setYoutubeThumbnailDataUrl] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const setPreviewByPlatform = (platform: string) => {
    const platformMap: Record<string, PreviewPlatform | undefined> = {
      instagram: "instagram",
      facebook: "facebook",
      X: "x",
      youtube: "youtube",
    };
    const mapped = platformMap[platform];
    if (mapped) setPreviewPlatform(mapped);
  };

  useEffect(() => {
    if (selectedPlatforms.length > 0) {
      setPreviewByPlatform(selectedPlatforms[0]);
    }
  }, [selectedPlatforms]);

  const previewCandidates = ((): PreviewPlatform[] => {
    const source = selectedPlatforms.length > 0 ? selectedPlatforms : connectedPlatforms;
    const platformMap: Record<string, PreviewPlatform | undefined> = {
      instagram: "instagram",
      facebook: "facebook",
      X: "x",
      youtube: "youtube",
    };
    const mapped = source.map((p) => platformMap[p]).filter(Boolean) as PreviewPlatform[];
    const unique = Array.from(new Set(mapped));
    return unique.length > 0 ? unique : ["instagram"];
  })();

  useEffect(() => {
    if (!previewCandidates.includes(previewPlatform)) {
      setPreviewPlatform(previewCandidates[0]);
    }
  }, [selectedPlatforms, connectedPlatforms, previewCandidates, previewPlatform]);

  const handleImageUpload = (files: FileList) => {
    const newImages: UploadedImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
        });
      }
    });
    setImages((prev) => [...prev, ...newImages].slice(0, 10));
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleVideoUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setVideo({ id: `${Date.now()}`, file, preview });
  };

  const handleVideoUrlSubmit = (url: string) => {
    setVideo({ id: `${Date.now()}`, preview: "", url });
  };

  const removeVideo = () => {
    if (video?.preview) URL.revokeObjectURL(video.preview);
    setVideo(null);
  };

  const handleYoutubeThumbnailUpload = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setYoutubeThumbnail((prev) => {
      if (prev?.preview) URL.revokeObjectURL(prev.preview);
      return { id: `${Date.now()}`, file, preview };
    });
    const reader = new FileReader();
    reader.onload = () => setYoutubeThumbnailDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const removeYoutubeThumbnail = () => {
    setYoutubeThumbnail((prev) => {
      if (prev?.preview) URL.revokeObjectURL(prev.preview);
      return null;
    });
    setYoutubeThumbnailDataUrl(null);
  };

  const togglePlatformFromHeader = (platform: string) => {
    setSelectedPlatforms((prev) => {
      const isSelected = prev.includes(platform);
      const next = isSelected ? prev.filter((p) => p !== platform) : [...prev, platform];
      if (!isSelected) {
        setPreviewByPlatform(platform);
      } else if (previewPlatform === (platform === "X" ? "x" : platform)) {
        const nextPlatform = next.length > 0 ? next[0] : connectedPlatforms[0];
        if (nextPlatform) setPreviewByPlatform(nextPlatform);
      }
      return next;
    });
  };

  return {
    previewPlatform, setPreviewPlatform,
    postContent, setPostContent,
    images, setImages,
    video, setVideo,
    youtubeThumbnail, setYoutubeThumbnail,
    youtubeThumbnailDataUrl, setYoutubeThumbnailDataUrl,
    hashtags, setHashtags,
    selectedPlatforms, setSelectedPlatforms,
    isPosting, setIsPosting,
    showScheduler, setShowScheduler,
    scheduleDate, setScheduleDate,
    scheduleTime, setScheduleTime,
    handleImageUpload, removeImage,
    handleVideoUpload, handleVideoUrlSubmit, removeVideo,
    handleYoutubeThumbnailUpload, removeYoutubeThumbnail,
    togglePlatformFromHeader,
    setPreviewByPlatform
  };
};
