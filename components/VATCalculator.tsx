'use client';

import { useState } from 'react';

export default function VATCalculator() {
  const [amount, setAmount] = useState('');
  const [vatRate, setVatRate] = useState('20');
  const [calculationType, setCalculationType] = useState<'add' | 'remove'>('add');

  const calculateVAT = () => {
    const numAmount = parseFloat(amount);
    const numRate = parseFloat(vatRate);

    if (isNaN(numAmount) || isNaN(numRate)) return null;

    if (calculationType === 'add') {
      const vat = numAmount * (numRate / 100);
      const total = numAmount + vat;
      return { vat, total, original: numAmount };
    } else {
      const total = numAmount;
      const original = total / (1 + numRate / 100);
      const vat = total - original;
      return { vat, total, original };
    }
  };

  const result = calculateVAT();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <section className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            VAT & Percentage Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Calculate VAT, add or remove percentages from amounts. Free online VAT and percentage calculator tool.
          </p>
        </section>

        <div className="max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8 mb-16">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Calculation Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setCalculationType('add')}
                className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                  calculationType === 'add'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Add VAT
              </button>
              <button
                onClick={() => setCalculationType('remove')}
                className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                  calculationType === 'remove'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Remove VAT
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Amount ({calculationType === 'add' ? 'without VAT' : 'with VAT'})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              VAT Rate (%)
            </label>
            <input
              type="number"
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              placeholder="Enter VAT rate"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <div className="flex gap-2 mt-2">
              {[5, 10, 15, 20, 25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setVatRate(rate.toString())}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {calculationType === 'add' ? 'Original Amount' : 'Amount (without VAT)'}
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.original.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">VAT ({vatRate}%)</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.vat.toFixed(2)}
                </span>
              </div>
              <div className="pt-4 border-t border-blue-200 dark:border-blue-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Total</span>
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {result.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
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

