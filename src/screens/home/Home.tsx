"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { SEOInputFlow } from "@/components/ui/SEOInputFlow";

export function HomePage() {
  const [step, setStep] = React.useState<"website" | "keywords">("website");
  const [website, setWebsite] = React.useState("");
  const router = useRouter();
  const handleWebsiteSubmit = React.useCallback((value: string) => {
    setWebsite(value);
    setStep("keywords");
  }, []);

  const handleKeywordsSubmit = React.useCallback(
    async (keywords: string) => {
      const body = {
        target_url: website,
        main_keyword: keywords,
      };
      setLoading(true);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.text();
        // try parse JSON, otherwise keep text
        let parsed: unknown = data;
        try {
          parsed = JSON.parse(data);
        } catch {
          // leave as text
        }
        const final = { status: res.status, ok: res.ok, body: parsed };
        try {
          localStorage.setItem("latest_result", JSON.stringify(final));
          // use app-router navigation
          router.push("/result");
        } catch (err) {
          console.error("Failed to persist latest_result:", err);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
      setStep("website");
    },
    [website, router]
  );

  const [loading, setLoading] = React.useState(false);

  return (
    <div className="flex w-full h-screen justify-center items-center bg-[radial-gradient(125%_125%_at_50%_101%,rgba(245,87,2,1)_10.5%,rgba(245,120,2,1)_16%,rgba(245,140,2,1)_17.5%,rgba(245,170,100,1)_25%,rgba(238,174,202,1)_40%,rgba(202,179,214,1)_65%,rgba(148,201,233,1)_100%)] relative">
      <div className="p-4 w-[500px] relative">
        <SEOInputFlow
          step={step}
          handleWebsiteSubmit={handleWebsiteSubmit}
          handleKeywordsSubmit={handleKeywordsSubmit}
          loading={loading}
        />
        {/* {result && (
          <div className="h-[60vh] overflow-y-scroll mt-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm text-white/80">Latest result</div>
              <Link href="/result" className="text-sm text-white/60 underline">
                View on result page
              </Link>
            </div>
            <pre className="whitespace-pre-wrap break-words text-xs bg-white/6 p-3 rounded-md">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )} */}
      </div>
    </div>
  );
}
