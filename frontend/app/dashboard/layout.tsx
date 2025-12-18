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

  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

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
      <div className="min-h-screen bg-gray-50">
        {/* Body */}
        <div className="flex">
          {/* Left sidebar */}
          <aside className="w-80 border-r bg-white text-black">
            <TopBar />
            <WatchList />
          </aside>

          {/* Main content */}
          <main className="flex-1 text-black">{children}</main>
        </div>
      </div>
    </GeneralContextProvider>
  );
}
