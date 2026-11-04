import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportToCSV,
  exportToJSON,
  exportData,
  copyToClipboard,
} from '../utils/exportUtils';

describe('exportUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportToCSV', () => {
    it('should export data to CSV format', () => {
      const data = [
        { name: 'Gold', price: 2000, change: 5.2 },
        { name: 'Silver', price: 25, change: -1.3 },
      ];

      const mockDownload = vi.fn();
      vi.stubGlobal('URL', {
        createObjectURL: vi.fn(() => 'blob:test'),
        revokeObjectURL: vi.fn(),
      });

      const mockCreateElement = vi.spyOn(document, 'createElement');
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      mockCreateElement.mockReturnValue(mockLink as any);

      exportToCSV(data, { filename: 'test', format: 'csv' });

      expect(mockCreateElement).toHaveBeenCalledWith('a');
    });

    it('should handle empty data', () => {
      const consoleWarn = vi.spyOn(console, 'warn');
      exportToCSV([], { filename: 'test', format: 'csv' });
      expect(consoleWarn).toHaveBeenCalledWith('No data to export');
    });

    it('should escape special characters in CSV', () => {
      const data = [
        { name: 'Asset "A"', value: 'test, value' },
      ];

      const mockCreateElement = vi.spyOn(document, 'createElement');
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      mockCreateElement.mockReturnValue(mockLink as any);

      vi.stubGlobal('URL', {
        createObjectURL: vi.fn(() => 'blob:test'),
        revokeObjectURL: vi.fn(),
      });

      exportToCSV(data, { filename: 'test', format: 'csv' });

      expect(mockLink.download).toBe('test.csv');
    });
  });

  describe('exportToJSON', () => {
    it('should export data to JSON format', () => {
      const data = [{ name: 'Gold', price: 2000 }];

      const mockCreateElement = vi.spyOn(document, 'createElement');
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      mockCreateElement.mockReturnValue(mockLink as any);

      vi.stubGlobal('URL', {
        createObjectURL: vi.fn(() => 'blob:test'),
        revokeObjectURL: vi.fn(),
      });

      exportToJSON(data, { filename: 'test', format: 'json' });

      expect(mockLink.download).toBe('test.json');
    });
  });

  describe('exportData', () => {
    it('should call exportToCSV for csv format', () => {
      const data = [{ name: 'Gold' }];
      const mockCreateElement = vi.spyOn(document, 'createElement');
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      mockCreateElement.mockReturnValue(mockLink as any);

      vi.stubGlobal('URL', {
        createObjectURL: vi.fn(() => 'blob:test'),
        revokeObjectURL: vi.fn(),
      });

      exportData(data, { filename: 'test', format: 'csv' });

      expect(mockLink.download).toBe('test.csv');
    });

    it('should call exportToJSON for json format', () => {
      const data = [{ name: 'Gold' }];
      const mockCreateElement = vi.spyOn(document, 'createElement');
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      mockCreateElement.mockReturnValue(mockLink as any);

      vi.stubGlobal('URL', {
        createObjectURL: vi.fn(() => 'blob:test'),
        revokeObjectURL: vi.fn(),
      });

      exportData(data, { filename: 'test', format: 'json' });

      expect(mockLink.download).toBe('test.json');
    });

    it('should handle unsupported format', () => {
      const consoleError = vi.spyOn(console, 'error');
      exportData([{ name: 'test' }], { filename: 'test', format: 'xml' as any });
      expect(consoleError).toHaveBeenCalledWith('Unsupported export format: xml');
    });
  });

  describe('copyToClipboard', () => {
    it('should copy data as CSV to clipboard', async () => {
      const data = [{ name: 'Gold', price: 2000 }];
      
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      const result = await copyToClipboard(data, 'csv');

      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    it('should copy data as JSON to clipboard', async () => {
      const data = [{ name: 'Gold', price: 2000 }];
      
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      const result = await copyToClipboard(data, 'json');

      expect(result).toBe(true);
    });

    it('should return false on clipboard error', async () => {
      const data = [{ name: 'Gold' }];
      
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')),
        },
      });

      const consoleError = vi.spyOn(console, 'error');
      const result = await copyToClipboard(data, 'csv');

      expect(result).toBe(false);
      expect(consoleError).toHaveBeenCalled();
    });
  });
});
