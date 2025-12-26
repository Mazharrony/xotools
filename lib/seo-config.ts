// SEO Configuration
// Update NEXT_PUBLIC_SITE_URL in your .env.local file with your actual domain

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export const seoConfig = {
  siteName: 'Barcode Generator',
  title: 'Free Barcode Generator Online | Create QR Codes & Barcodes Instantly',
  description: 'Create professional barcodes and QR codes for free. Export as PNG, JPEG, SVG, or PDF. Supports Code128, EAN, UPC, QR Code, and more. No registration required!',
  keywords: [
    'barcode generator',
    'free barcode generator',
    'online barcode generator',
    'QR code generator',
    'create barcode',
    'barcode maker',
    'barcode creator',
    'generate QR code',
    'EAN barcode',
    'UPC barcode',
    'Code128 generator',
    'batch barcode generator',
  ],
  author: 'Barcode Generator Team',
  locale: 'en_US',
  ogImage: '/og-image.png', // You'll need to create this image (1200x630px)
};

