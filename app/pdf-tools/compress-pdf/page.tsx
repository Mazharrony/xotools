import type { Metadata } from "next";
import CompressPDF from '@/components/CompressPDF';
import Breadcrumb from '@/components/Breadcrumb';
import FAQSchema from '@/components/FAQSchema';
import Link from 'next/link';
import { siteUrl } from '@/lib/seo-config';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: "Optimize PDF (Light) - Rebuild PDF Files | Free PDF Optimizer",
  description: "Lightly optimize and rebuild PDF files online. Best results for image-heavy PDFs. Free PDF optimizer tool - rebuild PDF structure for better compatibility. No registration required.",
  keywords: "optimize pdf, rebuild pdf, pdf optimizer, pdf rebuild, optimize pdf online, free pdf optimizer, pdf structure optimizer",
  alternates: {
    canonical: `${siteUrl}/pdf-tools/compress-pdf`,
  },
  openGraph: {
    title: "Optimize PDF (Light) - Free PDF Optimizer",
    description: "Lightly optimize and rebuild PDF files. Best results for image-heavy PDFs. Free online PDF optimizer.",
    url: `${siteUrl}/pdf-tools/compress-pdf`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Optimize PDF (Light) - Free PDF Optimizer",
    description: "Lightly optimize PDF files instantly. Free, secure, and easy to use.",
  },
};

const faqs = [
  {
    question: "What does 'Optimize PDF (Light)' mean?",
    answer: "This tool performs limited compression by rebuilding the PDF structure. It's best for image-heavy PDFs and provides basic optimization. For more significant file size reduction, specialized server-side compression tools may be needed."
  },
  {
    question: "Will my PDF file size always decrease?",
    answer: "Not necessarily. This tool rebuilds the PDF structure which may optimize it, but file size reduction depends on the PDF content. Image-heavy PDFs typically see better results."
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes, this PDF optimizer is completely free to use. No registration or payment required."
  },
  {
    question: "Are my PDF files secure?",
    answer: "Yes, all processing happens in your browser. Files are never uploaded to our servers, ensuring complete privacy and security."
  }
];

export default function CompressPDFPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'PDF Tools', href: routes.categories.pdf },
          { label: 'Optimize PDF (Light)', href: routes.pdfTools.compress }
        ]} />
      </div>
      <CompressPDF />
      {/* Related Tools */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Related Tools</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href={routes.pdfTools.merge}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Merge PDF
            </Link>
            <Link
              href={routes.pdfTools.split}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Split PDF
            </Link>
            <Link
              href={routes.pdfTools.rotate}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Rotate PDF
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}



