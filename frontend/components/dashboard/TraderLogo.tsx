import React from "react";

interface TraderLogoProps {
  className?: string;
  compact?: boolean;
}

export default function TraderLogo({
  className = "",
  compact = true,
}: TraderLogoProps) {
  if (compact) {
    // Compact version for sidebar
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            className="w-5 h-5"
          >
            {/* Upward arrow representing trader/gains */}
            <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="white" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
            Trader
          </span>
          <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 -mt-0.5">
            PRO
          </span>
        </div>
      </div>
    );
  }

  // Full version for other uses
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          className="w-6 h-6"
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="white" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          Trader
        </span>
        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 -mt-0.5">
          PROFESSIONAL
        </span>
      </div>
    </div>
  );
}
