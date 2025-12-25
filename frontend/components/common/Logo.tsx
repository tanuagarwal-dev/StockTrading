import React from "react";
import TradeCraftIcon from "./TradeCraftIcon";

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  iconSize?: number;
}

export default function Logo({
  className = "",
  showIcon = true,
  iconSize = 40,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showIcon && <TradeCraftIcon size={iconSize} />}
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Trade
          </span>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Craft
          </span>
        </div>
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-wide -mt-1">
          SMART TRADING
        </span>
      </div>
    </div>
  );
}
