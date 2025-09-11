import { ReactNode } from "react";
import { SiteProvider } from "@/contexts/SiteContext";

interface SiteLayoutProps {
  children: ReactNode;
  params: {
    site: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { site: string };
}) {
  return {
    title: `${params.site} - SEOMI AI`,
    description: `SEO management and AI tools for ${params.site}`,
    keywords: [
      `${params.site}`,
      "SEO",
      "analytics",
      "AI tools",
      "website optimization",
    ],
    openGraph: {
      title: `${params.site} - SEOMI AI`,
      description: `SEO management and AI tools for ${params.site}`,
      url: `/${params.site}`,
    },
  };
}

export default function SiteLayout({ children, params }: SiteLayoutProps) {
  return (
    <SiteProvider>
      <div data-site={params.site}>{children}</div>
    </SiteProvider>
  );
}
