"use client";
import React from "react";

export default function TestAnalyzePage() {
  const [url, setUrl] = React.useState("http://tuhinthakur.me/");
  const [keyword, setKeyword] = React.useState("Tuhin Thakur");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Record<string, unknown> | null>(
    null
  );

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_url: url, main_keyword: keyword }),
      });
      const data = await res.text();
      // try parse JSON, otherwise keep text
      let parsed: unknown = data;
      try {
        parsed = JSON.parse(data);
      } catch {
        // leave as text
      }
      setResult({ status: res.status, ok: res.ok, body: parsed });
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Test /api/analyze</h1>
        <label className="block mb-2">
          <div className="text-sm text-gray-300 mb-1">Target URL</div>
          <input
            className="w-full rounded-md p-2 bg-[#111827] border border-[#374151]"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <div className="text-sm text-gray-300 mb-1">Main Keyword</div>
          <input
            className="w-full rounded-md p-2 bg-[#111827] border border-[#374151]"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 bg-white text-black rounded-md disabled:opacity-60"
            onClick={runTest}
            disabled={loading}
          >
            {loading ? "Running..." : "Run test"}
          </button>
          <button
            className="px-3 py-2 bg-transparent border border-white rounded-md text-sm"
            onClick={() => {
              setUrl("http://tuhinthakur.me/");
              setKeyword("Tuhin Thakur");
              setResult(null);
            }}
          >
            Reset
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Result</h2>
          <pre className="whitespace-pre-wrap bg-[#071024] p-4 rounded-md text-sm">
            {result ? JSON.stringify(result, null, 2) : "No result yet"}
          </pre>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <div>Or test from terminal (PowerShell):</div>
          <pre className="bg-[#071024] p-3 rounded mt-2">{`curl -X POST "http://localhost:3000/api/analyze" -H "Content-Type: application/json" -d '{"target_url":"http://tuhinthakur.me/","main_keyword":"Tuhin Thakur"}'`}</pre>
        </div>
      </div>
    </div>
  );
}
