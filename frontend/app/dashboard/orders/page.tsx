import Menu from "@/components/dashboard/Menu";
import Link from "next/link";

export default function Orders() {
  return (
    <>
      <Menu />
      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-sm">
            You haven&apos;t placed any orders today
          </p>

          <Link
            href="/"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Get started
          </Link>
        </div>
      </div>
    </>
  );
}
