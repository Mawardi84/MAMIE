interface NotConfiguredMessageProps {
  feature: string;
  reason?: string;
  alternative?: string;
}

export default function NotConfiguredMessage({ 
  feature, 
  reason = 'This feature requires additional data sources or configuration',
  alternative 
}: NotConfiguredMessageProps) {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">
            {feature} - NOT_CONFIGURED
          </h3>
          <p className="text-gray-300 text-sm mb-3">{reason}</p>
          {alternative && (
            <p className="text-gray-400 text-xs">
              <strong>Alternative:</strong> {alternative}
            </p>
          )}
          <div className="mt-4 text-xs text-gray-500">
            <p>
              This feature is part of the MAMIE platform but requires additional configuration,
              data sources, or API keys to function. Please contact your system administrator
              or refer to the documentation for setup instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
