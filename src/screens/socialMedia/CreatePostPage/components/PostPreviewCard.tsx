import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye } from "react-icons/fi";
import {
  InstagramPreview,
  FacebookPreview,
  XPreview,
  YouTubePreview,
} from "@/screens/socialMedia/components/PostComposer/previews";
import { PreviewPlatform } from "@/screens/socialMedia/components/PostComposer/types";

interface PostPreviewCardProps {
  previewPlatform: PreviewPlatform;
  postContent: string;
  images: any[];
  video: any | null;
  youtubeThumbnail?: any;
  getFullContent: () => string;
}

export const PostPreviewCard: React.FC<PostPreviewCardProps> = ({
  previewPlatform,
  postContent,
  images,
  video,
  youtubeThumbnail,
  getFullContent,
}) => {
  const getPreviewLabel = (platform: string) => {
    switch (platform) {
      case "x": return "X (Twitter)";
      case "youtube": return "YouTube";
      default: return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };

  return (
    <div className="bg-white rounded-2xl  overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-slate-100 rounded-lg">
            <FiEye className="w-4 h-4 text-slate-600" />
          </div>
          Preview
        </h2>
        <div className="text-xs text-slate-500 font-medium">
          {getPreviewLabel(previewPlatform)}
        </div>
      </div>

      <div className="p-4 bg-gradient-to-b from-slate-50 to-white min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={previewPlatform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex justify-center"
          >
            {previewPlatform === "instagram" && (
              <InstagramPreview content={getFullContent()} images={images} video={video} />
            )}
            {previewPlatform === "facebook" && (
              <FacebookPreview content={getFullContent()} images={images} video={video} />
            )}
            {previewPlatform === "x" && (
              <XPreview content={getFullContent()} images={images} video={video} />
            )}
            {previewPlatform === "youtube" && (
              <YouTubePreview
                title={postContent.split("\n")[0].slice(0, 100) || "New video"}
                description={getFullContent()}
                video={video}
                thumbnailPreview={youtubeThumbnail?.preview}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {!postContent && images.length === 0 && !video && (
          <div className="text-center py-16 text-slate-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FiEye className="w-7 h-7 text-slate-300" />
            </div>
            <p className="font-medium text-slate-500">No preview yet</p>
            <p className="text-sm mt-1">Start composing to see a live preview</p>
          </div>
        )}
      </div>

      {(postContent || images.length > 0 || video) && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Previewing as {getPreviewLabel(previewPlatform)}</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Live preview
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
