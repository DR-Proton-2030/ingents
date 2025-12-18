/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import KeyValue from "./KeyValue";

export default function PageByPage({
  pages,
  openPages,
  togglePage,
}: {
  pages?: any;
  openPages: Record<string, boolean>;
  togglePage: (url: string) => void;
}) {
  if (!pages || typeof pages !== "object")
    return <p className="text-white/60">No pages data</p>;

  return (
    <div className=" border border-[#444444] h-[50vh]  hidescroll overflow-y-scroll  overflow-hidden bg-[#1F2023] px-3 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h3 className="text-lg text-white font-semibold mb-3">📄 Page by Page</h3>
      {Object.keys(pages).map((url) => {
        const p = pages[url];
        const open = !!openPages[url];
        return (
          <div key={url} className="mb-4 p-3 bg-black/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-sm w-56 ">
                  {url}
                </div>
                <div className="text-white/80 text-xs mt-1">
                  H1s: {p.on_page_elements?.h1_count ?? p.h1_count ?? "-"} •
                  H2s: {p.on_page_elements?.h2_count ?? p.h2_count ?? "-"} •
                  Words: {p.on_page_elements?.word_count ?? p.word_count ?? "-"}
                </div>
              </div>
              <div>
                <button
                  onClick={() => togglePage(url)}
                  className="text-xs px-2 py-1 rounded bg-white/6 text-white/80"
                >
                  {open ? "Hide" : "View"}
                </button>
              </div>
            </div>

            {open && (
              <div className="mt-3 text-white/80 text-xs">
                <div className="mb-1">Recommendations:</div>
                <ul className="list-disc ml-5">
                  {(p.recommendations || []).map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                {p.on_page_elements && (
                  <div className="mt-2">
                    <KeyValue k="H1s" v={p.on_page_elements.h1_count} />
                    <KeyValue k="H2s" v={p.on_page_elements.h2_count} />
                    <KeyValue k="Words" v={p.on_page_elements.word_count} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
