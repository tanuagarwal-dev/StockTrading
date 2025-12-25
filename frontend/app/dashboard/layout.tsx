"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Menu from "@/components/dashboard/Menu";
import { GeneralContextProvider } from "@/context/GeneralContext";
import { UserProvider, useUser } from "@/context/UserContext";

function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return null;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <UserProvider>
      <GeneralContextProvider>
        <ProtectedDashboard>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
              aria-label="Toggle menu"
            >
              ☰
            </button>

            {isSidebarOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <div className="flex h-screen overflow-hidden">
              <aside
                className={`
                  fixed inset-y-0 left-0 z-40
                  w-64 border-r border-gray-200 dark:border-gray-700 
                  bg-white dark:bg-gray-800 shadow-lg
                  transform transition-transform duration-300
                  ${
                    isSidebarOpen
                      ? "translate-x-0"
                      : "-translate-x-full lg:translate-x-0"
                  }
                `}
              >
                <Sidebar />
              </aside>

              <main className="flex-1 w-full text-black dark:text-white overflow-y-auto lg:ml-64">
                {children}
              </main>
            </div>
          </div>
        </ProtectedDashboard>
      </GeneralContextProvider>
    </UserProvider>
  );
}
