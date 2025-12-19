"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WatchList from "@/components/dashboard/WatchList";
import TopBar from "@/components/dashboard/TopBar";
import { GeneralContextProvider } from "@/context/GeneralContext";
import Menu from "@/components/dashboard/Menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.replace("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return null;
  }

  return (
    <GeneralContextProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex">
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-40
              w-80 border-r border-gray-200 dark:border-gray-700 
              bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg
              transform transition-transform duration-300 ease-in-out
              ${
                isSidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
              }
            `}
          >
            <TopBar />
            <WatchList />
          </aside>

          <main className="flex-1 text-black dark:text-white w-full lg:w-auto">
            {children}
          </main>
        </div>
      </div>
    </GeneralContextProvider>
  );
}
