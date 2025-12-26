'use client';

import { useState } from 'react';
import { BarcodeConfig, BatchItem } from '@/lib/types';
import { generateBarcode, validateBarcodeValue } from '@/lib/barcode-generator';
import { exportBatchAsZIP } from '@/lib/export-utils';

interface BatchGeneratorProps {
  config: Omit<BarcodeConfig, 'value'>;
}

export default function BatchGenerator({ config }: BatchGeneratorProps) {
  const [batchInput, setBatchInput] = useState('');
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const parseBatchInput = (input: string): BatchItem[] => {
    const lines = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.map((line, index) => {
      // Support format: "value,label" or just "value"
      const parts = line.split(',').map((p) => p.trim());
      return {
        id: `item-${index}`,
        value: parts[0],
        label: parts[1] || parts[0],
      };
    });
  };

  const handleParse = () => {
    const parsed = parseBatchInput(batchInput);
    setItems(parsed);
  };

  const handleGenerateBatch = async () => {
    if (items.length === 0) return;

    setIsGenerating(true);
    setProgress(0);

    const exportItems: Array<{ dataUrl: string; filename: string }> = [];

    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (!validateBarcodeValue(config.type, item.value)) {
          console.warn(`Skipping invalid value: ${item.value}`);
          continue;
        }

        try {
          const dataUrl = await generateBarcode({
            ...config,
            value: item.value,
          });

          const extension = config.format === 'jpeg' ? 'jpg' : config.format;
          const filename = `${config.type}-${item.value}.${extension}`;
          exportItems.push({ dataUrl, filename });

          setProgress(((i + 1) / items.length) * 100);
        } catch (error) {
          console.error(`Failed to generate barcode for ${item.value}:`, error);
        }
      }

      // Export all items
      if (exportItems.length > 0) {
        await exportBatchAsZIP(exportItems);
      }
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8 hover:shadow-3xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Batch Generation
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Enter values (one per line, or &quot;value,label&quot; format)
          </label>
          <textarea
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="123456789012&#10;987654321098&#10;111222333444,Product A"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {items.length > 0 && `${items.length} items ready to generate`}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleParse}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Parse Input
          </button>
          <button
            onClick={handleGenerateBatch}
            disabled={items.length === 0 || isGenerating}
            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Generate {items.length} Barcodes
              </>
            )}
          </button>
        </div>

        {isGenerating && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {items.length > 0 && !isGenerating && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview Items:
            </h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {items.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="text-sm text-gray-600 dark:text-gray-400 font-mono"
                >
                  {item.value} {item.label !== item.value && `(${item.label})`}
                </div>
              ))}
              {items.length > 10 && (
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  ... and {items.length - 10} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

