
import { Dashboard } from "@/screens/dashbard/Dashbaord";

interface SitePageProps {
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
    title: `${site} Dashboard - SEOMI AI`,
    description: `SEO dashboard and analytics for ${site}`,
    keywords: [
      `${site}`,
      "dashboard",
      "SEO",
      "analytics",
      "website optimization",
    ],
  };
}

export default async function SitePage({ params }: SitePageProps) {
  // Site parameter is available for future customization
  const { site } = await params;
  return (
    <>
      <Dashboard />
    </>
  );
}
