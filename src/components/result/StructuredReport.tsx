/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export default function StructuredReport({ data }: { data?: any }) {
  return (
    <section className=" border border-[#444444] bg-[#1F2023] px-3 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h2 className="text-lg text-white font-semibold mb-2">
        📦 Structured Report
      </h2>
      {data ? (
        <div className="text-white/80 text-sm space-y-2">
          <div className="font-medium">Orphan pages</div>
          <ul className="list-disc ml-5">
            {data.internal_crawl_data?.orphan_pages?.map(
              (u: string, i: number) => (
                <li key={i}>
                  <a
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-indigo-200"
                  >
                    {u}
                  </a>
                </li>
              )
            ) ?? <li className="text-white/60">None</li>}
          </ul>

          <div className="mt-2">
            <div className="font-medium">Page report cards (sample)</div>
            <pre className="whitespace-pre-wrap break-words text-xs p-2 bg-black/20 rounded mt-1 max-h-36 overflow-auto">
              {JSON.stringify(
                data.page_report_cards?.slice(0, 3) ?? data.page_report_cards,
                null,
                2
              )}
            </pre>
          </div>
        </div>
      ) : (
        <div className="text-white/60">No structured report data</div>
      )}
    </section>
  );
}
