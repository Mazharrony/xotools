import type { Metadata } from "next";
import VATCalculator from '@/components/VATCalculator';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "VAT & Percentage Calculator - Add or Remove VAT Online",
  description: "Calculate VAT, add or remove percentages from amounts. Free online VAT and percentage calculator tool.",
  keywords: "vat calculator, percentage calculator, add vat, remove vat, tax calculator, percentage tool, online calculator",
  alternates: {
    canonical: `${siteUrl}/calculators/vat-calculator`,
  },
  openGraph: {
    title: "VAT & Percentage Calculator - Calculate VAT Online",
    description: "Calculate VAT and percentages. Free online VAT and percentage calculator tool.",
    url: `${siteUrl}/calculators/vat-calculator`,
    type: "website",
  },
};

export default function VATCalculatorPage() {
  return <VATCalculator />;
}

