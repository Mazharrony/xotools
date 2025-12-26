'use client';

import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  const paragraphCount = text.trim() ? text.trim().split(/\n\s*\n/).filter(p => p.trim()).length : 0;
  const sentenceCount = text.trim() ? text.match(/[.!?]+/g)?.length || 0 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <section className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Word Counter - Free Online Word & Character Counter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Count words, characters, sentences, and paragraphs in your text. Free online word counter tool - perfect for writers, students, and professionals.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Enter Your Text</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Statistics</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Words</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{wordCount.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Characters</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{charCount.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Characters (no spaces)</div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{charCountNoSpaces.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sentences</div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{sentenceCount.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Paragraphs</div>
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{paragraphCount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Coming soon:</strong> This tool is being enhanced with additional features. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}

