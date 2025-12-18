/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Badge from "./Badge";

export default function TopPrioritiesSERP({ data }: { data?: any }) {
  return (
    <section className=" border border-[#444444] bg-[#1F2023] px-3 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h2 className="text-lg text-white font-semibold mb-3">
        Top Priorities & SERP
      </h2>
      <div className="mb-3 gap-2">
        {data?.top_priorities?.map((p: string, i: number) => (
          <Badge key={i}>{p}</Badge>
        ))}
      </div>
      <div>
        <div className="text-white/80 mb-2">SERP Summary</div>
        <ul className="list-disc ml-5 gap-2 text-white/80 text-sm">
          {data?.serp_summary?.top_results_sample?.map((r: any, i: number) => (
            <li key={i} className="mb-1">
              <a
                href={r.link}
                target="_blank"
                rel="noreferrer"
                className="underline text-indigo-200"
              >
                {r.title || r.link}
              </a>{" "}
              — <span className="text-white/60">pos {r.position}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
