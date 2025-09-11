import { Dashboard } from "@/screens/dashbard/Dashbaord";

interface SitePageProps {
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
    title: `${params.site} Dashboard - SEOMI AI`,
    description: `SEO dashboard and analytics for ${params.site}`,
    keywords: [
      `${params.site}`,
      "dashboard",
      "SEO",
      "analytics",
      "website optimization",
    ],
  };
}

export default function SitePage({ params }: SitePageProps) {
  // Site parameter is available for future customization
  return (
    <>
      <Dashboard />
    </>
  );
}
