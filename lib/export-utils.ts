'use client';

import jsPDF from 'jspdf';
import { BarcodeConfig } from './types';
import { generateBarcode } from './barcode-generator';

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
      await exportAsSVG(imageDataUrl, filename, config);
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

async function exportAsSVG(dataUrl: string, filename: string, config: BarcodeConfig): Promise<void> {
  const img = new Image();

  return new Promise(async (resolve, reject) => {
    img.onload = async () => {
      try {
        // Generate barcode without text for clean image
        const barcodeWithoutText = await generateBarcode(config, false);
        const barcodeImg = new Image();
        
        barcodeImg.onload = () => {
          // Calculate dimensions
          const barcodeWidth = barcodeImg.width;
          const barcodeHeight = barcodeImg.height;
          
          // Calculate text position (below barcode, centered)
          const textMargin = config.margin || 10;
          const textY = barcodeHeight + textMargin + (config.fontSize || 20) * 0.7; // 0.7 for better vertical centering
          const textX = barcodeWidth / 2;
          const totalHeight = config.displayValue ? textY + (config.fontSize || 20) * 0.3 : barcodeHeight;
          
          // Create SVG with barcode image and editable text
          const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${barcodeWidth}" height="${totalHeight}">
              <rect width="100%" height="100%" fill="${config.backgroundColor}"/>
              <image href="${barcodeWithoutText}" width="${barcodeWidth}" height="${barcodeHeight}" y="0"/>
              ${config.displayValue ? `
                <text 
                  x="${textX}" 
                  y="${textY}" 
                  font-family="Arial, sans-serif" 
                  font-size="${config.fontSize}" 
                  font-weight="bold" 
                  fill="${config.fontColor}" 
                  text-anchor="middle"
                  dominant-baseline="middle"
                >${escapeXml(config.value)}</text>
              ` : ''}
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
        
        barcodeImg.onerror = () => {
          // Fallback to original method if generation fails
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
        
        barcodeImg.src = barcodeWithoutText;
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

async function exportAsPDF(
  dataUrl: string,
  filename: string,
  config: BarcodeConfig
): Promise<void> {
  const img = new Image();

  return new Promise(async (resolve, reject) => {
    img.onload = async () => {
      try {
        // Generate barcode without text for clean image
        const barcodeWithoutText = await generateBarcode(config, false);
        const barcodeImg = new Image();
        
        barcodeImg.onload = () => {
          const pdf = new jsPDF({
            orientation: barcodeImg.width > barcodeImg.height ? 'landscape' : 'portrait',
            unit: 'px',
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          // Calculate dimensions to fit page
          const imgWidth = barcodeImg.width;
          const imgHeight = barcodeImg.height;
          
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

          // Draw barcode image (without text)
          pdf.addImage(barcodeWithoutText, 'PNG', x, y, finalWidth, finalHeight);
          
          // Add text as editable text element
          if (config.displayValue) {
            const textY = y + finalHeight + (config.margin || 10) + (config.fontSize || 20);
            const textX = pdfWidth / 2;
            
            // Convert hex color to RGB
            const hex = config.fontColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            
            // Set text properties
            pdf.setFontSize(config.fontSize);
            pdf.setTextColor(r, g, b);
            pdf.setFont('helvetica', 'bold');
            
            // Center the text
            const textWidth = pdf.getTextWidth(config.value);
            pdf.text(config.value, textX - textWidth / 2, textY);
          }
          
          pdf.save(`${filename}.pdf`);
          resolve();
        };
        
        barcodeImg.onerror = () => {
          // Fallback to original method if generation fails
          const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'px',
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
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
        
        barcodeImg.src = barcodeWithoutText;
      } catch (error) {
        reject(error);
      }
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

