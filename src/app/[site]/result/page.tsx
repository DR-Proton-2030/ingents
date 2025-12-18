/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardCopy, Trash2, Home } from "lucide-react";
import ExecutiveSummary from "@/components/screens/result/ExecutiveSummary";
import ImageSEO from "@/components/screens/result/ImageSEO";
import FinalChecklist from "@/components/screens/result/FinalChecklist";
import OriginalText from "@/components/screens/result/OriginalText";
import TopPrioritiesSERP from "@/components/screens/result/TopPrioritiesSERP";
import Metadata from "@/components/screens/result/Metadata";
import SitemapCrawl from "@/components/screens/result/SitemapCrawl";
import TechnicalAudit from "@/components/screens/result/TechnicalAudit";
import StructuredReport from "@/components/screens/result/StructuredReport";
import Performance from "@/components/screens/result/Performance";
import PageByPage from "@/components/screens/result/PageByPage";

export default function ResultPage() {
  const [stored, setStored] = useState<any | null>(null);
  const [rawJson, setRawJson] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [openPages, setOpenPages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("seo_result");
      if (!raw) return setStored(null);
      setRawJson(raw);
      try {
        setStored(JSON.parse(raw));
      } catch {
        setStored(raw as any);
      }
    } catch (err) {
      console.error("Failed reading seo_result from localStorage:", err);
      setStored(null);
    }
  }, []);

  const clearStored = () => {
    try {
      localStorage.removeItem("seo_result");
      setStored(null);
      setRawJson(null);
    } catch (err) {
      console.error("Failed clearing latest_result:", err);
    }
  };

  const copyRaw = async () => {
    try {
      if (!rawJson) return;
      await navigator.clipboard.writeText(rawJson);
      setCopiedToast("Copied JSON to clipboard");
      setTimeout(() => setCopiedToast(null), 1600);
    } catch (err) {
      console.error("Failed copying:", err);
    }
  };

  const togglePage = (url: string) => {
    setOpenPages((s) => ({ ...s, [url]: !s[url] }));
  };

  const checklist = stored?.body?.ai_generated_json?.final_action_checklist;
  const performance = stored?.body?.ai_generated_json?.performance;
  const pages = stored?.body?.ai_generated_json?.page_by_page;

  return (
    <div
      className="h-screen overflow-hidden p-6 flex items-start justify-center
    bg-[radial-gradient(125%_125%_at_50%_101%,rgba(245,87,2,1)_10.5%,rgba(245,120,2,1)_16%,rgba(245,140,2,1)_17.5%,rgba(245,170,100,1)_25%,rgba(238,174,202,1)_40%,rgba(202,179,214,1)_65%,rgba(148,201,233,1)_100%)]"
    >
      <div className="w-[1150px]">
        <header className="flex items-center justify-end mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={copyRaw}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1F2023] text-white/90 hover:bg-white/20 transition"
            >
              <ClipboardCopy size={16} /> Copy JSON
            </button>
            <button
              onClick={clearStored}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1F2023] text-white hover:bg-rose-700 transition"
            >
              <Trash2 size={16} /> Clear
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1F2023] text-white/80 hover:bg-white/20 transition"
            >
              <Home size={16} /> Home
            </Link>
          </div>
        </header>

        {!stored && (
          <div className="bg-white/10 p-6 rounded-xl text-white/70 shadow-lg">
            No stored result in localStorage (key: latest_result)
          </div>
        )}

        {stored && (
          <div>
            {copiedToast && (
              <div className="fixed  border border-[#444444] bg-[#1F2023] px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] right-6 top-6 text-white/90 rounded-md">
                {copiedToast}
              </div>
            )}

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6  overflow-y-scroll h-screen -mt-20 hidescroll">
                <ExecutiveSummary
                  exec={
                    stored?.body?.ai_generated_json?.executive_summary
                      ? {
                          ...stored.body.ai_generated_json.executive_summary,
                          artifacts: stored.body.ai_generated_json.artifacts,
                        }
                      : null
                  }
                />

                <ImageSEO data={stored?.body?.ai_generated_json?.image_seo} />

                <FinalChecklist checklist={checklist} />

                <OriginalText
                  text={stored?.body?.ai_generated_json?.original_text_report}
                />

                <TopPrioritiesSERP data={stored?.body?.ai_generated_json} />

                <Metadata data={stored?.body?.metadata} />

                <SitemapCrawl
                  data={stored?.body?.ai_generated_json?.sitemap_and_crawl}
                />

                <TechnicalAudit
                  data={stored?.body?.ai_generated_json?.technical_audit}
                />

                <StructuredReport
                  data={
                    stored?.body?.structured_report ??
                    stored?.body?.ai_generated_json?.structured_report
                  }
                />
              </div>

              <aside className="space-y-6">
                <Performance performance={performance} />
                <PageByPage
                  pages={pages}
                  openPages={openPages}
                  togglePage={togglePage}
                />
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
