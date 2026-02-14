import { motion } from "framer-motion";
import { Eye, PlayCircle, TrendingUp } from "lucide-react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";

interface ContentItem {
  id: string;
  title: string;
  thumbnail?: string;
  publishedAt?: string;
  views: number;
  watchTime?: number;
  type?: "Post" | "Video";
}

interface FBContentListProps {
  content: ContentItem[];
  title: string;
  layout?: "grid" | "list";
}

const FBContentList: React.FC<FBContentListProps> = ({
  content,
  title,
  layout = "list",
}) => {
  if (!content || content.length === 0) {
    return (
      <div className="bg-white/60 p-16 rounded-[40px] border border-dashed border-white/60 backdrop-blur-xl text-center">
        <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
          <PlayCircle className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest text-shadow-sm">
          Digital Void: No Content Detected
        </p>
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h3>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 italic">
            Official Published Log
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {content.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              whileHover={{ y: -8 }}
              className="bg-white/60 rounded-[35px] overflow-hidden border border-white/40 shadow-xl backdrop-blur-xl hover:shadow-2xl transition-all group"
            >
              <div className="relative aspect-video overflow-hidden bg-white/20">
                <img
                  src={
                    item.thumbnail ||
                    "https://picsum.photos/seed/placeholder/400/225"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/20">
                  {item.type || "Post"}
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-black text-slate-900 text-sm line-clamp-1 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title || "Untitled Post"}
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-black text-slate-700">
                      {formatCompactNumber(item.views)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 p-10 rounded-[40px] border border-white/40 backdrop-blur-2xl shadow-xl transition-all hover:shadow-2xl">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {title}
        </h3>
        <TrendingUp className="w-5 h-5 text-blue-500" />
      </div>
      <div className="space-y-4">
        {content.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex items-center gap-4 p-4 rounded-[28px] hover:bg-white/40 transition-all group cursor-pointer border border-transparent hover:border-white/30"
          >
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex-shrink-0 shadow-sm border border-white/20">
              <img
                src={
                  item.thumbnail ||
                  "https://picsum.photos/seed/placeholder/100/100"
                }
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-1 left-1 bg-blue-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px] font-black">
                {idx + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[12px] font-black text-slate-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                {item.title || "Untitled Post"}
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600">
                  <Eye className="w-3 h-3" />
                  <span className="text-[10px] font-black">
                    {formatCompactNumber(item.views)}
                  </span>
                </div>
                {item.watchTime && (
                  <span className="text-[10px] font-bold text-slate-400 opacity-60 uppercase">
                    {formatCompactNumber(item.watchTime)}m watch
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FBContentList;
