import Menu from "@/components/dashboard/Menu";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardPage() {
  return (
    <>
      <Menu />
      <section className="p-4 space-y-8">
        {/* Username */}
        <div>
          <h6 className="text-sm font-medium text-gray-700">Hi, User!</h6>
          <hr className="mt-2 border-gray-200" />
        </div>

        {/* Equity Section */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Equity</p>

          <div className="flex items-center gap-6">
            {/* Left */}
            <div>
              <h3 className="text-2xl font-semibold text-black">3.74k</h3>
              <p className="text-sm text-gray-500">Margin available</p>
            </div>

            <div className="h-12 w-px bg-gray-200" />

            {/* Right */}
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                Margins used <span className="font-medium text-black">0</span>
              </p>
              <p>
                Opening balance{" "}
                <span className="font-medium text-black">3.74k</span>
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />
        </div>

        {/* Holdings Section */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Holdings (13)</p>

          <div className="flex items-center gap-6">
            {/* Left */}
            <div>
              <h3 className="text-2xl font-semibold text-green-600">
                1.55k{" "}
                <small className="text-sm font-medium text-green-500">
                  +5.20%
                </small>
              </h3>
              <p className="text-sm text-gray-500">P&amp;L</p>
            </div>

            <div className="h-12 w-px bg-gray-200" />

            {/* Right */}
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                Current Value{" "}
                <span className="font-medium text-black">31.43k</span>
              </p>
              <p>
                Investment{" "}
                <span className="font-medium text-black">29.88k</span>
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />
        </div>
      </section>
    </>
  );
}
