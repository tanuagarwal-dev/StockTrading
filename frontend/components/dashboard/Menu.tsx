"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

const tabs = [
  { label: "Summary", href: "/dashboard" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Holdings", href: "/dashboard/holdings" },
  { label: "Trades", href: "/dashboard/trades" },
  { label: "OHLC", href: "/dashboard/ohlc" },
  { label: "Wallet", href: "/dashboard/funds" },
  { label: "Market", href: "/dashboard/shares" },
  { label: "Apps", href: "/dashboard/apps" },
];

export default function Menu() {
  const pathname = usePathname();
  const { logout } = useUser();
  return (
    <div className="lg:h-20 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 lg:px-6">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Image
            src="/media/images/zerodhaFundhouse.png"
            alt="Logo"
            width={150}
            height={28}
            sizes="150px"
            className="h-6 lg:h-7 my-4"
          />
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
              ZU
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              <button
                onClick={logout}
                className="text-xs text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <div className="flex">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-5 text-sm font-semibold border-b-3 transition-all duration-200
                    ${
                      isActive
                        ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
              ZU
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              <button
                onClick={logout}
                className="text-xs text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="flex lg:hidden gap-2 overflow-x-auto w-full pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
