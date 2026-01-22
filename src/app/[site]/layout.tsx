import { ReactNode } from "react";
import { SiteProvider } from "@/contexts/SiteContext";

interface SiteLayoutProps {
  children: ReactNode;
  params: Promise<{
    site: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  return {
    title: `Ingents`,
    description: `Ingents - AI tools for ${site}`,
    keywords: [
      "Ingents",
      "SEO",
      "analytics",
      "AI tools",
      "website optimization",
    ],
    openGraph: {
      title: `Ingents`,
      description: `Ingents - AI tools for ${site}`,
      url: `/${site}`,
    },
  };
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { site } = await params;
  return (
    <SiteProvider>
      <div data-site={site}>{children}</div>
    </SiteProvider>
  );
}
