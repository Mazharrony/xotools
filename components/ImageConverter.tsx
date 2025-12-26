'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';
import Navbar from './Navbar';
import Footer from './Footer';

interface ConvertedFile {
  id: string;
  originalName: string;
  file: File;
  convertedDataUrl?: string;
  convertedBlob?: Blob;
  error?: string;
}

export default function ImageConverter() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(90);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: ConvertedFile[] = selectedFiles
      .filter(file => file.type === 'image/png')
      .map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        originalName: file.name,
        file,
      }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertPNGToJPEG = async (file: File, quality: number, bgColor: string): Promise<{ dataUrl: string; blob: Blob }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Fill canvas with background color first
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image on canvas (this will composite over the background)
        ctx.drawImage(img, 0, 0);
        
        // Convert to JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ dataUrl, blob });
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          quality / 100
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    
    const convertedFiles: ConvertedFile[] = [];
    
    for (const fileItem of files) {
      try {
        const { dataUrl, blob } = await convertPNGToJPEG(fileItem.file, quality, backgroundColor);
        convertedFiles.push({
          ...fileItem,
          convertedDataUrl: dataUrl,
          convertedBlob: blob,
        });
      } catch (error) {
        convertedFiles.push({
          ...fileItem,
          error: error instanceof Error ? error.message : 'Conversion failed',
        });
      }
    }
    
    setFiles(convertedFiles);
    setIsConverting(false);
  };

  const handleDownload = async (fileItem: ConvertedFile) => {
    if (!fileItem.convertedBlob) return;
    
    const url = URL.createObjectURL(fileItem.convertedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileItem.originalName.replace(/\.png$/i, '.jpg');
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    if (files.length === 0) return;
    
    const zip = new JSZip();
    const convertedFiles = files.filter(f => f.convertedBlob);
    
    if (convertedFiles.length === 0) return;
    
    if (convertedFiles.length === 1) {
      handleDownload(convertedFiles[0]);
      return;
    }
    
    for (const fileItem of convertedFiles) {
      if (fileItem.convertedBlob) {
        const fileName = fileItem.originalName.replace(/\.png$/i, '.jpg');
        zip.file(fileName, fileItem.convertedBlob);
      }
    }
    
    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted-images-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create ZIP:', error);
      // Fallback: download individually
      for (let i = 0; i < convertedFiles.length; i++) {
        setTimeout(() => handleDownload(convertedFiles[i]), i * 200);
      }
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-16 text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Free Image Converter
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              PNG to JPEG<br />Bulk Converter
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              Convert multiple PNG images to JPEG format instantly. Adjust quality, convert in bulk, and download all at once.
              No registration required.
            </p>
          </div>
        </section>

        {/* Converter Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              Settings
            </h2>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PNG Files
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer text-center text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose PNG Files
              </label>
              {files.length > 0 && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Background Color */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:scale-105 transition-transform"
                  title="Choose background color"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="#FFFFFF"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                PNG transparency will be filled with this color
              </p>
              {/* Quick color presets */}
              <div className="mt-3 flex gap-2 flex-wrap">
                {['#FFFFFF', '#000000', '#F3F4F6', '#FEF3C7', '#DBEAFE'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quality Slider */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                JPEG Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>Lower Size</span>
                <span>Higher Quality</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConvert}
                disabled={files.length === 0 || isConverting}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Converting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Convert All
                  </>
                )}
              </button>

              {files.some(f => f.convertedBlob) && (
                <button
                  onClick={handleDownloadAll}
                  className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download All as ZIP
                </button>
              )}

              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  className="w-full py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Files List */}
          <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Files ({files.length})
            </h2>

            {files.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">No files selected</p>
                <p className="text-sm mt-2">Upload PNG files to get started</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {files.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex-shrink-0">
                      {fileItem.convertedDataUrl ? (
                        <img
                          src={fileItem.convertedDataUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {fileItem.originalName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(fileItem.file.size / 1024).toFixed(2)} KB
                        {fileItem.convertedBlob && (
                          <span className="ml-2">
                            → {((fileItem.convertedBlob.size / 1024).toFixed(2))} KB
                          </span>
                        )}
                      </p>
                      {fileItem.error && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fileItem.error}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {fileItem.convertedBlob ? (
                        <button
                          onClick={() => handleDownload(fileItem)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {isConverting ? 'Converting...' : 'Ready'}
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(fileItem.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <section id="services">
          <Footer />
        </section>
      </div>
    </div>
  );
}

