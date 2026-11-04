import { AlertCircle } from 'lucide-react';

interface DataUnavailableProps {
  message?: string;
  reason?: string;
}

export default function DataUnavailable({ 
  message = 'Data Unavailable',
  reason = 'Unable to fetch data from market sources'
}: DataUnavailableProps) {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-yellow-400 font-semibold text-sm mb-1">{message}</h3>
          <p className="text-gray-300 text-xs">{reason}</p>
          <div className="mt-3 text-xs text-gray-400 space-y-1">
            <p><strong>Possible causes:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>CORS restrictions blocking API requests</li>
              <li>API rate limits exceeded</li>
              <li>Network connectivity issues</li>
              <li>Data source temporarily unavailable</li>
            </ul>
            <p className="mt-2"><strong>Solution:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>The platform will automatically retry every 60 seconds</li>
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>For production use, consider implementing a backend proxy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
