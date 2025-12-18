/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export default function ImageSEO({ data }: { data?: any }) {
  if (!data)
    return (
      <section className=" border border-[#444444] bg-[#1F2023] px-3 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
        <h2 className="text-lg text-white font-semibold mb-3">🖼️ Image SEO</h2>
        <div className="text-white/60">No image SEO data</div>
      </section>
    );

  return (
    <section className=" border border-[#444444] bg-[#1F2023] px-3 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h2 className="text-lg text-white font-semibold mb-3">🖼️ Image SEO</h2>
      <div className="text-white/80 space-y-2 text-sm">
        <div className="font-medium">Recommendation</div>
        <div className="text-white/70">{data.recommendation}</div>
        {Array.isArray(data.examples) && data.examples.length > 0 && (
          <div>
            <div className="font-medium mt-2">Examples</div>
            <ul className="list-disc ml-5 text-white/80 text-sm">
              {data.examples.map((e: any, i: number) => (
                <li key={i}>{String(e)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
