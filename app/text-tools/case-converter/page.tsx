import type { Metadata } from "next";
import CaseConverter from '@/components/CaseConverter';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Case Converter - Transform Text Case Online | Free Text Case Tool",
  description: "Convert text between uppercase, lowercase, title case, sentence case, and more. Free online case converter tool.",
  keywords: "case converter, text case converter, uppercase, lowercase, title case, sentence case, text transformer",
  alternates: {
    canonical: `${siteUrl}/text-tools/case-converter`,
  },
  openGraph: {
    title: "Case Converter - Transform Text Case Online",
    description: "Convert text between different cases. Free online case converter tool.",
    url: `${siteUrl}/text-tools/case-converter`,
    type: "website",
  },
};

export default function CaseConverterPage() {
  return <CaseConverter />;
}

