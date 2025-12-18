/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import KeyValue from "./KeyValue";

export default function SitemapCrawl({ data }: { data?: any }) {
  return (
    <section className=" border border-[#444444] bg-[#1F2023] px-3 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h2 className="text-lg text-white font-semibold mb-2">
        🧭 Sitemap & Crawl
      </h2>
      {data ? (
        <div className="text-white/80 text-sm space-y-2">
          <KeyValue k="Sitemap found" v={String(data.sitemap_found)} />
          {Array.isArray(data.sitemap_urls) && (
            <div>
              <div className="font-medium">Sitemap URLs</div>
              <ul className="list-disc ml-5 text-white/80 text-sm mt-1">
                {data.sitemap_urls.map((u: string, i: number) => (
                  <li key={i}>
                    <a
                      href={u}
                      className="underline text-indigo-200"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {u}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-white/60">No sitemap data</div>
      )}
    </section>
  );
}
