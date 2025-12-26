export type BarcodeType =
  | 'code128'
  | 'code39'
  | 'ean13'
  | 'ean8'
  | 'upc'
  | 'itf14'
  | 'msi'
  | 'pharmacode'
  | 'codabar'
  | 'qrcode';

export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'pdf';

export interface BarcodeConfig {
  type: BarcodeType;
  value: string;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  lineColor: string;
  margin: number;
  format: ExportFormat;
}

export interface BatchItem {
  id: string;
  value: string;
  label?: string;
}

