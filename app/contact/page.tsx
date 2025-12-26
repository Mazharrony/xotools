import type { Metadata } from "next";
import ContactPage from '@/components/ContactPage';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Contact Us - Barcode Generator Support",
  description: "Get in touch with our barcode generator team. Questions, feedback, or support requests welcome.",
  openGraph: {
    title: "Contact Us - Barcode Generator Support",
    description: "Get in touch with our barcode generator team. Questions, feedback, or support requests welcome.",
    url: `${siteUrl}/contact`,
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};

export default function Contact() {
  return <ContactPage />;
}

