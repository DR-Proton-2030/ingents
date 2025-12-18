import React from "react";

export default function OriginalText({ text }: { text?: string }) {
  return (
    <section className=" border border-[#444444] bg-[#1F2023] px-3 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h2 className="text-xl text-white font-semibold mb-3">
        Original Text Report
      </h2>
      <pre className="whitespace-pre-wrap break-words text-sm text-white/80 max-h-[320px] overflow-auto bg-black/30 p-3 rounded-lg">
        {text}
      </pre>
    </section>
  );
}
