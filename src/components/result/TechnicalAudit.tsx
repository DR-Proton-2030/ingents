/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export default function TechnicalAudit({ data }: { data?: any }) {
  return (
    <section className=" border border-[#444444] bg-[#1F2023] px-3 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h2 className="text-lg text-white font-semibold mb-2">
        🛠️ Technical Audit
      </h2>
      {data ? (
        <div className="text-white/80 text-sm space-y-2">
          <div>
            <div className="font-medium">Broken external links</div>
            <ul className="list-disc ml-5">
              {data.broken_links?.external?.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              )) ?? <li className="text-white/60">None</li>}
            </ul>
          </div>

          <div>
            <div className="font-medium">Robots.txt (raw)</div>
            <pre className="whitespace-pre-wrap break-words text-xs p-2 bg-black/20 rounded mt-1">
              {data.robots_txt?.raw_content ?? "-"}
            </pre>
          </div>
        </div>
      ) : (
        <div className="text-white/60">No technical audit data</div>
      )}
    </section>
  );
}
