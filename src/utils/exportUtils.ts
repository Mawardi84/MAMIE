// Export utilities for data export functionality

export type ExportFormat = 'csv' | 'json' | 'excel';

export interface ExportOptions {
  filename: string;
  format: ExportFormat;
  includeHeaders?: boolean;
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], options: ExportOptions): void {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const { filename, includeHeaders = true } = options;
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV rows
  const csvRows = [];
  
  // Add headers
  if (includeHeaders) {
    csvRows.push(headers.join(','));
  }
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value ?? '').replace(/"/g, '""');
      return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
        ? `"${escaped}"`
        : escaped;
    });
    csvRows.push(values.join(','));
  }
  
  // Create CSV string
  const csvString = csvRows.join('\n');
  
  // Download file
  downloadFile(csvString, `${filename}.csv`, 'text/csv');
}

/**
 * Export data to JSON format
 */
export function exportToJSON(data: any[], options: ExportOptions): void {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const { filename } = options;
  const jsonString = JSON.stringify(data, null, 2);
  
  downloadFile(jsonString, `${filename}.json`, 'application/json');
}

/**
 * Export data to Excel format (as CSV with .xlsx extension)
 * Note: For true Excel format, would need a library like SheetJS
 */
export function exportToExcel(data: any[], options: ExportOptions): void {
  // For simplicity, export as CSV with Excel-compatible format
  exportToCSV(data, { ...options, filename: options.filename });
}

/**
 * Generic export function
 */
export function exportData(data: any[], options: ExportOptions): void {
  const { format } = options;
  
  switch (format) {
    case 'csv':
      exportToCSV(data, options);
      break;
    case 'json':
      exportToJSON(data, options);
      break;
    case 'excel':
      exportToExcel(data, options);
      break;
    default:
      console.error(`Unsupported export format: ${format}`);
  }
}

/**
 * Helper function to download file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export chart data with metadata
 */
export function exportChartData(
  chartData: any[],
  metadata: {
    title: string;
    asset?: string;
    timeframe?: string;
    generatedAt?: string;
  },
  options: ExportOptions
): void {
  // Add metadata as first row
  const dataWithMetadata = [
    {
      _metadata: `Title: ${metadata.title}`,
      _asset: metadata.asset || '',
      _timeframe: metadata.timeframe || '',
      _generated: metadata.generatedAt || new Date().toISOString(),
    },
    { _metadata: '', _asset: '', _timeframe: '', _generated: '' }, // Empty row
    ...chartData,
  ];
  
  exportData(dataWithMetadata, options);
}

/**
 * Copy data to clipboard
 */
export async function copyToClipboard(data: any[], format: 'csv' | 'json' = 'csv'): Promise<boolean> {
  try {
    let text = '';
    
    if (format === 'csv') {
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];
      
      for (const row of data) {
        const values = headers.map(header => String(row[header] ?? ''));
        csvRows.push(values.join(','));
      }
      
      text = csvRows.join('\n');
    } else {
      text = JSON.stringify(data, null, 2);
    }
    
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
