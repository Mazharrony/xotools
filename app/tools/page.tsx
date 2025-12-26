import type { Metadata } from "next";
import AllToolsEnhanced from '@/components/AllToolsEnhanced';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "All Tools | Search & Filter Free Online Tools | xotools",
  description: "Browse all free online tools - image converters, PDF tools, generators, text tools, developer tools, and calculators. Search, filter, and find exactly what you need.",
  keywords: "free online tools, all tools, tool directory, search tools, filter tools, online utilities, free tools",
  alternates: {
    canonical: `${siteUrl}/tools`,
  },
  openGraph: {
    title: "All Tools | Search & Filter Free Online Tools",
    description: "Browse all free online tools. Search, filter, and find exactly what you need.",
    url: `${siteUrl}/tools`,
    type: "website",
  },
};

export default function AllToolsPage() {
  return (
    <main>
      <AllToolsEnhanced />
    </main>
  );
}

