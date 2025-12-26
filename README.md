# Barcode Generator

A modern, free web-based barcode generator application built with Next.js. Create professional barcodes and QR codes instantly with support for multiple formats and export options.

## Features

- ✅ **Multiple Barcode Types**: Code128, Code39, EAN-13, EAN-8, UPC-A, ITF-14, QR Code, and more
- ✅ **Designer-Friendly Customization**: 
  - Adjustable width, height, and margins
  - Custom colors (bar and background)
  - Font size control
  - Display value toggle
- ✅ **Multiple Export Formats**: PNG, JPEG, SVG, PDF
- ✅ **Batch Generation**: Generate multiple barcodes at once
- ✅ **Real-time Preview**: See changes instantly as you customize
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Dark Mode Support**: Automatic dark mode detection

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Barcode Libraries**: 
  - `jsbarcode` - For linear barcodes
  - `qrcode` - For QR code generation
- **Export Libraries**:
  - `jspdf` - PDF generation
  - `jszip` - Batch ZIP export
  - Canvas API - Image conversion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gencode
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy automatically

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Usage

### Single Barcode Generation

1. Select a barcode type from the dropdown
2. Enter the value (follow format requirements for each type)
3. Customize appearance (colors, size, margins)
4. Choose export format
5. Click "Export" to download

### Batch Generation

1. Scroll to the "Batch Generation" section
2. Enter multiple values (one per line, or "value,label" format)
3. Click "Parse Input" to preview items
4. Click "Generate X Barcodes" to create all barcodes
5. All barcodes will be downloaded as a ZIP file

## Supported Barcode Types

- **QR Code**: Any text or URL
- **Code 128**: Alphanumeric characters
- **Code 39**: Alphanumeric with limited special characters
- **EAN-13**: 12 or 13 digit numbers
- **EAN-8**: 7 or 8 digit numbers
- **UPC-A**: 11 or 12 digit numbers
- **ITF-14**: 14 digit numbers
- **MSI**: Numeric values
- **Pharmacode**: Pharmaceutical numbering
- **Codabar**: Numeric with start/stop characters

## Project Structure

```
gencode/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── BarcodeGenerator.tsx   # Main generator component
│   ├── BarcodeControls.tsx    # Control panel
│   ├── BarcodePreview.tsx     # Preview panel
│   └── BatchGenerator.tsx     # Batch generation
├── lib/
│   ├── types.ts                # TypeScript types
│   ├── barcode-generator.ts    # Barcode generation logic
│   └── export-utils.ts         # Export functionality
└── package.json
```

## Future Enhancements

- [ ] User accounts and cloud storage
- [ ] Product database with multiple codes per product
- [ ] Template system
- [ ] API access
- [ ] Analytics and scan tracking (for QR codes)
- [ ] PWA support for offline usage

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
