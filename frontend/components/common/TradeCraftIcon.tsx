import React from "react";

interface TradeCraftIconProps {
  className?: string;
  size?: number;
}

export default function TradeCraftIcon({
  className = "",
  size = 40,
}: TradeCraftIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="24" cy="24" r="22" fill="#3B82F6" />
      <circle cx="24" cy="24" r="22" fill="url(#gradient)" />

      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Chart Bars */}
      <g opacity="0.9">
        <rect
          x="12"
          y="26"
          width="3"
          height="8"
          rx="1"
          fill="white"
          opacity="0.7"
        />
        <rect
          x="17"
          y="22"
          width="3"
          height="12"
          rx="1"
          fill="white"
          opacity="0.8"
        />
        <rect
          x="22"
          y="18"
          width="3"
          height="16"
          rx="1"
          fill="white"
          opacity="0.9"
        />
        <rect x="27" y="14" width="3" height="20" rx="1" fill="white" />
      </g>

      {/* Upward Trend Arrow */}
      <g>
        <path
          d="M32 18 L36 14 L40 18"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <line
          x1="36"
          y1="14"
          x2="36"
          y2="22"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Letter "T" for TradeCraft (subtle) */}
      <text
        x="11"
        y="19"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="800"
        fill="white"
        opacity="0.3"
      >
        T
      </text>
    </svg>
  );
}
