import WatchList from "@/components/dashboard/WatchList";
import TopBar from "@/components/dashboard/TopBar";
import { GeneralContextProvider } from "@/context/GeneralContext";
import Menu from "@/components/dashboard/Menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GeneralContextProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <TopBar />

        {/* Body */}
        <div className="flex">
          {/* Left sidebar */}
          <aside className="w-80 border-r bg-white">
            <WatchList />
          </aside>

          {/* Main content */}
          <main className="flex-1  text-black">{children}</main>
        </div>
      </div>
    </GeneralContextProvider>
  );
}
