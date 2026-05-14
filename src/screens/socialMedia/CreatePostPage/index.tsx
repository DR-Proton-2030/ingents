"use client";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FiEdit3 } from "react-icons/fi";
import AuthContext from "@/contexts/authContext/authContext";
import { toast } from "react-toastify";
import { uploadYoutubeVideo } from "@/service/youtube/youtube.service";
import { postFacebookContent } from "@/service/facebook/facebook.service";
import { postXContent } from "@/service/x/x.service";
import {
  schedulePost,
} from "@/service/scheduler/scheduler.service";
import Layout from "@/screens/layout/Layout";
import { useRouter, usePathname } from "next/navigation";

import { usePostForm } from "./hooks/usePostForm";
import { CreatePostHeader } from "./components/CreatePostHeader";
import { CreatePostForm } from "./components/CreatePostForm";
import { PostPreviewCard } from "./components/PostPreviewCard";

export default function CreatePostPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  // Get connected platforms from user context
  const getConnectedPlatforms = () => {
    if (!user) return [];
    const platforms: string[] = [];
    const userData = user as any;

    if (userData.instagram?.id || userData.instagram?.name || userData.instagram?.access_token)
      platforms.push("instagram");
    if (userData.facebook?.page_id || userData.facebook?.name || userData.facebook?.access_token)
      platforms.push("facebook");
    if (userData.x?.id || userData.x?.name || userData.x?.access_token) platforms.push("X");
    if (userData.youtube?.id || userData.youtube?.name || userData.youtube?.access_token)
      platforms.push("youtube");

    if (platforms.length === 0) {
      return ["instagram", "facebook", "X", "youtube"];
    }
    return platforms;
  };

  const connectedPlatforms = getConnectedPlatforms();

  const form = usePostForm(user, connectedPlatforms);

  const handlePost = async () => {
    if (!form.postContent.trim() && form.images.length === 0 && !form.video) return;
    if (form.selectedPlatforms.length === 0) return;

    form.setIsPosting(true);
    const userId = user?.id || (user as any)?._id;

    try {
      const isScheduled = form.showScheduler && form.scheduleDate && form.scheduleTime;

      if (isScheduled) {
        const scheduledDateTime = new Date(
          `${form.scheduleDate}T${form.scheduleTime}`
        ).toISOString();

        for (const platform of form.selectedPlatforms) {
          const platformMapping: Record<string, "facebook" | "instagram" | "youtube" | "x"> = {
            facebook: "facebook",
            instagram: "instagram",
            youtube: "youtube",
            X: "x",
          };

          const mappedPlatform = platformMapping[platform];
          if (!mappedPlatform) continue;

          // Use FormData so the backend handles file → S3 upload
          const formData = new FormData();
          formData.append("user_id", userId);
          formData.append("platform", mappedPlatform);
          formData.append("content", form.postContent);
          formData.append("scheduled_at", scheduledDateTime);
          formData.append("hashtags", JSON.stringify(form.hashtags));

          if (form.video?.file) {
            formData.append("video", form.video.file);
            formData.append("media_type", "video");
          } else if (form.video?.url) {
            formData.append("media_urls", JSON.stringify([form.video.url]));
            formData.append("media_type", "video");
          } else if (form.images.length > 0) {
            for (const img of form.images) {
              if (img.file) {
                formData.append("images", img.file);
              }
            }
            formData.append("media_type", "image");
          } else {
            formData.append("media_type", "text");
          }

          if (mappedPlatform === "facebook") {
            formData.append("page_id", (user as any).facebook?.project_id || "");
          }

          if (mappedPlatform === "youtube") {
            formData.append("platform_specific_data", JSON.stringify({
              title: form.postContent.slice(0, 100) || "Untitled Video",
              privacyStatus: "public",
              thumbnailDataUrl: form.youtubeThumbnailDataUrl || undefined,
            }));
          }

          await schedulePost(formData);
        }
        toast.success("Posts scheduled successfully!");
        router.push(pathname.replace("/create-post", ""));
      } else {
        // Immediate posting
        if (form.selectedPlatforms.includes("youtube")) {
          if (!form.video) {
            toast.error("Please provide a video for YouTube");
            form.setIsPosting(false);
            return;
          }

          let ytResponse;
          if (form.video.file) {
            const ytFormData = new FormData();
            ytFormData.append("user_id", userId);
            ytFormData.append("title", form.postContent.slice(0, 100) || "Untitled Video");
            ytFormData.append("description", form.postContent);
            ytFormData.append("tags", form.hashtags.join(","));
            ytFormData.append("privacyStatus", "public");
            ytFormData.append("video", form.video.file);
            if (form.youtubeThumbnailDataUrl) ytFormData.append("thumbnailDataUrl", form.youtubeThumbnailDataUrl);
            ytResponse = await uploadYoutubeVideo(ytFormData);
          } else {
            ytResponse = await uploadYoutubeVideo({
              user_id: userId,
              title: form.postContent.slice(0, 100) || "Untitled Video",
              description: form.postContent,
              tags: form.hashtags,
              privacyStatus: "public",
              videoURL: form.video.url || "",
              thumbnailDataUrl: form.youtubeThumbnailDataUrl || undefined,
            });
          }
          toast.success("YouTube video upload started!");
        }

        if (form.selectedPlatforms.includes("facebook")) {
          const fbFormData = new FormData();
          fbFormData.append("userId", userId);
          fbFormData.append("pageId", (user as any).facebook?.project_id || "");
          fbFormData.append("message", form.postContent);
          if (form.images.length > 0) fbFormData.append("image", form.images[0].file!);
          if (form.video?.file) fbFormData.append("video", form.video.file);
          else if (form.video?.url) fbFormData.append("videoURL", form.video.url);
          await postFacebookContent(fbFormData);
          toast.success("Posted to Facebook!");
        }

        if (form.selectedPlatforms.includes("X")) {
          const xFormData = new FormData();
          xFormData.append("userId", userId);
          xFormData.append("message", form.postContent);
          if (form.hashtags.length > 0) xFormData.append("hashtags", form.hashtags.join(","));
          if (form.images.length > 0) xFormData.append("image", form.images[0].file!);
          if (form.video?.file) xFormData.append("video", form.video.file);
          else if (form.video?.url) xFormData.append("videoURL", form.video.url);
          await postXContent(xFormData);
          toast.success("Posted to X!");
        }

        router.push(pathname.replace("/create-post", ""));
      }

      // Reset form
      form.setPostContent("");
      form.setImages([]);
      form.setVideo(null);
      form.removeYoutubeThumbnail();
      form.setHashtags([]);
      form.setSelectedPlatforms([]);
      form.setShowScheduler(false);
    } catch (error: any) {
      console.error("Post failed:", error);
      toast.error(error.message || "Failed to publish post");
    } finally {
      form.setIsPosting(false);
    }
  };

  const getFullContent = () => {
    const hashtagString = form.hashtags.join(" ");
    return hashtagString ? `${form.postContent}\n\n${hashtagString}` : form.postContent;
  };

  const basePath = pathname.replace("/create-post", "");

  return (
    <Layout>
      <div className="mx-auto px-5 max-w-7xl font-sans min-h-screen">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-white rounded-2xl  -sm overflow-hidden"
          >
            <CreatePostHeader
              basePath={basePath}
              connectedPlatforms={connectedPlatforms}
              selectedPlatforms={form.selectedPlatforms}
              togglePlatformFromHeader={form.togglePlatformFromHeader}
              handlePost={handlePost}
              isPosting={form.isPosting}
              postContent={form.postContent}
              images={form.images}
              video={form.video}
              showScheduler={form.showScheduler}
            />


            <CreatePostForm
              postContent={form.postContent}
              setPostContent={form.setPostContent}
              images={form.images}
              handleImageUpload={form.handleImageUpload}
              removeImage={form.removeImage}
              video={form.video}
              handleVideoUpload={form.handleVideoUpload}
              handleVideoUrlSubmit={form.handleVideoUrlSubmit}
              removeVideo={form.removeVideo}
              youtubeThumbnail={form.youtubeThumbnail}
              handleYoutubeThumbnailUpload={form.handleYoutubeThumbnailUpload}
              removeYoutubeThumbnail={form.removeYoutubeThumbnail}
              hashtags={form.hashtags}
              addHashtag={(t) => form.setHashtags((prev) => [...prev, t])}
              removeHashtag={(t) => form.setHashtags((prev) => prev.filter((h) => h !== t))}
              selectedPlatforms={form.selectedPlatforms}
              showScheduler={form.showScheduler}
              setShowScheduler={form.setShowScheduler}
              scheduleDate={form.scheduleDate}
              setScheduleDate={form.setScheduleDate}
              scheduleTime={form.scheduleTime}
              setScheduleTime={form.setScheduleTime}
              isPosting={form.isPosting}
              handlePost={handlePost}
              basePath={basePath}
              userId={user?.id || (user as any)?._id}
              companyId={(user as any)?.company_id || (user as any)?.company_object_id}
            />
          </motion.div>

          {/* Right Column - Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 lg:sticky lg:top-5 lg:h-fit"
          >
            <PostPreviewCard
              previewPlatform={form.previewPlatform}
              postContent={form.postContent}
              images={form.images}
              video={form.video}
              youtubeThumbnail={form.youtubeThumbnail}
              getFullContent={getFullContent}
            />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

