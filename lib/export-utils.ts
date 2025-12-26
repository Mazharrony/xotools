'use client';

import jsPDF from 'jspdf';
import { BarcodeConfig } from './types';

export async function exportBarcode(
  imageDataUrl: string,
  config: BarcodeConfig,
  filename: string
): Promise<void> {
  const { format } = config;

  switch (format) {
    case 'png':
      await exportAsPNG(imageDataUrl, filename);
      break;
    case 'jpeg':
      await exportAsJPEG(imageDataUrl, filename);
      break;
    case 'svg':
      await exportAsSVG(imageDataUrl, filename);
      break;
    case 'pdf':
      await exportAsPDF(imageDataUrl, filename, config);
      break;
  }
}

async function exportAsPNG(dataUrl: string, filename: string): Promise<void> {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

async function exportAsJPEG(dataUrl: string, filename: string): Promise<void> {
  // Convert PNG data URL to JPEG
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx?.drawImage(img, 0, 0);
      
      const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `${filename}.jpg`;
      link.href = jpegDataUrl;
      link.click();
      resolve();
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function exportAsSVG(dataUrl: string, filename: string): Promise<void> {
  // For SVG, we need to create an SVG wrapper
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      // Create SVG with embedded image
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
          <image href="${dataUrl}" width="${img.width}" height="${img.height}"/>
        </svg>
      `;

      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function exportAsPDF(
  dataUrl: string,
  filename: string,
  config: BarcodeConfig
): Promise<void> {
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const pdf = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit page
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;
      
      if (imgWidth > pdfWidth) {
        finalWidth = pdfWidth - 40;
        finalHeight = (imgHeight / imgWidth) * finalWidth;
      }
      
      if (finalHeight > pdfHeight) {
        finalHeight = pdfHeight - 40;
        finalWidth = (imgWidth / imgHeight) * finalHeight;
      }

      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, finalWidth, finalHeight);
      pdf.save(`${filename}.pdf`);
      resolve();
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function exportBatchAsZIP(
  items: Array<{ dataUrl: string; filename: string }>
): Promise<void> {
  if (items.length === 0) return;

  // For single item, just download it
  if (items.length === 1) {
    const link = document.createElement('a');
    link.download = items[0].filename;
    link.href = items[0].dataUrl;
    link.click();
    return;
  }

  // For multiple items, use JSZip
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Convert data URLs to blobs and add to zip
    for (const item of items) {
      const response = await fetch(item.dataUrl);
      const blob = await response.blob();
      // item.filename already includes extension
      zip.file(item.filename, blob);
    }

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.download = `barcodes-${Date.now()}.zip`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    // Fallback: download files sequentially
    console.warn('ZIP generation failed, downloading files individually', error);
    for (let i = 0; i < items.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100 * i));
      const link = document.createElement('a');
      link.download = items[i].filename;
      link.href = items[i].dataUrl;
      link.click();
    }
  }
}

