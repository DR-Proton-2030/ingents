/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import KeyValue from "./KeyValue";

export default function Metadata({ data }: { data?: any }) {
  return (
    <section className=" border border-[#444444] bg-[#1F2023] px-3 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h2 className="text-lg text-white font-semibold mb-2">🔖 Metadata</h2>
      {data ? (
        <div className="text-sm text-white/80 space-y-1">
          <KeyValue k="Main keyword" v={data.main_keyword ?? "-"} />
          <KeyValue k="Target URL" v={data.target_url ?? "-"} />
        </div>
      ) : (
        <div className="text-white/60">No metadata</div>
      )}
    </section>
  );
}
