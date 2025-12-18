/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ArtifactPreview from "./ArtifactPreview";

export default function ExecutiveSummary({ exec }: { exec: any }) {
  return (
    <section className=" border border-[#444444] bg-[#1F2023] px-3 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h2 className="text-xl text-white font-semibold mb-3">
        Executive Summary
      </h2>
      <ArtifactPreview />
      {exec ? (
        <div className="space-y-3 text-white/80">
          <p className="font-semibold text-white">{exec.summary}</p>
          <p>
            Target:{" "}
            <a
              className="underline text-indigo-200 hover:text-indigo-300"
              href={exec.target as string}
              target="_blank"
              rel="noopener noreferrer"
            >
              {exec.target}
            </a>
          </p>
          <div>
            <span className="font-medium text-white">Top Issues:</span>
            <ul className="list-disc ml-6 mt-1 space-y-1">
              {exec.top_issues?.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-white/60">No executive summary found.</p>
      )}
    </section>
  );
}
