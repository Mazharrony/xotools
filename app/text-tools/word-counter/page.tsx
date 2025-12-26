import type { Metadata } from "next";
import WordCounter from '@/components/WordCounter';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Word Counter - Free Online Word & Character Counter Tool",
  description: "Count words, characters, sentences, and paragraphs in your text. Free online word counter tool - perfect for writers, students, and professionals.",
  keywords: "word counter, character counter, text counter, word count, character count, text analysis, online word counter",
  alternates: {
    canonical: `${siteUrl}/text-tools/word-counter`,
  },
  openGraph: {
    title: "Word Counter - Free Online Word & Character Counter",
    description: "Count words, characters, sentences, and paragraphs in your text. Free online word counter tool.",
    url: `${siteUrl}/text-tools/word-counter`,
    type: "website",
  },
};

export default function WordCounterPage() {
  return <WordCounter />;
}

