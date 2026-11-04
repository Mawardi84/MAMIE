import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Copy, Check } from 'lucide-react';
import { exportData, copyToClipboard, type ExportFormat } from '../utils/exportUtils';
import { useNotification } from './NotificationSystem';

interface ExportButtonProps {
  data: any[];
  filename: string;
  label?: string;
  disabled?: boolean;
}

export default function ExportButton({ data, filename, label = 'Export', disabled = false }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { success, error: showError } = useNotification();

  const handleExport = (format: ExportFormat) => {
    try {
      exportData(data, { filename, format });
      success('Export Successful', `Data exported as ${format.toUpperCase()}`);
      setIsOpen(false);
    } catch (err) {
      showError('Export Failed', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleCopy = async () => {
    try {
      const success_copy = await copyToClipboard(data, 'csv');
      if (success_copy) {
        setCopied(true);
        success('Copied to Clipboard', 'Data copied as CSV format');
        setTimeout(() => setCopied(false), 2000);
      } else {
        showError('Copy Failed', 'Failed to copy to clipboard');
      }
    } catch (err) {
      showError('Copy Failed', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg text-sm text-white hover:bg-[var(--color-bg-surface)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Export data"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Download className="w-4 h-4" />
        <span>{label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg shadow-lg z-50"
            role="menu"
            aria-label="Export options"
          >
            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[var(--color-bg-surface)] transition-colors"
              role="menuitem"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-400" />
              <span>Export as CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[var(--color-bg-surface)] transition-colors border-t border-[var(--color-border-default)]"
              role="menuitem"
            >
              <FileJson className="w-4 h-4 text-blue-400" />
              <span>Export as JSON</span>
            </button>
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[var(--color-bg-surface)] transition-colors border-t border-[var(--color-border-default)]"
              role="menuitem"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
