import type { Metadata } from "next";
import JSONFormatter from '@/components/JSONFormatter';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - Format, Minify, Validate JSON Online",
  description: "Format, minify, and validate JSON data. Free online JSON formatter tool for developers.",
  keywords: "json formatter, json validator, json minify, json beautifier, json parser, json tool, online json formatter",
  alternates: {
    canonical: `${siteUrl}/developer-tools/json-formatter`,
  },
  openGraph: {
    title: "JSON Formatter & Validator - Format JSON Online",
    description: "Format, minify, and validate JSON data. Free online JSON formatter tool.",
    url: `${siteUrl}/developer-tools/json-formatter`,
    type: "website",
  },
};

export default function JSONFormatterPage() {
  return <JSONFormatter />;
}

