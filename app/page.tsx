import type { Metadata } from "next";
import BarcodeGenerator from '@/components/BarcodeGenerator';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Free Barcode Generator Online | Create QR Codes & Barcodes Instantly",
  description: "Create professional barcodes and QR codes for free. Export as PNG, JPEG, SVG, or PDF. Supports Code128, EAN, UPC, QR Code, and more. No registration required!",
  alternates: {
    canonical: siteUrl,
  },
};

export default function Home() {
  return <BarcodeGenerator />;
}
