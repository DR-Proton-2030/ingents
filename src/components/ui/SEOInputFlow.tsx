import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBox } from "@/components/ui/SearchBox";

interface SEOInputFlowProps {
  step: "website" | "keywords";
  handleWebsiteSubmit: (value: string) => void;
  handleKeywordsSubmit: (value: string) => void;
  loading?: boolean;
}

export const SEOInputFlow: React.FC<SEOInputFlowProps> = ({
  step,
  handleWebsiteSubmit,
  handleKeywordsSubmit,
  loading = false,
}) => (
  <>
    {/* Show loader in-place (matching the SearchBox look) when loading */}
    {loading ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="w-full"
      >
        <div className="flex items-center w-full  rounded-3xl border border-[#444444] bg-[#1F2023] px-3 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300">
          <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
          <div className="ml-3 text-sm text-white">
            Analyzing... please wait
          </div>
        </div>
      </motion.div>
    ) : (
      <>
        <SearchBox
          placeholder="Enter website URL..."
          onSearch={handleWebsiteSubmit}
          disabled={step !== "website"}
        />

        <AnimatePresence>
          {step === "keywords" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="absolute top-0 left-0 w-full z-50 flex justify-center items-center"
            >
              <div className="w-full">
                <SearchBox
                  placeholder="Enter keywords for SEO..."
                  onSearch={handleKeywordsSubmit}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )}
  </>
);
