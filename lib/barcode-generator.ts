'use client';

import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { BarcodeConfig, BarcodeType } from './types';

export async function generateBarcode(config: BarcodeConfig): Promise<string> {
  const { type, value } = config;

  if (type === 'qrcode') {
    return generateQRCode(value, config);
  }

  return generateLinearBarcode(config);
}

function generateLinearBarcode(config: BarcodeConfig): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element that will be rendered off-screen
      const canvas = document.createElement('canvas');
      
      // Create a container to hold the canvas temporarily
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '400px';
      container.style.height = `${config.height + 40}px`;
      container.appendChild(canvas);
      document.body.appendChild(container);
      
      try {
        const options: {
          format: string;
          width: number;
          height: number;
          displayValue: boolean;
          fontSize: number;
          font: string;
          textMargin: number;
          margin: number;
          background: string;
          lineColor: string;
          fontOptions: string;
        } = {
          format: config.type,
          width: config.width,
          height: config.height,
          displayValue: config.displayValue,
          fontSize: config.fontSize,
          font: 'Arial',
          textMargin: config.margin / 2,
          margin: config.margin,
          background: config.backgroundColor,
          lineColor: config.fontColor,
          fontOptions: 'bold',
        };

        JsBarcode(canvas, config.value, options);
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Clean up
        document.body.removeChild(container);
        
        resolve(dataUrl);
      } catch (error) {
        // Clean up on error
        if (container.parentNode) {
          document.body.removeChild(container);
        }
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function generateQRCode(value: string, config: BarcodeConfig): Promise<string> {
  try {
    const size = Math.max(config.height, 400);
    const dataUrl = await QRCode.toDataURL(value, {
      width: size,
      margin: config.margin,
      color: {
        dark: config.fontColor,
        light: config.backgroundColor,
      },
    });
    return dataUrl;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}

export function validateBarcodeValue(type: BarcodeType, value: string): boolean {
  if (!value || value.trim().length === 0) {
    return false;
  }

  const numericRegex = /^\d+$/;

  switch (type) {
    case 'ean13':
      return numericRegex.test(value) && (value.length === 12 || value.length === 13);
    case 'ean8':
      return numericRegex.test(value) && (value.length === 7 || value.length === 8);
    case 'upc':
      return numericRegex.test(value) && (value.length === 11 || value.length === 12);
    case 'itf14':
      return numericRegex.test(value) && value.length === 14;
    case 'code128':
    case 'code39':
    case 'qrcode':
      return true; // Accept any string
    default:
      return true;
  }
}

