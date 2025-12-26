import { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoConfig.siteName,
    short_name: 'Barcode Gen',
    description: seoConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/barcoderapp-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

