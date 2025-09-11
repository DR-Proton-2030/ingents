import React from "react";

export default function FinalChecklist({
  checklist,
}: {
  checklist?: string[];
}) {
  return (
    <section className=" border border-[#444444] bg-[#1F2023] px-3 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h2 className="text-xl text-white font-semibold mb-3">
        ✅ Final Action Checklist
      </h2>
      {Array.isArray(checklist) ? (
        <ol className="list-decimal ml-6 space-y-1 text-white/80">
          {checklist.map((c: string, i: number) => (
            <li key={i}>{c}</li>
          ))}
        </ol>
      ) : (
        <p className="text-white/60">No checklist found.</p>
      )}
    </section>
  );
}
